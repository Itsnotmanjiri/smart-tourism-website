import { useState } from 'react';
import { CreditCard, Smartphone, Building, Wallet, Lock, CheckCircle, X, QrCode, Copy, Check, ShieldCheck, AlertCircle, ArrowRight, IndianRupee } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface RazorpayPaymentGatewayProps {
  amount: number;
  bookingDetails: {
    type: 'hotel' | 'flight' | 'train' | 'carpool' | 'buddy';
    title: string;
    description: string;
    itemName?: string;
    checkIn?: string;
    checkOut?: string;
    date?: string;
  };
  onSuccess: (paymentData: PaymentSuccessData) => void;
  onCancel: () => void;
}

export interface PaymentSuccessData {
  paymentId: string;
  orderId: string;
  method: string;
  amount: number;
  timestamp: string;
}

export function RazorpayPaymentGateway({ amount, bookingDetails, onSuccess, onCancel }: RazorpayPaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null);

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI details
  const [upiId, setUpiId] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);

  // Net Banking
  const [selectedBank, setSelectedBank] = useState('');

  // Wallet
  const [selectedWallet, setSelectedWallet] = useState('');

  // Calculate amounts
  const gstAmount = amount * 0.18; // 18% GST
  const platformFee = 50;
  const totalAmount = amount + gstAmount + platformFee;

  // Popular Indian Banks
  const banks = [
    { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
    { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
    { id: 'icici', name: 'ICICI Bank', logo: '🏦' },
    { id: 'axis', name: 'Axis Bank', logo: '🏦' },
    { id: 'pnb', name: 'Punjab National Bank', logo: '🏦' },
    { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏦' },
  ];

  // Popular Wallets
  const wallets = [
    { id: 'paytm', name: 'Paytm', logo: '💳' },
    { id: 'phonepe', name: 'PhonePe', logo: '📱' },
    { id: 'googlepay', name: 'Google Pay', logo: '💰' },
    { id: 'amazonpay', name: 'Amazon Pay', logo: '🛒' },
    { id: 'mobikwik', name: 'Mobikwik', logo: '💵' },
  ];

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const generateUPIQR = () => {
    // Generate UPI payment string
    const upiString = `upi://pay?pa=merchant@razorpay&pn=SmartTourismIndia&am=${totalAmount}&cu=INR&tn=${bookingDetails.title}`;
    return upiString;
  };

  const copyUPIId = async () => {
    try {
      await navigator.clipboard.writeText('merchant@razorpay');
      setQrCopied(true);
      toast.success('UPI ID copied!');
      setTimeout(() => setQrCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePayment = async () => {
    // Validate based on payment method
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error('Please fill all card details');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Invalid card number');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId && !showQR) {
        toast.error('Please enter UPI ID or scan QR code');
        return;
      }
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (upiId && !upiRegex.test(upiId)) {
        toast.error('Invalid UPI ID format');
        return;
      }
    } else if (paymentMethod === 'netbanking' && !selectedBank) {
      toast.error('Please select a bank');
      return;
    } else if (paymentMethod === 'wallet' && !selectedWallet) {
      toast.error('Please select a wallet');
      return;
    }

    setIsProcessing(true);

    // Simulate Razorpay API call
    setTimeout(() => {
      const paymentId = `pay_${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const orderId = `order_${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const paymentInfo: PaymentSuccessData = {
        paymentId,
        orderId,
        method: paymentMethod,
        amount: totalAmount,
        timestamp: new Date().toISOString(),
      };

      setPaymentData(paymentInfo);
      setPaymentSuccess(true);
      setIsProcessing(false);

      // Save to expenses
      const existingExpenses = localStorage.getItem('expenses');
      const expenses = existingExpenses ? JSON.parse(existingExpenses) : [];
      
      expenses.push({
        id: Date.now().toString(),
        amount: totalAmount,
        category: bookingDetails.type === 'hotel' ? 'accommodation' : 
                 bookingDetails.type === 'flight' || bookingDetails.type === 'train' ? 'transport' : 'other',
        description: bookingDetails.title,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: paymentMethod,
        paymentId: paymentId,
      });
      
      localStorage.setItem('expenses', JSON.stringify(expenses));

      // Show success notification
      toast.success('Payment successful! ₹' + totalAmount.toLocaleString('en-IN'));

      // Call success callback after 2 seconds
      setTimeout(() => {
        onSuccess(paymentInfo);
      }, 2000);
    }, 3000);
  };

  if (paymentSuccess && paymentData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center animate-in zoom-in-95">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-3xl mb-2 text-green-900">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your booking has been confirmed</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Payment ID</p>
                <p className="text-gray-900">{paymentData.paymentId}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Order ID</p>
                <p className="text-gray-900">{paymentData.orderId}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Amount Paid</p>
                <p className="text-lg text-gray-900">₹{paymentData.amount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Payment Method</p>
                <p className="text-gray-900 uppercase">{paymentData.method}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              📧 Confirmation email sent to your registered email address
            </p>
          </div>

          <Badge className="bg-green-100 text-green-900 mb-6">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Secured by Razorpay
          </Badge>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl flex items-center gap-2">
              <Lock className="w-6 h-6" />
              Secure Payment
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-white hover:bg-white/20"
              disabled={isProcessing}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Powered by Razorpay - India's Most Trusted Payment Gateway
          </Badge>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Payment Methods */}
            <div>
              <h3 className="text-lg mb-4">Choose Payment Method</h3>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('upi')}
                  className="h-20 flex-col"
                >
                  <Smartphone className="w-6 h-6 mb-1" />
                  <span>UPI</span>
                  <span className="text-xs opacity-70">PhonePe, GPay</span>
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="h-20 flex-col"
                >
                  <CreditCard className="w-6 h-6 mb-1" />
                  <span>Card</span>
                  <span className="text-xs opacity-70">Credit/Debit</span>
                </Button>
                <Button
                  variant={paymentMethod === 'netbanking' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('netbanking')}
                  className="h-20 flex-col"
                >
                  <Building className="w-6 h-6 mb-1" />
                  <span>Net Banking</span>
                  <span className="text-xs opacity-70">All Banks</span>
                </Button>
                <Button
                  variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('wallet')}
                  className="h-20 flex-col"
                >
                  <Wallet className="w-6 h-6 mb-1" />
                  <span>Wallets</span>
                  <span className="text-xs opacity-70">Paytm, etc</span>
                </Button>
              </div>

              {/* UPI Payment */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={!showQR ? 'default' : 'outline'}
                      onClick={() => setShowQR(false)}
                      size="sm"
                    >
                      Enter UPI ID
                    </Button>
                    <Button
                      variant={showQR ? 'default' : 'outline'}
                      onClick={() => setShowQR(true)}
                      size="sm"
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      Scan QR
                    </Button>
                  </div>

                  {!showQR ? (
                    <div>
                      <label className="block text-sm mb-2">Enter your UPI ID</label>
                      <Input
                        placeholder="yourname@paytm"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="mb-2"
                      />
                      <p className="text-xs text-gray-500">
                        Examples: yourname@paytm, yourname@ybl, yourname@oksbi
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="bg-white border-4 border-blue-900 rounded-lg p-4 inline-block mb-4">
                        <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                          <QrCode className="w-24 h-24 text-blue-900" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Scan with any UPI app</p>
                      <div className="flex items-center justify-center gap-2">
                        <code className="bg-gray-100 px-3 py-2 rounded text-sm">
                          merchant@razorpay
                        </code>
                        <Button size="sm" variant="outline" onClick={copyUPIId}>
                          {qrCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    <AlertCircle className="w-4 h-4" />
                    <span>Payment will be verified instantly</span>
                  </div>
                </div>
              )}

              {/* Card Payment */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Card Number</label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Cardholder Name</label>
                    <Input
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Expiry Date</label>
                      <Input
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">CVV</label>
                      <Input
                        placeholder="123"
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength={3}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span>Your card details are encrypted and secure</span>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3">
                  <label className="block text-sm mb-2">Select Your Bank</label>
                  {banks.map((bank) => (
                    <Button
                      key={bank.id}
                      variant={selectedBank === bank.id ? 'default' : 'outline'}
                      onClick={() => setSelectedBank(bank.id)}
                      className="w-full justify-start"
                    >
                      <span className="text-2xl mr-3">{bank.logo}</span>
                      {bank.name}
                    </Button>
                  ))}
                </div>
              )}

              {/* Wallets */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-3">
                  <label className="block text-sm mb-2">Select Wallet</label>
                  {wallets.map((wallet) => (
                    <Button
                      key={wallet.id}
                      variant={selectedWallet === wallet.id ? 'default' : 'outline'}
                      onClick={() => setSelectedWallet(wallet.id)}
                      className="w-full justify-start"
                    >
                      <span className="text-2xl mr-3">{wallet.logo}</span>
                      {wallet.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h3 className="text-lg mb-4">Order Summary</h3>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="mb-2">{bookingDetails.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{bookingDetails.description}</p>
                  {bookingDetails.checkIn && bookingDetails.checkOut && (
                    <p className="text-sm text-gray-600">
                      {bookingDetails.checkIn} → {bookingDetails.checkOut}
                    </p>
                  )}
                  {bookingDetails.date && (
                    <p className="text-sm text-gray-600">
                      Date: {bookingDetails.date}
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Base Amount</span>
                    <span>₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee</span>
                    <span>₹{platformFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span>Total Amount</span>
                    <span className="text-blue-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-900 to-purple-900"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <IndianRupee className="w-5 h-5 mr-2" />
                      Pay ₹{totalAmount.toLocaleString('en-IN')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Lock className="w-3 h-3" />
                  <span>256-bit SSL Encrypted Payment</span>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center mb-2">Accepted Payment Methods</p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <Badge variant="outline">💳 Visa</Badge>
                    <Badge variant="outline">💳 Mastercard</Badge>
                    <Badge variant="outline">💳 RuPay</Badge>
                    <Badge variant="outline">📱 UPI</Badge>
                    <Badge variant="outline">🏦 Net Banking</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
