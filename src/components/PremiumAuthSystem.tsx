import { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Heart, Shield, Sparkles, ArrowRight, CheckCircle, Eye, EyeOff, Chrome, Facebook, Apple } from 'lucide-react';
import { NatureBackground, FloatingGradientCard, AnimatedButton } from './ui/GlassCard';

interface PremiumAuthSystemProps {
  onLoginSuccess: (user: any) => void;
}

export function PremiumAuthSystem({ onLoginSuccess }: PremiumAuthSystemProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!isLogin && !formData.name.trim()) {
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
    
    if (!isLogin && !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!isLogin && !formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = {
        id: `user-${Date.now()}`,
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        phone: formData.phone || '+91 98765 43210',
        city: formData.city || 'Mumbai',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || formData.email)}&background=1e40af&color=fff&size=128`,
        verified: true,
        joinedDate: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      setIsLoading(false);
      onLoginSuccess(user);
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const user = {
        id: `user-${Date.now()}`,
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        phone: '+91 98765 43210',
        city: 'Mumbai',
        avatar: `https://ui-avatars.com/api/?name=${provider}+User&background=1e40af&color=fff&size=128`,
        verified: true,
        joinedDate: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      setIsLoading(false);
      onLoginSuccess(user);
    }, 1500);
  };

  return (
    <NatureBackground
      imageUrl="https://images.unsplash.com/photo-1687753578329-797da473eaa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaW1hbGF5YSUyMG1vdW50YWluJTIwcGVha3xlbnwxfHx8fDE3Njc1MjYzMTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
      overlay="gradient"
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <FloatingGradientCard className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl mb-4 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
              India's #1 Travel Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover incredible destinations, connect with travel buddies, and create unforgettable memories
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl">
                <div className="text-4xl mb-2">🏨</div>
                <div className="text-3xl text-blue-900 mb-1">50K+</div>
                <div className="text-sm text-gray-600">Hotels & Stays</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
                <div className="text-4xl mb-2">👥</div>
                <div className="text-3xl text-purple-900 mb-1">1M+</div>
                <div className="text-sm text-gray-600">Travel Buddies</div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-2xl">
                <div className="text-4xl mb-2">🚗</div>
                <div className="text-3xl text-pink-900 mb-1">500K+</div>
                <div className="text-sm text-gray-600">Carpool Rides</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-3xl text-orange-900 mb-1">4.9/5</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
            </div>
          </FloatingGradientCard>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Bank-grade security & encryption', color: 'text-blue-600' },
              { icon: CheckCircle, text: 'Verified travel buddies & drivers', color: 'text-green-600' },
              { icon: Heart, text: 'AI-powered smart matching', color: 'text-pink-600' },
              { icon: Sparkles, text: 'Instant booking & payments', color: 'text-purple-600' }
            ].map((feature, idx) => (
              <FloatingGradientCard key={idx} className="!p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${feature.color.replace('text', 'bg')}/10 rounded-xl flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <p className="text-gray-700">{feature.text}</p>
                </div>
              </FloatingGradientCard>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <FloatingGradientCard className="relative">
          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl mb-2 bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back!' : 'Join the Adventure'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Continue your journey with us' : 'Start your travel journey today'}
              </p>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => handleSocialLogin('Google')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50"
              >
                <Chrome className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => handleSocialLogin('Facebook')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50"
              >
                <Facebook className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => handleSocialLogin('Apple')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50"
              >
                <Apple className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-blue-600 transition-all`}
                      placeholder="Enter your full name"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-blue-600 transition-all`}
                    placeholder="your.email@example.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-12 pr-12 py-3.5 border-2 ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-blue-600 transition-all`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3.5 border-2 ${errors.phone ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-blue-600 transition-all`}
                        placeholder="+91 98765 43210"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3.5 border-2 ${errors.city ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-blue-600 transition-all`}
                        disabled={isLoading}
                      >
                        <option value="">Select your city</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Jaipur">Jaipur</option>
                        <option value="Goa">Goa</option>
                      </select>
                    </div>
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                </>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </button>
                </div>
              )}

              <AnimatedButton
                variant="primary"
                icon={isLoading ? undefined : <ArrowRight className="w-5 h-5" />}
                className="w-full !py-4 !text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Please wait...</span>
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </AnimatedButton>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                disabled={isLoading}
                className="text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                {isLogin ? (
                  <>Don't have an account? <span className="text-blue-600 font-medium">Sign Up</span></>
                ) : (
                  <>Already have an account? <span className="text-blue-600 font-medium">Sign In</span></>
                )}
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-600" />
                  <span>Trusted</span>
                </div>
              </div>
            </div>
          </div>
        </FloatingGradientCard>
      </div>
    </NatureBackground>
  );
}
