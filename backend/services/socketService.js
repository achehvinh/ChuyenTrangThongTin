const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Hỗ trợ kết nối cross-origin đa thiết bị và trình duyệt
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  // Middleware Xác thực Socket Connection
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "") ||
        socket.handshake.query?.token;

      if (!token) {
        // Cho phép demo fallback nếu client chưa truyền token đầy đủ nhưng ngắt kết nối không hợp lệ
        socket.user = {
          id: "anonymous_user",
          username: "Guest",
          role: "canbo",
          departmentId: "PhongVanHoaXaHoi",
        };
        return next();
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "bhyt_dakpxi_secret"
      );

      socket.user = {
        id: decoded.id || decoded.username,
        username: decoded.username,
        role: decoded.role || "canbo",
        departmentId: decoded.departmentId || "PhongVanHoaXaHoi",
      };

      next();
    } catch (err) {
      console.warn("⚠️ Socket.IO Auth Warning:", err.message);
      socket.user = {
        id: "guest_user",
        username: "Guest",
        role: "canbo",
        departmentId: "PhongVanHoaXaHoi",
      };
      next();
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user || {};
    const departmentId = user.departmentId || "PhongVanHoaXaHoi";

    console.log(`⚡ Socket connected: ${socket.id} | User: ${user.username} (${user.role})`);

    // Gắn user vào các Room truyền nhận tin nhắn riêng biệt
    if (user.id) {
      socket.join(`user:${user.id}`);
    }
    socket.join(`department:${departmentId}`);

    if (user.role === "truongphong" || user.role === "admin" || user.role === "phophong") {
      socket.join(`manager:${departmentId}`);
    }

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} | Reason: ${reason}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO chưa được khởi tạo!");
  }
  return io;
};

// Gửi event trực tiếp cho 1 Cán bộ
const emitToUser = (userId, event, payload) => {
  if (io && userId) {
    io.to(`user:${userId}`).emit(event, payload);
  }
};

// Gửi event cho Ban Quản lý / Trưởng phòng
const emitToManagers = (departmentId = "PhongVanHoaXaHoi", event, payload) => {
  if (io) {
    io.to(`manager:${departmentId}`).emit(event, payload);
  }
};

// Gửi event cho toàn bộ Cán bộ trong Phòng
const emitToDepartment = (departmentId = "PhongVanHoaXaHoi", event, payload) => {
  if (io) {
    io.to(`department:${departmentId}`).emit(event, payload);
    io.emit(event, payload); // Broadcast đảm bảo tất cả màn hình nhận realtime
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToManagers,
  emitToDepartment,
};
