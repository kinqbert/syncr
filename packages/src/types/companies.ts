export type Company = {
  id: number;
  name: string;
};

export type UserCompany = Company & {
  id: number;
  name: string;
  roleName: string;
  weeklyLoadMinutes: number;
};

export type CreateCompanyBody = {
  name: string;
};

export type UpdateCompanyUserSettingsBody = {
  weeklyLoadMinutes: number;
};
