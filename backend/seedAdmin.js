import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const exists = await Admin.findOne();

    if (exists) {
      console.log("Đã có tài khoản admin");
      process.exit();
    }

    await Admin.create({
      username: "admin",
      password: "123456",
    });

    console.log("Tạo admin thành công");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createAdmin();