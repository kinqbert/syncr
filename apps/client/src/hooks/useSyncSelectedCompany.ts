import { useEffect } from "react";

import { useGetMyCompanies } from "@/api/companies";
import { removeCompanyScopedCache } from "@/lib/react-query";
import { useCompanyStore } from "@/store/useCompanyStore";

/**
 * Keeps the selected company valid: picks the first one when nothing (or a
 * company the user no longer belongs to) is selected, and clears it when the
 * user has no companies. Must run regardless of which UI is mounted.
 */
export const useSyncSelectedCompany = () => {
  const { data: companies = [], isPending } = useGetMyCompanies();
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const setSelectedCompanyId = useCompanyStore(
    (state) => state.setSelectedCompanyId,
  );

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (companies.length === 0) {
      if (selectedCompanyId !== null) {
        setSelectedCompanyId(null);
        removeCompanyScopedCache();
      }

      return;
    }

    const hasSelectedCompany = companies.some(
      (company) => company.id === selectedCompanyId,
    );

    if (!hasSelectedCompany) {
      setSelectedCompanyId(companies[0].id);

      if (selectedCompanyId !== null) {
        removeCompanyScopedCache();
      }
    }
  }, [companies, isPending, selectedCompanyId, setSelectedCompanyId]);
};
