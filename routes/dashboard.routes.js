const express = require("express");
const router = express.Router();

const controller = require("../controllers/dashboard.controller");

// GET DASHBOARD
router.get("/", controller.getDashboard);

module.exports = router;