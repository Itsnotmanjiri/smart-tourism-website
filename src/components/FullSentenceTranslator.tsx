import { useState, useEffect } from 'react';
import { Languages, Volume2, ArrowRightLeft, Mic, Loader2, Copy, Check, Globe, BookOpen, Sparkles } from 'lucide-react';
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
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', apiCode: 'pa' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', apiCode: 'es' },
  { code: 'fr', name: 'French', flag: '🇫🇷', apiCode: 'fr' },
  { code: 'de', name: 'German', flag: '🇩🇪', apiCode: 'de' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', apiCode: 'ja' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', apiCode: 'ko' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', apiCode: 'zh' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', apiCode: 'ar' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', apiCode: 'pt' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', apiCode: 'ru' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', apiCode: 'it' }
];

// Quick translation examples for first-time users
const TRANSLATION_EXAMPLES = [
  { en: 'My name is Manjiri', hi: 'मेरा नाम मंजिरी है' },
  { en: 'How much does this cost?', hi: 'इसकी कीमत कितनी है?' },
  { en: 'Where is the nearest hospital?', hi: 'निकटतम अस्पताल कहाँ है?' },
  { en: 'I need help please', hi: 'मुझे मदद चाहिए कृपया' },
  { en: 'What time does the train leave?', hi: 'ट्रेन किस समय निकलती है?' },
  { en: 'Can you recommend a good restaurant?', hi: 'क्या आप एक अच्छे रेस्तरां की सिफारिश कर सकते हैं?' }
];

export function FullSentenceTranslator({ isCompact = false }: TranslatorProps) {
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('hi');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<Array<{from: string, to: string, input: string, output: string, timestamp: string}>>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load translation history
    const history = localStorage.getItem('translationHistory');
    if (history) {
      setTranslationHistory(JSON.parse(history));
    }
  }, []);

  // Auto-translate as user types (with debounce)
  useEffect(() => {
    if (inputText.trim().length > 0) {
      const timer = setTimeout(() => {
        handleTranslate();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setOutputText('');
    }
  }, [inputText, fromLang, toLang]);

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
    toast.error('Translation service temporarily unavailable. Please try again.');
    return text;
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
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: 'text'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    
    if (data.translatedText) {
      return data.translatedText;
    }
    throw new Error('LibreTranslate failed');
  };

  // Google Translate Free Proxy
  const translateWithGoogleFree = async (text: string, from: string, to: string): Promise<string> => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0].map((item: any) => item[0]).join('');
    }
    throw new Error('Google Translate failed');
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    try {
      const translated = await translateWithAPI(inputText, fromLang, toLang);
      setOutputText(translated);
      
      // Save to history
      const newEntry = {
        from: fromLang,
        to: toLang,
        input: inputText,
        output: translated,
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [newEntry, ...translationHistory.slice(0, 19)]; // Keep last 20
      setTranslationHistory(updatedHistory);
      localStorage.setItem('translationHistory', JSON.stringify(updatedHistory));
      
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
    
    // Also swap the text
    const tempText = inputText;
    setInputText(outputText);
    setOutputText(tempText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    toast.success('Translation copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
      toast.success('Playing audio...');
    } else {
      toast.error('Text-to-speech not supported');
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = fromLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.success('Listening... Speak now');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Voice input failed');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast.error('Voice input not supported in this browser');
    }
  };

  const useExample = (example: typeof TRANSLATION_EXAMPLES[0]) => {
    setFromLang('en');
    setToLang('hi');
    setInputText(example.en);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-3 flex items-center gap-3">
              <Languages className="w-10 h-10" />
              Full Sentence Translator
            </h2>
            <p className="text-purple-200 text-lg">
              Translate any sentence from small to very complex • Powered by advanced AI
            </p>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-all flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            History
          </button>
        </div>
      </div>

      {/* Main Translator */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Language Selection */}
        <div className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <select
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-900 text-lg"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.apiCode}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <select
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-900 text-lg"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.apiCode}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -mt-3 mb-3 z-10 relative">
          <button
            onClick={swapLanguages}
            className="p-4 bg-gradient-to-r from-purple-900 to-blue-900 text-white rounded-full hover:shadow-xl transition-all hover:scale-110"
            aria-label="Swap languages"
          >
            <ArrowRightLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Input/Output Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Input Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Enter any text to translate</label>
              <button
                onClick={handleVoiceInput}
                disabled={isListening}
                className={`p-2 rounded-lg transition-all ${
                  isListening 
                    ? 'bg-red-100 text-red-900 animate-pulse' 
                    : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                }`}
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type any sentence here... (e.g., My name is Manjiri, Where is the nearest hospital?, How much does this cost?)"
              className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-900 resize-none text-lg"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{inputText.length} characters</span>
              {inputText && (
                <button
                  onClick={() => handleSpeak(inputText, fromLang)}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-900 rounded-lg hover:bg-purple-200 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  Listen
                </button>
              )}
            </div>
          </div>

          {/* Output Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Translation</label>
              {isTranslating && (
                <div className="flex items-center gap-2 text-purple-900">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Translating...</span>
                </div>
              )}
            </div>
            <div className="relative">
              <div className="w-full h-64 px-4 py-3 border-2 border-purple-200 bg-purple-50 rounded-xl overflow-y-auto text-lg">
                {outputText || (
                  <p className="text-gray-400 italic">Translation will appear here...</p>
                )}
              </div>
              {outputText && (
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                    title="Copy translation"
                  >
                    {isCopied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-purple-900" />
                    )}
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{outputText.length} characters</span>
              {outputText && (
                <button
                  onClick={() => handleSpeak(outputText, toLang)}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-900 rounded-lg hover:bg-purple-200 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  Listen
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Translation Examples */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-900" />
            <h3 className="text-lg font-semibold text-gray-900">Try These Examples</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {TRANSLATION_EXAMPLES.map((example, index) => (
              <button
                key={index}
                onClick={() => useExample(example)}
                className="p-4 bg-white rounded-xl hover:shadow-lg transition-all text-left border-2 border-transparent hover:border-purple-300"
              >
                <p className="text-sm text-gray-900 mb-2">{example.en}</p>
                <p className="text-sm text-purple-900 font-medium">{example.hi}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Translation History */}
      {showHistory && translationHistory.length > 0 && (
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Recent Translations</h3>
            <button
              onClick={() => {
                setTranslationHistory([]);
                localStorage.removeItem('translationHistory');
                toast.success('History cleared');
              }}
              className="px-4 py-2 bg-red-100 text-red-900 rounded-lg hover:bg-red-200 transition-all"
            >
              Clear History
            </button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {translationHistory.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => {
                  setFromLang(item.from);
                  setToLang(item.to);
                  setInputText(item.input);
                  setOutputText(item.output);
                  setShowHistory(false);
                }}
              >
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                  <span>{LANGUAGES.find(l => l.apiCode === item.from)?.flag}</span>
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>{LANGUAGES.find(l => l.apiCode === item.to)?.flag}</span>
                  <span className="ml-auto">{new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-gray-900 mb-1">{item.input}</p>
                <p className="text-purple-900 font-medium">{item.output}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Globe className="w-5 h-5 text-orange-600" />
          Pro Tips for Best Translation
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span><strong>Type naturally:</strong> Write complete sentences as you would normally speak</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span><strong>Use proper grammar:</strong> Better grammar = better translation quality</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span><strong>Context matters:</strong> Include context for phrases with multiple meanings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span><strong>Voice input:</strong> Click the microphone icon to speak instead of typing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span><strong>Listen back:</strong> Use the speaker icon to hear correct pronunciation</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
