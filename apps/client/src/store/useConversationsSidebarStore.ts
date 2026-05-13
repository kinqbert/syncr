import { create } from "zustand";
import { persist } from "zustand/middleware";

type ConversationsSidebarStore = {
  closeSidebar: () => void;
  isOpen: boolean;
  openSidebar: () => void;
};

export const useConversationsSidebarStore = create<ConversationsSidebarStore>()(
  persist(
    (set) => ({
      isOpen: true,
      closeSidebar: () => {
        set({ isOpen: false });
      },
      openSidebar: () => {
        set({ isOpen: true });
      },
    }),
    { name: "syncr-conversations-sidebar" },
  ),
);
