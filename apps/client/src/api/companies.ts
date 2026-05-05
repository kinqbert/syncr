import api from "@/lib/axios";
import type { Company, CreateCompanyBody } from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

export const companiesKeys = {
  companies: ["companies"],
};

const getMyCompanies = async () => {
  const response = await api.get<Company[]>("companies");

  return response.data;
};

const createCompany = async (body: CreateCompanyBody) => {
  const response = await api.post<Company>("companies", body);

  return response.data;
};

export const useGetMyCompanies = () => {
  return useQuery({
    queryFn: getMyCompanies,
    queryKey: companiesKeys.companies,
  });
};

export const useCreateCompany = () => {
  return useMutation({
    mutationFn: createCompany,
  });
};
