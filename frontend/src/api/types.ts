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

export interface CreatePaymentRequest {
  amount: number;
  currency?: string;
  description?: string;
  expiresAt?: string;
  callbackUrl?: string;
}

export interface CreatePaymentResponse {
  referenceId: string;
}

export interface PaymentIntentSummary {
  referenceId: string;
  amount: number;
  currency: string;
  description?: string;
  status: 'CREATED' | 'REQUIRES_CONFIRMATION' | 'PAID' | 'CANCELED' | 'EXPIRED';
  createdAt: string;
  paidAt?: string;
  expiresAt?: string;
}

export interface PublicPaymentDto {
  referenceId: string;
  amount: number;
  currency: string;
  description?: string;
  merchantName: string;
  expiresAt?: string;  // ISO
  status: 'CREATED' | 'REQUIRES_CONFIRMATION' | 'PAID' | 'CANCELED' | 'EXPIRED';
}

export interface ConfirmPaymentResponse {
  journalReferenceId: string;
  amount: number;
  fee: number;
  currency: string;
  payerBalanceAfter: number;
  merchantBalanceAfter: number;
}