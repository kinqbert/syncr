import type {
  Company,
  CreateCompanyBody,
  UpdateCompanyUserSettingsBody,
  UserCompany,
} from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { queryClient } from "@/lib/react-query";

export const companiesKeys = {
  companies: ["companies"],
};

const getMyCompanies = async () => {
  const response = await api.get<UserCompany[]>("companies");

  return response.data;
};

const createCompany = async (body: CreateCompanyBody) => {
  const response = await api.post<Company>("companies", body);

  return response.data;
};

const updateCompanyUserSettings = async ({
  body,
  companyId,
}: {
  body: UpdateCompanyUserSettingsBody;
  companyId: number;
}) => {
  await api.patch(`companies/${companyId}/settings`, body);
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
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: companiesKeys.companies,
      });
    },
  });
};

export const useUpdateCompanyUserSettings = () => {
  return useMutation({
    mutationFn: updateCompanyUserSettings,
    onSuccess: (_, variables) => {
      queryClient.setQueryData<UserCompany[]>(
        companiesKeys.companies,
        (companies) =>
          companies?.map((company) =>
            company.id === variables.companyId
              ? {
                  ...company,
                  weeklyLoadMinutes: variables.body.weeklyLoadMinutes,
                }
              : company,
          ),
      );
      void queryClient.invalidateQueries({
        queryKey: companiesKeys.companies,
      });
      void queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
};
