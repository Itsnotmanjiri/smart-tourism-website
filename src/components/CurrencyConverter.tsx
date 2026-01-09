import { useState, useEffect } from 'react';
import { X, ArrowRightLeft, TrendingUp, Info, Plus, Check, Receipt, CreditCard } from 'lucide-react';
import { UniversalPaymentGateway } from './UniversalPaymentGateway';
import { globalState } from '../utils/globalState';
import { toast } from 'sonner';

interface CurrencyConverterProps {
  onClose: () => void;
  onGoToExpenses?: () => void;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  flag: string;
}

export function CurrencyConverter({ onClose, onGoToExpenses }: CurrencyConverterProps) {
  const currencies: Currency[] = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 1, flag: '🇮🇳' },
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 83.50, flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 90.20, flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 105.75, flag: '🇬🇧' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 54.30, flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 61.40, flag: '🇨🇦' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 0.56, flag: '🇯🇵' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 22.75, flag: '🇦🇪' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 62.15, flag: '🇸🇬' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 95.40, flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 11.50, flag: '🇨🇳' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 2.35, flag: '🇹🇭' },
  ];

  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[1]); // USD
  const [toCurrency, setToCurrency] = useState<Currency>(currencies[0]); // INR
  const [amount, setAmount] = useState<string>('100');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [showBudgetGuide, setShowBudgetGuide] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    calculateConversion();
  }, [amount, fromCurrency, toCurrency]);

  const calculateConversion = () => {
    const numAmount = parseFloat(amount) || 0;
    // Convert from source currency to INR, then to target currency
    const amountInINR = numAmount * fromCurrency.rate;
    const result = amountInINR / toCurrency.rate;
    setConvertedAmount(result);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN', { 
      maximumFractionDigits: 2, 
      minimumFractionDigits: 2 
    });
  };

  const getExchangeRate = () => {
    const rate = fromCurrency.rate / toCurrency.rate;
    return formatNumber(rate);
  };

  const getBudgetGuide = () => {
    if (toCurrency.code !== 'INR') return null;

    const inr = convertedAmount;
    const guides = [];

    if (inr >= 600 && inr <= 1500) {
      guides.push({ icon: '🏨', text: 'Perfect for 1 night at a budget hotel' });
    } else if (inr > 1500 && inr <= 4000) {
      guides.push({ icon: '🏨', text: '1-2 nights at a mid-range hotel' });
    } else if (inr > 4000) {
      guides.push({ icon: '🏨', text: `${Math.floor(inr / 4000)} nights at luxury hotel` });
    }

    if (inr >= 200) {
      guides.push({ icon: '🍛', text: `About ${Math.floor(inr / 300)} good restaurant meals` });
    }

    if (inr >= 50) {
      guides.push({ icon: '🌮', text: `${Math.floor(inr / 100)} street food experiences` });
    }

    if (inr >= 2500) {
      guides.push({ icon: '🎒', text: `${Math.floor(inr / 2500)} days backpacking` });
    }

    if (inr >= 20) {
      guides.push({ icon: '🚇', text: `${Math.floor(inr / 30)} metro rides` });
    }

    return guides.length > 0 ? guides : null;
  };

  const popularConversions = [
    { from: 'USD', to: 'INR', amount: '100' },
    { from: 'EUR', to: 'INR', amount: '100' },
    { from: 'GBP', to: 'INR', amount: '50' },
    { from: 'AED', to: 'INR', amount: '500' },
  ];

  const setQuickConversion = (from: string, to: string, amt: string) => {
    const fromCurr = currencies.find(c => c.code === from);
    const toCurr = currencies.find(c => c.code === to);
    if (fromCurr && toCurr) {
      setFromCurrency(fromCurr);
      setToCurrency(toCurr);
      setAmount(amt);
    }
  };

  const handlePayNow = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    // Convert to INR for storage
    const amountInINR = parseFloat(amount) * fromCurrency.rate;
    
    // Add to expenses
    globalState.addExpense({
      id: `expense-currency-${Date.now()}`,
      userId: globalState.getCurrentUser()?.id || 'guest',
      amount: amountInINR,
      category: 'other',
      description: `Currency Exchange: ${fromCurrency.symbol}${amount} ${fromCurrency.code} to ${toCurrency.symbol}${convertedAmount.toFixed(2)} ${toCurrency.code}`,
      date: new Date().toISOString().split('T')[0],
      currency: 'INR'
    });
    
    toast.success(`Payment successful! Transaction ID: ${transactionId.slice(0, 8)}`);
    setShowPayment(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-t-2xl sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <ArrowRightLeft className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl">Currency Converter</h2>
                  <p className="text-blue-100 text-sm">Real-time exchange rates for travelers</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                aria-label="Close converter"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Converter Section */}
            <div className="space-y-4">
              {/* From Currency */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">From</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
                    placeholder="Enter amount"
                  />
                  <select
                    value={fromCurrency.code}
                    onChange={(e) => {
                      const curr = currencies.find(c => c.code === e.target.value);
                      if (curr) setFromCurrency(curr);
                    }}
                    className="px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors cursor-pointer bg-white min-w-[180px]"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 px-1">
                  <span>{fromCurrency.symbol}1 {fromCurrency.code} = ₹{formatNumber(fromCurrency.rate)}</span>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={swapCurrencies}
                  className="p-3 bg-blue-900 text-white rounded-full hover:bg-blue-950 transition-all hover:scale-110 shadow-lg"
                  aria-label="Swap currencies"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
              </div>

              {/* To Currency */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">To</label>
                <div className="flex gap-3">
                  <div className="flex-1 px-4 py-4 border-2 border-blue-900 bg-blue-50 rounded-xl">
                    <div className="text-3xl text-blue-900">
                      {toCurrency.symbol}{formatNumber(convertedAmount)}
                    </div>
                  </div>
                  <select
                    value={toCurrency.code}
                    onChange={(e) => {
                      const curr = currencies.find(c => c.code === e.target.value);
                      if (curr) setToCurrency(curr);
                    }}
                    className="px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors cursor-pointer bg-white min-w-[180px]"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 px-1">
                  <span>{toCurrency.symbol}1 {toCurrency.code} = ₹{formatNumber(toCurrency.rate)}</span>
                </div>
              </div>
            </div>

            {/* Exchange Rate Info */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-900" />
                <span className="text-blue-900">Exchange Rate</span>
              </div>
              <p className="text-2xl text-blue-900">
                1 {fromCurrency.code} = {getExchangeRate()} {toCurrency.code}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {fromCurrency.symbol}{amount} {fromCurrency.code} = {toCurrency.symbol}{formatNumber(convertedAmount)} {toCurrency.code}
              </p>
            </div>

            {/* Budget Guide for INR */}
            {toCurrency.code === 'INR' && convertedAmount > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-green-700" />
                    <span className="text-green-900">Travel Budget Guide</span>
                  </div>
                  <button
                    onClick={() => setShowBudgetGuide(!showBudgetGuide)}
                    className="text-sm text-green-700 hover:text-green-900 underline"
                  >
                    {showBudgetGuide ? 'Hide' : 'Show'} details
                  </button>
                </div>
                {showBudgetGuide && (
                  <div className="space-y-2">
                    <p className="text-green-900 mb-3">
                      With ₹{formatNumber(convertedAmount)}, you can afford:
                    </p>
                    {getBudgetGuide()?.map((guide, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white bg-opacity-50 p-3 rounded-lg">
                        <span className="text-2xl">{guide.icon}</span>
                        <span className="text-green-800">{guide.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                {!showBudgetGuide && (
                  <p className="text-sm text-green-700">
                    Click "Show details" to see what you can afford in India!
                  </p>
                )}
              </div>
            )}

            {/* Quick Conversions */}
            <div>
              <h3 className="text-gray-700 mb-3">Quick Conversions</h3>
              <div className="grid grid-cols-2 gap-3">
                {popularConversions.map((conv, index) => (
                  <button
                    key={index}
                    onClick={() => setQuickConversion(conv.from, conv.to, conv.amount)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-left border border-gray-300"
                  >
                    <div className="text-sm text-gray-600">
                      {currencies.find(c => c.code === conv.from)?.flag} {conv.amount} {conv.from}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      to {currencies.find(c => c.code === conv.to)?.flag} {conv.to}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Currency Rates */}
            <div>
              <h3 className="text-gray-700 mb-3">Popular Exchange Rates (to INR)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currencies.slice(1, 7).map((currency) => (
                  <div
                    key={currency.code}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currency.flag}</span>
                      <div>
                        <div className="text-sm text-gray-900">{currency.code}</div>
                        <div className="text-xs text-gray-500">{currency.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-900">₹{formatNumber(currency.rate)}</div>
                      <div className="text-xs text-gray-500">per {currency.symbol}1</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2">
                <Info className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="mb-1">
                    <strong>Note:</strong> Exchange rates are approximate and updated regularly. 
                    Actual rates may vary at banks, airports, and exchange counters.
                  </p>
                  <p className="text-xs text-yellow-700 mt-2">
                    For best rates: Use ATMs, authorized forex dealers, or UPI for international transactions.
                  </p>
                </div>
              </div>
            </div>

            {/* Go to Expense Tracker Button */}
            {onGoToExpenses && (
              <button
                onClick={onGoToExpenses}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-lg flex items-center justify-center gap-3"
              >
                <Receipt className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-medium">Track Your Expenses</p>
                  <p className="text-xs text-green-100">Manage your travel budget efficiently</p>
                </div>
              </button>
            )}

            {/* Pay Now Button - NEW */}
            <button
              onClick={handlePayNow}
              className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-5 px-6 rounded-xl hover:shadow-xl transition-all shadow-lg flex items-center justify-center gap-3 mt-4"
            >
              <CreditCard className="w-7 h-7" />
              <div className="text-left">
                <p className="text-xl font-bold">Exchange & Pay Now</p>
                <p className="text-sm text-blue-100">
                  Pay {fromCurrency.symbol}{amount} {fromCurrency.code} = Get {toCurrency.symbol}{formatNumber(convertedAmount)} {toCurrency.code}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPayment && (
        <UniversalPaymentGateway
          paymentDetails={{
            type: 'currency_exchange',
            amount: parseFloat(amount) * fromCurrency.rate, // Amount in INR
            description: `Currency Exchange: ${fromCurrency.code} to ${toCurrency.code}`,
            itemName: 'Currency Exchange Service',
            destination: `${fromCurrency.symbol}${amount} ${fromCurrency.code} → ${toCurrency.symbol}${formatNumber(convertedAmount)} ${toCurrency.code}`,
            metadata: {
              fromCurrency: fromCurrency.code,
              toCurrency: toCurrency.code,
              fromAmount: amount,
              toAmount: convertedAmount.toFixed(2),
              exchangeRate: getExchangeRate()
            }
          }}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
}