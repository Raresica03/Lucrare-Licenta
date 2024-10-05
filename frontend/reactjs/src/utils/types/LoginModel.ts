export interface LoginModel {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}
