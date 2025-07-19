import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// Update the import path if the file is named keycloakUtility.ts and located in src/utils
import { prepareHeaders } from "@/utils/keycloakUtility";
import type { Me, UserRegistration, RegisterResponse } from "./types";

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
    register: builder.mutation<RegisterResponse, UserRegistration>({
      query: (userData) => ({
        url: "/public/register",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useGetMeQuery, useRegisterMutation } = pegaspayAPI;