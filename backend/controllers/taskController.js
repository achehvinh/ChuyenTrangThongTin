const Task = require("../models/Task");
const TaskProgress = require("../models/TaskProgress");
const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");
const Admin = require("../models/Admin");
const { emitToDepartment, emitToManagers, emitToUser } = require("../services/socketService");

// ── Hàm trợ giúp khởi tạo dữ liệu mẫu Task vào MongoDB nếu DB trống ──
const seedInitialTasksIfNeeded = async () => {
  try {
    const count = await Task.countDocuments();
    if (count === 0) {
      const sampleTasks = [
        {
          title: "Tổng hợp báo cáo tình hình thực hiện nhiệm vụ tháng 8/2026",
          description: "Tổng hợp số liệu từ các chuyên viên, rà soát kết quả các chỉ tiêu phát triển văn hóa xã hội tháng 8 để trình UBND xã.",
          assigneeName: "Lê Ngọc Sơn",
          assignedByName: "Lê Ngọc Sơn",
          priority: "URGENT",
          status: "IN_PROGRESS",
          progress: 60,
          startDate: new Date("2026-08-10"),
          dueDate: new Date("2026-08-15"),
        },
        {
          title: "Rà soát, cập nhật danh sách hộ gia đình khó khăn",
          description: "Phối hợp với các Trưởng thôn để rà soát danh sách hộ nghèo, hộ cận nghèo cần hỗ trợ thẻ BHYT và chính sách an sinh.",
          assigneeName: "Nguyễn Văn A",
          assignedByName: "Lê Ngọc Sơn",
          priority: "MEDIUM",
          status: "IN_PROGRESS",
          progress: 30,
          startDate: new Date("2026-08-10"),
          dueDate: new Date("2026-08-18"),
        },
        {
          title: "Hoàn thiện kế hoạch tuyên truyền BHYT quý III/2026",
          description: "Xây dựng lịch phát sóng loa truyền thanh xã và bài tuyên truyền lưu động về chính sách BHYT tự nguyện.",
          assigneeName: "Trần Văn B",
          assignedByName: "Lê Ngọc Sơn",
          priority: "HIGH",
          status: "NEAR_DEADLINE",
          progress: 70,
          startDate: new Date("2026-08-05"),
          dueDate: new Date("2026-08-13"),
        },
        {
          title: "Báo cáo công tác văn hóa - xã hội 6 tháng đầu năm",
          description: "Đã tổng hợp 90% khối lượng văn bản, còn thiếu phụ lục thống kê hoạt động thể thao thôn làng.",
          assigneeName: "Nguyễn Thị C",
          assignedByName: "Lê Ngọc Sơn",
          priority: "URGENT",
          status: "OVERDUE",
          progress: 90,
          startDate: new Date("2026-08-01"),
          dueDate: new Date("2026-08-08"),
        },
        {
          title: "Tổng hợp kết quả thực hiện nhiệm vụ tuần",
          description: "Hoàn tất báo cáo giao ban tuần trình Trưởng phòng duyệt.",
          assigneeName: "Nguyễn Văn D",
          assignedByName: "Lê Ngọc Sơn",
          priority: "MEDIUM",
          status: "COMPLETED",
          progress: 100,
          startDate: new Date("2026-08-08"),
          dueDate: new Date("2026-08-12"),
          completedAt: new Date("2026-08-12"),
        },
        {
          title: "Tuyên truyền vận động người dân tham gia BHYT hộ gia đình",
          description: "Phối hợp với Đại lý thu BHYT xã Đăk Pxi để tư vấn trực tiếp cho các hộ dân tại Thôn 1 và Thôn 2.",
          assigneeName: "Lê Ngọc Sơn",
          assignedByName: "Lê Ngọc Sơn",
          priority: "MEDIUM",
          status: "IN_PROGRESS",
          progress: 45,
          startDate: new Date("2026-08-02"),
          dueDate: new Date("2026-08-20"),
        },
        {
          title: "Kiểm tra công tác cải cách thủ tục hành chính tại bộ phận 1 cửa",
          description: "Rà soát quy trình niêm yết công khai TTHC thuộc lĩnh vực Lao động - Thương binh & Xã hội.",
          assigneeName: "Nguyễn Văn A",
          assignedByName: "Lê Ngọc Sơn",
          priority: "HIGH",
          status: "NEAR_DEADLINE",
          progress: 80,
          startDate: new Date("2026-08-04"),
          dueDate: new Date("2026-08-14"),
        },
        {
          title: "Phê duyệt danh sách chi trả trợ cấp xã hội tháng 8/2026",
          description: "Danh sách 215 đối tượng bảo trợ xã hội nhận lương và trợ cấp hàng tháng qua bưu điện.",
          assigneeName: "Nguyễn Thị C",
          assignedByName: "Lê Ngọc Sơn",
          priority: "URGENT",
          status: "SUBMITTED",
          progress: 95,
          startDate: new Date("2026-08-09"),
          dueDate: new Date("2026-08-11"),
          submittedAt: new Date("2026-08-11"),
        },
      ];

      await Task.insertMany(sampleTasks);
      console.log("🌱 Seeded initial tasks into MongoDB successfully!");
    }
  } catch (err) {
    console.error("Error seeding initial tasks:", err);
  }
};

// ── Tự động cập nhật các Task quá hạn trong MongoDB ──
const autoCheckOverdueTasks = async () => {
  try {
    const now = new Date();
    const overdueTasks = await Task.find({
      dueDate: { $lt: now },
      status: { $nin: ["COMPLETED", "CANCELLED", "OVERDUE"] },
    });

    for (const task of overdueTasks) {
      task.status = "OVERDUE";
      await task.save();

      // Lưu ActivityLog
      await ActivityLog.create({
        actorName: "Hệ thống",
        action: "OVERDUE",
        taskId: task._id,
        taskTitle: task.title,
        description: `Nhiệm vụ "${task.title}" do ${task.assigneeName} thực hiện đã quá hạn hoàn thành!`,
      });

      // Phát Socket event
      emitToDepartment("PhongVanHoaXaHoi", "task:overdue", {
        taskId: task._id,
        taskTitle: task.title,
        status: "OVERDUE",
        assigneeName: task.assigneeName,
        dueDate: task.dueDate,
      });
    }
  } catch (err) {
    console.error("Error auto-checking overdue tasks:", err);
  }
};

// ── GET: Lấy danh sách nhiệm vụ toàn phòng & Thống kê KPI từ MongoDB ──
exports.getDepartmentTasks = async (req, res) => {
  try {
    await seedInitialTasksIfNeeded();
    await autoCheckOverdueTasks();

    const tasks = await Task.find({}).sort({ createdAt: -1 });

    // Tính toán trực tiếp số liệu KPI từ MongoDB
    const total = await Task.countDocuments({});
    const inProgress = await Task.countDocuments({ status: { $in: ["IN_PROGRESS", "NEAR_DEADLINE", "TODO"] } });
    const completed = await Task.countDocuments({ status: "COMPLETED" });
    const overdue = await Task.countDocuments({ status: "OVERDUE" });
    const submitted = await Task.countDocuments({ status: "SUBMITTED" });

    return res.json({
      success: true,
      statistics: {
        total,
        inProgress,
        completed,
        overdue,
        submitted,
      },
      tasks: tasks.map((t) => ({
        id: t._id,
        title: t.title,
        description: t.description,
        assignee: t.assigneeName,
        assignedBy: t.assignedByName,
        assignedDate: t.startDate ? t.startDate.toLocaleDateString("vi-VN") : "01/08/2026",
        dueDate: t.dueDate ? t.dueDate.toLocaleDateString("vi-VN") : "15/08/2026",
        rawDueDate: t.dueDate,
        progress: t.progress,
        status: t.toVietnameseStatus(),
        rawStatus: t.status,
        priority: t.priority === "URGENT" ? "Cấp bách" : t.priority === "HIGH" ? "Khẩn" : "Bình thường",
        rawPriority: t.priority,
      })),
    });
  } catch (err) {
    console.error("Lỗi getDepartmentTasks:", err);
    return res.status(500).json({ message: "Lỗi hệ thống khi lấy danh sách nhiệm vụ" });
  }
};

// ── GET: Lấy nhiệm vụ của cá nhân cán bộ ──
exports.getMyTasks = async (req, res) => {
  try {
    const userName = req.user?.fullName || req.user?.username || "";
    const tasks = await Task.find({
      $or: [
        { assigneeName: { $regex: userName, $options: "i" } },
        { assignedTo: req.user?.id },
      ],
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: tasks.length,
      tasks: tasks.map((t) => ({
        id: t._id,
        title: t.title,
        description: t.description,
        assignee: t.assigneeName,
        assignedBy: t.assignedByName,
        assignedDate: t.startDate ? t.startDate.toLocaleDateString("vi-VN") : "01/08/2026",
        dueDate: t.dueDate ? t.dueDate.toLocaleDateString("vi-VN") : "15/08/2026",
        progress: t.progress,
        status: t.toVietnameseStatus(),
        rawStatus: t.status,
        priority: t.priority === "URGENT" ? "Cấp bách" : t.priority === "HIGH" ? "Khẩn" : "Bình thường",
      })),
    });
  } catch (err) {
    console.error("Lỗi getMyTasks:", err);
    return res.status(500).json({ message: "Lỗi khi lấy nhiệm vụ cá nhân" });
  }
};

// ── GET: Lấy thống kê KPI thời gian thực ──
exports.getStatistics = async (req, res) => {
  try {
    await autoCheckOverdueTasks();
    const total = await Task.countDocuments({});
    const inProgress = await Task.countDocuments({ status: { $in: ["IN_PROGRESS", "NEAR_DEADLINE", "TODO"] } });
    const completed = await Task.countDocuments({ status: "COMPLETED" });
    const overdue = await Task.countDocuments({ status: "OVERDUE" });
    const submitted = await Task.countDocuments({ status: "SUBMITTED" });

    return res.json({
      success: true,
      total,
      inProgress,
      completed,
      overdue,
      submitted,
    });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi lấy thống kê KPI" });
  }
};

// ── POST: Trưởng phòng Giao Nhiệm Vụ Mới ──
exports.createTask = async (req, res) => {
  try {
    const { title, description, assigneeName, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Vui lòng nhập tên nhiệm vụ" });
    }

    const creatorName = req.user?.fullName || req.user?.username || "Lê Ngọc Sơn";

    const newTask = await Task.create({
      title,
      description: description || "",
      assignedBy: req.user?.id,
      assignedByName: creatorName,
      assigneeName: assigneeName || "Nguyễn Văn A",
      priority: priority === "Cấp bách" ? "URGENT" : priority === "Khẩn" ? "HIGH" : "MEDIUM",
      status: "IN_PROGRESS",
      progress: 0,
      startDate: new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // 1. Tạo ActivityLog
    const activity = await ActivityLog.create({
      actorId: req.user?.id,
      actorName: creatorName,
      action: "ASSIGN",
      taskId: newTask._id,
      taskTitle: newTask.title,
      description: `${creatorName} đã giao nhiệm vụ mới "${newTask.title}" cho cán bộ ${newTask.assigneeName}.`,
    });

    // 2. Tạo Notification
    const notif = await Notification.create({
      senderId: req.user?.id,
      senderName: creatorName,
      title: "Nhiệm vụ mới được giao",
      message: `${creatorName} vừa phân công cho bạn nhiệm vụ: "${newTask.title}"`,
      taskId: newTask._id,
      recipientRole: "canbo",
    });

    // 3. Emit Realtime Events
    emitToDepartment("PhongVanHoaXaHoi", "task:created", {
      task: {
        id: newTask._id,
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assigneeName,
        assignedBy: newTask.assignedByName,
        assignedDate: newTask.startDate.toLocaleDateString("vi-VN"),
        dueDate: newTask.dueDate ? newTask.dueDate.toLocaleDateString("vi-VN") : "",
        progress: newTask.progress,
        status: newTask.toVietnameseStatus(),
        rawStatus: newTask.status,
        priority: priority || "Bình thường",
      },
    });

    emitToDepartment("PhongVanHoaXaHoi", "activity:new", activity);
    emitToDepartment("PhongVanHoaXaHoi", "notification:new", notif);

    return res.status(201).json({
      success: true,
      message: "Giao nhiệm vụ thành công",
      task: newTask,
    });
  } catch (err) {
    console.error("Lỗi createTask:", err);
    return res.status(500).json({ message: "Lỗi hệ thống khi giao nhiệm vụ" });
  }
};

// ── PUT: Cán bộ Cập nhật Tiến độ Nhiệm vụ (Core Realtime Endpoint) ──
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, note } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
    }

    const updaterName = req.user?.fullName || req.user?.username || task.assigneeName;
    const oldProgress = task.progress;
    const newProgress = Math.min(100, Math.max(0, Number(progress) || 0));

    // Cập nhật MongoDB
    task.progress = newProgress;
    if (newProgress === 100 && task.status !== "COMPLETED") {
      task.status = "SUBMITTED";
      task.submittedAt = new Date();
    } else if (task.status === "TODO") {
      task.status = "IN_PROGRESS";
    }
    await task.save();

    // 1. Lưu lịch sử TaskProgress vào DB (Không bao giờ ghi đè)
    await TaskProgress.create({
      taskId: task._id,
      userId: req.user?.id,
      userName: updaterName,
      oldProgress,
      newProgress,
      note: note || `Cập nhật tiến độ từ ${oldProgress}% lên ${newProgress}%`,
    });

    // 2. Tạo ActivityLog
    const activity = await ActivityLog.create({
      actorId: req.user?.id,
      actorName: updaterName,
      action: "UPDATE_PROGRESS",
      taskId: task._id,
      taskTitle: task.title,
      description: `${updaterName} đã cập nhật tiến độ nhiệm vụ "${task.title}" từ ${oldProgress}% lên ${newProgress}%.`,
    });

    // 3. Tạo Thông báo cho Trưởng phòng
    const notif = await Notification.create({
      senderId: req.user?.id,
      senderName: updaterName,
      title: "Cập nhật tiến độ nhiệm vụ",
      message: `Cán bộ ${updaterName} đã cập nhật tiến độ nhiệm vụ "${task.title}" lên ${newProgress}%`,
      taskId: task._id,
      recipientRole: "truongphong",
    });

    // 4. Lấy lại stats mới nhất từ MongoDB để emit realtime KPI
    const total = await Task.countDocuments({});
    const inProgressCount = await Task.countDocuments({ status: { $in: ["IN_PROGRESS", "NEAR_DEADLINE", "TODO"] } });
    const completedCount = await Task.countDocuments({ status: "COMPLETED" });
    const overdueCount = await Task.countDocuments({ status: "OVERDUE" });
    const submittedCount = await Task.countDocuments({ status: "SUBMITTED" });

    // 5. Emit Socket.IO Event thời gian thực tới tất cả Clients
    emitToDepartment("PhongVanHoaXaHoi", "task:progress_updated", {
      taskId: task._id,
      title: task.title,
      oldProgress,
      progress: newProgress,
      status: task.toVietnameseStatus(),
      rawStatus: task.status,
      updatedBy: updaterName,
      updatedAt: new Date(),
      stats: {
        total,
        inProgress: inProgressCount,
        completed: completedCount,
        overdue: overdueCount,
        submitted: submittedCount,
      },
    });

    emitToDepartment("PhongVanHoaXaHoi", "activity:new", activity);
    emitToDepartment("PhongVanHoaXaHoi", "notification:new", notif);

    return res.json({
      success: true,
      message: `Đã cập nhật tiến độ lên ${newProgress}%`,
      task,
    });
  } catch (err) {
    console.error("Lỗi updateProgress:", err);
    return res.status(500).json({ message: "Lỗi khi cập nhật tiến độ nhiệm vụ" });
  }
};

// ── POST: Cán bộ Gửi Kết quả Nhiệm vụ (Submit for Approval) ──
exports.submitTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
    }

    const updaterName = req.user?.fullName || req.user?.username || task.assigneeName;

    task.status = "SUBMITTED";
    task.submittedAt = new Date();
    if (task.progress < 100) task.progress = 100;
    await task.save();

    const activity = await ActivityLog.create({
      actorId: req.user?.id,
      actorName: updaterName,
      action: "SUBMIT",
      taskId: task._id,
      taskTitle: task.title,
      description: `Cán bộ ${updaterName} đã gửi kết quả nhiệm vụ "${task.title}" chờ Trưởng phòng phê duyệt.`,
    });

    const notif = await Notification.create({
      senderId: req.user?.id,
      senderName: updaterName,
      title: "Gửi kết quả nhiệm vụ chờ phê duyệt",
      message: `Cán bộ ${updaterName} đã hoàn thành và gửi kết quả nhiệm vụ "${task.title}" chờ phê duyệt.`,
      taskId: task._id,
      recipientRole: "truongphong",
    });

    emitToDepartment("PhongVanHoaXaHoi", "task:submitted", {
      taskId: task._id,
      taskTitle: task.title,
      status: "Chờ phê duyệt",
      rawStatus: "SUBMITTED",
      progress: 100,
      submittedBy: updaterName,
    });
    emitToDepartment("PhongVanHoaXaHoi", "activity:new", activity);
    emitToDepartment("PhongVanHoaXaHoi", "notification:new", notif);

    return res.json({ success: true, message: "Đã gửi kết quả chờ phê duyệt", task });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi gửi kết quả nhiệm vụ" });
  }
};

// ── POST: Trưởng phòng Phê duyệt Nhiệm vụ (Approve Task) ──
exports.approveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
    }

    const managerName = req.user?.fullName || req.user?.username || "Trưởng phòng";

    task.status = "COMPLETED";
    task.progress = 100;
    task.completedAt = new Date();
    await task.save();

    const activity = await ActivityLog.create({
      actorId: req.user?.id,
      actorName: managerName,
      action: "APPROVE",
      taskId: task._id,
      taskTitle: task.title,
      description: `Trưởng phòng ${managerName} đã phê duyệt hoàn thành nhiệm vụ "${task.title}".`,
    });

    const notif = await Notification.create({
      senderId: req.user?.id,
      senderName: managerName,
      title: "Nhiệm vụ đã được phê duyệt",
      message: `Nhiệm vụ "${task.title}" của bạn đã được Trưởng phòng phê duyệt HOÀN THÀNH.`,
      taskId: task._id,
      recipientRole: "canbo",
    });

    // Lấy lại stats MongoDB
    const total = await Task.countDocuments({});
    const inProgressCount = await Task.countDocuments({ status: { $in: ["IN_PROGRESS", "NEAR_DEADLINE", "TODO"] } });
    const completedCount = await Task.countDocuments({ status: "COMPLETED" });
    const overdueCount = await Task.countDocuments({ status: "OVERDUE" });

    emitToDepartment("PhongVanHoaXaHoi", "task:approved", {
      taskId: task._id,
      taskTitle: task.title,
      status: "Hoàn thành",
      rawStatus: "COMPLETED",
      progress: 100,
      approvedBy: managerName,
      stats: {
        total,
        inProgress: inProgressCount,
        completed: completedCount,
        overdue: overdueCount,
      },
    });
    emitToDepartment("PhongVanHoaXaHoi", "activity:new", activity);
    emitToDepartment("PhongVanHoaXaHoi", "notification:new", notif);

    return res.json({ success: true, message: "Đã phê duyệt nhiệm vụ hoàn thành", task });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi phê duyệt nhiệm vụ" });
  }
};

// ── POST: Trưởng phòng Yêu cầu Bổ sung Kết quả (Request Revision) ──
exports.requestRevision = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
    }

    const managerName = req.user?.fullName || req.user?.username || "Trưởng phòng";

    task.status = "REVISION_REQUIRED";
    task.revisionReason = reason || "Cần bổ sung thêm hồ sơ tài liệu.";
    await task.save();

    const activity = await ActivityLog.create({
      actorId: req.user?.id,
      actorName: managerName,
      action: "REVISION",
      taskId: task._id,
      taskTitle: task.title,
      description: `Trưởng phòng ${managerName} yêu cầu bổ sung nhiệm vụ "${task.title}": ${task.revisionReason}`,
    });

    const notif = await Notification.create({
      senderId: req.user?.id,
      senderName: managerName,
      title: "Yêu cầu bổ sung kết quả nhiệm vụ",
      message: `Trưởng phòng yêu cầu bổ sung kết quả nhiệm vụ "${task.title}": ${task.revisionReason}`,
      taskId: task._id,
      recipientRole: "canbo",
    });

    emitToDepartment("PhongVanHoaXaHoi", "task:revision_required", {
      taskId: task._id,
      taskTitle: task.title,
      status: "Yêu cầu bổ sung",
      rawStatus: "REVISION_REQUIRED",
      reason: task.revisionReason,
    });
    emitToDepartment("PhongVanHoaXaHoi", "activity:new", activity);
    emitToDepartment("PhongVanHoaXaHoi", "notification:new", notif);

    return res.json({ success: true, message: "Đã yêu cầu cán bộ bổ sung nhiệm vụ", task });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi yêu cầu bổ sung" });
  }
};

// ── GET: Lấy lịch sử tiến độ của 1 Nhiệm vụ ──
exports.getTaskHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await TaskProgress.find({ taskId: id }).sort({ createdAt: -1 });
    return res.json({ success: true, history });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi lấy lịch sử tiến độ" });
  }
};

// ── GET: Lấy danh sách Thông báo (Notifications) ──
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(30);
    const unreadCount = await Notification.countDocuments({ isRead: false });

    return res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi lấy danh sách thông báo" });
  }
};

// ── PUT: Đánh dấu thông báo đã đọc ──
exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === "all") {
      await Notification.updateMany({ isRead: false }, { isRead: true });
    } else {
      await Notification.findByIdAndUpdate(id, { isRead: true });
    }
    const unreadCount = await Notification.countDocuments({ isRead: false });
    return res.json({ success: true, unreadCount });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi cập nhật thông báo" });
  }
};

// ── GET: Lấy Nhật ký Hoạt động (Activity Log) ──
exports.getActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(25);
    return res.json({ success: true, activities });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi lấy nhật ký hoạt động" });
  }
};
