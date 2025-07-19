import { useGetMeQuery } from "@/api/pegaspayAPI";
import keycloak from "@/keycloak";
import { useEffect } from "react";

const DashboardPage = () => {
  const { data, error, isLoading, refetch } = useGetMeQuery();
  
  useEffect(() => {
    if (!isLoading && !data && !error) {
      console.log("No data received, attempting refetch");
      refetch();
    }
  }, [isLoading, data, error, refetch]);
  
  return (
    <div className="min-h-full bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
              <p className="text-lg text-gray-600">
                Benvenuto, <span className="font-semibold">{keycloak.tokenParsed?.preferred_username}</span>
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Caricamento..." : "Aggiorna"}
            </button>
          </div>
        </div>

        {/* Conditional Rendering with explicit checks */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-center text-gray-600">Caricamento...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">Errore nella chiamata al server</p>
            <pre className="text-xs text-red-600 mt-2 bg-red-100 p-2 rounded overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
            <button
              onClick={() => refetch()}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Riprova
            </button>
          </div>
        ) : data ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informazioni Account</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Messaggio dal server:</p>
                <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">{data.greeting || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Username:</p>
                <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">{data.username || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">{data?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nome Completo:</p>
                <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">{data.fullName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nome:</p>
                <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">{data.givenName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cognome:</p>
                <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">{data.familyName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subject:</p>
                <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">{data.subject || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ruoli:</p>
                <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">{data.roles?.join(", ") || "N/A"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-700">Nessun dato disponibile</p>
            <button
              onClick={() => refetch()}
              className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Carica Dati
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;