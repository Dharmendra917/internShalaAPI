const nodemailer = require("nodemailer");
const catchAsyncErrors = require("../middlewares/catchAsyncError.js");

exports.sendmailer = (req, res, next, url) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: "465",
    auth: {
      user: process.env.MAIL_EMAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const options = {
    from: "Freshers Private Limited",
    to: req.body.email,
    subject: "Password Reset Link",
    // "text" : "Do Not Share This Link Anyone",
    html: `<h1>Click Link Blow To Reset Password</h1>
            <a href=${url}>Password Reset Link</a>`,
  };

  transport.sendMail(options, (err, info) => {
    if (err) return next(new ErrorHandler(err, 500));

    console.log(info);

    return res.status(200).json({ message: "message sent successfully", url });
  });
};
