const { url } = require("inspector");
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const Student = require("../models/studentModel.js");
const Internship = require("../models/internshipModel");
const Job = require("../models/jobModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { sendmailer } = require("../utils/NodeMailer");
const { sendtoken } = require("../utils/SendToken");
const path = require("path");
const imagekit = require("../utils/ImageKit").initImageKit();

exports.home = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ message: "this is home router" });
});

exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  res.json({ student });
});

exports.studentsignup = catchAsyncErrors(async (req, res, next) => {
  const student = await new Student(req.body).save();
  sendtoken(student, 201, res);
});

exports.studentsignin = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email })
    .select("+password")
    .exec();

  if (!student) {
    return next(new ErrorHandler("User not found", 500));
  }
  // bcrypt
  const isMatch = student.comparepassword(req.body.password);

  if (!isMatch) {
    return next(new ErrorHandler("Wrong Credientials", 500));
  }
  // jwt
  sendtoken(student, 200, res);
});

exports.studentsignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Successfully signout!" });
});

exports.studentsendmail = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email });

  if (!student) {
    return next(new ErrorHandler("Student dose not exits", 500));
  }

  // const url = `${req.protocol}://${req.get("host")}/student/forget-link/${
  //   student._id
  // }`;
  const url = Math.floor(Math.random() * 9000 + 1000);
  sendmailer(req, res, next, url);
  student.restePasswordToken = `${url}`;
  await student.save();
  setTimeout(() => {
    student.restePasswordToken = "0";
    student.save();
  }, 60 * 1000 * 10);
  res.json({ url });
});

exports.studentforgetlink = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email }).exec();

  if (!student) {
    return next(
      new ErrorHandler("User Not Found With This Email Address", 500)
    );
  }

  if (student.restePasswordToken == req.body.otp) {
    student.restePasswordToken = "0";
    student.password = req.body.password;
    await student.save();
  } else {
    return next(
      new ErrorHandler("Invalid Reset Password Link! Please Try Again", 500)
    );
  }

  res.status(200).json({ message: "Password Has Been Changed Successfully!" });
});

exports.studentresetlink = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();
  student.password = req.body.password;
  await student.save();

  sendtoken(student, 201, res);
});

exports.studentupdate = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    req.body
  ).exec();
  res
    .status(200)
    .json({ success: true, message: "Student successfully updated!" });
});

exports.studentavatar = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();
  const file = req.files.avatar;

  const modified = `resumebulder-${Date.now()}${path.extname(file.name)}`;

  if (student.avatar.fileId !== "") {
    await imagekit.deleteFile(student.avatar.fileId);
  }

  const { fileId, url } = await imagekit.upload({
    file: file.data,
    fileName: modified,
  });

  student.avatar = { fileId, url };
  await student.save();
  res.status(200).json({ success: true, message: "profile updated!" });
});

//----------internship-----------

exports.applyinternship = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const internship = await Internship.findById(req.params.internshipid).exec();
  student.internships.push(internship._id);
  internship.students.push(student._id);
  await student.save();
  await internship.save();
  res.status(201).json({ success: true, student });
});

//----------job-----------------
exports.applyjob = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const job = await Job.findById(req.params.jobid).exec();
  student.jobs.push(job._id);
  job.students.push(student._id);
  await student.save();
  await job.save();
  res.status(201).json({ success: true, student });
});
