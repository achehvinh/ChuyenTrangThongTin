const jwt = require("jsonwebtoken");
const express = require("express");

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "Vhxh" && password === "Vhxh@2026") {
    const token = jwt.sign(
      { username: "Vhxh", role: "admin" },
      process.env.JWT_SECRET || "bhyt_dakpxi_secret",
      { expiresIn: "7d" }
    );

    return res.json({ token });
  }

  return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
});

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

module.exports = { authAdmin, router };
