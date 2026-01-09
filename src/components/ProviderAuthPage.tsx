import React, { useState } from 'react';
import { Building, Lock, Mail, Eye, EyeOff, Hotel, ArrowLeft } from 'lucide-react';

interface ProviderAuthPageProps {
  onLogin: (providerData: ProviderData) => void;
  onBackToUser: () => void;
}

export interface ProviderData {
  id: string;
  name: string;
  email: string;
  companyName: string;
  totalProperties: number;
  role: 'provider';
}

// Demo provider accounts
const DEMO_PROVIDERS = [
  {
    id: 'provider-1',
    email: 'taj@hotels.com',
    password: 'provider123',
    name: 'Rajesh Kumar',
    companyName: 'Taj Hotels Group',
    totalProperties: 125
  },
  {
    id: 'provider-2',
    email: 'oberoi@hotels.com',
    password: 'provider123',
    name: 'Priya Oberoi',
    companyName: 'Oberoi Hospitality',
    totalProperties: 98
  },
  {
    id: 'provider-3',
    email: 'itc@hotels.com',
    password: 'provider123',
    name: 'Amit Sharma',
    companyName: 'ITC Hotels',
    totalProperties: 110
  }
];

export function ProviderAuthPage({ onLogin, onBackToUser }: ProviderAuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Check demo providers
      const provider = DEMO_PROVIDERS.find(
        p => p.email === email && p.password === password
      );

      if (provider) {
        const providerData: ProviderData = {
          id: provider.id,
          name: provider.name,
          email: provider.email,
          companyName: provider.companyName,
          totalProperties: provider.totalProperties,
          role: 'provider'
        };
        localStorage.setItem('providerData', JSON.stringify(providerData));
        onLogin(providerData);
      } else {
        setError('Invalid credentials. Try: taj@hotels.com / provider123');
      }
    } else {
      // Registration
      if (!email || !password || !name || !companyName) {
        setError('Please fill all fields');
        return;
      }

      const newProvider: ProviderData = {
        id: `provider-${Date.now()}`,
        name,
        email,
        companyName,
        totalProperties: 0,
        role: 'provider'
      };
      localStorage.setItem('providerData', JSON.stringify(newProvider));
      onLogin(newProvider);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={onBackToUser}
        className="fixed top-6 left-6 px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 z-50"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
              <Building className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Provider Portal</h1>
            <p className="text-blue-200 text-sm">
              Manage your properties and bookings
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-blue-900 mb-2">Demo Provider Accounts:</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>📧 taj@hotels.com / provider123 (125 properties)</p>
                <p>📧 oberoi@hotels.com / provider123 (98 properties)</p>
                <p>📧 itc@hotels.com / provider123 (110 properties)</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <Hotel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                        placeholder="Your hotel/company name"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    placeholder="provider@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                {isLogin ? 'Sign In as Provider' : 'Create Provider Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-blue-900 hover:underline text-sm"
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}