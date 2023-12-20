const nodemailer = require("nodemailer");
const catchAsyncErrors = require("../middlewares/catchAsyncError.js");
const ErrorHandler = require("../utils/ErrorHandler.js");

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
    // <a href=${url}>Password Reset Link</a>
    // "text" : "Do Not Share This Link Anyone",
    html: `<div   style = "background-color:#CDE0C4; border:1px solid white">
           <h1>Forgot Password OTP</h1>
           <h5><span style= "color:red";>Note</span>: The token will expire in 10min </h5>
             <h1 style="background-color:#17be08;"> ${url} </h1> 
            </div>`,
  };

  transport.sendMail(options, (err, info) => {
    if (err) return next(new ErrorHandler(err, 500));

    // console.log(info);

    return res.status(200).json({ message: "message sent successfully", url });
  });
};
