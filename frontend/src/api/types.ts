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

export interface Wallet {
    balance: number;
    currency: string;
    createdAt: string;
    ownerFirstName: string;
    ownerLastName: string;
}

export interface Journal {
    referenceId: string;
    createdAt: string;
    description: string;
    credit: number;
    debit: number;
    balance: number;
    runningBalance: number;
    note: string;
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

export interface RedeemResponse {
    balance: number;
    currency: string;
}