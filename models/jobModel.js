const mongoose = require("mongoose");

const jobModel = new mongoose.Schema(
  {
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }], // how many students apply
    employe: { type: mongoose.Schema.Types.ObjectId, ref: "employe" }, // which employe create this job
    title: {
      type: String,
      require: [true, "Job Title is required "],
    },
    skill: {
      type: String,
    },
    jobtype: {
      type: String,
      enum: ["In office", "Remote"],
    },
    openings: {
      type: Number,
      require: [true, "Minimum 1 opening should be required"],
    },
    description: String,
    preferences: String,
    salary: Number,
    perks: String,
    assesments: String,
  },

  { timestamps: true }
);

module.exports = mongoose.model("job", jobModel);
