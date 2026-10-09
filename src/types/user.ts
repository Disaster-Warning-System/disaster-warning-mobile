export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  district: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
  district?: string;
};