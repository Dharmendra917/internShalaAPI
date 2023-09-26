const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const Student = require("../models/studentModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
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
    return next(new ErrorHandler("User not found"));
  }

  const isMatch = student.comparepassword(req.body.password);

  if (!isMatch) {
    return next(new ErrorHandler("Wrong Credientials", 500));
  }

  sendtoken(student, 200, res);
});

exports.studentsignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Successfully signout!" });
});
