import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Phone, Video, MoreVertical, Image as ImageIcon, MapPin, Calendar, X, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'location' | 'itinerary';
  attachments?: string[];
}

interface ChatProps {
  buddy: {
    id: string;
    name: string;
    avatar: string;
    destination: string;
    travelDates: string;
    isOnline: boolean;
    lastSeen?: Date;
  };
  onClose: () => void;
}

export function TravelBuddyChat({ buddy, onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with some demo messages
  useEffect(() => {
    const demoMessages: Message[] = [
      {
        id: '1',
        senderId: buddy.id,
        senderName: buddy.name,
        text: `Hey! Excited to travel to ${buddy.destination} together!`,
        timestamp: new Date(Date.now() - 3600000),
        status: 'read',
        type: 'text'
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'You',
        text: 'Me too! Have you booked your hotel yet?',
        timestamp: new Date(Date.now() - 3000000),
        status: 'read',
        type: 'text'
      },
      {
        id: '3',
        senderId: buddy.id,
        senderName: buddy.name,
        text: "Not yet, looking at options around ₹2000/night. Any suggestions?",
        timestamp: new Date(Date.now() - 2400000),
        status: 'read',
        type: 'text'
      }
    ];
    setMessages(demoMessages);
  }, [buddy]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      text: newMessage,
      timestamp: new Date(),
      status: 'sent',
      type: 'text'
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 500);

    // Simulate buddy typing and response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: Message = {
          id: (Date.now() + 1).toString(),
          senderId: buddy.id,
          senderName: buddy.name,
          text: getSmartResponse(newMessage),
          timestamp: new Date(),
          status: 'sent',
          type: 'text'
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }, 1000);
  };

  const getSmartResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    if (lower.includes('hotel') || lower.includes('stay')) {
      return "I'm looking at some options near the beach. Want to share a room to split costs?";
    } else if (lower.includes('itinerary') || lower.includes('plan')) {
      return "I was thinking we could visit the main attractions on Day 1 and relax on Day 2. Thoughts?";
    } else if (lower.includes('food') || lower.includes('eat')) {
      return "I'm a foodie! Let's definitely try the local cuisine. Any dietary restrictions?";
    } else if (lower.includes('budget') || lower.includes('cost')) {
      return "I'm budgeting around ₹15,000 for 3 days including stay, food, and activities.";
    } else if (lower.includes('time') || lower.includes('when')) {
      return "I'm planning to reach by 10 AM. We can meet at the hotel?";
    } else {
      return "Sounds good! Let me know if you need any help with planning.";
    }
  };

  const handleShareLocation = () => {
    const locationMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      text: 'Shared my current location',
      timestamp: new Date(),
      status: 'sent',
      type: 'location'
    };
    setMessages([...messages, locationMessage]);
  };

  const handleShareItinerary = () => {
    const itineraryMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      text: `Shared itinerary for ${buddy.destination}`,
      timestamp: new Date(),
      status: 'sent',
      type: 'itinerary'
    };
    setMessages([...messages, itineraryMessage]);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-blue-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={buddy.avatar} 
                alt={buddy.name}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              {buddy.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-900" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{buddy.name}</h3>
              <p className="text-sm text-blue-200">
                {buddy.isOnline ? 'Online' : `Last seen ${buddy.lastSeen ? formatTime(buddy.lastSeen) : 'recently'}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-blue-800 rounded-lg transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-blue-800 rounded-lg transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-blue-800 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trip Info Banner */}
        <div className="bg-blue-50 border-b border-blue-200 p-3 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-900" />
            <span className="text-gray-900">{buddy.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-900" />
            <span className="text-gray-900">{buddy.travelDates}</span>
          </div>
          <button 
            onClick={handleShareItinerary}
            className="ml-auto bg-blue-900 text-white px-4 py-1 rounded-lg hover:bg-blue-950 transition-colors text-xs"
          >
            Share Itinerary
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => {
            const showDate = index === 0 || 
              formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
            const isMe = message.senderId === 'me';

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-600 shadow-sm">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                    {!isMe && (
                      <p className="text-xs text-gray-600 mb-1 ml-2">{message.senderName}</p>
                    )}
                    
                    {message.type === 'text' && (
                      <div className={`rounded-2xl px-4 py-2 ${
                        isMe 
                          ? 'bg-blue-900 text-white rounded-br-none' 
                          : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                      }`}>
                        <p>{message.text}</p>
                      </div>
                    )}

                    {message.type === 'location' && (
                      <div className={`rounded-2xl overflow-hidden ${
                        isMe ? 'rounded-br-none' : 'rounded-bl-none'
                      }`}>
                        <div className="bg-white p-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-semibold">Live Location</span>
                          </div>
                          <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                            <p className="text-gray-600 text-sm">Map View</p>
                          </div>
                          <button className="w-full mt-2 bg-blue-900 text-white py-2 rounded-lg text-sm">
                            View on Maps
                          </button>
                        </div>
                      </div>
                    )}

                    {message.type === 'itinerary' && (
                      <div className={`rounded-2xl overflow-hidden ${
                        isMe ? 'rounded-br-none' : 'rounded-bl-none'
                      }`}>
                        <div className="bg-white p-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-blue-900" />
                            <span className="text-sm font-semibold">Trip Itinerary</span>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-900 mb-1">{buddy.destination} - 3 Days</p>
                            <p className="text-xs text-gray-600">Day 1: Beach & Water Sports</p>
                            <p className="text-xs text-gray-600">Day 2: Local Sightseeing</p>
                            <p className="text-xs text-gray-600">Day 3: Shopping & Departure</p>
                          </div>
                          <button className="w-full mt-2 bg-blue-900 text-white py-2 rounded-lg text-sm">
                            View Full Itinerary
                          </button>
                        </div>
                      </div>
                    )}

                    <div className={`flex items-center gap-2 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      {isMe && (
                        <span>
                          {message.status === 'sent' && <Check className="w-3 h-3 text-gray-500" />}
                          {message.status === 'delivered' && <CheckCheck className="w-3 h-3 text-gray-500" />}
                          {message.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 p-2 flex gap-2 overflow-x-auto">
          <button 
            onClick={handleShareLocation}
            className="px-3 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm hover:bg-blue-100 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Share Location
          </button>
          <button className="px-3 py-2 bg-green-50 text-green-900 rounded-lg text-sm hover:bg-green-100 transition-colors whitespace-nowrap">
            Split Bill
          </button>
          <button className="px-3 py-2 bg-purple-50 text-purple-900 rounded-lg text-sm hover:bg-purple-100 transition-colors whitespace-nowrap">
            Book Together
          </button>
          <button className="px-3 py-2 bg-orange-50 text-orange-900 rounded-lg text-sm hover:bg-orange-100 transition-colors whitespace-nowrap">
            Share Photos
          </button>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
            />
            <button 
              onClick={handleFileUpload}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none outline-none resize-none max-h-32"
                rows={1}
              />
              <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-lg transition-all ${
                newMessage.trim()
                  ? 'bg-blue-900 text-white hover:bg-blue-950'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
