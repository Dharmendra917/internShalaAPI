const express = require("express");
const {
  home,
  studentsignup,
  studentsignin,
  studentsignout,
} = require("../controllers/indexControllers");
const router = express.Router();

// GET /
router.get("/", home);

// POST /student/signup
router.post("/student/signup", studentsignup);

// POST /student/signin
router.post("/student/signin", studentsignin);

// POST /student/signout
router.post("/student/signout", studentsignout);

module.exports = router;
