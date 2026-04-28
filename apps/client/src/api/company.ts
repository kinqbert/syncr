import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const companyKeys = {
  companies: ["companies"],
};

const getMyCompanies = async () => await api.get("company");

export const useGetMyCompanies = () => {
  return useQuery({
    queryFn: getMyCompanies,
    queryKey: [companyKeys.companies],
  });
};
