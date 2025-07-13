import { type JSX } from 'react'
import { useKeycloak } from "@react-keycloak/web";

type Props = {
  children: JSX.Element;
};

const PrivateRoute = ({ children }: Props) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return <p>Verifica autenticazione...</p>;

  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }

  return children;
}

export default PrivateRoute;