import { useState } from 'react';
import { CreditCard, X, Check, Lock, Smartphone, Wallet, Building } from 'lucide-react';
import { globalState } from '../utils/globalState';

interface PaymentGatewayProps {
  amount: number;
  description: string;
  bookingDetails: {
    hotelId: string;
    hotelName: string;
    destination: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  };
  onSuccess: (bookingId: string) => void;
  onClose: () => void;
}

export function ProperPaymentGateway({ amount, description, bookingDetails, onSuccess, onClose }: PaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('card');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
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

  const handlePayment = async () => {
    // Validation
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        alert('Please fill all card details');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Card number must be 16 digits');
        return;
      }
      if (cvv.length !== 3) {
        alert('CVV must be 3 digits');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        alert('Please enter valid UPI ID');
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
    setTimeout(() => {
      // Create booking in global state
      const bookingId = globalState.addBooking({
        ...bookingDetails,
        totalPrice: amount,
        paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' : 
                      paymentMethod === 'upi' ? 'UPI' :
                      paymentMethod === 'netbanking' ? 'Net Banking' : 'Wallet',
        paymentStatus: 'completed'
      });

      setProcessing(false);
      setPaymentComplete(true);

      // Call success callback after 2 seconds
      setTimeout(() => {
        onSuccess(bookingId);
      }, 2000);
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-fadeIn">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">₹{amount.toLocaleString('en-IN')} paid successfully</p>
          <p className="text-sm text-gray-500 mb-6">
            Your booking has been confirmed and added to expenses tracker
          </p>
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-blue-900 font-medium">
              ✓ Booking confirmed<br/>
              ✓ Added to "My Bookings"<br/>
              ✓ Recorded in Expense Tracker
            </p>
          </div>
          <p className="text-gray-500 text-sm">Redirecting to bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Secure Payment</h2>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-blue-100 text-sm">
            <Lock className="w-4 h-4" />
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-600 text-sm">Amount to Pay</p>
              <p className="text-3xl font-bold text-blue-900">₹{amount.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm">{description}</p>
              <p className="text-sm font-medium text-gray-900">{bookingDetails.hotelName}</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {bookingDetails.checkIn} to {bookingDetails.checkOut} • {bookingDetails.guests} Guest{bookingDetails.guests > 1 ? 's' : ''}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'card'
                  ? 'border-blue-900 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'card' ? 'text-blue-900' : 'text-gray-600'}`} />
              <p className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-blue-900' : 'text-gray-600'}`}>
                Card
              </p>
            </button>

            <button
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'upi'
                  ? 'border-blue-900 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Smartphone className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'upi' ? 'text-blue-900' : 'text-gray-600'}`} />
              <p className={`text-sm font-medium ${paymentMethod === 'upi' ? 'text-blue-900' : 'text-gray-600'}`}>
                UPI
              </p>
            </button>

            <button
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'netbanking'
                  ? 'border-blue-900 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Building className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'netbanking' ? 'text-blue-900' : 'text-gray-600'}`} />
              <p className={`text-sm font-medium ${paymentMethod === 'netbanking' ? 'text-blue-900' : 'text-gray-600'}`}>
                Net Banking
              </p>
            </button>

            <button
              onClick={() => setPaymentMethod('wallet')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'wallet'
                  ? 'border-blue-900 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Wallet className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'wallet' ? 'text-blue-900' : 'text-gray-600'}`} />
              <p className={`text-sm font-medium ${paymentMethod === 'wallet' ? 'text-blue-900' : 'text-gray-600'}`}>
                Wallet
              </p>
            </button>
          </div>

          {/* Payment Forms */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
                  maxLength={19}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="JOHN DOE"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substr(0, 3))}
                    placeholder="123"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
              />
              <p className="text-sm text-gray-500 mt-2">Enter your UPI ID (e.g., yourname@paytm, yourname@ybl)</p>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
              >
                <option value="">Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {paymentMethod === 'wallet' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Wallet</label>
              <select
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
              >
                <option value="">Choose your wallet</option>
                <option value="paytm">Paytm</option>
                <option value="phonepe">PhonePe</option>
                <option value="googlepay">Google Pay</option>
                <option value="amazonpay">Amazon Pay</option>
                <option value="mobikwik">Mobikwik</option>
              </select>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl hover:shadow-2xl transition-all text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {processing ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Pay ₹{amount.toLocaleString('en-IN')}
              </>
            )}
          </button>

          {/* Security Info */}
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Your payment information is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
