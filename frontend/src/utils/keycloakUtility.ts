import keycloak from "@/keycloak";

export const prepareHeaders = (headers: Headers) => {
  const token = keycloak.token;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};