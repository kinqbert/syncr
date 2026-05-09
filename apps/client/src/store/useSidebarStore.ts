import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarStore = {
  isOpen: boolean;
  closeSidebar: () => void;
  openSidebar: () => void;
};

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: false,
      closeSidebar: () => {
        set({ isOpen: false });
      },
      openSidebar: () => {
        set({ isOpen: true });
      },
    }),
    { name: "syncr-sidebar" },
  ),
);
