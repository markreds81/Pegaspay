import { useState } from "react";
import { useCreatePaymentMutation } from "@/api/pegaspayAPI";
import { ClipboardCopy, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function NewPaymentPage() {
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState("EUR");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const [createPayment, { data, isLoading, isError, error, isSuccess }] =
    useCreatePaymentMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Amount must be a positive number");
      return;
    }

    let expiresPayload: string | undefined = undefined;
    if (expiresAt) {
      const d = new Date(expiresAt);
      if (!isNaN(d.getTime())) expiresPayload = d.toISOString();
    }

    await createPayment({
      amount: amt,
      currency,
      description: description || undefined,
      expiresAt: expiresPayload,
      callbackUrl: callbackUrl || undefined,
    });
  };

  const paymentUrl =
    isSuccess && data
      ? `${import.meta.env.VITE_PUBLIC_BASE_URL}/pay/${data.referenceId}`
      : "";

  const copyLink = async () => {
    if (paymentUrl) {
      await navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Crea un nuovo pagamento</h1>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Importo:</label>
              <input
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Es. 25.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Valuta:</label>
              <input
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                placeholder="EUR"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Descrizione:</label>
              <input
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrizione facoltativa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Scadenza: (opzionale)</label>
              <input
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2 text-left">
                Se impostata, il link scadrà a questa data/ora.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Callback URL (opzionale)</label>
              <input
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                type="url"
                value={callbackUrl}
                onChange={(e) => setCallbackUrl(e.target.value)}
                placeholder="https://merchant.example.com/mock-webhook"
              />
            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
              {isLoading ? 'Creazione in corso...' : 'Crea pagamento'}
            </button>
          </form>
        </div>

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600 text-sm">
              Errore: {JSON.stringify(error)}
            </div>
          </div>
        )}

        {isSuccess && data && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Pagamento creato con successo!</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Payment link</div>
              <div className="bg-gray-50 p-3 rounded-md text-sm break-all font-mono text-gray-800">
                {paymentUrl}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={copyLink}
                className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                <ClipboardCopy className="w-4 h-4" />
                {copied ? "Copiato!" : "Copia link"}
              </button>
              <a
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                href={paymentUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
                Apri
              </a>
            </div>
          </div>
        )}
        
        {isSuccess && data && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">QR Code</h3>
            <div className="flex justify-center">
              <QRCodeSVG value={paymentUrl} size={200} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}