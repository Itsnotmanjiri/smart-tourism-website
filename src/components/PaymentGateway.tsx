import { useState } from 'react';
import { CreditCard, Building, Smartphone, Wallet, Lock, CheckCircle, ArrowLeft } from 'lucide-react';

interface PaymentGatewayProps {
  amount: number;
  bookingDetails: {
    type: 'hotel' | 'currency';
    hotelName?: string;
    checkIn?: string;
    checkOut?: string;
    nights?: number;
    guests?: number;
    currencyFrom?: string;
    currencyTo?: string;
    convertedAmount?: number;
  };
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

export function PaymentGateway({ amount, bookingDetails, onSuccess, onCancel }: PaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');

  const taxAmount = amount * 0.12; // 12% GST
  const totalAmount = amount + taxAmount;

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const paymentId = `PAY${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Add to expenses if it's a hotel booking
      if (bookingDetails.type === 'hotel') {
        const existingExpenses = localStorage.getItem('expenses');
        const expenses = existingExpenses ? JSON.parse(existingExpenses) : [];
        
        expenses.push({
          id: Date.now().toString(),
          amount: totalAmount,
          category: 'accommodation',
          merchant: bookingDetails.hotelName || 'Hotel Booking',
          date: new Date().toISOString().split('T')[0],
          currency: 'INR',
          amountInINR: totalAmount,
          paymentId
        });
        
        localStorage.setItem('expenses', JSON.stringify(expenses));
      } else if (bookingDetails.type === 'currency') {
        // Add currency conversion to expenses
        const existingExpenses = localStorage.getItem('expenses');
        const expenses = existingExpenses ? JSON.parse(existingExpenses) : [];
        
        expenses.push({
          id: Date.now().toString(),
          amount: totalAmount,
          category: 'other',
          merchant: `Currency Exchange: ${bookingDetails.currencyFrom} to ${bookingDetails.currencyTo}`,
          date: new Date().toISOString().split('T')[0],
          currency: 'INR',
          amountInINR: totalAmount,
          paymentId
        });
        
        localStorage.setItem('expenses', JSON.stringify(expenses));
      }
      
      setIsProcessing(false);
      onSuccess(paymentId);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onCancel} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl">Secure Payment</h2>
            <div className="flex items-center gap-2 text-green-400">
              <Lock className="w-5 h-5" />
              <span className="text-sm">256-bit SSL</span>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
            {bookingDetails.type === 'hotel' ? (
              <>
                <p className="text-blue-200 text-sm mb-2">Hotel Booking</p>
                <h3 className="text-xl mb-2">{bookingDetails.hotelName}</h3>
                <div className="flex items-center gap-4 text-sm text-blue-200">
                  <span>Check-in: {bookingDetails.checkIn}</span>
                  <span>•</span>
                  <span>{bookingDetails.nights} nights</span>
                  <span>•</span>
                  <span>{bookingDetails.guests} guests</span>
                </div>
              </>
            ) : (
              <>
                <p className="text-blue-200 text-sm mb-2">Currency Exchange</p>
                <h3 className="text-xl mb-2">
                  {bookingDetails.currencyFrom} → {bookingDetails.currencyTo}
                </h3>
                <p className="text-blue-200">Converted Amount: {bookingDetails.convertedAmount}</p>
              </>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-900 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-900" />
                    <p className="text-sm font-medium">Credit/Debit Card</p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-blue-900 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Smartphone className="w-8 h-8 mx-auto mb-2 text-blue-900" />
                    <p className="text-sm font-medium">UPI</p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-blue-900 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Building className="w-8 h-8 mx-auto mb-2 text-blue-900" />
                    <p className="text-sm font-medium">Net Banking</p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'wallet'
                        ? 'border-blue-900 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Wallet className="w-8 h-8 mx-auto mb-2 text-blue-900" />
                    <p className="text-sm font-medium">Wallets</p>
                  </button>
                </div>
              </div>

              {/* Payment Forms */}
              <div className="bg-gray-50 rounded-2xl p-6">
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <h4 className="text-gray-900 mb-4">Card Details</h4>
                    
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">Card Number</label>
                      <input
                        type="text"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim() })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 block mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })}
                        placeholder="JOHN DOE"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 block mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 block mb-2">CVV</label>
                        <input
                          type="password"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          placeholder="123"
                          maxLength={3}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
                      <Lock className="w-4 h-4" />
                      <span>Your card details are encrypted and secure</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <h4 className="text-gray-900 mb-4">UPI Payment</h4>
                    
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">Enter UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                      />
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <p className="text-sm text-blue-900 mb-2">Popular UPI Apps</p>
                      <div className="flex gap-3">
                        <div className="px-3 py-2 bg-white rounded-lg text-sm">Google Pay</div>
                        <div className="px-3 py-2 bg-white rounded-lg text-sm">PhonePe</div>
                        <div className="px-3 py-2 bg-white rounded-lg text-sm">Paytm</div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <h4 className="text-gray-900 mb-4">Select Your Bank</h4>
                    
                    <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900">
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Punjab National Bank</option>
                      <option>Bank of Baroda</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Yes Bank</option>
                    </select>

                    <p className="text-sm text-gray-600">You will be redirected to your bank's website</p>
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="space-y-4">
                    <h4 className="text-gray-900 mb-4">Select Wallet</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-blue-900 transition-colors">
                        <p className="font-medium">Paytm</p>
                      </button>
                      <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-blue-900 transition-colors">
                        <p className="font-medium">PhonePe</p>
                      </button>
                      <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-blue-900 transition-colors">
                        <p className="font-medium">Amazon Pay</p>
                      </button>
                      <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-blue-900 transition-colors">
                        <p className="font-medium">Mobikwik</p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-6">
                <h3 className="text-gray-900 mb-4">Payment Summary</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {bookingDetails.type === 'hotel' ? 'Room charges' : 'Exchange amount'}
                    </span>
                    <span className="text-gray-900">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (12%)</span>
                    <span className="text-gray-900">₹{taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="border-t-2 border-gray-300 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="text-2xl text-blue-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-xl transition-all text-white font-medium ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-900 to-indigo-900 hover:shadow-lg'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Pay ₹${totalAmount.toLocaleString('en-IN')}`
                  )}
                </button>

                {/* Security Badges */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <p className="text-xs text-gray-600 mb-3">Secured by</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">🔒 SSL Encrypted</div>
                    <div className="text-xs text-gray-500">✓ PCI DSS</div>
                    <div className="text-xs text-gray-500">Razorpay</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
