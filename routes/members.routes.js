const express = require("express");
const router = express.Router();

const controller = require("../controllers/members.controller");

router.get("/", controller.getMembers);
router.post("/", controller.addMember);
router.put("/:id", controller.updateMember);
router.put("/:id", controller.updateMember);
router.put("/deactivate/:id", controller.deactivateMember);
module.exports = router;