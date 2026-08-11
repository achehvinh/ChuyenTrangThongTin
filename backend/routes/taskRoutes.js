const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authAdmin } = require("../middleware/auth");

// ── GET Routes ──
router.get("/staff", taskController.getStaffList);
router.get("/department", taskController.getDepartmentTasks);
router.get("/my", authAdmin, taskController.getMyTasks);
router.get("/statistics", taskController.getStatistics);
router.get("/activities", taskController.getActivities);
router.get("/notifications", taskController.getNotifications);
router.get("/:id/history", taskController.getTaskHistory);

// ── POST / PUT Routes ──
router.post("/", authAdmin, taskController.createTask);
router.put("/:id/progress", authAdmin, taskController.updateProgress);
router.post("/:id/submit", authAdmin, taskController.submitTask);
router.post("/:id/approve", authAdmin, taskController.approveTask);
router.post("/:id/request-revision", authAdmin, taskController.requestRevision);
router.put("/notifications/:id/read", taskController.markNotificationRead);

module.exports = router;
