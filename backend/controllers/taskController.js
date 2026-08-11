const Task = require("../models/Task");
const TaskProgress = require("../models/TaskProgress");
const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");
const Admin = require("../models/Admin");
const notificationService = require("../services/notificationService");
const { emitToDepartment, emitToManagers, emitToUser } = require("../services/socketService");

// ── Khởi tạo danh sách cán bộ mẫu vào Admin DB nếu chưa có ──
const ensureStaffExists = async () => {
  try {
    const count = await Admin.countDocuments({ role: { $ne: "admin" } });
    if (count === 0) {
      const bcrypt = require("bcryptjs");
      const defaultPassword = bcrypt.hashSync("Vhxh@2026", 10);
      await Admin.create([
        {
          username: "lengocson.vhxh",
          password: defaultPassword,
          role: "canbo",
          fullName: "Lê Ngọc Sơn",
          chucVu: "Công chức chuyên môn Văn hóa - Xã hội",
          phongBan: "Phòng Văn hóa - Xã hội",
          status: "active",
        },
        {
          username: "nguyenvana.vhxh",
          password: defaultPassword,
          role: "canbo",
          fullName: "Nguyễn Văn A",
          chucVu: "Công chức chuyên môn BHYT",
          phongBan: "Phòng Văn hóa - Xã hội",
          status: "active",
        },
        {
          username: "tranvanb.vhxh",
          password: defaultPassword,
          role: "canbo",
          fullName: "Trần Văn B",
          chucVu: "Công chức chuyên môn TTHC",
          phongBan: "Phòng Văn hóa - Xã hội",
          status: "active",
        },
        {
          username: "nguyenthic.vhxh",
          password: defaultPassword,
          role: "canbo",
          fullName: "Nguyễn Thị C",
          chucVu: "Công chức phụ trách Bảo trợ Xã hội",
          phongBan: "Phòng Văn hóa - Xã hội",
          status: "active",
        },
        {
          username: "ybyen.vhxh",
          password: defaultPassword,
          role: "phophong",
          fullName: "Y Byen",
          chucVu: "Phó Trưởng phòng",
          phongBan: "Phòng Văn hóa - Xã hội",
          status: "active",
        },
      ]);
      console.log("🌱 Created initial staff in Admin DB successfully!");
    }
  } catch (e) {
    console.error("Error ensuring staff exists:", e);
  }
};

// ── GET /api/users/staff: Lấy danh sách cán bộ ──
exports.getStaffList = async (req, res) => {
  try {
    await ensureStaffExists();
    const staffMembers = await Admin.find({ status: "active" })
      .select("-password")
      .sort({ fullName: 1 });

    const formattedStaff = staffMembers.map((s) => ({
      _id: s._id,
      id: s._id,
      name: s.fullName || s.username,
      fullName: s.fullName || s.username,
      username: s.username,
      position: s.chucVu || "Công chức chuyên môn",
      chucVu: s.chucVu || "Công chức chuyên môn",
      phongBan: s.phongBan || "Phòng Văn hóa - Xã hội",
      role: s.role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName || s.username)}&background=E0F2FE&color=005BAC&bold=true`,
    }));

    return res.json({
      success: true,
      staff: formattedStaff,
      users: formattedStaff,
    });
  } catch (err) {
    console.error("Lỗi getStaffList:", err);
    return res.status(500).json({ message: "Lỗi khi lấy danh sách cán bộ" });
  }
};

// ── Tự động tạo Task mẫu vào MongoDB nếu DB chưa có Task ──
const seedInitialTasksIfNeeded = async () => {
  try {
    const count = await Task.countDocuments();
    if (count === 0) {
      const sampleTasks = [
        {
          title: "Tổng hợp báo cáo tình hình thực hiện nhiệm vụ tháng 8/2026",
          description: "Tổng hợp số liệu từ các chuyên viên, rà soát kết quả các chỉ tiêu phát triển văn hóa xã hội tháng 8 để trình UBND xã.",
          assigneeName: "Lê Ngọc Sơn",
          assignedByName: "Nguyễn Thái Huy",
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
          assignedByName: "Nguyễn Thái Huy",
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
          assignedByName: "Nguyễn Thái Huy",
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
          assignedByName: "Nguyễn Thái Huy",
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
          assignedByName: "Nguyễn Thái Huy",
          priority: "MEDIUM",
          status: "COMPLETED",
          progress: 100,
          startDate: new Date("2026-08-08"),
          dueDate: new Date("2026-08-12"),
          completedAt: new Date("2026-08-12"),
        },
      ];

      await Task.insertMany(sampleTasks);
      console.log("🌱 Seeded initial tasks into MongoDB!");
    }
  } catch (err) {
    console.error("Error seeding tasks:", err);
  }
};

// ── Tự động kiểm tra quá hạn trong MongoDB ──
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

      await ActivityLog.create({
        actorName: "Hệ thống",
        action: "OVERDUE",
        taskId: task._id,
        taskTitle: task.title,
        description: `Nhiệm vụ "${task.title}" do ${task.assigneeName} thực hiện đã quá hạn hoàn thành!`,
      });

      if (task.assignedTo) {
        await notificationService.notifyTaskOverdue({
          taskId: task._id,
          taskTitle: task.title,
          assigneeId: task.assignedTo,
        });
      }

      emitToDepartment("PhongVanHoaXaHoi", "task:overdue", {
        taskId: task._id,
        taskTitle: task.title,
        status: "OVERDUE",
        assigneeName: task.assigneeName,
        dueDate: task.dueDate,
      });
    }
  } catch (err) {
    console.error("Error checking overdue tasks:", err);
  }
};

// ── GET: Lấy danh sách nhiệm vụ toàn phòng từ MongoDB ──
exports.getDepartmentTasks = async (req, res) => {
  try {
    await seedInitialTasksIfNeeded();
    await autoCheckOverdueTasks();

    const tasks = await Task.find({}).sort({ createdAt: -1 });

    const total = await Task.countDocuments({});
    const todo = await Task.countDocuments({ status: "TODO" });
    const inProgress = await Task.countDocuments({ status: { $in: ["IN_PROGRESS", "NEAR_DEADLINE", "TODO"] } });
    const completed = await Task.countDocuments({ status: "COMPLETED" });
    const overdue = await Task.countDocuments({ status: "OVERDUE" });
    const submitted = await Task.countDocuments({ status: "SUBMITTED" });

    return res.json({
      success: true,
      statistics: {
        total,
        todo,
        inProgress,
        completed,
        overdue,
        submitted,
      },
      tasks: tasks.map((t) => ({
        id: t._id,
        _id: t._id,
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
        priority: t.priority === "URGENT" ? "Khẩn cấp" : t.priority === "HIGH" ? "Cao" : t.priority === "LOW" ? "Thấp" : "Bình thường",
        rawPriority: t.priority,
      })),
    });
  } catch (err) {
    console.error("Lỗi getDepartmentTasks:", err);
    return res.status(500).json({ message: "Lỗi hệ thống khi lấy danh sách nhiệm vụ" });
  }
};

// ── GET: Lấy nhiệm vụ cá nhân cán bộ ──
exports.getMyTasks = async (req, res) => {
  try {
    await seedInitialTasksIfNeeded();
    const currentUserId = req.user?.id;
    const userName = req.user?.fullName || req.user?.username || "";

    const query = { $or: [] };
    if (currentUserId) query.$or.push({ assignedTo: currentUserId });
    if (userName) query.$or.push({ assigneeName: { $regex: userName, $options: "i" } });
    if (query.$or.length === 0) delete query.$or;

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: tasks.length,
      tasks: tasks.map((t) => ({
        id: t._id,
        _id: t._id,
        title: t.title,
        description: t.description,
        assignee: t.assigneeName,
        assignedBy: t.assignedByName,
        assignedDate: t.startDate ? t.startDate.toLocaleDateString("vi-VN") : "01/08/2026",
        dueDate: t.dueDate ? t.dueDate.toLocaleDateString("vi-VN") : "15/08/2026",
        progress: t.progress,
        status: t.toVietnameseStatus(),
        rawStatus: t.status,
        priority: t.priority === "URGENT" ? "Khẩn cấp" : t.priority === "HIGH" ? "Cao" : t.priority === "LOW" ? "Thấp" : "Bình thường",
      })),
    });
  } catch (err) {
    console.error("Lỗi getMyTasks:", err);
    return res.status(500).json({ message: "Lỗi khi lấy nhiệm vụ cá nhân" });
  }
};

// ── GET: Lấy thống kê KPI ──
exports.getStatistics = async (req, res) => {
  try {
    await autoCheckOverdueTasks();
    const total = await Task.countDocuments({});
    const todo = await Task.countDocuments({ status: "TODO" });
    const inProgress = await Task.countDocuments({ status: { $in: ["IN_PROGRESS", "NEAR_DEADLINE"] } });
    const completed = await Task.countDocuments({ status: "COMPLETED" });
    const overdue = await Task.countDocuments({ status: "OVERDUE" });
    const submitted = await Task.countDocuments({ status: "SUBMITTED" });

    return res.json({
      success: true,
      total,
      todo,
      inProgress,
      completed,
      overdue,
      submitted,
    });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi lấy thống kê KPI" });
  }
};

// ── POST /api/tasks: Trưởng phòng GIAO NHIỆM VỤ MỚI ──
exports.createTask = async (req, res) => {
  try {
    const userRole = req.user?.role || "truongphong";

    const { title, description, assignedTo, assigneeName, startDate, dueDate, priority, note } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Tên nhiệm vụ không được để trống." });
    }

    if (!assignedTo && !assigneeName) {
      return res.status(400).json({ message: "Vui lòng chọn cán bộ thực hiện." });
    }

    if (!dueDate) {
      return res.status(400).json({ message: "Hạn hoàn thành không được để trống." });
    }

    const start = startDate ? new Date(startDate) : new Date();
    const due = new Date(dueDate);

    if (due < start) {
      return res.status(400).json({ message: "Hạn hoàn thành phải sau ngày bắt đầu." });
    }

    // Tra cứu cán bộ thực hiện
    let targetStaff = null;
    if (assignedTo) {
      targetStaff = await Admin.findById(assignedTo);
    }
    if (!targetStaff && assigneeName) {
      targetStaff = await Admin.findOne({
        $or: [
          { fullName: { $regex: assigneeName, $options: "i" } },
          { username: { $regex: assigneeName, $options: "i" } },
        ],
      });
    }
    if (!targetStaff) {
      targetStaff = await Admin.findOne({ role: "canbo" });
    }

    const creatorName = req.user?.fullName || req.user?.username || "Nguyễn Thái Huy";
    const finalAssigneeName = targetStaff ? targetStaff.fullName || targetStaff.username : (assigneeName || "Lê Ngọc Sơn");

    let enumPriority = "MEDIUM";
    if (priority === "Khẩn cấp" || priority === "URGENT") enumPriority = "URGENT";
    else if (priority === "Cao" || priority === "HIGH") enumPriority = "HIGH";
    else if (priority === "Thấp" || priority === "LOW") enumPriority = "LOW";

    // 1. Tạo và Lưu Task vào MongoDB
    const newTask = await Task.create({
      title: title.trim(),
      description: description || note || "",
      assignedBy: req.user?.id || req.user?._id || "6a5982689a2f05a601d3a250",
      assignedByName: creatorName,
      assignedTo: targetStaff ? targetStaff._id : null,
      assigneeName: finalAssigneeName,
      departmentId: "PhongVanHoaXaHoi",
      priority: enumPriority,
      status: "TODO",
      progress: 0,
      startDate: start,
      dueDate: due,
    });

    // 2. Tạo ActivityLog thực tế
    const activity = await ActivityLog.create({
      actorId: req.user?.id || req.user?._id,
      actorName: creatorName,
      action: "TASK_ASSIGNED",
      taskId: newTask._id,
      taskTitle: newTask.title,
      description: `${creatorName} đã giao nhiệm vụ cho ${finalAssigneeName}`,
      targetUserId: targetStaff ? targetStaff._id : null,
      departmentId: "PhongVanHoaXaHoi",
    });

    // 3. Tạo Notification trong MongoDB và phát Socket Realtime qua Notification Service
    if (targetStaff) {
      await notificationService.notifyTaskAssigned({
        taskId: newTask._id,
        taskTitle: newTask.title,
        assignedTo: targetStaff._id,
        assignedBy: req.user?.id,
        creatorName,
      });
    }

    const totalCount = await Task.countDocuments({});
    const todoCount = await Task.countDocuments({ status: "TODO" });
    const inProgressCount = await Task.countDocuments({ status: { $in: ["IN_PROGRESS", "NEAR_DEADLINE"] } });
    const completedCount = await Task.countDocuments({ status: "COMPLETED" });
    const overdueCount = await Task.countDocuments({ status: "OVERDUE" });

    emitToDepartment("PhongVanHoaXaHoi", "task:created", {
      task: {
        id: newTask._id,
        _id: newTask._id,
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assigneeName,
        assignedBy: newTask.assignedByName,
        assignedDate: newTask.startDate.toLocaleDateString("vi-VN"),
        dueDate: newTask.dueDate.toLocaleDateString("vi-VN"),
        progress: 0,
        status: "Chưa thực hiện",
        rawStatus: "TODO",
        priority: priority || "Bình thường",
      },
      stats: {
        total: totalCount,
        todo: todoCount,
        inProgress: inProgressCount,
        completed: completedCount,
        overdue: overdueCount,
      },
    });

    emitToDepartment("PhongVanHoaXaHoi", "activity:new", activity);

    return res.status(201).json({
      success: true,
      message: "Giao nhiệm vụ thành công.",
      task: newTask,
      statistics: {
        total: totalCount,
        todo: todoCount,
        inProgress: inProgressCount,
        completed: completedCount,
        overdue: overdueCount,
      },
    });
  } catch (err) {
    console.error("Lỗi khi giao nhiệm vụ:", err);
    return res.status(500).json({ message: "Không thể giao nhiệm vụ. Vui lòng thử lại." });
  }
};

// ── PUT: Cập nhật tiến độ ──
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, note } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });

    const updaterName = req.user?.fullName || req.user?.username || task.assigneeName;
    const oldProgress = task.progress;
    const newProgress = Math.min(100, Math.max(0, Number(progress) || 0));

    task.progress = newProgress;
    if (newProgress === 100 && task.status !== "COMPLETED") {
      task.status = "SUBMITTED";
      task.submittedAt = new Date();
    } else if (task.status === "TODO") {
      task.status = "IN_PROGRESS";
    }
    await task.save();

    await TaskProgress.create({
      taskId: task._id,
      userId: req.user?.id,
      userName: updaterName,
      oldProgress,
      newProgress,
      note: note || `Cập nhật tiến độ từ ${oldProgress}% lên ${newProgress}%`,
    });

    const activity = await ActivityLog.create({
      actorId: req.user?.id,
      actorName: updaterName,
      action: "UPDATE_PROGRESS",
      taskId: task._id,
      taskTitle: task.title,
      description: `${updaterName} đã cập nhật tiến độ nhiệm vụ "${task.title}" từ ${oldProgress}% lên ${newProgress}%.`,
    });

    // Tìm Trưởng phòng để gửi thông báo
    const manager = await Admin.findOne({ role: "truongphong" });
    const managerId = manager ? manager._id : "6a5982689a2f05a601d3a250";

    await notificationService.notifyTaskProgressUpdated({
      taskId: task._id,
      taskTitle: task.title,
      oldProgress,
      newProgress,
      assigneeName: updaterName,
      managerId,
      senderId: req.user?.id,
    });

    const total = await Task.countDocuments({});
    const inProgressCount = await Task.countDocuments({ status: { $in: ["IN_PROGRESS", "NEAR_DEADLINE", "TODO"] } });
    const completedCount = await Task.countDocuments({ status: "COMPLETED" });
    const overdueCount = await Task.countDocuments({ status: "OVERDUE" });

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
      },
    });

    emitToDepartment("PhongVanHoaXaHoi", "activity:new", activity);

    return res.json({
      success: true,
      message: `Đã cập nhật tiến độ lên ${newProgress}%`,
      task,
    });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi cập nhật tiến độ nhiệm vụ" });
  }
};

// ── POST: Nộp kết quả ──
exports.submitTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });

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

    const manager = await Admin.findOne({ role: "truongphong" });
    const managerId = manager ? manager._id : "6a5982689a2f05a601d3a250";

    await notificationService.notifyTaskSubmitted({
      taskId: task._id,
      taskTitle: task.title,
      assigneeName: updaterName,
      managerId,
      senderId: req.user?.id,
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

    return res.json({ success: true, message: "Đã gửi kết quả chờ phê duyệt", task });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi gửi kết quả nhiệm vụ" });
  }
};

// ── POST: Phê duyệt hoàn thành ──
exports.approveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });

    const managerName = req.user?.fullName || req.user?.username || "Nguyễn Thái Huy";

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

    if (task.assignedTo) {
      await notificationService.notifyTaskCompleted({
        taskId: task._id,
        taskTitle: task.title,
        managerName,
        assigneeId: task.assignedTo,
        managerId: req.user?.id,
      });
    }

    emitToDepartment("PhongVanHoaXaHoi", "task:approved", {
      taskId: task._id,
      taskTitle: task.title,
      status: "Hoàn thành",
      rawStatus: "COMPLETED",
      progress: 100,
      approvedBy: managerName,
    });
    emitToDepartment("PhongVanHoaXaHoi", "activity:new", activity);

    return res.json({ success: true, message: "Đã phê duyệt nhiệm vụ hoàn thành", task });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi phê duyệt nhiệm vụ" });
  }
};

// ── POST: Yêu cầu bổ sung ──
exports.requestRevision = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });

    const managerName = req.user?.fullName || req.user?.username || "Nguyễn Thái Huy";

    task.status = "REVISION_REQUIRED";
    task.revisionReason = reason || "Cần bổ sung thêm thông tin.";
    await task.save();

    const activity = await ActivityLog.create({
      actorId: req.user?.id,
      actorName: managerName,
      action: "REVISION",
      taskId: task._id,
      taskTitle: task.title,
      description: `Trưởng phòng ${managerName} yêu cầu bổ sung nhiệm vụ "${task.title}": ${task.revisionReason}`,
    });

    if (task.assignedTo) {
      await notificationService.notifyTaskRevisionRequired({
        taskId: task._id,
        taskTitle: task.title,
        managerName,
        assigneeId: task.assignedTo,
        managerId: req.user?.id,
        reason: task.revisionReason,
      });
    }

    emitToDepartment("PhongVanHoaXaHoi", "task:revision_required", {
      taskId: task._id,
      taskTitle: task.title,
      status: "Yêu cầu bổ sung",
      rawStatus: "REVISION_REQUIRED",
    });
    emitToDepartment("PhongVanHoaXaHoi", "activity:new", activity);

    return res.json({ success: true, message: "Đã yêu cầu bổ sung nhiệm vụ", task });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi yêu cầu bổ sung" });
  }
};

// ── GET: Lịch sử ──
exports.getTaskHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await TaskProgress.find({ taskId: id }).sort({ createdAt: -1 });
    return res.json({ success: true, history });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi lấy lịch sử" });
  }
};

// ── GET: Notifications ──
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || "6a5982689a2f05a601d3a250";
    const result = await notificationService.getUserNotifications(userId, req.query);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi lấy thông báo" });
  }
};

// ── PUT/PATCH: Mark Notification Read ──
exports.markNotificationRead = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || "6a5982689a2f05a601d3a250";
    const { id } = req.params;
    if (id === "read-all" || id === "all") {
      const result = await notificationService.markAllAsRead(userId);
      return res.json(result);
    }
    const result = await notificationService.markAsRead(id, userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi cập nhật thông báo" });
  }
};

// ── GET: Activities ──
exports.getActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(25);
    return res.json({ success: true, activities });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi lấy nhật ký hoạt động" });
  }
};
