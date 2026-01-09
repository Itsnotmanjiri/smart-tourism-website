import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MoreVertical, Star, Ban } from 'lucide-react';
import { TravelBuddy } from '../data/massiveProperBuddies';
import { addNotification } from './InAppNotifications';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

interface EnhancedTravelBuddyChatProps {
  buddy: TravelBuddy;
  onClose: () => void;
  onEndChat?: () => void;
}

export function EnhancedTravelBuddyChat({ buddy, onClose, onEndChat }: EnhancedTravelBuddyChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'current-user';

  useEffect(() => {
    // Load chat history from localStorage
    const chatKey = `chat-${buddy.id}`;
    const savedChat = localStorage.getItem(chatKey);
    
    if (savedChat) {
      const parsed = JSON.parse(savedChat);
      setMessages(parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    } else {
      // Initialize with a welcome message
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: buddy.id,
        text: `Hi! I'm ${buddy.name}. Looking forward to traveling together! 😊`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem(chatKey, JSON.stringify([welcomeMessage]));
    }
  }, [buddy.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      text: newMessage.trim(),
      timestamp: new Date()
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setNewMessage('');

    // Save to localStorage
    const chatKey = `chat-${buddy.id}`;
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));

    // Simulate buddy response after a delay
    setTimeout(() => {
      const responses = [
        "That sounds great! 👍",
        "I agree! When are you planning to go?",
        "Perfect! I'm looking forward to it.",
        "Awesome! Let me know the details.",
        "That works for me! 🎉",
        "Sounds like a plan!",
        "Great idea! Count me in.",
        "I'm excited about this trip! ✈️"
      ];
      
      const response: Message = {
        id: `msg-${Date.now()}`,
        senderId: buddy.id,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      const newMessages = [...updatedMessages, response];
      setMessages(newMessages);
      localStorage.setItem(chatKey, JSON.stringify(newMessages));
    }, 1000 + Math.random() * 2000);
  };

  const handleEndChat = () => {
    setShowEndChatModal(false);
    setShowReviewModal(true);
  };

  const handleSubmitReview = (rating: number, comment: string) => {
    // Save review to buddy's profile
    const reviewsKey = `buddy-reviews-${buddy.id}`;
    const existingReviews = JSON.parse(localStorage.getItem(reviewsKey) || '[]');
    
    const newReview = {
      id: `review-${Date.now()}`,
      rating,
      comment,
      date: new Date().toISOString(),
      reviewerName: JSON.parse(localStorage.getItem('userData') || '{}').name || 'Anonymous'
    };
    
    existingReviews.push(newReview);
    localStorage.setItem(reviewsKey, JSON.stringify(existingReviews));

    // Update buddy's average rating
    const avgRating = existingReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / existingReviews.length;
    
    addNotification({
      type: 'success',
      title: 'Review Submitted',
      message: `Your review for ${buddy.name} has been submitted successfully!`
    });

    setShowReviewModal(false);
    
    if (onEndChat) {
      onEndChat();
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                {buddy.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold">{buddy.name}</h3>
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <span>{buddy.destination}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{buddy.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl py-2 w-48 z-10">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowEndChatModal(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <Ban className="w-4 h-4" />
                      End Chat & Review
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.senderId === currentUserId
                        ? 'bg-blue-900 text-white rounded-br-sm'
                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === currentUserId ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* End Chat Confirmation Modal */}
      {showEndChatModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">End Chat?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to end this chat? You'll be able to leave a review for {buddy.name}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndChatModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEndChat}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                End Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          buddyName={buddy.name}
          onSubmit={handleSubmitReview}
          onClose={() => {
            setShowReviewModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}

interface ReviewModalProps {
  buddyName: string;
  onSubmit: (rating: number, comment: string) => void;
  onClose: () => void;
}

function ReviewModal({ buddyName, onSubmit, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmit(rating, comment);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Rate Your Experience with {buddyName}
        </h3>
        
        {/* Star Rating */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">How was your experience?</p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share your feedback (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
