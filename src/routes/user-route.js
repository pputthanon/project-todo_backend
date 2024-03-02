const express = require("express");
const userController = require("../controllers/user-controller");
const authenticateMiddleware = require("../middlewares/authenticate");

const router = express.Router();

router.get("/:userId", authenticateMiddleware, userController.getTaskByUserId);
router.post("/create", authenticateMiddleware, userController.createTask);
router.patch(
  "/update/:taskId",
  authenticateMiddleware,
  userController.updatedTask
);
router.delete(
  "/delete/:taskId",
  authenticateMiddleware,
  userController.deletedTask
);

module.exports = router;
