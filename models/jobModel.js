const mongoose = require("mongoose");

const jobModel = new mongoose.Schema(
  {
    employe: { type: mongoose.Schema.Types.ObjectId, ref: "employe" },
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
