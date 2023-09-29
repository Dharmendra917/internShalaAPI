const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const Student = require("../models/studentModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { sendmailer } = require("../utils/NodeMailer");
const { sendtoken } = require("../utils/SendToken");

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

  const url = `${req.protocol}://${req.get("host")}/student/forget-link/${
    student._id
  }`;

  sendmailer(req, res, next, url);
  student.restePasswordToken = "1";
  await student.save();
  res.json({ student, url });
});

exports.studentforgetlink = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();

  if (!student) {
    return next(
      new ErrorHandler("User Not Found With This Email Address", 500)
    );
  }

  if (student.restePasswordToken == "1") {
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
