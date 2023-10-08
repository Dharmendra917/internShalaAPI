const mongoose = require("mongoose");

const internshipModel = new mongoose.Schema(
  {
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }], // how many student are apply
    employe: { type: mongoose.Schema.Types.ObjectId, ref: "employe" }, // which employe create this intern
    profile: {
      type: String,
      require: [true, "Profile is required "],
      minLength: [4, "Profile Name Should be atleast 4 Character long"],
    },
    skill: {
      type: String,
    },
    internshiptype: {
      type: String,
      enum: ["In office", "Remote"],
    },
    openings: {
      type: Number,
      require: [true, "Minimum 1 opening should required"],
    },
    from: {
      type: String,
      require: [true, "Please mention internship Starting date"],
    },
    to: {
      type: String,
      require: [true, "Please mention internship End date"],
    },
    duration: {
      type: String,
      require: [true, "Duration Should be atleast 1month"],
    },
    responsibility: {
      type: String,
      require: true,
    },
    stipend: {
      status: {
        type: String,
        enum: ["Fixed", "Negotiable", "Performance based", "Unpaid"],
      },
      amount: Number,
    },
    perks: String,
    assesments: String,
  },

  { timestamps: true }
);

module.exports = mongoose.model("internship", internshipModel);
