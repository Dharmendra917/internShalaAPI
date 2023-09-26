const express = require("express");
const {
  home,
  currentUser,
  studentsignup,
  studentsignin,
  studentsignout,
} = require("../controllers/indexControllers");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// GET /
router.get("/", home);

//POST /student
router.post("/student", isAuthenticated, currentUser);

// POST /student/signup
router.post("/student/signup", studentsignup);

// POST /student/signin
router.post("/student/signin", studentsignin);

// POST /student/signout
router.get("/student/signout", isAuthenticated, studentsignout);

module.exports = router;
