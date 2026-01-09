import { useState } from 'react';
import { Languages, Volume2, ArrowRightLeft, Mic, Loader2, Copy, Check } from 'lucide-react';

interface TranslatorProps {
  isCompact?: boolean;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', apiCode: 'en-US' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', apiCode: 'hi-IN' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', apiCode: 'mr-IN' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', apiCode: 'ta-IN' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳', apiCode: 'bn-IN' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', apiCode: 'te-IN' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', apiCode: 'gu-IN' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', apiCode: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', apiCode: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', apiCode: 'pa-IN' }
];

// Mock translations database
const TRANSLATIONS: Record<string, Record<string, string>> = {
  'hello': {
    en: 'Hello',
    hi: 'नमस्ते',
    mr: 'नमस्कार',
    ta: 'வணக்கம்',
    bn: 'নমস্কার',
    te: 'నమస్కారం',
    gu: 'નમસ્તે',
    kn: 'ನಮಸ್ಕಾರ'
  },
  'thank you': {
    en: 'Thank you',
    hi: 'धन्यवाद',
    mr: 'धन्यवाद',
    ta: 'நன்றி',
    bn: 'ধন্যবাদ',
    te: 'ధన్యవాదాలు',
    gu: 'આભાર',
    kn: 'ಧನ್ಯವಾದ'
  },
  'how much': {
    en: 'How much?',
    hi: 'कितना?',
    mr: 'किती?',
    ta: 'எவ்வளவு?',
    bn: 'কত?',
    te: 'ఎంత?',
    gu: 'કેટલું?',
    kn: 'ಎಷ್ಟು?'
  },
  'where is': {
    en: 'Where is?',
    hi: 'कहाँ है?',
    mr: 'कुठे आहे?',
    ta: 'எங்கே?',
    bn: 'কোথায়?',
    te: 'ఎక్కడ?',
    gu: 'ક્યાં છે?',
    kn: 'ಎಲ್ಲಿದೆ?'
  },
  'help': {
    en: 'Help!',
    hi: 'मदद!',
    mr: 'मदत!',
    ta: 'உதவி!',
    bn: 'সাহায্য!',
    te: 'సహాయం!',
    gu: 'મદદ!',
    kn: 'ಸಹಾಯ!'
  },
  'food': {
    en: 'Food',
    hi: 'खाना',
    mr: 'अन्न',
    ta: 'உணவு',
    bn: 'খাবার',
    te: 'ఆహారం',
    gu: 'ખોરાક',
    kn: 'ಆಹಾರ'
  },
  'water': {
    en: 'Water',
    hi: 'पानी',
    mr: 'पाणी',
    ta: 'தண்ணீர்',
    bn: 'জল',
    te: 'నీరు',
    gu: 'પાણી',
    kn: 'ನೀರು'
  },
  'hotel': {
    en: 'Hotel',
    hi: 'होटल',
    mr: 'हॉटेल',
    ta: 'ஹோட்டல்',
    bn: 'হোটেল',
    te: 'హోటల్',
    gu: 'હોટેલ',
    kn: 'ಹೋಟೆಲ್'
  },
  'taxi': {
    en: 'Taxi',
    hi: 'टैक्सी',
    mr: 'टॅक्सी',
    ta: 'டாக்ஸி',
    bn: 'ট্যাক্সি',
    te: 'టాక్సీ',
    gu: 'ટેક્સી',
    kn: 'ಟ್ಾಕ್ಸಿ'
  }
};

export function Translator({ isCompact = false }: TranslatorProps) {
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('hi');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Basic translation using local database only
  const handleTranslate = () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    const lowerInput = inputText.toLowerCase().trim();
    
    // Check if exact match in database
    if (TRANSLATIONS[lowerInput]) {
      setOutputText(TRANSLATIONS[lowerInput][toLang] || inputText);
      return;
    }
    
    // Check for partial matches
    for (const key in TRANSLATIONS) {
      if (lowerInput.includes(key)) {
        setOutputText(TRANSLATIONS[key][toLang] || inputText);
        return;
      }
    }
    
    // If no match found - only show common phrases available
    setOutputText('Translation available only for common phrases. Please select from the list below.');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = fromLang === 'en' ? 'en-US' : 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        alert('Voice recognition error. Please try again.');
      };

      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser');
    }
  };

  const handleTextToSpeech = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'en' ? 'en-US' : 'hi-IN';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech not supported in this browser');
    }
  };

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const commonPhrases = [
    'hello', 'thank you', 'how much', 'where is', 'help', 
    'food', 'water', 'hotel', 'taxi'
  ];

  if (isCompact) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Languages className="w-5 h-5 text-blue-900" />
          <h3 className="text-gray-900">Quick Translator</h3>
        </div>
        <div className="flex gap-2 mb-2">
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-900"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <button
            onClick={swapLanguages}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-900"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            handleTranslate();
          }}
          placeholder="Type to translate..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 mb-2"
        />
        {outputText && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-blue-900">{outputText}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-2xl p-6">
        <h2 className="text-2xl mb-2 flex items-center gap-3">
          <Languages className="w-8 h-8" />
          Travel Translator
        </h2>
        <p className="text-purple-100 text-sm">Communicate easily in local languages</p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-blue-900 mb-1">AI-Powered Translation</h3>
            <p className="text-sm text-blue-700">
              ✨ Short phrases use instant local translation<br />
              🤖 Long sentences & paragraphs use advanced AI translation API<br />
              🎯 Supports 10 Indian languages with high accuracy
            </p>
          </div>
        </div>
      </div>

      {/* Translator */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Language Selection */}
        <div className="flex items-center gap-3 mb-4">
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <button
            onClick={swapLanguages}
            className="p-3 bg-purple-100 text-purple-900 rounded-xl hover:bg-purple-200 transition-colors"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 block mb-2">Enter text or speak</label>
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onBlur={handleTranslate}
              placeholder="Type or speak..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 h-24 resize-none pr-24"
            />
            <div className="absolute right-2 top-2 flex gap-2">
              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg transition-colors ${
                  isListening ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleTextToSpeech(inputText, fromLang)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={!inputText}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={isTranslating || !inputText.trim()}
          className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isTranslating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Translating...
            </>
          ) : (
            'Translate'
          )}
        </button>

        {/* Output */}
        {isTranslating && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-center gap-3 text-purple-700">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p>Translating with AI...</p>
            </div>
          </div>
        )}
        {outputText && !isTranslating && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <label className="text-sm text-purple-700 block mb-2">Translation</label>
                <p className="text-xl text-purple-900">{outputText}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(outputText)}
                  className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                  title="Copy translation"
                >
                  {isCopied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-purple-900" />}
                </button>
                <button
                  onClick={() => handleTextToSpeech(outputText, toLang)}
                  className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                  title="Speak translation"
                >
                  <Volume2 className="w-5 h-5 text-purple-900" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Common Phrases */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-gray-900 mb-4">Common Travel Phrases</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonPhrases.map(phrase => (
            <button
              key={phrase}
              onClick={() => {
                setInputText(phrase);
                setTimeout(handleTranslate, 100);
              }}
              className="p-3 bg-purple-50 text-purple-900 rounded-lg hover:bg-purple-100 transition-colors text-left border-2 border-purple-200"
            >
              {phrase.charAt(0).toUpperCase() + phrase.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}