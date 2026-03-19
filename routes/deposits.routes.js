const express = require("express");
const router = express.Router();

const controller = require("../controllers/deposits.controller");

router.get("/", controller.getDeposits);
router.post("/", controller.addDeposit);

module.exports = router;