const express = require("express");
const {
  home,
  currentUser,
  studentsignup,
  studentsignin,
  studentsignout,
  studentsendmail,
  studentforgetlink,
  studentresetlink,
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

// POST /student/send-mail
router.post("/student/send-mail", studentsendmail);

//GET  /student/forget-link/:student._id
router.get("/student/forget-link/:id", studentforgetlink);

//POST  /student/reste-link/:student._id
router.post("/student/reset-link/:id", isAuthenticated, studentresetlink);

module.exports = router;
