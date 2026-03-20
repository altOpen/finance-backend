const express = require("express");
const router = express.Router();

const controller = require("../controllers/members.controller");

router.get("/", controller.getMembers);
router.post("/", controller.addMember);
router.put("/:id", controller.updateMember);
router.delete("/:id", controller.deleteMember);
router.put("/:id", controller.updateMember);
module.exports = router;