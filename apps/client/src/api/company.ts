import api from "@/lib/axios";
import type { Company, CreateCompanyBody } from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

export const companyKeys = {
  companies: ["companies"],
};

const getMyCompanies = async () => {
  const response = await api.get<Company[]>("company");

  return response.data;
};

const createCompany = async (body: CreateCompanyBody) => {
  const response = await api.post<Company>("company", body);

  return response.data;
};

export const useGetMyCompanies = () => {
  return useQuery({
    queryFn: getMyCompanies,
    queryKey: companyKeys.companies,
  });
};

export const useCreateCompany = () => {
  return useMutation({
    mutationFn: createCompany,
  });
};
