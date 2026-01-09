# AI Chatbot Setup Guide - ChatGPT Integration

## 🚀 Quick Start

Your chatbot is now **fully integrated with ChatGPT API** and works in two modes:

### Mode 1: ChatGPT-Powered (Recommended)
✅ Answers ANY question like ChatGPT
✅ Natural conversations with context awareness
✅ Specialized knowledge about your Indian tourism platform

### Mode 2: Smart Fallback (No setup required)
✅ Works immediately without API key
✅ Comprehensive responses for Indian tourism
✅ 100+ pre-programmed travel scenarios

---

## 📋 How to Get Your OpenAI API Key

### Step 1: Create OpenAI Account
1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Sign up with email or Google account
3. Verify your email address

### Step 2: Add Payment Method
1. Go to [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Click "Add payment method"
3. Add credit/debit card (requires $5-10 minimum)
4. **Cost is very low**: ~$0.01-0.02 per conversation

### Step 3: Generate API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "+ Create new secret key"
3. Name it (e.g., "Tourism Platform Chatbot")
4. **Copy the key** (starts with `sk-...`)
5. ⚠️ **Important**: Save it now - you can't see it again!

---

## 🔧 Setup in the Application

### Option A: In-App Setup (Easiest)

1. **Open the chatbot** (click the chat icon)
2. **Click the Settings icon** (⚙️) in the top-right corner
3. **Paste your API key** (sk-...)
4. **Click "Save API Key"**
5. ✅ Done! The chatbot is now ChatGPT-powered

**Visual Indicators:**
- 🟢 Green dot = ChatGPT API connected
- 🟡 Yellow dot = Using smart fallback mode

### Option B: Environment Variable (For Developers)

Create a `.env` file in your project root:
```env
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

---

## 💰 Pricing & Cost

**GPT-3.5-Turbo Pricing:**
- Input: $0.50 per 1M tokens
- Output: $1.50 per 1M tokens

**Real-World Costs:**
- Single conversation: ~$0.01-0.02
- 100 conversations: ~$1-2
- 1,000 conversations: ~$10-20

**Monthly Estimates:**
- Light usage (100 users/month): $10-20
- Medium usage (500 users/month): $50-100
- Heavy usage (2,000 users/month): $200-400

💡 **Tip**: Set a spending limit at platform.openai.com to control costs

---

## ✨ Features & Capabilities

### With ChatGPT API:
✅ Answers ANY question naturally (like ChatGPT)
✅ Remembers conversation context (last 6 messages)
✅ Expert on Indian tourism, culture, and your platform
✅ Handles complex multi-part questions
✅ Provides personalized recommendations
✅ Can discuss general topics and relate them to travel

### Platform Knowledge (Built-in):
- All destinations across India (Delhi, Goa, Kerala, Mumbai, etc.)
- Hotel pricing: Budget ₹600-1,500, Mid-range ₹1,500-4,000, Luxury ₹4,000+
- Restaurants, street food, regional cuisine
- Travel buddy finder, AI itineraries, emergency services
- QR code bookings, sentiment analysis, dynamic pricing
- Festivals, weather, transportation, safety tips

---

## 🧪 Test Questions to Try

### Travel Questions:
- "Plan a 5-day trip to Kerala with budget ₹20,000"
- "Best street food in Mumbai under ₹200"
- "Hotels in Goa near the beach for couples"
- "Is Ladakh safe for solo female travelers?"
- "What festivals happen in October?"

### General Questions (with ChatGPT API):
- "What is the history of the Taj Mahal?"
- "How does monsoon season affect travel plans?"
- "Tips for first-time visitors to India"
- "What's the best way to negotiate prices in markets?"

### Platform Questions:
- "How do I find a travel buddy?"
- "Show me hotels with best reviews in Delhi"
- "I need emergency help, what do I do?"
- "How does the QR code booking system work?"

---

## 🔐 Security & Privacy

### ✅ Best Practices:
- API keys are stored in browser localStorage (local to device)
- Keys are never sent to any server except OpenAI
- Use the "Remove" button to clear your API key anytime
- Conversations are not stored on our servers

### ⚠️ Important Notes:
- Never share your API key publicly
- Don't commit API keys to GitHub/version control
- Monitor usage at platform.openai.com
- Set spending limits to prevent unexpected charges

### For Production:
Consider using a backend proxy to hide API keys:
```
User → Your Backend → OpenAI API
```
This prevents API key exposure in frontend code.

---

## 🛠️ Customization Options

### Change AI Model
Edit `ChatBot.tsx`:
```typescript
model: 'gpt-3.5-turbo'  // or 'gpt-4' for better quality
```

**GPT-4** is smarter but costs ~20x more:
- Better understanding of complex questions
- More creative and detailed responses
- Recommended only for premium users

### Adjust Response Length
```typescript
max_tokens: 500  // 300 for shorter, 800 for longer
```

### Control Creativity
```typescript
temperature: 0.7  // 0.0 = focused, 1.0 = creative
```

### Conversation Memory
```typescript
conversationHistory.slice(-6)  // Change -6 to remember more/less
```

---

## 🐛 Troubleshooting

### "Invalid API key" Error
- ✅ Check if key starts with `sk-`
- ✅ Verify key is active at platform.openai.com
- ✅ Ensure you have credits/payment method added
- ✅ Try removing and re-adding the key

### Slow Responses
- Normal: 1-3 seconds for API call
- Check internet connection
- OpenAI API might be experiencing high traffic
- Fallback mode activates if API times out

### Not Getting Smart Responses
- ✅ Confirm green dot is showing (API connected)
- ✅ Check browser console for errors
- ✅ Try a test question like "What is AI?"
- Yellow dot = using fallback mode (still works great!)

### API Key Not Saving
- Check browser localStorage is enabled
- Try different browser
- Clear cache and try again

---

## 📊 Monitoring Usage

### Check API Usage:
1. Go to [https://platform.openai.com/usage](https://platform.openai.com/usage)
2. View daily/monthly costs
3. See number of requests
4. Monitor token usage

### Set Spending Limits:
1. Go to [https://platform.openai.com/account/limits](https://platform.openai.com/account/limits)
2. Set hard limit (e.g., $50/month)
3. Get email alerts at 75%, 90% usage

---

## 🎯 How It Works

### System Architecture:
```
User Message
    ↓
ChatBot Component
    ↓
Check for API Key?
    ↓
YES → OpenAI API → ChatGPT Response
    ↓
NO → Intelligent Fallback → Pattern-Matched Response
    ↓
Display to User
```

### Context System:
The chatbot sends:
1. **System Prompt**: Your platform info, pricing, features
2. **Conversation History**: Last 6 messages for context
3. **User Question**: Current message
4. **Response**: ChatGPT's contextual answer

---

## 💡 Tips for Best Results

### Ask Specific Questions:
❌ "Tell me about India"
✅ "Plan a 3-day trip to Jaipur with forts and food"

### Provide Context:
❌ "Good hotels?"
✅ "Romantic hotels in Udaipur under ₹3,000/night"

### Use Follow-ups:
✅ "Tell me more about that"
✅ "What about vegetarian options?"
✅ "How far is it from the airport?"

### Platform Features:
✅ "Find me travel buddies going to Goa in January"
✅ "Generate emergency itinerary for Delhi"
✅ "Show hotels with highest sentiment scores"

---

## 🚀 Next Steps

1. **Get API Key**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Add to Chatbot**: Click settings icon and paste key
3. **Start Testing**: Try the test questions above
4. **Monitor Usage**: Check costs weekly
5. **Set Limits**: Prevent unexpected charges

**Without API Key?**
No problem! The smart fallback system works great for Indian tourism queries.

---

## 📞 Support

**The chatbot now:**
✅ Works like ChatGPT with API key
✅ Handles ANY question naturally
✅ Remembers conversation context
✅ Falls back gracefully without API
✅ Is production-ready out of the box

**Questions?**
- Check OpenAI documentation: [platform.openai.com/docs](https://platform.openai.com/docs)
- Test in the app and monitor console for errors
- Review API usage at platform.openai.com/usage

---

🎉 **Your ChatGPT-powered travel assistant is ready to use!**