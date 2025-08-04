import { useGetWalletQuery } from "@/api/pegaspayAPI";
import { useEffect } from "react";

const UserWallet = () => {
  const { data, error, isLoading, refetch } = useGetWalletQuery();

  useEffect(() => {
    if (!isLoading && !data && !error) {
      console.log("No data received, attempting refetch");
      refetch();
    }
  }, [isLoading, data, error, refetch]);

  return (
    <div className="max-w-4xl mx-auto">
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Il tuo wallet</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Saldo:</p>
              <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">{data.balance || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Valuta:</p>
              <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">{data.currency || "N/A"}</p>
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
  );
}

export default UserWallet;