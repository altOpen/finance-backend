console.log("Dashboard route loaded");
const express = require("express");
const router = express.Router();

const controller = require("../controllers/dashboard.controller");

// GET DASHBOARD DATA
router.get("/", controller.getDashboard);

module.exports = router;