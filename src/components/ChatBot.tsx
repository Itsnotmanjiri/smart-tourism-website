import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, AlertCircle, Settings, Key } from 'lucide-react';
import { chatbotQuery } from '../utils/supabase-api';
import { searchGoogle, formatSearchForChat } from '../utils/google-search-api';
import { getRelevantKnowledge } from '../utils/chatbot-knowledge-base';
import MEGA_KNOWLEDGE_BASE, { searchMegaKnowledge } from '../utils/mega-chatbot-knowledge';
import EXTENDED_KNOWLEDGE from '../utils/mega-knowledge-extended';
import { getHotelsByCity, getCityInfo } from '../utils/complete-city-database';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  onClose: () => void;
}

export function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Namaste! 🙏 I'm your AI travel assistant. I can help you with destinations, hotels, carpools, travel buddies, and emergency services. All prices are in Indian Rupees (₹). How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load API key on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('chatbotApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const saveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('chatbotApiKey', apiKeyInput.trim());
      setApiKey(apiKeyInput.trim());
      setApiKeyInput('');
      setShowApiSetup(false);
    }
  };

  const removeApiKey = () => {
    localStorage.removeItem('chatbotApiKey');
    setApiKey(null);
    setShowApiSetup(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    // Get bot response
    setTimeout(async () => {
      try {
        // PRIORITY 1: Check MEGA knowledge base first (100+ sections)
        const megaKnowledgeResponse = searchMegaKnowledge(userInput);
        if (megaKnowledgeResponse) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: megaKnowledgeResponse,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
          return;
        }

        // PRIORITY 2: Check extended knowledge (50+ more sections)
        for (const [key, section] of Object.entries(EXTENDED_KNOWLEDGE)) {
          if (section.keywords && section.keywords.some(kw => userInput.toLowerCase().includes(kw))) {
            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: `${section.title}\n\n${section.content}`,
              sender: 'bot',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
            return;
          }
        }
        
        // PRIORITY 3: Check for original knowledge base (hotels, destinations, general info)
        const knowledgeResponse = getRelevantKnowledge(userInput);
        if (knowledgeResponse) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: knowledgeResponse,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
          return;
        }
        
        // PRIORITY 3.5: Check for hotel queries in city database
        if (userInput.toLowerCase().match(/hotel.*in|hotels.*in|stay.*in|accommodation.*in/)) {
          const cityMatch = userInput.match(/(?:hotel|hotels|stay|accommodation).*?(?:in|at|near)\s+(\w+)/i);
          if (cityMatch) {
            const cityName = cityMatch[1];
            const hotelResponse = getHotelsByCity(cityName);
            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: hotelResponse,
              sender: 'bot',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
            return;
          }
        }

        // PRIORITY 4: Check for local handlers (currency, trip plans, etc.)
        const currencyResponse = handleCurrencyConversion(userInput);
        if (currencyResponse) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: currencyResponse,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
          return;
        }

        const tripPlanResponse = generateTripPlan(userInput);
        if (tripPlanResponse) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: tripPlanResponse,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
          return;
        }

        // PRIORITY 5: Try to get answer from Google/Wikipedia API
        try {
          const searchResponse = await searchGoogle(userInput);
          if (searchResponse.success) {
            const formattedResponse = formatSearchForChat(searchResponse);
            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: formattedResponse,
              sender: 'bot',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
            return;
          }
        } catch (searchError) {
          console.log('Search API failed, trying fallback');
        }

        // PRIORITY 6: Fallback to Supabase chatbot
        const storedUserData = localStorage.getItem('userData');
        const userId = storedUserData ? JSON.parse(storedUserData).email : 'guest';
        
        const result = await chatbotQuery(userInput, userId, messages);
        
        if (result.success) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: result.data.response,
            sender: 'bot',
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, botMessage]);
        } else {
          throw new Error('Failed to get response');
        }
      } catch (error) {
        console.error('Chatbot error:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I'm having trouble finding information. Try searching on Google:\n\n🔍 https://www.google.com/search?q=${encodeURIComponent(userInput)}\n\nOr ask me about:\n• Hotel bookings 🏨\n• Trip planning 🗺️\n• Travel buddies 👥\n• Carpool rides 🚗\n• Currency conversion 💱`,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickSuggestions = [
    'Best hotels in Mumbai',
    'Plan 3-day Goa trip',
    'Find travel buddy Delhi',
    'Book carpool to Jaipur',
    'Emergency contacts',
    'Convert 100 USD to INR',
    'Weather in Kerala',
    'Top attractions Udaipur',
    'Budget trip to Rishikesh',
    'Hotels near Taj Mahal'
  ];

  return (
    <div className="bg-white rounded-xl shadow-2xl w-96 h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="flex items-center gap-2">
              AI Travel Assistant
              <span className={`w-2 h-2 rounded-full animate-pulse ${apiKey ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
            </h3>
            <p className="text-blue-100 text-xs">{apiKey ? 'ChatGPT Powered' : 'Smart Fallback Mode'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiSetup(!showApiSetup)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            aria-label="API Settings"
            title={apiKey ? 'API Connected' : 'Setup ChatGPT API'}
          >
            {apiKey ? <Key className="w-5 h-5 text-green-300" /> : <Settings className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* API Setup Panel */}
      {showApiSetup && (
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="flex items-start gap-2 mb-3">
            <Key className="w-5 h-5 text-blue-900 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-blue-900 mb-1">ChatGPT API Setup</h4>
              <p className="text-xs text-blue-700 mb-3">
                {apiKey 
                  ? '✅ API key connected. Remove to use fallback mode.' 
                  : 'Enter your OpenAI API key to enable ChatGPT-powered responses.'}
              </p>
              
              {!apiKey ? (
                <div className="space-y-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveApiKey}
                      className="flex-1 bg-blue-900 text-white px-3 py-2 rounded-lg hover:bg-blue-950 transition-colors text-sm"
                    >
                      Save API Key
                    </button>
                    <button
                      onClick={() => setShowApiSetup(false)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs text-blue-600">
                    Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com</a>
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1 bg-white px-3 py-2 rounded-lg text-sm text-gray-600 border border-blue-200">
                    API Key: sk-••••••••
                  </div>
                  <button
                    onClick={removeApiKey}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 shadow-sm ${
                message.sender === 'user'
                  ? 'bg-blue-900 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-bl-none p-4 shadow-sm border border-gray-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="px-4 pb-3 pt-2 bg-white border-t">
        <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-full hover:bg-blue-100 transition-colors border border-blue-200 text-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-xl">
        <form onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Function to handle currency conversion
function handleCurrencyConversion(userMessage: string): string | null {
  const lowerMessage = userMessage.toLowerCase();
  
  // Current exchange rates (approximate, as of Dec 2024)
  const exchangeRates: Record<string, { rate: number; symbol: string; name: string }> = {
    usd: { rate: 83.50, symbol: '$', name: 'US Dollar' },
    dollar: { rate: 83.50, symbol: '$', name: 'US Dollar' },
    eur: { rate: 90.20, symbol: '€', name: 'Euro' },
    euro: { rate: 90.20, symbol: '€', name: 'Euro' },
    gbp: { rate: 105.75, symbol: '£', name: 'British Pound' },
    pound: { rate: 105.75, symbol: '£', name: 'British Pound' },
    aud: { rate: 54.30, symbol: 'A$', name: 'Australian Dollar' },
    cad: { rate: 61.40, symbol: 'C$', name: 'Canadian Dollar' },
    jpy: { rate: 0.56, symbol: '¥', name: 'Japanese Yen' },
    yen: { rate: 0.56, symbol: '¥', name: 'Japanese Yen' },
    aed: { rate: 22.75, symbol: 'AED', name: 'UAE Dirham' },
    sgd: { rate: 62.15, symbol: 'S$', name: 'Singapore Dollar' },
    chf: { rate: 95.40, symbol: 'CHF', name: 'Swiss Franc' },
    inr: { rate: 1, symbol: '₹', name: 'Indian Rupee' },
    rupee: { rate: 1, symbol: '₹', name: 'Indian Rupee' },
    rupees: { rate: 1, symbol: '₹', name: 'Indian Rupee' }
  };
  
  // Pattern 1: "convert 100 USD to INR" or "100 USD to INR"
  let match = lowerMessage.match(/(\d+\.?\d*)\s*(usd|eur|gbp|dollar|euro|pound|aud|cad|jpy|yen|aed|sgd|chf|inr|rupee|rupees)\s*(?:to|in)?\s*(usd|eur|gbp|dollar|euro|pound|aud|cad|jpy|yen|aed|sgd|chf|inr|rupee|rupees)?/);
  
  // Pattern 2: "how much is 100 USD" or "what is 50 dollars in rupees"
  if (!match) {
    match = lowerMessage.match(/(?:how much|what|price|value).*?(\d+\.?\d*)\s*(usd|eur|gbp|dollar|euro|pound|aud|cad|jpy|yen|aed|sgd|chf|inr|rupee|rupees)/);
  }
  
  if (!match) {
    // If currency keywords are present but no clear pattern, show converter info
    if (lowerMessage.match(/\b(currency|convert|exchange|rate)\b/)) {
      return `💱 **CURRENCY CONVERTER**\n\nI can help you convert between currencies!\n\n📊 **Supported Currencies:**\n• USD ($) - US Dollar\n• EUR (€) - Euro\n• GBP (£) - British Pound\n• AUD (A$) - Australian Dollar\n• CAD (C$) - Canadian Dollar\n• JPY (¥) - Japanese Yen\n• AED - UAE Dirham\n• SGD (S$) - Singapore Dollar\n• CHF - Swiss Franc\n• INR (₹) - Indian Rupee\n\n💡 **Examples:**\n• "Convert 100 USD to INR"\n• "How much is 50 euros in rupees?"\n• "500 dollars"\n• "What is 1000 AED in INR?"\n\n📌 **Current Rates (1 = INR):**\n• $1 USD = ₹83.50\n• €1 EUR = ₹90.20\n• £1 GBP = ₹105.75\n• A$1 AUD = ₹54.30\n• C$1 CAD = ₹61.40\n\nTry asking: "Convert 500 USD to INR"`;
    }
    return null;
  }
  
  const amount = parseFloat(match[1]);
  const fromCurrencyKey = match[2];
  const toCurrencyKey = match[3] || 'inr'; // Default to INR if no target specified
  
  const fromCurrency = exchangeRates[fromCurrencyKey];
  const toCurrency = exchangeRates[toCurrencyKey];
  
  if (!fromCurrency || !toCurrency) return null;
  
  // Convert: amount in fromCurrency -> INR -> toCurrency
  const amountInINR = amount * fromCurrency.rate;
  const convertedAmount = amountInINR / toCurrency.rate;
  
  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  };
  
  // Build response
  let response = `💱 **CURRENCY CONVERSION**\n\n`;
  response += `${fromCurrency.symbol}${formatNumber(amount)} ${fromCurrency.name}\n`;
  response += `= ${toCurrency.symbol}${formatNumber(convertedAmount)} ${toCurrency.name}\n\n`;
  
  // Add breakdown if converting through INR
  if (fromCurrencyKey !== 'inr' && toCurrencyKey !== 'inr') {
    response += `📊 **Breakdown:**\n`;
    response += `• ${fromCurrency.symbol}${formatNumber(amount)} = ₹${formatNumber(amountInINR)}\n`;
    response += `• ₹${formatNumber(amountInINR)} = ${toCurrency.symbol}${formatNumber(convertedAmount)}\n\n`;
  }
  
  // Add current rate
  const directRate = fromCurrency.rate / toCurrency.rate;
  response += `📈 **Exchange Rate:**\n`;
  response += `1 ${fromCurrency.name} = ${formatNumber(directRate)} ${toCurrency.name}\n\n`;
  
  // Add practical examples for INR conversions
  if (toCurrencyKey === 'inr' || toCurrencyKey === 'rupee' || toCurrencyKey === 'rupees') {
    response += `💡 **Travel Budget Guide:**\n`;
    const budgetHotel = convertedAmount >= 600 && convertedAmount <= 1500;
    const midRangeHotel = convertedAmount > 1500 && convertedAmount <= 4000;
    const luxuryHotel = convertedAmount > 4000;
    
    if (budgetHotel) {
      response += `• Perfect for 1 night at a budget hotel\n`;
    } else if (midRangeHotel) {
      response += `• Good for 1-2 nights at a mid-range hotel\n`;
    } else if (luxuryHotel) {
      response += `• Enough for luxury accommodation\n`;
    }
    
    if (convertedAmount >= 200 && convertedAmount < 1000) {
      response += `• Can enjoy ${Math.floor(convertedAmount / 200)} good meals\n`;
    }
    
    if (convertedAmount >= 2000) {
      response += `• Covers about ${Math.floor(convertedAmount / 2500)} days backpacking\n`;
    }
  }
  
  response += `\n💬 **Need more conversions?** Just ask!`;
  
  return response;
}

// Function to generate a trip plan based on user input
function generateTripPlan(userMessage: string): string | null {
  const lowerMessage = userMessage.toLowerCase();
  
  // Extract duration if mentioned
  const durationMatch = lowerMessage.match(/(\d+)\s*(day|days|night|nights)/);
  const days = durationMatch ? parseInt(durationMatch[1]) : 3;
  
  // Comprehensive trip plans for all major Indian destinations
  const tripPlans: Record<string, any> = {
    delhi: {
      name: "Delhi",
      icon: "🏛️",
      itinerary: {
        1: "• Morning: Red Fort & Jama Masjid (8:00-11:00)\n• Lunch: Paranthe Wali Gali, Chandni Chowk (₹200)\n• Afternoon: Raj Ghat & India Gate (2:00-5:00)\n• Evening: Connaught Place shopping (5:30-8:00)\n• Dinner: Karim's for Mughlai cuisine (₹500)",
        2: "• Morning: Qutub Minar & Mehrauli Archaeological Park (8:00-11:00)\n• Lunch: Saravana Bhavan for South Indian (₹300)\n• Afternoon: Humayun's Tomb & Lotus Temple (2:00-5:00)\n• Evening: Dilli Haat for handicrafts (6:00-9:00)\n• Dinner: Indian Accent fine dining (₹2,500)",
        3: "• Morning: Akshardham Temple (9:00-12:00)\n• Lunch: Rajinder Da Dhaba (₹400)\n• Afternoon: National Museum & Jantar Mantar (2:00-5:00)\n• Evening: Khan Market for cafes & books (5:30-8:00)\n• Dinner: Bukhara at ITC Maurya (₹3,000)"
      },
      hotels: "₹800-2,500/night (Connaught Place, Karol Bagh, Paharganj)",
      transport: "Metro: ₹10-60/trip, Auto: ₹50-150, Ola/Uber available",
      budget: "₹2,000-4,000/day (backpacker), ₹5,000-8,000/day (mid-range)",
      tips: "• Book Red Fort tickets online\n• Use Delhi Metro to avoid traffic\n• Try street food at Chandni Chowk\n• Visit monuments early morning\n• Carry water bottle & sunscreen"
    },
    
    goa: {
      name: "Goa",
      icon: "🏖️",
      itinerary: {
        1: "• Morning: Calangute Beach & water sports (7:00-11:00)\n• Lunch: Beach shacks - try Goan Fish Curry (₹400)\n• Afternoon: Fort Aguada & Sinquerim Beach (2:00-5:00)\n• Evening: Baga Beach sunset & nightlife (6:00-11:00)\n• Dinner: Tito's Beach Club (₹1,000)",
        2: "• Morning: Old Goa Churches - Basilica of Bom Jesus (8:00-11:00)\n• Lunch: Vinayak Family Restaurant (₹350)\n• Afternoon: Dudhsagar Falls trek (2:00-6:00)\n• Evening: Palolem Beach in South Goa (7:00-9:00)\n• Dinner: Sunset at Agonda Beach (₹600)",
        3: "• Morning: Spice plantation tour (8:00-12:00)\n• Lunch: Plantation lunch included (₹500)\n• Afternoon: Dolphin watching cruise (2:00-4:00)\n• Evening: Anjuna Flea Market shopping (5:00-8:00)\n• Night: Saturday Night Market (₹300)"
      },
      hotels: "₹1,500-5,000/night (North Goa hotels, South Goa resorts)",
      transport: "Scooter rental: ₹300-500/day, Taxi: ₹15/km",
      budget: "₹3,000-5,000/day (backpacker), ₹8,000-15,000/day (mid-range)",
      tips: "• Rent a scooter for freedom\n• North Goa = Party, South Goa = Peace\n• Try Bebinca (Goan dessert)\n• Book houseboats in advance\n• Carry cash for beach shacks"
    },
    
    mumbai: {
      name: "Mumbai",
      icon: "🌆",
      itinerary: {
        1: "• Morning: Gateway of India & Taj Hotel (7:00-9:00)\n• Ferry: Elephanta Caves (9:30-2:00) - ₹200\n• Lunch: Leopold Cafe, Colaba (₹500)\n• Evening: Marine Drive sunset walk (5:00-7:00)\n• Dinner: Bademiya kebabs at Colaba (₹400)",
        2: "• Morning: Chhatrapati Shivaji Terminus & Crawford Market (8:00-11:00)\n• Lunch: Britannia & Co for Berry Pulav (₹450)\n• Afternoon: Dharavi tour & local train experience (2:00-5:00)\n• Evening: Juhu Beach & street food (6:00-8:00)\n• Dinner: Pav Bhaji at Sardar (₹150)",
        3: "• Morning: Sanjay Gandhi National Park & Kanheri Caves (7:00-12:00)\n• Lunch: Cafe Madras for South Indian (₹300)\n• Afternoon: Film City tour (optional) (2:00-5:00)\n• Evening: Bandra-Worli Sea Link & Bandstand (6:00-8:00)\n• Dinner: Khau Galli street food tour (₹300)"
      },
      hotels: "₹1,200-4,000/night (Colaba, Andheri, Bandra)",
      transport: "Local train: ₹10-30, Uber/Ola: ₹100-500",
      budget: "₹2,500-4,500/day (backpacker), ₹6,000-12,000/day (mid-range)",
      tips: "• Use local trains during non-rush hours\n• Try Vada Pav everywhere!\n• Book Elephanta ferry early\n• Avoid peak traffic 9-11am, 6-9pm\n• Street food is safe at busy stalls"
    },
    
    kerala: {
      name: "Kerala",
      icon: "🌴",
      itinerary: {
        1: "• Morning: Alleppey Houseboat check-in (10:00)\n• Cruise: Backwaters exploration with meals included\n• Lunch: Traditional Kerala Sadya on boat (₹800)\n• Afternoon: Village visits & coir-making demos (2:00-5:00)\n• Evening: Sunset on backwaters (6:00-7:00)\n• Dinner: Fresh fish curry on houseboat (included)",
        2: "• Morning: Check-out & drive to Munnar (8:00-12:00)\n• Lunch: Local restaurant (₹300)\n• Afternoon: Tea plantation tour & tasting (2:00-5:00)\n• Evening: Mattupetty Dam & Echo Point (5:30-7:00)\n• Dinner: Hotel in Munnar (₹400)",
        3: "• Morning: Eravikulam National Park - Nilgiri Tahr (7:00-11:00)\n• Lunch: Munnar town (₹350)\n• Afternoon: Tea Museum & shopping (2:00-4:00)\n• Evening: Drive to Thekkady (4:30-7:00)\n• Dinner: Spice village restaurant (₹500)"
      },
      hotels: "Houseboat: ₹4,000-8,000/night, Hotels: ₹800-3,000/night",
      transport: "Taxi: ₹12-15/km, Bus: ₹50-200 between cities",
      budget: "₹4,000-6,000/day (backpacker), ₹10,000-18,000/day (mid-range)",
      tips: "• Book houseboat in advance\n• Best time: Sep-March\n• Try Ayurvedic massage\n• Visit spice gardens\n• Carry light woolens for Munnar"
    },
    
    jaipur: {
      name: "Jaipur",
      icon: "🏰",
      itinerary: {
        1: "• Morning: Amber Fort & elephant ride (7:00-11:00) - ₹300\n• Lunch: Laxmi Misthan Bhandar (₹250)\n• Afternoon: City Palace & Jantar Mantar (2:00-5:00) - ₹500\n• Evening: Hawa Mahal photo stop (5:30-6:30)\n• Dinner: Chokhi Dhani village resort (₹800)",
        2: "• Morning: Nahargarh Fort & sunrise view (6:00-9:00)\n• Lunch: Rawat Mishthan Bhandar for kachori (₹200)\n• Afternoon: Jaigarh Fort & Jal Mahal (2:00-5:00)\n• Evening: Johari Bazaar shopping - jewelry, textiles (6:00-9:00)\n• Dinner: Suvarna Mahal at Rambagh Palace (₹3,000)",
        3: "• Morning: Albert Hall Museum (9:00-11:00) - ₹150\n• Lunch: Tapri Central for rooftop dining (₹400)\n• Afternoon: Block printing workshop & handicraft shopping (2:00-5:00)\n• Evening: Raj Mandir Cinema - Bollywood experience (6:00-9:00)\n• Dinner: Peacock rooftop restaurant (₹800)"
      },
      hotels: "₹1,200-5,000/night (Heritage hotels, C-Scheme area)",
      transport: "Auto: ₹50-200, Uber/Ola: ₹100-400, Day taxi: ₹2,000",
      budget: "₹2,500-4,000/day (backpacker), ₹6,000-10,000/day (mid-range)",
      tips: "• Haggle in markets (30-40% off)\n• Visit forts early morning\n• Try Dal Baati Churma\n• Stay in heritage hotel for experience\n• Carry water in summer"
    },
    
    agra: {
      name: "Agra",
      icon: "💎",
      itinerary: {
        1: "• Early Morning: Taj Mahal sunrise (6:00-9:00) - ₹1,050\n• Breakfast: Joney's Place near Taj (₹200)\n• Late Morning: Agra Fort (10:00-12:30) - ₹650\n• Lunch: Pinch of Spice (₹500)\n• Afternoon: Mehtab Bagh sunset view of Taj (4:00-6:00) - ₹200\n• Evening: Shopping at Sadar Bazaar - marble inlay (6:30-8:00)\n• Dinner: Dasaprakash for South Indian (₹350)",
        2: "• Morning: Fatehpur Sikri day trip (7:00-12:00) - ₹610\n• Lunch: Local restaurant at Fatehpur Sikri (₹300)\n• Afternoon: Itmad-ud-Daulah (Baby Taj) (2:00-4:00) - ₹310\n• Evening: Kinari Bazaar shopping (5:00-7:00)\n• Dinner: Peshawri at ITC Mughal (₹2,500)",
        3: "• Morning: Taj Museum & second Taj visit (7:00-10:00)\n• Late Morning: Petha shopping - famous Agra sweet (10:30-12:00)\n• Lunch: Jhankar for rooftop Taj view (₹600)\n• Afternoon: Leisure/shopping or depart\n• Pro tip: Consider same-day Delhi return"
      },
      hotels: "₹600-2,500/night (Taj Ganj, Fatehabad Road)",
      transport: "Auto: ₹30-150, Taxi for Fatehpur: ₹2,000 round trip",
      budget: "₹2,000-3,500/day (backpacker), ₹5,000-8,000/day (mid-range)",
      tips: "• Book Taj tickets online (skip queues)\n• Visit Taj at sunrise & sunset\n• Carry your passport\n• Taj closed on Fridays\n• Buy Petha from Panchhi or Deviram"
    },
    
    bangalore: {
      name: "Bangalore",
      icon: "🌳",
      itinerary: {
        1: "• Morning: Lalbagh Botanical Garden (6:00-9:00) - ₹50\n• Breakfast: Vidyarthi Bhavan for masala dosa (₹100)\n• Late Morning: Bangalore Palace (10:00-12:00) - ₹230\n• Lunch: MTR on Lalbagh Road (₹200)\n• Afternoon: Cubbon Park & Government Museum (2:00-5:00)\n• Evening: MG Road & Brigade Road shopping (6:00-9:00)\n• Dinner: Toit Brewpub (₹1,000)",
        2: "• Morning: Nandi Hills sunrise trip (5:00-10:00) - ₹50\n• Breakfast: At Nandi Hills (₹150)\n• Afternoon: ISKCON Temple (12:00-2:00)\n• Lunch: Koshy's classic Bangalore cafe (₹400)\n• Evening: Commercial Street shopping (4:00-7:00)\n• Dinner: The Black Pearl (₹800)",
        3: "• Morning: Bannerghatta National Park (8:00-1:00) - ₹100\n• Lunch: Meghana Foods for biryani (₹300)\n• Afternoon: Visvesvaraya Museum (2:00-4:00) - ₹50\n• Evening: Cafe hopping - Church Street, Koramangala (5:00-8:00)\n• Dinner: Karavalli for coastal cuisine (₹1,500)"
      },
      hotels: "₹1,000-3,500/night (Indiranagar, Koramangala, MG Road)",
      transport: "Metro: ₹10-60, Uber/Ola: ₹100-500, Namma Yatri (auto app)",
      budget: "₹2,500-4,500/day (backpacker), ₹6,000-10,000/day (mid-range)",
      tips: "• Use Namma Metro to avoid traffic\n• Cafe culture is big here\n• Try filter coffee everywhere\n• Nightlife on MG Road & Indiranagar\n• Book Nandi Hills car in advance"
    },
    
    varanasi: {
      name: "Varanasi",
      icon: "🕉️",
      itinerary: {
        1: "• Early Morning: Sunrise boat ride on Ganges (5:30-7:30) - ₹200\n• Breakfast: Blue Lassi & Kachori Gali (₹100)\n• Morning: Walk through ghats - Dashashwamedh, Manikarnika (8:00-11:00)\n• Lunch: Pizzeria Vaatika rooftop (₹300)\n• Afternoon: Kashi Vishwanath Temple (dress modestly) (2:00-4:00)\n• Evening: Ganga Aarti at Dashashwamedh Ghat (6:00-7:30)\n• Dinner: Brown Bread Bakery (₹250)",
        2: "• Morning: Sarnath Buddhist site (7:00-11:00) - ₹200\n• Lunch: Open Hand Cafe (₹300)\n• Afternoon: Banaras Hindu University & Bharat Kala Bhavan Museum (2:00-5:00)\n• Evening: Assi Ghat aarti & yoga (5:30-7:00)\n• Dinner: Baati Chokha at local eatery (₹200)",
        3: "• Morning: Sunrise yoga at ghat (6:00-7:30)\n• Breakfast: Shree Cafe (₹150)\n• Late Morning: Shopping - Banarasi silk sarees (9:00-12:00)\n• Lunch: Keshari Ruchikar Byanjan (₹250)\n• Afternoon: Ramnagar Fort & Museum (2:00-5:00) - ₹150\n• Evening: Final ghat walk & meditation (6:00-7:30)"
      },
      hotels: "₹600-2,500/night (Ghat-side hotels, Assi Ghat area)",
      transport: "Auto: ₹30-100, Walking is best in old city, Boat: ₹200-500",
      budget: "₹1,500-3,000/day (backpacker), ₹4,000-7,000/day (mid-range)",
      tips: "• Respect religious sentiments\n• No photos at Manikarnika (burning ghat)\n• Avoid touts near temples\n• Dress modestly\n• Don't drink tap water"
    },
    
    manali: {
      name: "Manali",
      icon: "🏔️",
      itinerary: {
        1: "• Morning: Solang Valley - paragliding & zorbing (8:00-1:00) - ₹2,000\n• Lunch: Johnson's Cafe (₹500)\n• Afternoon: Hadimba Temple & Old Manali exploration (3:00-6:00)\n• Evening: Mall Road shopping & cafes (6:30-9:00)\n• Dinner: Casa Bella Vista (₹800)",
        2: "• Full Day: Rohtang Pass excursion (snow activities) (6:00-6:00)\n• Permit required: ₹500, Taxi: ₹3,500\n• Lunch: Packed lunch or at Rohtang\n• Activities: Snow skiing, sledding (₹500-2,000)\n• Dinner: The Lazy Dog (₹700)",
        3: "• Morning: Vashisht Hot Springs & Temple (8:00-10:00)\n• Late Morning: River rafting in Beas (11:00-1:00) - ₹800\n• Lunch: Dylan's Toasted & Roasted (₹400)\n• Afternoon: Manikaran Gurudwara day trip (2:00-7:00)\n• Dinner: Chopsticks for Tibetan food (₹500)"
      },
      hotels: "₹800-4,000/night (Old Manali, Vashisht, Mall Road)",
      transport: "Taxi: ₹2,000-4,000/day, Local bus: ₹20-100",
      budget: "₹3,000-5,000/day (backpacker), ₹7,000-12,000/day (mid-range)",
      tips: "• Book Rohtang permit online 1 month advance\n• Best time: May-June, Sep-Oct\n• Carry warm clothes year-round\n• Old Manali has best cafes\n• Altitude sickness precautions"
    },
    
    ladakh: {
      name: "Ladakh",
      icon: "🏔️",
      itinerary: {
        1: "• Morning: Rest & acclimatization in Leh\n• Late Morning: Shanti Stupa visit (10:00-12:00)\n• Lunch: Lamayuru Restaurant (₹400)\n• Afternoon: Leh Palace & market (2:00-5:00) - ₹150\n• Evening: Light walk only - altitude rest (6:00-7:00)\n• Dinner: Tibetan Kitchen (₹500)",
        2: "• Full Day: Pangong Lake excursion (6:00-9:00)\n• Permit: ₹400, Taxi: ₹6,000-8,000\n• Breakfast & Lunch: Packed from Leh\n• Activities: Photography, lakeside relaxation\n• Return: Late evening (9:00 PM)\n• Dinner: Summer Harvest (₹600)",
        3: "• Morning: Thiksey & Hemis Monastery (7:00-12:00) - ₹100\n• Lunch: Chopsticks Noodle Bar (₹350)\n• Afternoon: Magnetic Hill & Confluence (2:00-5:00)\n• Evening: Stok Palace Museum (5:30-7:00) - ₹100\n• Dinner: Bon Appetit (₹700)"
      },
      hotels: "₹800-3,000/night (Leh town, Changspa area)",
      transport: "Taxi for sightseeing: ₹5,000-8,000/day, Bikes: ₹1,200-2,000/day",
      budget: "₹3,500-6,000/day (backpacker), ₹10,000-18,000/day (mid-range)",
      tips: "• Acclimatize for 24-48 hours\n• Carry Diamox for altitude sickness\n• Roads open June-September only\n• Book permits in advance\n• Carry cash - limited ATMs"
    },
    
    udaipur: {
      name: "Udaipur",
      icon: "💎",
      itinerary: {
        1: "• Morning: City Palace complex (9:00-12:30) - ₹300\n• Lunch: Ambrai restaurant lakeside (₹800)\n• Afternoon: Jagdish Temple & shopping at Hathi Pol (2:00-5:00)\n• Evening: Lake Pichola boat ride & sunset (5:30-7:00) - ₹400\n• Dinner: Upre rooftop at Lake Palace Hotel (₹1,500)",
        2: "• Morning: Saheliyon ki Bari & Fateh Sagar Lake (8:00-11:00) - ₹50\n• Lunch: Savage Garden (₹500)\n• Afternoon: Monsoon Palace (Sajjangarh) (2:00-5:00) - ₹80\n• Evening: Cultural show at Bagore ki Haveli (7:00-8:00) - ₹100\n• Dinner: Charcoal by Carlsson (₹1,200)",
        3: "• Morning: Shilpgram craft village (9:00-12:00) - ₹50\n• Lunch: Millets of Mewar (₹400)\n• Afternoon: Vintage car museum (2:00-4:00) - ₹300\n• Evening: Sunset from Karni Mata temple (5:00-6:30)\n• Dinner: 1559 AD at City Palace (₹2,000)"
      },
      hotels: "₹1,500-8,000/night (Lake-facing hotels, Old City)",
      transport: "Auto: ₹50-200, Uber/Ola available, Walking in old city",
      budget: "₹3,000-5,000/day (backpacker), ₹8,000-15,000/day (mid-range)",
      tips: "• Book lake-view hotel\n• Watch sunset from rooftop restaurants\n• Shopping: miniature paintings\n• Cultural shows every evening\n• Best time: October-March"
    }
  };
  
  // Find matching destination
  for (const [key, plan] of Object.entries(tripPlans)) {
    if (lowerMessage.includes(key)) {
      let response = `${plan.icon} **${plan.name.toUpperCase()} TRIP PLAN** (${days} ${days === 1 ? 'Day' : 'Days'})\n\n`;
      
      // Add day-by-day itinerary
      for (let i = 1; i <= Math.min(days, 3); i++) {
        response += `📅 **DAY ${i}:**\n${plan.itinerary[i]}\n\n`;
      }
      
      // Add additional days guidance if requested > 3 days
      if (days > 3) {
        response += `📅 **DAYS 4+:**\nExplore nearby attractions, take day trips, or enjoy leisure time at your accommodation.\n\n`;
      }
      
      // Add practical information
      response += `🏨 **ACCOMMODATION:**\n${plan.hotels}\n\n`;
      response += `🚗 **TRANSPORTATION:**\n${plan.transport}\n\n`;
      response += `💰 **BUDGET ESTIMATE:**\n${plan.budget}\n\n`;
      response += `💡 **PRO TIPS:**\n${plan.tips}\n\n`;
      response += `✅ **READY TO BOOK?**\nI can help you find hotels, restaurants, or travel buddies for this trip!`;
      
      return response;
    }
  }
  
  // Generic trip plan for unlisted destinations
  if (lowerMessage.match(/plan|trip|itinerary|visit/)) {
    return `🗺️ **TRIP PLANNING ASSISTANCE**\n\nI can create detailed ${days}-day itineraries for these popular Indian destinations:\n\n🏛️ **North India:**\n• Delhi - Capital city heritage\n• Agra - Taj Mahal & Mughal architecture\n• Jaipur - Pink City palaces\n• Varanasi - Spiritual capital\n• Rishikesh - Yoga & adventure\n\n🏖️ **Beaches:**\n• Goa - Beach paradise & nightlife\n• Kerala - Backwaters & beaches\n\n🏔️ **Mountains:**\n• Manali - Adventure sports\n• Ladakh - High altitude desert\n Himachal - Hill stations\n\n🌆 **Metro Cities:**\n• Mumbai - City of dreams\n• Bangalore - Garden city\n\n💎 **Rajasthan:**\n• Udaipur - City of lakes\n• Jaipur - Pink city\n\n**Just say:** "Plan a trip to [destination]" and I'll create a detailed day-by-day itinerary with timing, costs, food recommendations, and insider tips!\n\nWhich destination interests you?`;
  }
  
  return null;
}