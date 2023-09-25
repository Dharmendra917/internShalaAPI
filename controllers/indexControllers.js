const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const Student = require("../models/studentModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
// const comparepassword = require("../models/studentModel");

exports.home = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ message: "this is home router" });
});

exports.studentsignup = catchAsyncErrors(async (req, res, next) => {
  const student = await new Student(req.body).save();
  res.status(201).json(student);
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

  res.json(student);
});

exports.studentsignout = catchAsyncErrors(async (req, res, next) => {});
