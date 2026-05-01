import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Cpu, Info, MessageSquare } from "lucide-react";

// Local Knowledge Base (API இல்லாமல் நேரடியாக இயங்கும் தரவுகள்)
const KNOWLEDGE_BASE: Record<string, string> = {
  "வணக்கம்": "வணக்கம்! நான் உங்கள் சொந்த சிறிய AI. உங்களுக்கு எப்படி உதவ முடியும்?",
  "யார் நீ": "நான் ஒரு எளிய 'Rule-based AI'. எனக்கு API தேவையில்லை, நான் உங்கள் பிரவுசரிலேயே இயங்குகிறேன்.",
  "ai என்றால் என்ன": "AI (Artificial Intelligence) என்பது மனிதர்களைப் போல சிந்திக்கும் திறனை கணினிக்கு வழங்கும் ஒரு தொழில்நுட்பம்.",
  "llm என்றால் என்ன": "LLM (Large Language Model) என்பது மொழியைப் புரிந்து கொண்டு பேசும் மிகப்பொரிய AI மாடல். நான் அதன் ஒரு மிகச்சிறிய வடிவம்.",
  "எப்படி இருக்க": "நான் ஒரு கணினி நிரல் என்பதால் எனக்கு உணர்வுகள் இல்லை, ஆனால் நான் மிகச் சிறப்பாக இயங்கிக் கொண்டிருக்கிறேன்!",
  "நன்றி": "மிக்க மகிழ்ச்சி! வேறு ஏதேனும் உதவி வேண்டுமா?",
  "உன் பெயர் என்ன": "என் பெயர் 'சின்ன AI'. நான் ஒரு எளிய உள்ளூர் (Local) கருவி.",
  "default": "மன்னிக்கவும், அதைப் பற்றி எனக்குத் தெரியவில்லை. நான் இன்னும் கற்றுக் கொள்ள வேண்டும்! (குறிப்பு: வணக்கம், AI என்றால் என்ன, யார் நீ போன்றவற்றை கேட்டுப் பாருங்கள்)"
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "வணக்கம்! நான் இணையம் (Internet) அல்லது API இல்லாமலேயே இயங்கும் உங்கள் சொந்த AI. என்னிடம் எதாவது கேளுங்கள்." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getLocalResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // எளிய கீவேர்டு மேட்சிங் (Simple Keyword Matching)
    for (const key in KNOWLEDGE_BASE) {
      if (lowerQuery.includes(key.toLowerCase())) {
        return KNOWLEDGE_BASE[key];
      }
    }
    return KNOWLEDGE_BASE["default"];
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    // AI யோசிப்பது போன்ற ஒரு சிறிய தாமதம் (Simulated processing delay)
    setTimeout(() => {
      const response = getLocalResponse(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-xl">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800">My Own Local AI</h1>
            <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-widest">No API • 100% Offline</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Info className="w-5 h-5 text-slate-400 cursor-help" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Logic Explanation Card */}
        <section className="mb-8 bg-indigo-900 text-indigo-100 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> இது எப்படி வேலை செய்கிறது?
            </h2>
            <p className="text-sm opacity-90 leading-relaxed mb-4">
              இந்த கருவி எந்த ஒரு வெளி நிறுவனத்தின் (Google/OpenAI) உதவியும் இல்லாமலேயே இயங்குகிறது. 
              நீங்கள் ஒரு சொல்லைத் தட்டச்சு செய்யும் போது, அது ஏற்கனவே உள்ள தரவுகளுடன் (Knowledge Base) 
              ஒப்பிடப்பட்டு சரியான பதில் வழங்கப்படுகிறது.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase mb-1">படி 1</p>
                <p className="text-[11px]">உங்கள் கேள்வியைப் பெறுகிறது</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase mb-1">படி 2</p>
                <p className="text-[11px]">முக்கியச் சொற்களைப் பிரிக்கிறது</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase mb-1">படி 3</p>
                <p className="text-[11px]">பொருத்தமான பதிலைக் காட்டுகிறது</p>
              </div>
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </section>

        {/* Chat Interface */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[550px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-500'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                }`}>
                  {m.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white border-t border-slate-100">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="வணக்கம், பெயர், AI என்றால் என்ன..."
                className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 disabled:opacity-40 transition-colors shadow-lg shadow-indigo-200"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
