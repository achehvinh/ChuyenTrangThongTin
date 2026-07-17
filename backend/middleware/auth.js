const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const router = express.Router();

// ── Đăng nhập Cán bộ ──
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Kiểm tra tài khoản cứng Admin Vhxh để tương thích ngược
    if (username === "Vhxh" && password === "Vhxh@2026") {
      const token = jwt.sign(
        { username: "Vhxh", role: "admin" },
        process.env.JWT_SECRET || "bhyt_dakpxi_secret",
        { expiresIn: "7d" }
      );
      return res.json({
        token,
        username: "Vhxh",
        role: "admin",
        fullName: "Quản trị viên Hệ thống",
      });
    }

    // 2. Tra cứu động trong Database
    const user = await Admin.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    // Kiểm tra tài khoản có bị tạm dừng hoạt động hay không
    if (user.status === "suspended") {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị tạm dừng hoạt động" });
    }

    // So khớp mật khẩu đã mã hóa
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "bhyt_dakpxi_secret",
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      username: user.username,
      role: user.role,
      fullName: user.fullName || user.username,
    });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    return res.status(500).json({ message: "Lỗi hệ thống trong quá trình đăng nhập" });
  }
});

// Middleware xác thực quyền Admin/Cán bộ
function authAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Không có token xác thực" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "bhyt_dakpxi_secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
}

// ── GET: Lấy danh sách tài khoản ──
router.get("/users", authAdmin, async (req, res) => {
  try {
    const { role, username } = req.user;

    if (role === "admin") {
      // Admin thấy danh sách các Trưởng phòng
      const users = await Admin.find({ role: "truongphong" }).select("-password");
      return res.json(users);
    } else if (role === "truongphong") {
      // Trưởng phòng thấy các Phó phòng & Cán bộ do chính mình tạo ra
      const users = await Admin.find({ createdBy: username }).select("-password");
      return res.json(users);
    } else {
      return res.status(403).json({ message: "Bạn không có quyền xem danh sách cán bộ" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống khi lấy danh sách cán bộ" });
  }
});

// ── POST: Tạo tài khoản mới ──
router.post("/users", authAdmin, async (req, res) => {
  const { username, password, role, fullName } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ tên đăng nhập, mật khẩu và vai trò" });
  }

  try {
    const currentUser = req.user;

    // Phân quyền tạo tài khoản
    if (currentUser.role === "admin") {
      if (role !== "truongphong") {
        return res.status(403).json({ message: "Quyền Admin chỉ được phép tạo tài khoản Trưởng phòng" });
      }
    } else if (currentUser.role === "truongphong") {
      if (role !== "phophong" && role !== "canbo") {
        return res.status(403).json({ message: "Trưởng phòng chỉ được phép tạo tài khoản Phó phòng hoặc Cán bộ" });
      }
    } else {
      return res.status(403).json({ message: "Bạn không có quyền tạo tài khoản cán bộ" });
    }

    // Kiểm tra tài khoản đã tồn tại chưa
    const exists = await Admin.findOne({ username });
    if (exists || username === "Vhxh") {
      return res.status(400).json({ message: "Tên đăng nhập này đã tồn tại trên hệ thống" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Tạo mới tài khoản
    const newUser = await Admin.create({
      username,
      password: hashedPassword,
      role,
      fullName: fullName || "",
      createdBy: currentUser.username,
    });

    return res.status(201).json({
      success: true,
      user: {
        _id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        fullName: newUser.fullName,
      },
    });
  } catch (err) {
    console.error("Lỗi tạo tài khoản:", err);
    return res.status(500).json({ message: "Lỗi hệ thống khi tạo tài khoản" });
  }
});

// ── PUT: Cập nhật tài khoản (Thông tin hoặc Trạng thái Tạm dừng) ──
router.put("/users/:id", authAdmin, async (req, res) => {
  try {
    const targetUser = await Admin.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản cán bộ" });
    }

    const currentUser = req.user;

    // Quyền cập nhật tài khoản
    if (currentUser.role === "admin") {
      if (targetUser.role !== "truongphong") {
        return res.status(403).json({ message: "Admin chỉ được phép cập nhật tài khoản Trưởng phòng" });
      }
    } else if (currentUser.role === "truongphong") {
      if (targetUser.createdBy !== currentUser.username) {
        return res.status(403).json({ message: "Bạn chỉ có quyền cập nhật các tài khoản cán bộ do chính mình tạo ra" });
      }
    } else {
      return res.status(403).json({ message: "Bạn không có quyền cập nhật tài khoản" });
    }

    const { fullName, role, password, status } = req.body;

    if (fullName !== undefined) targetUser.fullName = fullName;
    if (role !== undefined) {
      if (currentUser.role === "admin" && role !== "truongphong") {
        return res.status(400).json({ message: "Admin chỉ được sửa vai trò thành Trưởng phòng" });
      }
      if (currentUser.role === "truongphong" && role !== "phophong" && role !== "canbo") {
        return res.status(400).json({ message: "Trưởng phòng chỉ được sửa vai trò thành Phó phòng hoặc Cán bộ" });
      }
      targetUser.role = role;
    }
    if (password) {
      targetUser.password = bcrypt.hashSync(password, 10);
    }
    if (status !== undefined) {
      if (status !== "active" && status !== "suspended") {
        return res.status(400).json({ message: "Trạng thái không hợp lệ (chỉ chấp nhận active hoặc suspended)" });
      }
      targetUser.status = status;
    }

    await targetUser.save();
    return res.json({
      success: true,
      message: "Cập nhật tài khoản cán bộ thành công",
      user: {
        _id: targetUser._id,
        username: targetUser.username,
        role: targetUser.role,
        fullName: targetUser.fullName,
        status: targetUser.status,
      }
    });
  } catch (err) {
    console.error("Lỗi cập nhật tài khoản:", err);
    return res.status(500).json({ message: "Lỗi hệ thống khi cập nhật tài khoản" });
  }
});

// ── DELETE: Xóa tài khoản ──
router.delete("/users/:id", authAdmin, async (req, res) => {
  try {
    const targetUser = await Admin.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản cán bộ cần xóa" });
    }

    const currentUser = req.user;

    // Quyền xóa tài khoản
    if (currentUser.role === "admin") {
      if (targetUser.role !== "truongphong") {
        return res.status(403).json({ message: "Admin chỉ được phép xóa tài khoản Trưởng phòng" });
      }
    } else if (currentUser.role === "truongphong") {
      if (targetUser.createdBy !== currentUser.username) {
        return res.status(403).json({ message: "Bạn chỉ có quyền xóa các tài khoản cán bộ do chính mình tạo ra" });
      }
    } else {
      return res.status(403).json({ message: "Bạn không có quyền xóa tài khoản cán bộ" });
    }

    await Admin.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Đã xóa tài khoản cán bộ thành công" });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống khi xóa tài khoản" });
  }
});

module.exports = { authAdmin, router };
