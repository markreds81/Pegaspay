import { useGetJournalQuery } from "@/api/pegaspayAPI";
import { formatIsoDateTimeToLocale } from "@/utils/dateTimeUtility";
import { useEffect } from "react";

const UserJournal = () => {
  const { data, error, isLoading, refetch } = useGetJournalQuery();

  useEffect(() => {
    if (!isLoading && !data && !error) {
      console.log("No journal data received, attempting refetch");
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ultimi movimenti</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrizione
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credito
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Debito
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatIsoDateTimeToLocale(entry.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {entry.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {entry.credit && (
                        <span className="text-green-600 font-medium">
                          +€{entry.credit}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {entry.debit && (
                        <span className="text-red-600 font-medium">
                          -€{entry.debit}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default UserJournal;