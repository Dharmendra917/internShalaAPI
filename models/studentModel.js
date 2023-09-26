const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentModel = new mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, " email is requires"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      select: false,
      maxLength: [15, "password should not exced more than 15 character"],
      minLength: [6, "password should not atleast  6 character"],
      //   match: [
      //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/,
      //     "Password Does Not Contain Special Character",
      //   ],
    },
  },
  { timestamps: true }
);

// bcrypt - is used for password authentication encryption
studentModel.pre("save", function () {
  if (!this.isModified("password")) {
    // if password not modified dont save
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

//compare password
studentModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//generate Token
studentModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("student", studentModel);
