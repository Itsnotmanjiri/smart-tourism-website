import { useState } from 'react';
import { Languages, Volume2, ArrowRightLeft, Copy, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' }
];

// Comprehensive translation database
const TRANSLATIONS: Record<string, Record<string, string>> = {
  'hello': {
    en: 'Hello',
    hi: 'नमस्ते (Namaste)',
    mr: 'नमस्कार (Namaskar)',
    ta: 'வணக்கம் (Vanakkam)',
    bn: 'নমস্কার (Nomoshkar)',
    te: 'నమస్కారం (Namaskaram)',
    gu: 'નમસ્તે (Namaste)',
    kn: 'ನಮಸ್ಕಾರ (Namaskara)',
    ml: 'നമസ്കാരം (Namaskaram)',
    pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ (Sat Sri Akal)'
  },
  'thank you': {
    en: 'Thank you',
    hi: 'धन्यवाद (Dhanyavaad)',
    mr: 'धन्यवाद (Dhanyavaad)',
    ta: 'நன்றி (Nandri)',
    bn: 'ধন্যবাদ (Dhonnobad)',
    te: 'ధన్యవాదాలు (Dhanyavadalu)',
    gu: 'આભાર (Aabhar)',
    kn: 'ಧನ್ಯವಾದ (Dhanyavada)',
    ml: 'നന്ദി (Nandi)',
    pa: 'ਧੰਨਵਾਦ (Dhannvaad)'
  },
  'how much': {
    en: 'How much does this cost?',
    hi: 'यह कितने का है? (Yeh kitne ka hai?)',
    mr: 'हे किती आहे? (He kiti aahe?)',
    ta: 'இது எவ்வளவு? (Idhu evvalavu?)',
    bn: 'এটা কত? (Eta koto?)',
    te: 'ఇది ఎంత? (Idi enta?)',
    gu: 'આ કેટલું છે? (Aa ketlum chhe?)',
    kn: 'ಇದು ಎಷ್ಟು? (Idu eshtu?)',
    ml: 'ഇത് എത്ര? (Ithu ethra?)',
    pa: 'ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ? (Eh kinne da hai?)'
  },
  'where is': {
    en: 'Where is the bathroom?',
    hi: 'शौचालय कहाँ है? (Shauchalay kahan hai?)',
    mr: 'स्वच्छतागृह कुठे आहे? (Swachhatagrah kuthe aahe?)',
    ta: 'கழிவறை எங்கே? (Kazhivarai enge?)',
    bn: 'বাথরুম কোথায়? (Bathroom kothay?)',
    te: 'బాత్రూం ఎక్కడ? (Bathroom ekkada?)',
    gu: 'બાથરૂમ ક્યાં છે? (Bathroom kyaan chhe?)',
    kn: 'ಬಾತ್ರೂಂ ಎಲ್ಲಿದೆ? (Bathroom ellide?)',
    ml: 'ബാത്ത്റൂം എവിടെ? (Bathroom evide?)',
    pa: 'ਬਾਥਰੂਮ ਕਿੱਥੇ ਹੈ? (Bathroom kitthe hai?)'
  },
  'help': {
    en: 'Help! I need assistance',
    hi: 'मदद! मुझे सहायता चाहिए (Madad! Mujhe sahayata chahiye)',
    mr: 'मदत! मला मदत हवी (Madat! Mala madat havi)',
    ta: 'உதவி! எனக்கு உதவி வேண்டும் (Udavi! Enakku udavi vendum)',
    bn: 'সাহায্য! আমার সাহায্য দরকার (Sahajyo! Amar sahajyo dorkar)',
    te: 'సహాయం! నాకు సహాయం కావాలి (Sahayam! Naku sahayam kavali)',
    gu: 'મદદ! મને મદદની જરૂર છે (Madad! Mane madadni jarur chhe)',
    kn: 'ಸಹಾಯ! ನನಗೆ ಸಹಾಯ ಬೇಕು (Sahaya! Nanage sahaya beku)',
    ml: 'സഹായം! എനിക്ക് സഹായം വേണം (Sahayam! Enikku sahayam venam)',
    pa: 'ਮਦਦ! ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ (Madad! Mainu madad chahidi hai)'
  },
  'food': {
    en: 'I would like food',
    hi: 'मुझे खाना चाहिए (Mujhe khana chahiye)',
    mr: 'मला अन्न हवे (Mala anna have)',
    ta: 'எனக்கு உணவு வேண்டும் (Enakku unavu vendum)',
    bn: 'আমার খাবার চাই (Amar khabar chai)',
    te: 'నాకు ఆహారం కావాలి (Naku aharam kavali)',
    gu: 'મને ખોરાક જોઈએ છે (Mane khorak joie chhe)',
    kn: 'ನನಗೆ ಆಹಾರ ಬೇಕು (Nanage ahara beku)',
    ml: 'എനിക്ക് ഭക്ഷണം വേണം (Enikku bhakshanam venam)',
    pa: 'ਮੈਨੂੰ ਖਾਣਾ ਚਾਹੀਦਾ ਹੈ (Mainu khana chahida hai)'
  },
  'water': {
    en: 'Water please',
    hi: 'पानी दीजिए (Pani dijiye)',
    mr: 'पाणी द्या (Pani dya)',
    ta: 'தண்ணீர் தாருங்கள் (Thanneer tharungal)',
    bn: 'জল দিন (Jol din)',
    te: 'నీరు ఇవ్వండి (Neeru ivvandi)',
    gu: 'પાણી આપો (Pani aapo)',
    kn: 'ನೀರು ಕೊಡಿ (Neeru kodi)',
    ml: 'വെള്ളം തരൂ (Vellam tharoo)',
    pa: 'ਪਾਣੀ ਦਿਓ (Pani dio)'
  },
  'hotel': {
    en: 'Where is the hotel?',
    hi: 'होटल कहाँ है? (Hotel kahan hai?)',
    mr: 'हॉटेल कुठे आहे? (Hotel kuthe aahe?)',
    ta: 'ஹோட்டல் எங்கே? (Hotel enge?)',
    bn: 'হোটেল কোথায়? (Hotel kothay?)',
    te: 'హోటల్ ఎక్కడ? (Hotel ekkada?)',
    gu: 'હોટેલ ક્યાં છે? (Hotel kyaan chhe?)',
    kn: 'ಹೋಟೆಲ್ ಎಲ್ಲಿದೆ? (Hotel ellide?)',
    ml: 'ഹോട്ടൽ എവിടെ? (Hotel evide?)',
    pa: 'ਹੋਟਲ ਕਿੱਥੇ ਹੈ? (Hotel kitthe hai?)'
  },
  'taxi': {
    en: 'I need a taxi',
    hi: 'मुझे टैक्सी चाहिए (Mujhe taxi chahiye)',
    mr: 'मला टॅक्सी हवी (Mala taxi havi)',
    ta: 'எனக்கு டாக்ஸி வேண்டும் (Enakku taxi vendum)',
    bn: 'আমার ট্যাক্সি লাগবে (Amar taxi lagbe)',
    te: 'నాకు టాక్సీ కావాలి (Naku taxi kavali)',
    gu: 'મને ટેક્સી જોઈએ છે (Mane taxi joie chhe)',
    kn: 'ನನಗೆ ಟ್ಯಾಕ್ಸಿ ಬೇಕು (Nanage taxi beku)',
    ml: 'എനിക്ക് ടാക്സി വേണം (Enikku taxi venam)',
    pa: 'ਮੈਨੂੰ ਟੈਕਸੀ ਚਾਹੀਦੀ ਹੈ (Mainu taxi chahidi hai)'
  },
  'hospital': {
    en: 'Where is the hospital?',
    hi: 'अस्पताल कहाँ है? (Aspatal kahan hai?)',
    mr: 'रुग्णालय कुठे आहे? (Rugnalaya kuthe aahe?)',
    ta: 'மருத்துவமனை எங்கே? (Maruthuvamanai enge?)',
    bn: 'হাসপাতাল কোথায়? (Hospital kothay?)',
    te: 'ఆసుపత్రి ఎక్కడ? (Asupathri ekkada?)',
    gu: 'હોસ્પિટલ ક્યાં છે? (Hospital kyaan chhe?)',
    kn: 'ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ? (Aspatre ellide?)',
    ml: 'ആശുപത്രി എവിടെ? (Ashupathri evide?)',
    pa: 'ਹਸਪਤਾਲ ਕਿੱਥੇ ਹੈ? (Hospital kitthe hai?)'
  },
  'police': {
    en: 'I need police',
    hi: 'मुझे पुलिस चाहिए (Mujhe police chahiye)',
    mr: 'मला पोलीस हवे (Mala police have)',
    ta: 'எனக்கு காவல்துறை வேண்டும் (Enakku kavalthurai vendum)',
    bn: 'আমার পুলিশ দরকার (Amar police dorkar)',
    te: 'నాకు పోలీసు కావాలి (Naku police kavali)',
    gu: 'મને પોલીસ જોઈએ છે (Mane police joie chhe)',
    kn: 'ನನಗೆ ಪೊಲೀಸ್ ಬೇಕು (Nanage police beku)',
    ml: 'എനിക്ക് പോലീസ് വേണം (Enikku police venam)',
    pa: 'ਮੈਨੂੰ ਪੁਲਿਸ ਚਾਹੀਦੀ ਹੈ (Mainu police chahidi hai)'
  },
  'how are you': {
    en: 'How are you?',
    hi: 'आप कैसे हैं? (Aap kaise hain?)',
    mr: 'तुम्ही कसे आहात? (Tumhi kase aahat?)',
    ta: 'எப்படி இருக்கிறீர்கள்? (Eppadi irukkireergal?)',
    bn: 'আপনি কেমন আছেন? (Apni kemon achhen?)',
    te: 'మీరు ఎలా ఉన్నారు? (Meeru ela unnaru?)',
    gu: 'તમે કેવા છો? (Tame keva chho?)',
    kn: 'ನೀವು ಹೇಗಿದ್ದೀರಿ? (Neevu hegiddiri?)',
    ml: 'നിങ്ങൾ എങ്ങനെയുണ്ട്? (Ningal enganeundu?)',
    pa: 'ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ? (Tusi kive ho?)'
  },
  'yes': {
    en: 'Yes',
    hi: 'हाँ (Haan)',
    mr: 'होय (Hoy)',
    ta: 'ஆம் (Aam)',
    bn: 'হ্যাঁ (Hyan)',
    te: 'అవును (Avunu)',
    gu: 'હા (Ha)',
    kn: 'ಹೌದು (Houdu)',
    ml: 'അതെ (Athe)',
    pa: 'ਹਾਂ (Haan)'
  },
  'no': {
    en: 'No',
    hi: 'नहीं (Nahi)',
    mr: 'नाही (Nahi)',
    ta: 'இல்லை (Illai)',
    bn: 'না (Na)',
    te: 'కాదు (Kaadu)',
    gu: 'ના (Na)',
    kn: 'ಇಲ್ಲ (Illa)',
    ml: 'ഇല്ല (Illa)',
    pa: 'ਨਹੀਂ (Nahin)'
  },
  'sorry': {
    en: 'Sorry',
    hi: 'माफ़ कीजिये (Maaf kijiye)',
    mr: 'माफ करा (Maaf kara)',
    ta: 'மன்னிக்கவும் (Mannikkavum)',
    bn: 'দুঃখিত (Dukkhito)',
    te: 'క్షమించండి (Kshamimchandi)',
    gu: 'માફ કરજો (Maaf karjo)',
    kn: 'ಕ್ಷಮಿಸಿ (Kshamisi)',
    ml: 'ക്ഷമിക്കണം (Kshemikkanam)',
    pa: 'ਮਾਫ਼ ਕਰਨਾ (Maaf karna)'
  },
  'good': {
    en: 'Good',
    hi: 'अच्छा (Achha)',
    mr: 'चांगले (Changle)',
    ta: 'நல்லது (Nalladhu)',
    bn: 'ভালো (Bhalo)',
    te: 'మంచిది (Manchidi)',
    gu: 'સારું (Sarum)',
    kn: 'ಒಳ್ಳೆಯದು (Olleyadu)',
    ml: 'നല്ലത് (Nallath)',
    pa: 'ਚੰਗਾ (Changa)'
  },
  'i dont understand': {
    en: 'I don\'t understand',
    hi: 'मुझे समझ नहीं आया (Mujhe samajh nahi aaya)',
    mr: 'मला समजले नाही (Mala samajle nahi)',
    ta: 'எனக்கு புரியவில்லை (Enakku puriyavillai)',
    bn: 'আমি বুঝতে পারছি না (Ami bujhte parchi na)',
    te: 'నాకు అర్థం కాలేదు (Naku artham kaledu)',
    gu: 'મને સમજાયું નહીં (Mane samjayu nahin)',
    kn: 'ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ (Nanage arthavagalilla)',
    ml: 'എനിക്ക് മനസ്സിലായില്ല (Enikku manassilayilla)',
    pa: 'ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ (Mainu samajh nahin aaya)'
  }
};

const COMMON_PHRASES = Object.keys(TRANSLATIONS);

export function ImprovedTranslator() {
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('hi');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  const translate = () => {
    const lowerInput = inputText.toLowerCase().trim();
    
    // Try to find exact match
    if (TRANSLATIONS[lowerInput]) {
      setOutputText(TRANSLATIONS[lowerInput][toLang] || 'Translation not available');
      return;
    }

    // Try to find partial match
    for (const key of COMMON_PHRASES) {
      if (lowerInput.includes(key)) {
        setOutputText(TRANSLATIONS[key][toLang] || 'Translation not available');
        return;
      }
    }

    // If no match, show message
    setOutputText('Translation not found. Please select from common phrases below.');
  };

  const swapLanguages = () => {
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
    setInputText('');
    setOutputText('');
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'en' ? 'en-US' : `${lang}-IN`;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-800 text-white rounded-2xl p-6">
        <h2 className="text-2xl mb-2 flex items-center gap-3">
          <Languages className="w-8 h-8" />
          Language Translator
        </h2>
        <p className="text-purple-200 text-sm">Translate to Indian regional languages instantly</p>
      </div>

      {/* Language Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm text-gray-600 block mb-2">From</label>
            <select
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-900"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={swapLanguages}
            className="mt-6 p-3 bg-purple-100 text-purple-900 rounded-xl hover:bg-purple-200 transition-colors"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <label className="text-sm text-gray-600 block mb-2">To</label>
            <select
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-900"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Translation Input/Output */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="space-y-4">
          {/* Input */}
          <div>
            <label className="text-sm text-gray-600 block mb-2">Enter text or select phrase below</label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a phrase or select from common phrases..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-900 min-h-[100px] resize-none"
              />
              {inputText && (
                <button
                  onClick={() => speakText(inputText, fromLang)}
                  className="absolute top-3 right-3 p-2 text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Translate Button */}
          <button
            onClick={translate}
            className="w-full bg-purple-900 text-white py-3 rounded-xl hover:bg-purple-950 transition-colors flex items-center justify-center gap-2"
          >
            <Languages className="w-5 h-5" />
            Translate
          </button>

          {/* Output */}
          {outputText && (
            <div>
              <label className="text-sm text-gray-600 block mb-2">Translation</label>
              <div className="relative">
                <div className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-xl min-h-[100px] text-xl">
                  {outputText}
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => speakText(outputText, toLang)}
                    className="p-2 text-purple-900 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-purple-900 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Common Phrases */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-gray-900 mb-4">Common Phrases - Quick Select</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMMON_PHRASES.map(phrase => (
            <button
              key={phrase}
              onClick={() => {
                setInputText(phrase);
                setOutputText(TRANSLATIONS[phrase][toLang]);
              }}
              className="px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl transition-colors text-left text-sm"
            >
              {TRANSLATIONS[phrase]['en']}
            </button>
          ))}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
        <h3 className="text-blue-900 mb-3 flex items-center gap-2">
          💡 Usage Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Type common phrases like "hello", "thank you", "how much", etc.</li>
          <li>• Click on common phrases for instant translation</li>
          <li>• Use the speaker icon to hear the pronunciation</li>
          <li>• Copy translated text to use in conversations</li>
          <li>• Swap languages using the middle button</li>
        </ul>
      </div>
    </div>
  );
}
