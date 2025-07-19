export interface Me {
    username: string;
    email: string;
    fullName: string;
    givenName: string;
    familyName: string;
    subject: string;
    greeting: string;
    roles: string[];
}

export interface UserRegistration {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface RegisterResponse {
    activationLink: string;
    activationCode: string;
    message: string;
}