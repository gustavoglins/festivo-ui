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

export interface UserRecoverPasswordRequest {
    email: string;
    birthDate: string;
}

export interface AuthResponse {
    token: string;
    name: string;
}