const express = require("express");
const router = express.Router();

const controller = require("../controllers/members.controller");

router.get("/", controller.getMembers);
router.post("/", controller.addMember);
router.delete("/:id", controller.deleteMember);

module.exports = router;