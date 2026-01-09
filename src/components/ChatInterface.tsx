import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, ArrowLeft, Phone, Video, MapPin, Clock, Check, CheckCheck, User } from 'lucide-react';
import { ChatManager, ChatConversation, ChatMessage, DatabaseManager } from '../utils/database-manager';

interface ChatInterfaceProps {
  onClose: () => void;
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current user
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      
      // Initialize dummy chats if needed
      ChatManager.initializeDummyChats(user.email, user.name || user.email);
      
      // Load conversations
      loadConversations(user.email);
    }
  }, []);

  useEffect(() => {
    if (selectedConversation && currentUser) {
      loadMessages(selectedConversation.id);
      ChatManager.markAsRead(selectedConversation.id, currentUser.email);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = (userId: string) => {
    const convs = ChatManager.getUserConversations(userId);
    setConversations(convs);
  };

  const loadMessages = (conversationId: string) => {
    const msgs = ChatManager.getMessages(conversationId);
    setMessages(msgs);
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !selectedConversation || !currentUser) return;

    const otherParticipant = selectedConversation.participants.find(p => p !== currentUser.email);
    if (!otherParticipant) return;

    ChatManager.sendMessage(
      selectedConversation.id,
      currentUser.email,
      currentUser.name || currentUser.email,
      otherParticipant,
      inputMessage.trim()
    );

    setInputMessage('');
    loadMessages(selectedConversation.id);
    loadConversations(currentUser.email);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getOtherParticipantName = (conv: ChatConversation) => {
    const otherParticipant = conv.participants.find(p => p !== currentUser?.email);
    return otherParticipant ? conv.participantNames[otherParticipant] : 'Unknown';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getConversationIcon = (type: string) => {
    switch (type) {
      case 'buddy':
        return '👥';
      case 'carpool':
        return '🚗';
      case 'provider':
        return '🏨';
      default:
        return '💬';
    }
  };

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Please login to access chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white">
      {/* Conversations List */}
      {!selectedConversation && (
        <div className="w-full flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl">Messages</h2>
                <p className="text-blue-200 text-sm">{conversations.length} conversations</p>
              </div>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No messages yet</p>
                <p className="text-sm text-gray-400">Connect with travel buddies and drivers!</p>
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                        {getConversationIcon(conv.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-gray-900 truncate">{getOtherParticipantName(conv)}</h3>
                          <span className="text-xs text-gray-500">{formatTime(conv.lastMessageTime)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                          {conv.unreadCount[currentUser.email] > 0 && (
                            <span className="ml-2 bg-blue-900 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                              {conv.unreadCount[currentUser.email]}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                          conv.type === 'buddy' ? 'bg-green-100 text-green-800' :
                          conv.type === 'carpool' ? 'bg-orange-100 text-orange-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {conv.type === 'buddy' ? 'Travel Buddy' : conv.type === 'carpool' ? 'Carpool' : 'Provider'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat View */}
      {selectedConversation && (
        <div className="w-full flex flex-col h-full">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedConversation(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                  {getConversationIcon(selectedConversation.type)}
                </div>
                <div>
                  <h3 className="font-medium">{getOtherParticipantName(selectedConversation)}</h3>
                  <p className="text-xs text-blue-200">
                    {selectedConversation.type === 'buddy' ? 'Travel Buddy' : 
                     selectedConversation.type === 'carpool' ? 'Carpool Driver' : 'Hotel Provider'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="Voice Call">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="Video Call">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="Share Location">
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No messages yet</p>
                <p className="text-sm text-gray-400">Start the conversation!</p>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === currentUser.email ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-3 shadow-sm ${
                      msg.senderId === currentUser.email
                        ? 'bg-blue-900 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                    }`}
                  >
                    {msg.type === 'location' && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/20">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">Shared Location</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line leading-relaxed">{msg.message}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className={`text-xs ${
                        msg.senderId === currentUser.email ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.senderId === currentUser.email && (
                        msg.read ? <CheckCheck className="w-3 h-3 text-blue-300" /> : <Check className="w-3 h-3 text-blue-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 bg-white border-t border-gray-200">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {selectedConversation.type === 'carpool' && (
                <>
                  <button
                    onClick={() => {
                      setInputMessage("I'll be there on location, please be on time! ⏰");
                    }}
                    className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-full hover:bg-blue-100 transition-colors text-sm whitespace-nowrap border border-blue-200"
                  >
                    ⏰ Be on time
                  </button>
                  <button
                    onClick={() => {
                      setInputMessage("What's the pickup location? 📍");
                    }}
                    className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-full hover:bg-blue-100 transition-colors text-sm whitespace-nowrap border border-blue-200"
                  >
                    📍 Pickup location
                  </button>
                  <button
                    onClick={() => {
                      setInputMessage("Running 10 minutes late 🏃");
                    }}
                    className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-full hover:bg-blue-100 transition-colors text-sm whitespace-nowrap border border-blue-200"
                  >
                    🏃 Running late
                  </button>
                </>
              )}
              {selectedConversation.type === 'buddy' && (
                <>
                  <button
                    onClick={() => {
                      setInputMessage("Looking forward to the trip! 🎉");
                    }}
                    className="px-3 py-1.5 bg-green-50 text-green-900 rounded-full hover:bg-green-100 transition-colors text-sm whitespace-nowrap border border-green-200"
                  >
                    🎉 Excited
                  </button>
                  <button
                    onClick={() => {
                      setInputMessage("What time should we meet? ⏰");
                    }}
                    className="px-3 py-1.5 bg-green-50 text-green-900 rounded-full hover:bg-green-100 transition-colors text-sm whitespace-nowrap border border-green-200"
                  >
                    ⏰ Meeting time
                  </button>
                  <button
                    onClick={() => {
                      setInputMessage("Shall we plan the itinerary together? 🗺️");
                    }}
                    className="px-3 py-1.5 bg-green-50 text-green-900 rounded-full hover:bg-green-100 transition-colors text-sm whitespace-nowrap border border-green-200"
                  >
                    🗺️ Plan together
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const otherParticipant = selectedConversation.participants.find(p => p !== currentUser.email);
                  if (otherParticipant) {
                    ChatManager.sendMessage(
                      selectedConversation.id,
                      currentUser.email,
                      currentUser.name || currentUser.email,
                      otherParticipant,
                      '📍 Shared live location',
                      'location'
                    );
                    loadMessages(selectedConversation.id);
                  }
                }}
                className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                title="Share Location"
              >
                <MapPin className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
