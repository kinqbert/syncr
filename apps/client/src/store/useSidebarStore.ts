import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarStore = {
  /** Desktop: expanded (labels) vs collapsed (icons only). Persisted. */
  isOpen: boolean;
  /** Mobile: whether the temporary drawer is showing. */
  isMobileOpen: boolean;
  /** Whether the "Projects" group in the sidebar is expanded. Persisted. */
  isProjectsOpen: boolean;
  closeSidebar: () => void;
  openSidebar: () => void;
  toggleSidebar: () => void;
  setMobileOpen: (isMobileOpen: boolean) => void;
  toggleProjects: () => void;
};

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: true,
      isMobileOpen: false,
      isProjectsOpen: true,
      closeSidebar: () => {
        set({ isOpen: false });
      },
      openSidebar: () => {
        set({ isOpen: true });
      },
      toggleSidebar: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      setMobileOpen: (isMobileOpen) => {
        set({ isMobileOpen });
      },
      toggleProjects: () => {
        set((state) => ({ isProjectsOpen: !state.isProjectsOpen }));
      },
    }),
    {
      name: "syncr-sidebar-v2",
      partialize: ({ isOpen, isProjectsOpen }) => ({ isOpen, isProjectsOpen }),
    },
  ),
);
