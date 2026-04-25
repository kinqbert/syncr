export interface RegisterBody {
  email: string;
  password: string;
  name: string;
  surname: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
