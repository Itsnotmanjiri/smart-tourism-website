import { useState, useEffect } from 'react';
import { Plus, TrendingUp, DollarSign, Calendar, Tag, Trash2, PieChart, Receipt, RefreshCw, ArrowLeft } from 'lucide-react';
import { globalState, Expense as GlobalExpense } from '../utils/globalState';
import { NatureBackground, FloatingGradientCard, AnimatedButton } from './ui/GlassCard';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: string;
  bookingId?: string;
  amountInINR: number;
}

const EXCHANGE_RATES = {
  USD: 83.50,
  EUR: 90.20,
  GBP: 105.75,
  INR: 1,
  JPY: 0.56
};

const CATEGORIES = [
  { value: 'accommodation', label: 'Accommodation', icon: '🏨', color: 'blue' },
  { value: 'food', label: 'Food', icon: '🍽️', color: 'green' },
  { value: 'transport', label: 'Transport', icon: '🚗', color: 'yellow' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: 'purple' },
  { value: 'activities', label: 'Activities', icon: '🎯', color: 'orange' },
  { value: 'other', label: 'Other', icon: '💰', color: 'gray' }
];

const MERCHANT_SUGGESTIONS = [
  'Hotel Taj', 'Local Restaurant', 'Uber', 'Ola', 'Street Food', 
  'Souvenir Shop', 'Museum Entry', 'Tour Guide', 'Cafe', 'Gas Station'
];

interface ExpenseTrackerProps {
  onBack: () => void;
}

export function ExpenseTracker({ onBack }: ExpenseTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    description: '',
    date: new Date().toISOString().split('T')[0],
    currency: 'INR'
  });
  const [merchantSuggestions, setMerchantSuggestions] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    // Load expenses from globalState
    const loadExpenses = () => {
      const globalExpenses = globalState.getExpenses();
      
      // Transform to match UI interface
      const transformedExpenses = globalExpenses.map(exp => ({
        id: exp.id,
        amount: exp.amount,
        category: exp.category,
        description: exp.description,
        date: exp.date,
        currency: exp.currency || 'INR',
        amountInINR: exp.amount // Already in INR from globalState
      }));
      
      setExpenses(transformedExpenses);
    };

    loadExpenses();
    
    // Refresh expenses every 3 seconds to catch new bookings
    const interval = setInterval(loadExpenses, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAddExpense = () => {
    if (!formData.amount || !formData.description) {
      alert('Please fill all required fields');
      return;
    }

    const amountInINR = parseFloat(formData.amount) * EXCHANGE_RATES[formData.currency as keyof typeof EXCHANGE_RATES];
    
    // Add to globalState
    globalState.addExpense({
      id: `expense-${Date.now()}`,
      userId: globalState.getCurrentUser()?.id || 'guest',
      amount: amountInINR,
      category: formData.category,
      description: formData.description,
      date: formData.date,
      currency: formData.currency
    });

    // Reset form
    setFormData({
      amount: '',
      category: 'food',
      description: '',
      date: new Date().toISOString().split('T')[0],
      currency: 'INR'
    });
    setShowAddForm(false);
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const handleMerchantInput = (value: string) => {
    setFormData({ ...formData, description: value });
    if (value.length > 0) {
      const filtered = MERCHANT_SUGGESTIONS.filter(m => 
        m.toLowerCase().includes(value.toLowerCase())
      );
      setMerchantSuggestions(filtered);
    } else {
      setMerchantSuggestions([]);
    }
  };

  const getTotalByCategory = (category: string) => {
    return expenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amountInINR, 0);
  };

  const totalSpentINR = expenses.reduce((sum, exp) => sum + exp.amountInINR, 0);
  const totalSpentUSD = totalSpentINR / EXCHANGE_RATES.USD;

  return (
    <NatureBackground
      imageUrl="https://images.unsplash.com/photo-1593095218711-b66b4450a1de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwcmVmbGVjdGlvbiUyMG5hdHVyZXxlbnwxfHx8fDE3Njc1MjU5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
      overlay="light"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatedButton
          onClick={onBack}
          variant="primary"
          icon={<ArrowLeft className="w-5 h-5" />}
          className="mb-6"
        >
          Back to Home
        </AnimatedButton>

        <div className="space-y-6">
          {/* Header & Summary */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl p-6">
            <h2 className="text-2xl mb-4 flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              Expense Tracker
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <p className="text-gray-600 text-sm mb-1">Total Spent (INR)</p>
                <p className="text-3xl text-black font-bold">₹{totalSpentINR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <p className="text-gray-600 text-sm mb-1">Total Spent (USD)</p>
                <p className="text-3xl text-black font-bold">${totalSpentUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Spending by Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map(cat => {
                const total = getTotalByCategory(cat.value);
                const percentage = totalSpentINR > 0 ? (total / totalSpentINR) * 100 : 0;
                return (
                  <div key={cat.value} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-sm text-gray-700">{cat.label}</span>
                    </div>
                    <p className="text-xl text-gray-900">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`bg-${cat.color}-500 h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Expense Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full bg-blue-900 text-white py-4 rounded-xl hover:bg-blue-950 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>

          {/* Add Expense Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-900">
              <h3 className="text-gray-900 mb-4">Add New Expense</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div className="md:col-span-2 relative">
                  <label className="text-sm text-gray-600 block mb-2">Merchant/Description *</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => handleMerchantInput(e.target.value)}
                    placeholder="Where did you spend?"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                  />
                  {merchantSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border-2 border-gray-300 rounded-xl mt-1 shadow-lg max-h-40 overflow-y-auto">
                      {merchantSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setFormData({ ...formData, description: suggestion });
                            setMerchantSuggestions([]);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {formData.amount && formData.currency !== 'INR' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    {formData.currency} {formData.amount} = ₹{(parseFloat(formData.amount || '0') * EXCHANGE_RATES[formData.currency as keyof typeof EXCHANGE_RATES]).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  className="flex-1 bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-950 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </div>
          )}

          {/* Expense History */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Expense History</h3>
              <span className="text-sm text-gray-600">{expenses.length} expenses</span>
            </div>

            {expenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No expenses tracked yet</p>
                <p className="text-sm">Start adding your travel expenses</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => {
                  const category = CATEGORIES.find(c => c.value === expense.category);
                  return (
                    <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl">
                          {category?.icon}
                        </div>
                        <div>
                          <p className="text-gray-900">{expense.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            {new Date(expense.date).toLocaleDateString('en-IN')}
                            <span>•</span>
                            <Tag className="w-3 h-3" />
                            {category?.label}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p className="text-gray-900">
                            {expense.currency === 'INR' ? '₹' : expense.currency + ' '}
                            {expense.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </p>
                          {expense.currency !== 'INR' && (
                            <p className="text-xs text-gray-500">₹{expense.amountInINR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </NatureBackground>
  );
}