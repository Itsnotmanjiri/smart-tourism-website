import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Map, Plane } from 'lucide-react';

interface AuthPageProps {
  onLogin: (userData: { name: string; email: string }) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isSignUp && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate successful login/signup
      const userData = {
        name: formData.name || formData.email.split('@')[0],
        email: formData.email
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(userData));
      
      onLogin(userData);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Simulate social login
    const userData = {
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    onLogin(userData);
  };

  const handleDemoLogin = () => {
    const demoUser = {
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com'
    };
    
    localStorage.setItem('userData', JSON.stringify(demoUser));
    onLogin(demoUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-4 bg-blue-900 rounded-2xl">
                <Map className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-blue-900">AI Smart Tourism</h1>
            </div>
            <p className="text-gray-600 mb-8 text-xl">
              Your AI-powered travel companion for unforgettable adventures
            </p>
            
            <div className="space-y-6 text-left bg-white bg-opacity-50 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Plane className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <h3 className="mb-2">Discover Destinations</h3>
                  <p className="text-gray-600">Explore amazing places around the world with AI recommendations</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <h3 className="mb-2">Find Travel Buddies</h3>
                  <p className="text-gray-600">Connect with like-minded travelers heading to your destination</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Map className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <h3 className="mb-2">Emergency Services</h3>
                  <p className="text-gray-600">Access emergency contacts and location sharing anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <Map className="w-8 h-8 text-blue-900" />
            <h2 className="text-blue-900">AI Smart Tourism</h2>
          </div>

          <div className="text-center mb-8">
            <h2 className="mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-gray-600">
              {isSignUp ? 'Sign up to start your journey' : 'Sign in to continue your adventure'}
            </p>
          </div>

          {/* Demo Login Button */}
          <button
            onClick={handleDemoLogin}
            className="w-full py-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg hover:from-blue-950 hover:to-blue-800 transition-all mb-6"
          >
            Continue with Demo Account
          </button>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="w-full py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleSocialLogin('Facebook')}
              className="w-full py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continue with Facebook</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
            </div>

            {isSignUp && (
              <div>
                <label className="block text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-900 focus:ring-blue-900" />
                  <span className="ml-2 text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-blue-900 hover:text-blue-950">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                }}
                className="text-blue-900 hover:text-blue-950"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          <div className="mt-6 text-center text-gray-500">
            <p>By continuing, you agree to our</p>
            <p>
              <a href="#" className="text-blue-900 hover:underline">Terms of Service</a>
              {' & '}
              <a href="#" className="text-blue-900 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}