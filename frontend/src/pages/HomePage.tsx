import { Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

function HomePage() {
  const { keycloak, initialized } = useKeycloak();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-full flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">Benvenuto su Pegaspay</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          La piattaforma moderna e sicura per lo scambio e trasferimento di fondi tra utenti.
          Gestisci le tue transazioni in modo semplice e veloce.
        </p>

        {initialized && !keycloak.authenticated && (
          <div className="space-y-4">
            <div className="text-lg text-gray-700 mb-6">
              Inizia subito a utilizzare i nostri servizi
            </div>
            <div className="space-x-6">
              <button
                onClick={() => keycloak.login()}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 text-lg"
              >
                Accedi
              </button>
              <Link
                to="/register"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 text-lg"
              >
                Registrati
              </Link>
            </div>
          </div>
        )}

        {initialized && keycloak.authenticated && (
          <div className="space-y-6">
            <div className="text-lg text-gray-700 mb-6">
              Bentornato! Accedi alla tua dashboard per gestire le transazioni.
            </div>
            <div className="space-x-6">
              <Link
                to="/dashboard"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 text-lg"
              >
                Vai alla Dashboard
              </Link>
              <Link
                to="/newpayment"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 text-lg"
              >
                Crea pagamento              
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;