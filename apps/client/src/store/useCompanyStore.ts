import { create } from "zustand";
import { persist } from "zustand/middleware";

type CompanyStore = {
  selectedCompanyId: number | null;
  setSelectedCompanyId: (companyId: number | null) => void;
  clearSelectedCompany: () => void;
};

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      selectedCompanyId: null,
      setSelectedCompanyId: (companyId) =>
        set({ selectedCompanyId: companyId }),
      clearSelectedCompany: () => set({ selectedCompanyId: null }),
    }),
    {
      name: "syncr-company",
    },
  ),
);
