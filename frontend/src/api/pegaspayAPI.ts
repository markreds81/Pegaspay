import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "@/utils/keycloakUtility";
import type { Me, UserRegistration, RegisterResponse, Wallet, Journal, RedeemResponse, CreatePaymentResponse, CreatePaymentRequest, PaymentIntentSummary } from "./types";

export const pegaspayAPI = createApi({
  reducerPath: "pegaspayAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "/be",
    prepareHeaders,
  }),
  tagTypes: ['journal', 'wallet', 'payment'],
  endpoints: (builder) => ({
    getMe: builder.query<Me, void>({
      query: () => "/member/me",
    }),
    getWallet: builder.query<Wallet, void>({
      query: () => "/member/wallet",
      providesTags: ['wallet'],
    }),
    getJournal: builder.query<Journal[], void>({
      query: () => "/member/journal",
      providesTags: ['journal'],
    }),
    register: builder.mutation<RegisterResponse, UserRegistration>({
      query: (userData) => ({
        url: "/public/register",
        method: "POST",
        body: userData,
      }),
    }),
    redeem: builder.mutation<RedeemResponse, string>({
      query: (code) => ({
        url: "/member/redeem",
        method: "POST",
        body: code,
      }),
      invalidatesTags: ['wallet', 'journal'],
    }),
    createPayment: builder.mutation<CreatePaymentResponse, CreatePaymentRequest>({
      query: (paymentData) => ({
        url: "/member/payments",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ['payment'],
    }),
    listPayments: builder.query<PaymentIntentSummary[], number | void>({
      query: (limit = 10) => `/member/payments?limit=${limit}`,
      providesTags: ['payment'],
    }),
  }),
});

export const { useGetMeQuery, useGetWalletQuery, useGetJournalQuery, useRegisterMutation, useRedeemMutation, useCreatePaymentMutation, useListPaymentsQuery } = pegaspayAPI;