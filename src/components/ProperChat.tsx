import { useState, useEffect, useRef } from 'react';
import { X, Send, Circle, Image, Smile, Paperclip } from 'lucide-react';
import { globalState } from '../utils/globalState';
import { TravelBuddy } from '../data/properTravelBuddies';

interface ProperChatProps {
  buddy: TravelBuddy;
  onClose: () => void;
}

export function ProperChat({ buddy, onClose }: ProperChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = globalState.getCurrentUser();

  useEffect(() => {
    loadMessages();
    // Refresh messages every 2 seconds
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [buddy.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = () => {
    const chatMessages = globalState.getChatMessages(buddy.id);
    setMessages(chatMessages);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageId = `msg-${Date.now()}`;
    globalState.addMessage({
      id: messageId,
      senderId: currentUser?.id || 'guest',
      receiverId: buddy.id,
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    });

    setNewMessage('');
    loadMessages();

    // Simulate buddy response after 2 seconds
    setTimeout(() => {
      const responses = [
        "That sounds amazing! I'm so excited to explore together! 😊",
        "Great idea! I've been researching some cool spots we could visit 🗺️",
        "Perfect! Let me know your schedule and we can plan accordingly 📅",
        "Have you tried the local cuisine there? I heard it's fantastic! 🍜",
        "I'm totally up for that! This is going to be an awesome trip 🎉",
        "Absolutely! I love trying new experiences. What interests you most? 🌟",
        "That works for me! Should we split the costs or how do you prefer? 💰",
        "I've read some great reviews about that place! Can't wait 📸",
        "Yes! I'm a morning person, so early starts work well for me ☀️",
        "Sounds good! I'll share some itinerary ideas I've been working on 📝",
        "I'm flexible with timing. What works best for you? ⏰",
        "Totally agree! Local experiences are always the best part of traveling 🌍",
        "I'm bringing my camera - we can capture some amazing memories! 📷",
        "That's exactly what I was thinking! Great minds think alike 🤝",
        "Perfect! I'll check the weather forecast and pack accordingly 🌤️",
        "I'm so glad we matched! This trip is going to be incredible 🚀",
        "Count me in! Adventure awaits us 🏔️",
        "Wonderful! Let's make this trip unforgettable 🌈",
        "I completely agree! Safety first, fun always 🛡️",
        "That's a brilliant suggestion! Let's do it 💡"
      ];
      
      globalState.addMessage({
        id: `msg-${Date.now()}`,
        senderId: buddy.id,
        receiverId: currentUser?.id || 'guest',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        read: false
      });
      
      loadMessages();
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds for natural feel
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[600px] flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={buddy.avatar} alt={buddy.name} className="w-12 h-12 rounded-full border-2 border-white" />
              <Circle 
                className={`absolute bottom-0 right-0 w-3 h-3 fill-current ${
                  buddy.isOnline ? 'text-green-400' : 'text-gray-400'
                } border-2 border-white rounded-full`} 
              />
            </div>
            <div>
              <h3 className="font-bold">{buddy.name}</h3>
              <div className="flex items-center gap-2 text-xs text-blue-200">
                <span>{buddy.isOnline ? 'Online' : 'Offline'}</span>
                <span>•</span>
                <span>{buddy.destination}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Buddy Info Banner */}
        <div className="bg-blue-50 p-3 border-b border-blue-100">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>📅 {buddy.travelDates}</span>
            <span>•</span>
            <span>💰 {buddy.budget}</span>
            <span>•</span>
            <span>🎯 {buddy.travelStyle}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-blue-900" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation with {buddy.name}!</p>
            </div>
          ) : (
            <>
              {messages.map((msg: any) => {
                const isMine = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMine && (
                      <img 
                        src={buddy.avatar} 
                        alt={buddy.name}
                        className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                      />
                    )}
                    <div
                      className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
                        isMine
                          ? 'bg-blue-900 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      <p className="break-words">{msg.message}</p>
                      <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {isMine && (
                      <img 
                        src={currentUser?.avatar || 'https://randomuser.me/api/portraits/women/1.jpg'} 
                        alt="You"
                        className="w-8 h-8 rounded-full ml-2 flex-shrink-0"
                      />
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Quick Replies */}
        {messages.length === 0 && (
          <div className="px-4 py-2 border-t bg-white">
            <p className="text-xs text-gray-600 mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              {[
                '👋 Hi there!',
                '🗺️ Want to plan together?',
                '📸 Share travel tips?',
                '🍽️ Let\'s try local food!'
              ].map((quick) => (
                <button
                  key={quick}
                  onClick={() => setNewMessage(quick)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                >
                  {quick}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}