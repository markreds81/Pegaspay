import { useListPaymentsQuery } from "@/api/pegaspayAPI";
import { formatIsoDateTimeToLocale } from "@/utils/dateTimeUtility";
import { ExternalLink, Loader2, AlertCircle, Plus, List } from "lucide-react";
import { useEffect, useState } from "react";
import PaymentCreator from "./PaymentCreator";

function formatAmount(a: number, c: string) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: c || "EUR" }).format(a);
}

const LatestPayments = ({ limit = 10 }: { limit?: number }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data, error, isLoading, refetch } = useListPaymentsQuery(limit);

  const base = import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;

  useEffect(() => {
    if (!isLoading && !data && !error) {
      console.log("No payments data received, attempting refetch");
      refetch();
    }
  }, [isLoading, data, error, refetch]);

  const handlePaymentCreated = () => {
    setShowCreateForm(false); // Torna alla lista
    refetch(); // Aggiorna la lista dei pagamenti
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              showCreateForm
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {showCreateForm ? (
              <>
                <List className="h-4 w-4" />
                Lista
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Nuovo
              </>
            )}
          </button>
          <h2 className="text-lg font-semibold">
            {showCreateForm ? "Crea nuovo pagamento" : "Ultimi pagamenti"}
          </h2>
        </div>
        {!showCreateForm && (
          <span className="text-xs text-gray-500">{data?.length ?? 0} risultati</span>
        )}
      </div>

      {showCreateForm ? (
        <PaymentCreator onPaymentCreated={handlePaymentCreated} />
      ) : (
        <>
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" /> Caricamento…
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>Errore: {typeof error === "string" ? error : "impossibile caricare i pagamenti"}</span>
            </div>
          )}

          {!isLoading && !error && (!data || data.length === 0) && (
            <div className="text-sm text-gray-500">Nessun pagamento creato di recente.</div>
          )}

          {!isLoading && !error && data && data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrizione
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Importo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Azione
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((p) => {
                    const paymentUrl = `${base}/pay/${p.referenceId}`;
                    return (
                      <tr key={p.referenceId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {p.description || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {formatAmount(p.amount, p.currency)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatIsoDateTimeToLocale(p.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <a
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            href={paymentUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Apri link pagamento"
                          >
                            Apri <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LatestPayments;