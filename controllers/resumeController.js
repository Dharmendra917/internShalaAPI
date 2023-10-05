const Student = require("../models/studentModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const { v4: uuidv4 } = require("uuid");

exports.resume = catchAsyncErrors(async (req, res, next) => {
  const { resume } = await Student.findById(req.id).exec();

  res.status(200).json({ message: "Secure Resume Page!", resume });
});

exports.addeducation = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  student.resume.education.push({ ...req.body, id: uuidv4() });
  await student.save();
  res.json({ message: "Eductaion Added!" });
});

exports.editeducation = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const eduIndex = student.resume.education.findIndex(
    (i) => i.id === req.params.eduid
  );
  student.resume.education[eduIndex] = {
    ...student.resume.education[eduIndex],
    ...req.body,
  };

  await student.save();
  res.json({ message: "Eductaion Edit!" });
});

exports.deleteeducation = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const filteredu = student.resume.education.filter(
    (i) => i.id !== req.params.eduid
  );
  student.resume.education = filteredu;
  student.save();
  res.json({ message: "Eductaion Deleted!" });
});
