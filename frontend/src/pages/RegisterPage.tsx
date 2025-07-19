import { useState } from 'react';
import { useRegisterMutation } from '@/api/pegaspayAPI';
import type { UserRegistration } from '@/api/types';

function RegisterPage() {
  const [formData, setFormData] = useState<UserRegistration>({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  const [register, { isLoading, error, data }] = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      // Registration successful - show success message
    } catch (err) {
      // Error is handled by RTK Query
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Registrazione</h1>
        <p className="text-gray-600 mb-6 text-center">
          Crea il tuo account per iniziare ad utilizzare Pegaspay
        </p>

        {/* Success Message */}
        {data && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600 text-sm">{data.message}</p>
            {data.activationCode && (
              <p className="text-green-600 text-sm mt-2">
                Code: <span className="font-medium">{data.activationCode}</span>
              </p>
            )}
          </div>
        )}

        {data && data.activationLink && (
         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-600 mb-2">Link di attivazione:</h3>
            <p className="text-sm text-yellow-600">Dal momento che questo è un ambiente simulato, puoi attivare il tuo utente cliccando semplicemente nel link sottostante.</p>
            <p className="text-sm text-yellow-600">
              <a href={data.activationLink} target='_blank'>{data.activationLink}</a>
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">
              Errore durante la registrazione. Riprova.
            </p>
          </div>
        )}

        {!data && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input 
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              placeholder="inserisci il tuo username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              placeholder="inserisci la tua email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input 
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              placeholder="inserisci il tuo nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cognome
            </label>
            <input 
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              placeholder="inserisci il tuo cognome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              placeholder="inserisci la password"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            {isLoading ? 'Registrazione in corso...' : 'Registrati'}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;