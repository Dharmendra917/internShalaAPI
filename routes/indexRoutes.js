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
  studentupdate,
  studentavatar,
  applyinternship,
  applyjob,
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
router.post("/student/forget-link", studentforgetlink);

//POST  /student/reste-link/:student._id
router.post("/student/reset-link/:id", isAuthenticated, studentresetlink);

//POST  /student/update/:student._id
router.post("/student/update/:id", isAuthenticated, studentupdate);

//POST  /student/avtar/:student._id
router.post("/student/avatar/:id", isAuthenticated, studentavatar);

//-----internships------------------------

//POST /student/apply/:internshipid
router.post("/student/apply/:internshipid", isAuthenticated, applyinternship);

//-----jobs----------------------

//POST /student/apply/:jobid
router.post("/student/apply/job/:jobid", isAuthenticated, applyjob);

module.exports = router;
