import { io } from "socket.io-client";
import { getBackendServerUrl } from "../utils/apiConfig";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const backendUrl = getBackendServerUrl();
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken") || "";

    socket = io(backendUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      auth: {
        token
      },
      query: {
        token
      }
    });

    socket.on("connect", () => {
      console.log("⚡ Socket.IO Connected to backend Server:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.warn("⚠️ Socket.IO Connection Warning:", err.message);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
