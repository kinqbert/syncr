export type Company = {
  id: number;
  name: string;
};

export type UserCompany = Company & {
  id: number;
  name: string;
  roleName: string;
};

export type CreateCompanyBody = {
  name: string;
};
