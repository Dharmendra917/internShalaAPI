const express = require("express");
const {
  resume,
  addeducation,
  editeducation,
  deleteeducation,
} = require("../controllers/resumeController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// GET
router.get("/", isAuthenticated, resume);

// POST //add-edu
router.post("/add-edu", isAuthenticated, addeducation);

// POST //edit-edu
router.post("/edit-edu/:eduid", isAuthenticated, editeducation);

// POST //delete-edu
router.post("/delete-edu/:eduid", isAuthenticated, deleteeducation);

module.exports = router;
