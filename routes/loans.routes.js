const express = require("express");
const router = express.Router();
const controller = require("../controllers/loans.controller");

router.get("/", controller.getLoans);
router.post("/", controller.addLoan);
router.get("/:id", controller.getLoanDetails);
router.post("/payment", controller.addPayment);

// NEW
router.get("/emi/:id", controller.getEMI);
router.post("/foreclose/:id", controller.forecloseLoan);

module.exports = router;