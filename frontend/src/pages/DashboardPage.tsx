import keycloak from "../keycloak";

function DashboardPage() {
    return (
    <div>
      <h1>Dashboard</h1>
      <p>Benvenuto {keycloak.tokenParsed?.preferred_username}</p>
      <button onClick={() => keycloak.logout()}>Logout</button>
    </div>
  );
}

export default DashboardPage;