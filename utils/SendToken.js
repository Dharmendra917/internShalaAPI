exports.sendtoken = (student, statusCode, res) => {
  const token = student.getjwttoken();

  const options = {
    exipres: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // if you use http
    // secure : true    // if you use https
  };
  res.status(statusCode).cookie("token", token, options);
  res.json({ success: true, id: student._id, token });
};
