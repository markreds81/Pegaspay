import { useGetMeQuery } from "@/api/pegaspayAPI";
import keycloak from "@/keycloak";

const DashboardPage = () => {
  const { data, error, isLoading } = useGetMeQuery();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Benvenuto {keycloak.tokenParsed?.preferred_username}</p>
      <button onClick={() => keycloak.logout({ redirectUri: window.location.origin + '/' })}>Logout</button>
      {isLoading && <p>Caricamento...</p>}
      {error && <p>Errore nella chiamata:</p>}
      {data && (
        <div>
          <p>Messaggio dal server: {data.greeting}</p>
          <p>Username: {data.username}</p>
          <p>Email: {data.email}</p>
          <p>Full Name: {data.fullName}</p>
          <p>Given Name: {data.givenName}</p>
          <p>Family Name: {data.familyName}</p>
          <p>Subject: {data.subject}</p>
          <p>Roles: {data.roles.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;