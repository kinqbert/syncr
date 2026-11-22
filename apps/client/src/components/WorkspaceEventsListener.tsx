import type { TaskChangedPayload } from "@syncr/packages";
import { useCallback, useEffect } from "react";

import { invalidateRemoteTaskChange } from "@/api/tasks";
import { useSocket, useTaskChangedEvent } from "@/hooks/sockets";
import { useCompanyStore } from "@/store/useCompanyStore";

export const WorkspaceEventsListener = () => {
  const socket = useSocket();
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);

  useEffect(() => {
    if (!selectedCompanyId) {
      return;
    }

    const selectCompany = () => {
      socket.emit("company.select", { companyId: selectedCompanyId });
    };

    if (socket.connected) {
      selectCompany();
    }

    socket.on("connect", selectCompany);

    return () => {
      socket.off("connect", selectCompany);
    };
  }, [selectedCompanyId, socket]);

  const handleTaskChanged = useCallback(({ projectId }: TaskChangedPayload) => {
    invalidateRemoteTaskChange(projectId);
  }, []);

  useTaskChangedEvent(handleTaskChanged);

  return null;
};
