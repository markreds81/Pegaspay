import { useState } from 'react';
import { useRedeemMutation } from '@/api/pegaspayAPI';

const Redeem = () => {
    const [redeemCode, setRedeemCode] = useState('');
    const [redeem, { isLoading, error, data }] = useRedeemMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!redeemCode.trim()) {
            return;
        }
        
        try {
            await redeem(redeemCode.trim()).unwrap();
            // Success - clear the form
            setRedeemCode('');
        } catch (err) {
            // Error is handled by RTK Query
            console.error('Redeem failed:', err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Ricarica Wallet</h2>
                <p className="text-gray-600 mb-6">Inserisci il codice di riscatto per ricaricare il tuo wallet.</p>

                {/* Success Message */}
                {data && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">
                                    Ricarica completata con successo!
                                </h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>Nuovo saldo: <span className="font-semibold">{data.balance} {data.currency}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Errore durante il riscatto
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>Codice non valido o già utilizzato. Riprova con un codice diverso.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Redeem Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="redeemCode" className="block text-sm font-medium text-gray-700 mb-2">
                            Codice di Riscatto
                        </label>
                        <input
                            id="redeemCode"
                            type="text"
                            value={redeemCode}
                            onChange={(e) => setRedeemCode(e.target.value)}
                            placeholder="Inserisci il codice di riscatto"
                            required
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                            disabled={isLoading}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Il codice deve essere inserito esattamente come ricevuto
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !redeemCode.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Elaborando...
                            </>
                        ) : (
                            'Riscatta Codice'
                        )}
                    </button>
                </form>

                {/* Info Section */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Come funziona:</h3>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside text-left">
                        <li>Inserisci il codice di riscatto che hai ricevuto</li>
                        <li>Il sistema verificherà la validità del codice</li>
                        <li>L'importo verrà aggiunto automaticamente al tuo wallet</li>
                        <li>Potrai vedere il nuovo saldo immediatamente</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Redeem;