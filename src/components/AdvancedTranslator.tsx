import { useState, useEffect } from 'react';
import { Languages, Volume2, ArrowRightLeft, Mic, Loader2, Copy, Check, Globe, Zap, Star, BookOpen } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TranslatorProps {
  isCompact?: boolean;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', apiCode: 'en' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', apiCode: 'hi' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', apiCode: 'mr' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', apiCode: 'ta' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳', apiCode: 'bn' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', apiCode: 'te' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', apiCode: 'gu' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', apiCode: 'kn' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', apiCode: 'ml' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', apiCode: 'pa' }
];

// Comprehensive translations database for common phrases
const TRANSLATIONS: Record<string, Record<string, string>> = {
  'hello': { en: 'Hello', hi: 'नमस्ते', mr: 'नमस्कार', ta: 'வணக்கம்', bn: 'নমস্কার', te: 'నమస్కారం', gu: 'નમસ્તે', kn: 'ನಮಸ್ಕಾರ', ml: 'നമസ്കാരം', pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ' },
  'thank you': { en: 'Thank you', hi: 'धन्यवाद', mr: 'धन्यवाद', ta: 'நன்றி', bn: 'ধন্যবাদ', te: 'ధన్యవాదాలు', gu: 'આભાર', kn: 'ಧನ್ಯವಾದ', ml: 'നന്ദി', pa: 'ਧੰਨਵਾਦ' },
  'how much': { en: 'How much?', hi: 'कितना?', mr: 'किती?', ta: 'எவ்வளவு?', bn: 'কত?', te: 'ఎంత?', gu: 'કેટલું?', kn: 'ಎಷ್ಟು?', ml: 'എത്ര?', pa: 'ਕਿੰਨਾ?' },
  'where is': { en: 'Where is?', hi: 'कहाँ है?', mr: 'कुठे आहे?', ta: 'எங்கே?', bn: 'কোথায়?', te: 'ఎక్కడ?', gu: 'ક્યાં છે?', kn: 'ಎಲ್ಲಿದೆ?', ml: 'എവിടെയാണ്?', pa: 'ਕਿੱਥੇ ਹੈ?' },
  'help': { en: 'Help!', hi: 'मदद!', mr: 'मदत!', ta: 'உதவி!', bn: 'সাহায্য!', te: 'సహాయం!', gu: 'મદદ!', kn: 'ಸಹಾಯ!', ml: 'സഹായം!', pa: 'ਮਦਦ!' },
  'food': { en: 'Food', hi: 'खाना', mr: 'अन्न', ta: 'உணவு', bn: 'খাবার', te: 'ఆహారం', gu: 'ખોરાક', kn: 'ಆಹಾರ', ml: 'ഭക്ഷണം', pa: 'ਖਾਣਾ' },
  'water': { en: 'Water', hi: 'पानी', mr: 'पाणी', ta: 'தண்ணீர்', bn: 'জল', te: 'నీరు', gu: 'પાણી', kn: 'ನೀರು', ml: 'വെള്ളം', pa: 'ਪਾਣੀ' },
  'hotel': { en: 'Hotel', hi: 'होटल', mr: 'हॉटेल', ta: 'ஹோட்டல்', bn: 'হোটেল', te: 'హోటల్', gu: 'હોટેલ', kn: 'ಹೋಟೆಲ್', ml: 'ഹോട്ടൽ', pa: 'ਹੋਟਲ' },
  'taxi': { en: 'Taxi', hi: 'टैक्सी', mr: 'टॅक्सी', ta: 'டாக்ஸி', bn: 'ট্যাক্সি', te: 'టాక్సీ', gu: 'ટેક્સી', kn: 'ಟ್ಾಕ್ಸಿ', ml: 'ടാക്സി', pa: 'ਟੈਕਸੀ' },
  'good morning': { en: 'Good morning', hi: 'सुप्रभात', mr: 'सुप्रभात', ta: 'காலை வணக்கம்', bn: 'সুপ্রভাত', te: 'శుభోదయం', gu: 'સુપ્રભાત', kn: 'ಶುಭೋದಯ', ml: 'സുപ്രഭാതം', pa: 'ਸ਼ੁਭ ਸਵੇਰ' },
  'good night': { en: 'Good night', hi: 'शुभ रात्रि', mr: 'शुभ रात्री', ta: 'இனிய இரவு', bn: 'শুভ রাত্রি', te: 'శుభ రాత్రి', gu: 'શુભ રાત્રિ', kn: 'ಶುಭ ರಾತ್ರಿ', ml: 'ശുഭ രാത്രി', pa: 'ਸ਼ੁਭ ਰਾਤ' },
  'please': { en: 'Please', hi: 'कृपया', mr: 'कृपया', ta: 'தயவுசெய்து', bn: 'দয়া করে', te: 'దయచేసి', gu: 'કૃપા કરીને', kn: 'ದಯವಿಟ್ಟು', ml: 'ദയവായി', pa: 'ਕਿਰਪਾ ਕਰਕੇ' },
  'yes': { en: 'Yes', hi: 'हाँ', mr: 'होय', ta: 'ஆம்', bn: 'হ্যাঁ', te: 'అవును', gu: 'હા', kn: 'ಹೌದು', ml: 'അതെ', pa: 'ਹਾਂ' },
  'no': { en: 'No', hi: 'नहीं', mr: 'नाही', ta: 'இல்லை', bn: 'না', te: 'కాదు', gu: 'ના', kn: 'ಇಲ್ಲ', ml: 'ഇല്ല', pa: 'ਨਹੀਂ' },
  'sorry': { en: 'Sorry', hi: 'क्षमा करें', mr: 'माफ करा', ta: 'மன்னிக்கவும்', bn: 'দুঃখিত', te: 'క్షమించండి', gu: 'માફ કરશો', kn: 'ಕ್ಷಮಿಸಿ', ml: 'ക്ഷമിക്കണം', pa: 'ਮਾਫ਼ ਕਰਨਾ' },
  'bathroom': { en: 'Bathroom', hi: 'शौचालय', mr: 'स्वच्छतागृह', ta: 'கழிப்பறை', bn: 'বাথরুম', te: 'స్నానాల గది', gu: 'બાથરૂમ', kn: 'ಸ್ನಾನಗೃಹ', ml: 'കുളിമുറി', pa: 'ਗੁਸਲਖਾਨਾ' },
  'hospital': { en: 'Hospital', hi: 'अस्पताल', mr: 'रुग्णालय', ta: 'மருத்துவமனை', bn: 'হাসপাতাল', te: 'ఆసుపత్రి', gu: 'હોસ્પિટલ', kn: 'ಆಸ್ಪತ್ರೆ', ml: 'ആശുപത്രി', pa: 'ਹਸਪਤਾਲ' },
  'police': { en: 'Police', hi: 'पुलिस', mr: 'पोलीस', ta: 'காவல்துறை', bn: 'পুলিশ', te: 'పోలీసు', gu: 'પોલીસ', kn: 'ಪೊಲೀಸ್', ml: 'പോലീസ്', pa: 'ਪੁਲਿਸ' },
  'how are you': { en: 'How are you?', hi: 'आप कैसे हैं?', mr: 'तुम्ही कसे आहात?', ta: 'எப்படி இருக்கிறீர்கள்?', bn: 'আপনি কেমন আছেন?', te: 'మీరు ఎలా ఉన్నారు?', gu: 'તમે કેમ છો?', kn: 'ನೀವು ಹೇಗಿದ್ದೀರಿ?', ml: 'നീ എങ്ങനെയുണ്ട്?', pa: 'ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?' },
  'my name is': { en: 'My name is', hi: 'मेरा नाम है', mr: 'माझे नाव आहे', ta: 'என் பெயர்', bn: 'আমার নাম', te: 'నా పేరు', gu: 'મારું નામ છે', kn: 'ನನ್ನ ಹೆಸರು', ml: 'എന്റെ പേര്', pa: 'ਮੇਰਾ ਨਾਮ ਹੈ' },
  'i am lost': { en: 'I am lost', hi: 'मैं खो गया हूँ', mr: 'मी हरवलो आहे', ta: 'நான் தொலைந்துவிட்டேன்', bn: 'আমি হারিয়ে গেছি', te: 'నేను తప్పిపోయాను', gu: 'હું ખોવાઈ ગયો છું', kn: 'ನಾನು ಕಳೆದುಕೊಂಡಿದ್ದೇನೆ', ml: 'ഞാൻ നഷ്ടപ്പെട്ടു', pa: 'ਮੈਂ ਗੁੰਮ ਗਿਆ ਹਾਂ' },
  'train station': { en: 'Train station', hi: 'रेलवे स्टेशन', mr: 'रेल्वे स्टेशन', ta: 'ரயில் நிலையம்', bn: 'রেলওয়ে স্টেশন', te: 'రైల్వే స్టేషన్', gu: 'રેલ્વે સ્ટેશન', kn: 'ರೈಲು ನಿಲ್ದಾಣ', ml: 'റെയിൽവേ സ്റ്റേഷൻ', pa: 'ਰੇਲਵੇ ਸਟੇਸ਼ਨ' },
  'airport': { en: 'Airport', hi: 'हवाई अड्डा', mr: 'विमानतळ', ta: 'விமான நிலையம்', bn: 'বিমানবন্দর', te: 'విమానాశ్రయం', gu: 'એરપોર્ટ', kn: 'ವಿಮಾನ ನಿಲ್ದಾಣ', ml: 'വിമാനത്താവളം', pa: 'ਹਵਾਈ ਅੱਡਾ' }
};

export function AdvancedTranslator({ isCompact = false }: TranslatorProps) {
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('hi');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [translationMethod, setTranslationMethod] = useState<'local' | 'api'>('local');
  const [translationHistory, setTranslationHistory] = useState<Array<{from: string, to: string, timestamp: string}>>([]);

  useEffect(() => {
    // Load translation history
    const history = localStorage.getItem('translationHistory');
    if (history) {
      setTranslationHistory(JSON.parse(history));
    }
  }, []);

  // Multi-API translation with fallbacks
  const translateWithAPI = async (text: string, from: string, to: string): Promise<string> => {
    // Try multiple APIs in sequence
    const apis = [
      { name: 'MyMemory', func: translateWithMyMemory },
      { name: 'LibreTranslate', func: translateWithLibreTranslate },
      { name: 'Google Translate (Free)', func: translateWithGoogleFree }
    ];

    for (const api of apis) {
      try {
        const result = await api.func(text, from, to);
        if (result && result.trim() !== text) {
          console.log(`✅ Translation successful with ${api.name}`);
          return result;
        }
      } catch (error) {
        console.warn(`${api.name} failed, trying next API...`);
      }
    }

    // If all APIs fail, return fallback message
    return `Translation service temporarily unavailable. Text: "${text}"`;
  };

  // MyMemory Translation API (Free, no API key required)
  const translateWithMyMemory = async (text: string, from: string, to: string): Promise<string> => {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    throw new Error('MyMemory translation failed');
  };

  // LibreTranslate API (Free, public instance)
  const translateWithLibreTranslate = async (text: string, from: string, to: string): Promise<string> => {
    const url = 'https://libretranslate.de/translate';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: 'text'
      })
    });
    const data = await response.json();
    
    if (data.translatedText) {
      return data.translatedText;
    }
    throw new Error('LibreTranslate translation failed');
  };

  // Google Translate Free API (Unofficial)
  const translateWithGoogleFree = async (text: string, from: string, to: string): Promise<string> => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }
    throw new Error('Google Translate failed');
  };

  // Main translation handler
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    setIsTranslating(true);
    const lowerInput = inputText.toLowerCase().trim();
    
    // Check local database first for exact or partial matches
    let localMatch = false;
    
    // Exact match
    if (TRANSLATIONS[lowerInput]) {
      setOutputText(TRANSLATIONS[lowerInput][toLang] || inputText);
      setTranslationMethod('local');
      localMatch = true;
    } else {
      // Partial match
      for (const key in TRANSLATIONS) {
        if (lowerInput.includes(key)) {
          setOutputText(TRANSLATIONS[key][toLang] || inputText);
          setTranslationMethod('local');
          localMatch = true;
          break;
        }
      }
    }
    
    // If no local match and text is more than 3 words, use API
    if (!localMatch && inputText.split(' ').length > 1) {
      try {
        const translation = await translateWithAPI(inputText, fromLang, toLang);
        setOutputText(translation);
        setTranslationMethod('api');
        
        // Save to history
        const newHistory = [
          { from: inputText, to: translation, timestamp: new Date().toISOString() },
          ...translationHistory.slice(0, 9)
        ];
        setTranslationHistory(newHistory);
        localStorage.setItem('translationHistory', JSON.stringify(newHistory));
        
        toast.success('Translated using AI API');
      } catch (error) {
        console.error('Translation API error:', error);
        toast.error('Translation service unavailable. Try common phrases.');
        setOutputText('Translation service temporarily unavailable. Please try common phrases from the list below.');
        setTranslationMethod('local');
      }
    } else if (!localMatch) {
      setOutputText('Translation not found. Please use common phrases or longer sentences.');
      setTranslationMethod('local');
    }
    
    setIsTranslating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      const langCode = LANGUAGES.find(l => l.code === fromLang)?.apiCode || 'en';
      recognition.lang = langCode === 'en' ? 'en-US' : `${langCode}-IN`;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('Listening... Speak now');
      };
      
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        toast.success('Voice captured!');
        setTimeout(() => handleTranslate(), 100);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
      };

      recognition.start();
    } else {
      toast.error('Voice recognition not supported in this browser');
    }
  };

  const handleTextToSpeech = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langCode = LANGUAGES.find(l => l.code === lang)?.apiCode || 'en';
      utterance.lang = langCode === 'en' ? 'en-US' : `${langCode}-IN`;
      window.speechSynthesis.speak(utterance);
      toast.success('Speaking...');
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const commonPhrases = Object.keys(TRANSLATIONS).slice(0, 24);

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
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleTranslate()}
          placeholder="Type to translate..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 mb-2"
        />
        <button
          onClick={handleTranslate}
          disabled={isTranslating || !inputText.trim()}
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors mb-2 disabled:opacity-50 text-sm"
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>
        {outputText && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-blue-900 text-sm">{outputText}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-6">
        <h2 className="text-2xl mb-2 flex items-center gap-3">
          <Globe className="w-8 h-8" />
          Advanced AI Translator
        </h2>
        <p className="text-purple-100 text-sm">Powered by multiple translation engines for maximum accuracy</p>
      </div>

      {/* Info Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-blue-900">Instant Translation</h3>
              <p className="text-xs text-blue-700">Common phrases in milliseconds</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-purple-900">AI-Powered</h3>
              <p className="text-xs text-purple-700">Full sentences with context</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-green-900">10 Languages</h3>
              <p className="text-xs text-green-700">All major Indian languages</p>
            </div>
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
            title="Swap languages"
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
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleTranslate())}
              placeholder="Type anything - short phrases or long sentences..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 h-32 resize-none pr-24"
            />
            <div className="absolute right-2 top-2 flex gap-2">
              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg transition-colors ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleTextToSpeech(inputText, fromLang)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={!inputText}
                title="Speak text"
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
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          {isTranslating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Translating with AI...
            </>
          ) : (
            <>
              <Languages className="w-5 h-5" />
              Translate Now
            </>
          )}
        </button>

        {/* Output */}
        {outputText && !isTranslating && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm text-purple-700">Translation</label>
                  {translationMethod === 'api' ? (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      AI Powered
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Instant
                    </span>
                  )}
                </div>
                <p className="text-2xl text-purple-900">{outputText}</p>
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
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          Common Travel Phrases
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {commonPhrases.map(phrase => (
            <button
              key={phrase}
              onClick={() => {
                setInputText(phrase);
                setTimeout(handleTranslate, 100);
              }}
              className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-900 rounded-lg hover:from-purple-100 hover:to-indigo-100 transition-all text-left border-2 border-purple-200 hover:border-purple-400"
            >
              <p className="capitalize text-sm">{phrase}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Translation History */}
      {translationHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-gray-900 mb-4">Recent Translations</h3>
          <div className="space-y-3">
            {translationHistory.slice(0, 5).map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border-l-4 border-purple-500">
                <p className="text-sm text-gray-600 mb-1">{item.from}</p>
                <p className="text-purple-900">{item.to}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.timestamp).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
