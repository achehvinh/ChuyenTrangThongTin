const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authAdmin } = require("../middleware/auth");

router.get("/unread-count", authAdmin, notificationController.getUnreadCount);
router.get("/", authAdmin, notificationController.getNotifications);

router.patch("/read-all", authAdmin, notificationController.markAllAsRead);
router.patch("/:id/read", authAdmin, notificationController.markAsRead);
router.put("/:id/read", authAdmin, notificationController.markAsRead);
router.delete("/:id", authAdmin, notificationController.deleteNotification);

module.exports = router;
