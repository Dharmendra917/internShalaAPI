const express = require("express");
const {
  home,
  currentEmploye,
  employesignup,
  employesignin,
  employesignout,
  employesendmail,
  employeforgetlink,
  employeresetlink,
  employeupdate,
  employeavatar,
  createinternship,
  readinternship,
  singlereadinternship,
  createjob,
  readjob,
  singlereadjob,
} = require("../controllers/employeControllers");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// GET /employe
router.get("/", home);

// POST /employe/current;
router.post("/current", isAuthenticated, currentEmploye);

// POST /employe/signup
router.post("/signup", employesignup);

// POST /employe/signin
router.post("/signin", employesignin);

// GET /employe/signout
router.get("/signout", isAuthenticated, employesignout);

// POST /employe/send-mail
router.post("/send-mail", employesendmail);

//GET  /employe/forget-link/:student._id
router.get("/forget-link/:id", employeforgetlink);

//POST  /employe/reste-link/:student._id
router.post("/reset-link/:id", isAuthenticated, employeresetlink);

//POST  /employe/update/:student._id
router.post("/update/:id", isAuthenticated, employeupdate);

//POST  /employe/organizationlogo/:student._id
router.post("/organizationlogo/:id", isAuthenticated, employeavatar);

// --------Internships---------------------

//POST  /employe/internship/create
router.post("/internship/create", isAuthenticated, createinternship);

//POST  /employe/internship/read
router.post("/internship/read", isAuthenticated, readinternship);

//POST  /employe/internship/read/:id
router.post("/internship/read/:id", isAuthenticated, singlereadinternship);

//---------job-------------------

//POST /employe/job/create
router.post("/job/create", isAuthenticated, createjob);

//POST /employe/job/read
router.post("/job/read", isAuthenticated, readjob);

//POST /employe/job/read/:id
router.post("/job/read/:id", isAuthenticated, singlereadjob);

module.exports = router;
