import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "@/utils/keycloakUtility";
import type { Me, UserRegistration, RegisterResponse, Wallet, Journal } from "./types";

export const pegaspayAPI = createApi({
  reducerPath: "pegaspayAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "/be",
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    getMe: builder.query<Me, void>({
      query: () => "/member/me",
    }),
    getWallet: builder.query<Wallet, void>({
      query: () => "/member/wallet",
    }),
    getJournal: builder.query<Journal[], void>({
      query: () => "/member/journal",
    }),
    register: builder.mutation<RegisterResponse, UserRegistration>({
      query: (userData) => ({
        url: "/public/register",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useGetMeQuery, useGetWalletQuery, useGetJournalQuery, useRegisterMutation } = pegaspayAPI;