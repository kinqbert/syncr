import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarStore = {
  isOpen: boolean;
  toggleIsOpen: () => void;
};

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      toggleIsOpen: () => {
        set({ isOpen: !get().isOpen });
      },
    }),
    { name: "syncr-sidebar" },
  ),
);
