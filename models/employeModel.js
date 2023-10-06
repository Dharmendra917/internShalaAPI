const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeModel = new mongoose.Schema(
  {
    firstname: {
      type: String,
      require: [true, "First Name is required "],
      minLength: [4, "First Name Should be atleast 4 Character long"],
    },
    lastname: {
      type: String,
      require: [true, "Last Name is required "],
      minLength: [4, "Last Name Should be atleast 4 Character long"],
    },
    contact: {
      type: String,
      require: [true, "Contact is required "],
      minLength: [10, "Contact must not exceed 10 character"],
      maxLength: [10, "Contact should be atleast 10 character "],
    },
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
    restePasswordToken: {
      type: String,
      default: "0",
    },
    organizationname: {
      type: String,
      require: [true, "Organization name is required"],
      minLength: [4, "Organization name should be atleast 4 character"],
    },
    organizationlogo: {
      type: Object,
      default: {
        fileId: "",
        url: "https://images.unsplash.com/photo-1696215325855-082b3aba071c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1915&q=80",
      },
    },
    internships: [{ type: mongoose.Schema.Types.ObjectId, ref: "internship" }],
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "job" }],
  },

  { timestamps: true }
);

// bcrypt - is used for password authentication encryption
employeModel.pre("save", function () {
  if (!this.isModified("password")) {
    // if password not modified dont save
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

//compare password
employeModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//generate Token
employeModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("employe", employeModel);
