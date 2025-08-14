import { useGetWalletQuery } from "@/api/pegaspayAPI";
import { useEffect, useState } from "react";
import { Plus, Wallet } from "lucide-react";
import Redeem from "./Redeem";

const UserWallet = () => {
  const [showRechargeForm, setShowRechargeForm] = useState(false);
  const { data, error, isLoading, refetch } = useGetWalletQuery();

  useEffect(() => {
    if (!isLoading && !data && !error) {
      console.log("No data received, attempting refetch");
      refetch();
    }
  }, [isLoading, data, error, refetch]);

  const handleRechargeCompleted = () => {
    setShowRechargeForm(false);
    refetch();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRechargeForm(!showRechargeForm)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                showRechargeForm
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {showRechargeForm ? (
                <>
                  <Wallet className="h-4 w-4" />
                  Wallet
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Ricarica
                </>
              )}
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {showRechargeForm ? "Ricarica Wallet" : "Il tuo wallet"}
            </h2>
          </div>
        </div>

        {showRechargeForm ? (
          <Redeem onRechargeCompleted={handleRechargeCompleted} />
        ) : (
          <>
            {isLoading ? (
              <p className="text-center text-gray-600">Caricamento...</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Saldo:</p>
                  <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">{data.balance.toFixed(2) || "0.00"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valuta:</p>
                  <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">{data.currency || "EUR"}</p>
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
          </>
        )}
      </div>
    </div>
  );
}

export default UserWallet;