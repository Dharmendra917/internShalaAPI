const { url } = require("inspector");
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const Employe = require("../models/employeModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { sendmailer } = require("../utils/NodeMailer");
const { sendtoken } = require("../utils/SendToken");
const path = require("path");
const imagekit = require("../utils/ImageKit").initImageKit();
const Internship = require("../models/internshipModel");

exports.home = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ message: "Secure Employe Page!" });
});

exports.currentEmploye = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.id).exec();
  res.json({ employe });
});

exports.employesignup = catchAsyncErrors(async (req, res, next) => {
  const employe = await new Employe(req.body).save();
  sendtoken(employe, 201, res);
});

exports.employesignin = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findOne({ email: req.body.email })
    .select("+password")
    .exec();

  if (!employe) {
    return next(new ErrorHandler("User not found", 500));
  }
  // bcrypt
  const isMatch = employe.comparepassword(req.body.password);

  if (!isMatch) {
    return next(new ErrorHandler("Wrong Credientials", 500));
  }
  // jwt
  sendtoken(employe, 200, res);
});

exports.employesignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Successfully signout!" });
});

exports.employesendmail = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findOne({ email: req.body.email });

  if (!employe) {
    return next(new ErrorHandler("Student dose not exits", 500));
  }

  const url = `${req.protocol}://${req.get("host")}/employe/forget-link/${
    employe._id
  }`;

  sendmailer(req, res, next, url);
  employe.restePasswordToken = "1";
  await employe.save();
  res.json({ employe, url });
});

exports.employeforgetlink = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.params.id).exec();

  if (!employe) {
    return next(
      new ErrorHandler("User Not Found With This Email Address", 500)
    );
  }

  if (employe.restePasswordToken == "1") {
    employe.restePasswordToken = "0";
    employe.password = req.body.password;
    await employe.save();
  } else {
    return next(
      new ErrorHandler("Invalid Reset Password Link! Please Try Again", 500)
    );
  }

  res.status(200).json({ message: "Password Has Been Changed Successfully!" });
});

exports.employeresetlink = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.params.id).exec();
  employe.password = req.body.password;
  await employe.save();

  sendtoken(employe, 201, res);
});

exports.employeupdate = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findByIdAndUpdate(
    req.params.id,
    req.body
  ).exec();

  await employe.save();
  res
    .status(200)
    .json({ success: true, message: "Student successfully updated!" });
});

exports.employeavatar = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.params.id).exec();
  const file = req.files.organizationlogo;

  const modified = `resumebulder-${Date.now()}${path.extname(file.name)}`;

  if (employe.organizationlogo.fileId !== "") {
    await imagekit.deleteFile(student.organizationlogo.fileId);
  }

  const { fileId, url } = await imagekit.upload({
    file: file.data,
    fileName: modified,
  });

  employe.organizationlogo = { fileId, url };
  await employe.save();
  res.status(200).json({ success: true, message: "profile updated!" });
});

//---------Internships-------------

exports.createinternship = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.id).exec();
  const internship = await new Internship(req.body);
  internship.employe = employe._id;
  employe.internships.push(internship._id);
  await internship.save();
  await employe.save();
  res.status(201).json({ success: true, internship });
});

exports.readinternship = catchAsyncErrors(async (req, res, next) => {
  const { internships } = await Employe.findById(req.id)
    .populate("internships")
    .exec();
  res.status(200).json({ success: true, internships });
});

exports.singlereadinternship = catchAsyncErrors(async (req, res, next) => {
  const internship = await Internship.findById(req.params.id).exec();
  res.status(200).json({ success: true, internship });
});
