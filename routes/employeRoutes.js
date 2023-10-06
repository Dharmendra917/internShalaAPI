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

//POST  /organizationlogo/:student._id
router.post("/organizationlogo/:id", isAuthenticated, employeavatar);

module.exports = router;
