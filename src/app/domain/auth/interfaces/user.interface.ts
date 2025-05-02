export interface UserSignupRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthDate: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserForgotPasswordRequest {
  email: string;
  birthDate: string;
}

export interface UserResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  name: string;
}
