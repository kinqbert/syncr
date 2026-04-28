import { create } from "zustand";

export type StoreUser = {
  id: number;
  email: string;
};

type AuthStore = {
  user: StoreUser | null;
  isAuth: boolean;
  setUser: (user: StoreUser) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuth: true,
  setUser: (user) => set({ user, isAuth: true }),
  clearUser: () => set({ user: null, isAuth: false }),
}));
