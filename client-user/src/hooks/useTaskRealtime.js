import { useEffect, useState } from "react";
import { getSocket } from "../services/socket";

export const useTaskRealtime = ({
  onTaskUpdated,
  onProgressUpdated,
  onTaskCreated,
  onActivityNew,
  onNotificationNew,
  onReconnect
}) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      setIsConnected(true);
      if (onReconnect) onReconnect();
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleProgressUpdated = (data) => {
      if (onProgressUpdated) onProgressUpdated(data);
      if (onTaskUpdated) onTaskUpdated(data);
    };

    const handleTaskCreated = (data) => {
      if (onTaskCreated) onTaskCreated(data);
      if (onTaskUpdated) onTaskUpdated(data);
    };

    const handleTaskSubmitted = (data) => {
      if (onTaskUpdated) onTaskUpdated(data);
    };

    const handleTaskApproved = (data) => {
      if (onTaskUpdated) onTaskUpdated(data);
    };

    const handleTaskUpdated = (data) => {
      if (onTaskUpdated) onTaskUpdated(data);
    };

    const handleActivityNew = (data) => {
      if (onActivityNew) onActivityNew(data);
    };

    const handleNotificationNew = (data) => {
      if (onNotificationNew) onNotificationNew(data);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("task:progress_updated", handleProgressUpdated);
    socket.on("task:created", handleTaskCreated);
    socket.on("task:assigned", handleTaskCreated);
    socket.on("task:submitted", handleTaskSubmitted);
    socket.on("task:approved", handleTaskApproved);
    socket.on("task:revision_required", handleTaskSubmitted);
    socket.on("task:overdue", handleTaskUpdated);
    socket.on("activity:new", handleActivityNew);
    socket.on("notification:new", handleNotificationNew);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("task:progress_updated", handleProgressUpdated);
      socket.off("task:created", handleTaskCreated);
      socket.off("task:assigned", handleTaskCreated);
      socket.off("task:submitted", handleTaskSubmitted);
      socket.off("task:approved", handleTaskApproved);
      socket.off("task:revision_required", handleTaskSubmitted);
      socket.off("task:overdue", handleTaskUpdated);
      socket.off("activity:new", handleActivityNew);
      socket.off("notification:new", handleNotificationNew);
    };
  }, []);

  return { isConnected };
};
