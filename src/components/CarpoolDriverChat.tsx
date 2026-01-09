import { useState, useEffect } from 'react';
import { Send, X, User, MessageCircle, Star, ThumbsUp, Flag, Shield } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  rating?: number;
  feedback?: string;
}

interface Props {
  driverId: string;
  driverName: string;
  onClose: () => void;
}

export function CarpoolDriverChat({ driverId, driverName, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  useEffect(() => {
    loadMessages();
    loadDummyMessages();
    // Refresh messages every 5 seconds
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [driverId]);

  const loadDummyMessages = () => {
    // Create some dummy chat messages for demonstration
    const dummyMessages: Message[] = [
      {
        id: 'msg-1',
        userId: 'driver-' + driverId,
        userName: driverName,
        message: 'Hello! Thanks for booking. I\'ll be there on time. Looking forward to the ride!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-2',
        userId: 'user-current',
        userName: 'You',
        message: 'Great! What\'s your vehicle number?',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-3',
        userId: 'driver-' + driverId,
        userName: driverName,
        message: 'It\'s MH 02 AB 1234. White Honda City. I\'ll send you my live location 15 mins before pickup.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-4',
        userId: 'user-current',
        userName: 'You',
        message: 'Perfect! See you tomorrow. Can we make a quick stop at a dhaba on the way?',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-5',
        userId: 'driver-' + driverId,
        userName: driverName,
        message: 'Sure! I know a great one with clean facilities. We can stop there for 20 mins.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];

    // Only add if no messages exist
    const stored = localStorage.getItem(`chat-messages-${driverId}`);
    if (!stored) {
      localStorage.setItem(`chat-messages-${driverId}`, JSON.stringify(dummyMessages));
      setMessages(dummyMessages);
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      
      // Try loading from local storage first
      const stored = localStorage.getItem(`chat-messages-${driverId}`);
      if (stored) {
        setMessages(JSON.parse(stored));
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-95da31c9/carpool/${driverId}/messages`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        if (data.messages) {
          localStorage.setItem(`chat-messages-${driverId}`, JSON.stringify(data.messages));
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // Load from local storage as fallback
      const stored = localStorage.getItem(`chat-messages-${driverId}`);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-95da31c9/carpool/message`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            driverId,
            userId: userData.email || 'guest',
            userName: userData.name || 'Guest',
            message: newMessage
          })
        }
      );

      if (response.ok) {
        setNewMessage('');
        loadMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const submitFeedback = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-95da31c9/carpool/feedback`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            driverId,
            userId: userData.email || 'guest',
            userName: userData.name || 'Guest',
            rating: feedbackRating,
            feedback: feedbackComment
          })
        }
      );

      if (response.ok) {
        toast.success('Feedback submitted successfully!');
        setShowFeedbackForm(false);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 to-teal-900 text-white px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Chat with {driverName}</h3>
              <p className="text-sm text-green-200">Send a message to your driver</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFeedbackForm(!showFeedbackForm)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Rate Driver"
            >
              <Star className="w-6 h-6" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {loading && messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-900 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-green-900" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{msg.userName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm">
                    <p className="text-gray-800">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Feedback Form - Shows instead of message input when active */}
        {showFeedbackForm ? (
          <div className="p-6 border-t border-gray-200 bg-white rounded-b-3xl">
            <h4 className="text-lg text-gray-900 mb-3">Rate Your Experience</h4>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${star <= feedbackRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                  />
                </button>
              ))}
              <span className="ml-2 text-gray-900">{feedbackRating}.0</span>
            </div>
            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="Share your experience with this driver..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-900 mb-4"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  submitFeedback();
                  setFeedbackComment('');
                  setFeedbackRating(5);
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-900 to-teal-900 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <ThumbsUp className="w-5 h-5" />
                Submit Feedback
              </button>
              <button
                onClick={() => setShowFeedbackForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={sendMessage} className="p-6 border-t border-gray-200 bg-white rounded-b-3xl">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-900"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-6 py-3 bg-gradient-to-r from-green-900 to-teal-900 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}