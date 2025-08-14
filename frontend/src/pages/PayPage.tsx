import { useParams, useNavigate } from 'react-router-dom';
import { useGetPaymentPublicQuery, useConfirmPaymentMutation } from '@/api/pegaspayAPI';
import { Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

const PayPage = () => {
  const { referenceId } = useParams<{ referenceId: string }>();
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();
  const { data, isLoading, isError, refetch } = useGetPaymentPublicQuery(referenceId!, {
    skip: !referenceId,
  });
  const [confirmPayment, { isLoading: confirming, isSuccess, data: confirmRes, isError: confirmErr, error }] =
    useConfirmPaymentMutation();
  const [justPaid, setJustPaid] = useState(false);

  // se conferma completata → mostra esito e redirect/UX a piacere
  useEffect(() => {
    if (isSuccess && confirmRes) {
      // toast/notification a piacere
      // es: navigate('/dashboard'); oppure resta e mostra riepilogo
    }
  }, [isSuccess, confirmRes, navigate]);

  const handleLoginAndPay = async () => {
    if (!keycloak?.authenticated) {
      await keycloak.login({ redirectUri: window.location.href }); // dopo login torna qui
    }
    // se già autenticato o dopo redirect, prova a confermare
    if (referenceId) {
      const res = await confirmPayment(referenceId);
      if ('data' in res) {
        setJustPaid(true); // flag: pagamento appena effettuato
      }
      refetch(); // aggiorna stato pagamento
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-full">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Caricamento pagamento…</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center p-8 min-h-full">
        <div className="max-w-2xl w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Impossibile caricare il pagamento</span>
            </div>
            <p className="text-red-600 text-sm mt-2">
              Verifica che il link sia corretto e riprova.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const disabled = data.status !== 'REQUIRES_CONFIRMATION';
  const amountFmt = new Intl.NumberFormat('it-IT', { style: 'currency', currency: data.currency }).format(data.amount);

  return (
    <div className="flex items-center justify-center p-8 min-h-full">
      {initialized && (
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Pagamento a {data.merchantName}
              </h1>
              <div className="text-4xl font-bold text-blue-600 mb-2">{amountFmt}</div>
              {data.description && (
                <p className="text-lg text-gray-600">{data.description}</p>
              )}
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Stato:</span>
                  <span className="ml-2 font-medium text-gray-900">{data.status}</span>
                </div>
                {data.expiresAt && (
                  <div>
                    <span className="text-gray-600">Scadenza:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {new Date(data.expiresAt).toLocaleString('it-IT')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Messages */}
            {data.status === 'PAID' && !justPaid && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="font-semibold">Pagamento già effettuato</span>
                </div>
                <p className="text-green-600 text-sm mt-1 text-center">
                  Questo pagamento è stato completato con successo.
                </p>
              </div>
            )}

            {data.status === 'EXPIRED' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">Link di pagamento scaduto</span>
                </div>
                <p className="text-red-600 text-sm mt-1 text-center">
                  Questo link di pagamento non è più valido.
                </p>
              </div>
            )}

            {/* Payment Action */}
            {data.status === 'REQUIRES_CONFIRMATION' && (
              <div className="space-y-4">
                <button
                  onClick={handleLoginAndPay}
                  disabled={disabled || confirming}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2"
                >
                  {confirming && <Loader2 className="h-4 w-4 animate-spin" />}
                  {keycloak?.authenticated ? 'Conferma pagamento' : 'Accedi e paga'}
                </button>

                {!keycloak?.authenticated && (
                  <p className="text-center text-sm text-gray-600">
                    Dovrai effettuare l'accesso per completare il pagamento
                  </p>
                )}
              </div>
            )}

            {/* Error Message */}
            {confirmErr && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-600">
                  <span className="font-semibold">Errore durante il pagamento</span>
                  <p className="text-sm mt-1">
                    {typeof error === 'string' ? error : 'Pagamento non riuscito. Riprova più tardi.'}
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {isSuccess && confirmRes && justPaid && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="font-semibold">Pagamento completato con successo!</span>
                </div>

                <div className="bg-white rounded-md p-3 space-y-2">
                  <h3 className="font-medium text-gray-800 mb-2">Dettagli transazione:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Transazione:</span>
                      <span className="font-mono text-gray-900">{confirmRes.journalReferenceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Importo:</span>
                      <span className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('it-IT', { style: 'currency', currency: confirmRes.currency }).format(confirmRes.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commissione:</span>
                      <span className="text-gray-900">
                        {new Intl.NumberFormat('it-IT', { style: 'currency', currency: confirmRes.currency }).format(confirmRes.fee)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saldo residuo:</span>
                      <span className="font-medium text-gray-900">{confirmRes.payerBalanceAfter}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PayPage;