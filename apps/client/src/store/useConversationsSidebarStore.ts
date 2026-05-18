import { create } from "zustand";
import { persist } from "zustand/middleware";

type ConversationsSidebarStore = {
  isOpen: boolean;
  closeSidebar: () => void;
  openSidebar: () => void;
  toggleSidebar: () => void;
};

export const useConversationsSidebarStore = create<ConversationsSidebarStore>()(
  persist(
    (set, get) => ({
      isOpen: true,
      closeSidebar: () => {
        set({ isOpen: false });
      },
      openSidebar: () => {
        set({ isOpen: true });
      },
      toggleSidebar: () => {
        set({ isOpen: !get().isOpen });
      },
    }),
    { name: "syncr-conversations-sidebar" },
  ),
);
