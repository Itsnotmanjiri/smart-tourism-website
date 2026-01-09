import React, { useState } from 'react';
import { CreditCard, X, Check, Lock, Smartphone, Wallet, Building, ArrowRightLeft, DollarSign } from 'lucide-react';
import { addNotification } from './InAppNotifications';

interface PaymentDetails {
  type: 'hotel' | 'carpool' | 'buddy' | 'other';
  amount: number;
  description: string;
  itemName: string;
  destination?: string;
  date?: string;
  metadata?: any;
}

interface UniversalPaymentGatewayProps {
  paymentDetails: PaymentDetails;
  onSuccess: (transactionId: string) => void;
  onClose: () => void;
}

export function UniversalPaymentGateway({ paymentDetails, onSuccess, onClose }: UniversalPaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('card');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // UPI
  const [upiId, setUpiId] = useState('');
  
  // Net Banking
  const [selectedBank, setSelectedBank] = useState('');
  
  // Wallet
  const [selectedWallet, setSelectedWallet] = useState('');

  // Currency Converter
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const exchangeRates: { [key: string]: number } = {
    'USD': 0.012,
    'EUR': 0.011,
    'GBP': 0.0095,
    'AED': 0.044,
    'SGD': 0.016,
    'AUD': 0.018
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substr(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\//g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substr(0, 2)}/${cleaned.substr(2, 2)}`;
    }
    return cleaned;
  };

  const handleConvertCurrency = () => {
    const rate = exchangeRates[selectedCurrency];
    const converted = paymentDetails.amount * rate;
    setConvertedAmount(converted);
  };

  const handlePayment = async () => {
    // Validate payment method details
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        alert('Please fill all card details');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        alert('Please enter UPI ID');
        return;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!selectedBank) {
        alert('Please select a bank');
        return;
      }
    } else if (paymentMethod === 'wallet') {
      if (!selectedWallet) {
        alert('Please select a wallet');
        return;
      }
    }

    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Record transaction in expenses
    const expense = {
      id: transactionId,
      type: paymentDetails.type,
      description: paymentDetails.description,
      itemName: paymentDetails.itemName,
      amount: paymentDetails.amount,
      date: new Date().toISOString(),
      destination: paymentDetails.destination,
      paymentMethod: paymentMethod.toUpperCase(),
      status: 'completed',
      metadata: paymentDetails.metadata
    };

    // Save to localStorage
    const existingExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    existingExpenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(existingExpenses));

    // Save converted currency transaction if applicable
    if (convertedAmount) {
      const currencyTransaction = {
        id: `CONV-${Date.now()}`,
        type: 'currency_conversion',
        fromCurrency: 'INR',
        toCurrency: selectedCurrency,
        fromAmount: paymentDetails.amount,
        toAmount: convertedAmount,
        rate: exchangeRates[selectedCurrency],
        date: new Date().toISOString()
      };
      
      const conversions = JSON.parse(localStorage.getItem('currency_conversions') || '[]');
      conversions.push(currencyTransaction);
      localStorage.setItem('currency_conversions', JSON.stringify(conversions));
    }

    setProcessing(false);
    setPaymentComplete(true);

    // Add notification
    addNotification({
      type: 'payment',
      title: 'Payment Successful',
      message: `Payment of ₹${paymentDetails.amount.toLocaleString()} completed for ${paymentDetails.itemName}`
    });

    setTimeout(() => {
      onSuccess(transactionId);
    }, 1500);
  };

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">{paymentDetails.description}</p>
          <p className="text-3xl font-bold text-green-600 mb-6">₹{paymentDetails.amount.toLocaleString()}</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">✓ Transaction recorded in your expenses</p>
            <p className="text-sm text-gray-600">✓ Booking confirmed successfully</p>
            {convertedAmount && (
              <p className="text-sm text-blue-600 mt-2">
                Approx. {selectedCurrency} {convertedAmount.toFixed(2)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl hover:shadow-xl transition-all font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Secure Payment</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-blue-200">
            <Lock className="w-4 h-4" />
            <span className="text-sm">256-bit SSL Encrypted</span>
          </div>
        </div>

        <div className="p-6">
          {/* Payment Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Amount to Pay</p>
                <p className="text-3xl font-bold text-gray-900">₹{paymentDetails.amount.toLocaleString()}</p>
              </div>
              <button
                onClick={() => setShowCurrencyConverter(!showCurrencyConverter)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <ArrowRightLeft className="w-4 h-4 text-blue-900" />
                <span className="text-sm text-blue-900">Convert</span>
              </button>
            </div>

            {showCurrencyConverter && (
              <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => {
                      setSelectedCurrency(e.target.value);
                      setConvertedAmount(null);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="AED">UAE Dirham (AED)</option>
                    <option value="SGD">Singapore Dollar (SGD)</option>
                    <option value="AUD">Australian Dollar (AUD)</option>
                  </select>
                  <button
                    onClick={handleConvertCurrency}
                    className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors"
                  >
                    Convert
                  </button>
                </div>
                {convertedAmount && (
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Approximately</p>
                    <p className="text-xl font-bold text-blue-900">
                      {selectedCurrency} {convertedAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Rate: 1 INR = {exchangeRates[selectedCurrency].toFixed(4)} {selectedCurrency}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Item:</span>
                <span className="font-medium text-gray-900">{paymentDetails.itemName}</span>
              </div>
              {paymentDetails.destination && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Destination:</span>
                  <span className="font-medium text-gray-900">{paymentDetails.destination}</span>
                </div>
              )}
              {paymentDetails.date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">{paymentDetails.date}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-900 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'card' ? 'text-blue-900' : 'text-gray-600'
                }`} />
                <p className="text-sm font-medium text-gray-900">Card</p>
              </button>

              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-blue-900 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'upi' ? 'text-blue-900' : 'text-gray-600'
                }`} />
                <p className="text-sm font-medium text-gray-900">UPI</p>
              </button>

              <button
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-blue-900 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'netbanking' ? 'text-blue-900' : 'text-gray-600'
                }`} />
                <p className="text-sm font-medium text-gray-900">Net Banking</p>
              </button>

              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-blue-900 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Wallet className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'wallet' ? 'text-blue-900' : 'text-gray-600'
                }`} />
                <p className="text-sm font-medium text-gray-900">Wallet</p>
              </button>
            </div>
          </div>

          {/* Payment Details Form */}
          <div className="space-y-4">
            {paymentMethod === 'card' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="JOHN DOE"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substr(0, 3))}
                      placeholder="123"
                      maxLength={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  <option value="">Choose your bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                  <option value="pnb">Punjab National Bank</option>
                </select>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Wallet</label>
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  <option value="">Choose wallet</option>
                  <option value="paytm">Paytm</option>
                  <option value="phonepe">PhonePe</option>
                  <option value="googlepay">Google Pay</option>
                  <option value="amazonpay">Amazon Pay</option>
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={processing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay ₹{paymentDetails.amount.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}