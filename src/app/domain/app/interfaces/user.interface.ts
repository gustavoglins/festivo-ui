export interface User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
}

export interface UserUpdateRequest {
    fullName: string;
    email: string;
    phoneNumber: string;
}