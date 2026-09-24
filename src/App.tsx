import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, ModeId, Message, MODES, BOSS_VERIFICATION } from './types';
import { loadState, saveState, addMessage, getInitials, generateId } from './store';
import { generateResponse, getThinkingFiller } from './ai';

/* ═══════════════════════════════════════════
   TOAST NOTIFICATION
   ═══════════════════════════════════════════ */
function ToastNotification({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className="fixed top-5 left-1/2 z-[100] animate-slide-down" style={{ transform: 'translateX(-50%)' }}>
      <div className="bg-gray-800/95 backdrop-blur-xl text-white px-6 py-3 rounded-full shadow-2xl border border-white/10 text-sm font-medium flex items-center gap-2">
        {message}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FIRST TIME SETUP
   ═══════════════════════════════════════════ */
function FirstTimeSetup({ onComplete }: { onComplete: (userName: string, assistantName: string) => void }) {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [assistantName, setAssistantName] = useState('DK');

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center p-6 z-50">
      <div className="max-w-md w-full">
        {step === 0 && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="relative w-36 h-36 mx-auto">
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping-slow" />
              <div className="absolute inset-2 rounded-full bg-indigo-500/10 animate-pulse-slow" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
                <span className="text-5xl font-bold text-white relative z-10">DK</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">DK AI Assistant</h1>
              <p className="text-gray-400 text-lg">आपका personal AI साथी</p>
              <p className="text-gray-500 text-sm mt-1">Voice • Chat • Smart Modes</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
            >
              शुरू करें ✨
            </button>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl mb-3">👋</div>
              <h2 className="text-2xl font-bold text-white">आपका नाम बताइए</h2>
              <p className="text-gray-400 text-sm mt-1">इस नाम से DK आपको बुलाएगा</p>
            </div>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="जैसे: Dheeraj, Boss, Raja..."
              className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 text-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
              autoFocus
            />
            <button
              onClick={() => userName.trim() && setStep(2)}
              disabled={!userName.trim()}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              आगे बढ़ें →
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl mb-3">🤖</div>
              <h2 className="text-2xl font-bold text-white">Assistant का नाम</h2>
              <p className="text-gray-400 text-sm mt-1">आपका AI assistant किस नाम से जाना जाए?</p>
            </div>
            <input
              type="text"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              placeholder="DK"
              className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 text-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
            />
            <button
              onClick={() => onComplete(userName.trim(), assistantName.trim() || 'DK')}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
            >
              शुरू करें! 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ORB SCREEN (HOME)
   ═══════════════════════════════════════════ */
function OrbScreen({ state, onOpenChat, onOpenSettings, isListening, isSpeaking, onStartListen }: {
  state: AppState;
  onOpenChat: () => void;
  onOpenSettings: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  onStartListen: () => void;
}) {
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 5) return 'Good Night';
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    if (h < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getGreetingEmoji = () => {
    const h = new Date().getHours();
    if (h < 5) return '🌙';
    if (h < 12) return '🌅';
    if (h < 17) return '☀️';
    if (h < 21) return '🌆';
    return '🌙';
  };

  const activeModes = Object.entries(state.activeModes)
    .filter(([id, on]) => on && id !== 'normal')
    .map(([id]) => MODES.find(m => m.id === id))
    .filter(Boolean);

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-indigo-950/20 to-transparent" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-6 pb-2">
        <div>
          <p className="text-gray-500 text-xs font-medium flex items-center gap-1">
            {getGreetingEmoji()} {getGreeting()}
          </p>
          <h1 className="text-xl font-bold text-white mt-0.5">{state.userName}</h1>
        </div>
        <div className="flex items-center gap-2">
          {state.bossVerified && (
            <div className="flex items-center gap-1 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/20">
              <span className="text-xs">👑</span>
              <span className="text-amber-400 text-[10px] font-semibold">VERIFIED</span>
            </div>
          )}
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
          >
            <i className="fas fa-gear text-gray-300"></i>
          </button>
        </div>
      </div>

      {/* Orb Center */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="relative cursor-pointer group" onClick={onOpenChat}>
          {/* Outer rings */}
          <div className={`absolute inset-0 -m-12 rounded-full transition-all duration-700 ${isListening ? 'bg-green-500/10 animate-ping-slow' : 'bg-indigo-500/5 animate-pulse-slow'}`} />
          <div className={`absolute inset-0 -m-6 rounded-full transition-all duration-500 ${isSpeaking ? 'bg-blue-500/15 animate-pulse' : 'bg-indigo-500/8'}`} />
          
          {/* Main orb */}
          <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 flex items-center justify-center shadow-2xl shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-500 relative overflow-hidden group-active:scale-95">
            {/* Glass effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/15 via-transparent to-transparent" />
            <div className="absolute top-4 left-1/4 w-20 h-10 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-6 right-6 w-12 h-12 bg-purple-400/10 rounded-full blur-lg" />
            
            {/* DK Text */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight" style={{ textShadow: '0 0 30px rgba(99,102,241,0.5)' }}>DK</span>
              <span className="text-[10px] text-white/50 font-medium tracking-widest mt-1">AI ASSISTANT</span>
            </div>
          </div>
        </div>

        {/* Status pill */}
        <div className="mt-8 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <div className={`w-2 h-2 rounded-full transition-colors ${isListening ? 'bg-green-400 animate-pulse' : isSpeaking ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-xs text-gray-400 font-medium tracking-wide">
            {isListening ? 'LISTENING...' : isSpeaking ? 'SPEAKING...' : 'TAP ORB TO TALK'}
          </span>
          {isListening && (
            <div className="flex items-center gap-[2px] ml-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-[2px] bg-green-400/70 rounded-full animate-soundwave" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active modes */}
      {activeModes.length > 0 && (
        <div className="relative z-10 px-5 pb-2">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {activeModes.map(mode => mode && (
              <div
                key={mode.id}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border"
                style={{ backgroundColor: mode.accentBg, color: mode.accentColor, borderColor: `${mode.accentColor}25` }}
              >
                <span>{mode.icon}</span>
                <span>{mode.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="relative z-10 px-5 pb-8 pt-2">
        <div className="flex gap-3 max-w-sm mx-auto">
          <button
            onClick={onOpenChat}
            className="flex-1 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-medium text-sm hover:bg-white/10 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          >
            <i className="fas fa-comment-dots text-indigo-400"></i>
            Chat
          </button>
          <button
            onClick={() => { onOpenChat(); onStartListen(); }}
            className="flex-1 py-3.5 bg-indigo-500/15 border border-indigo-500/25 rounded-2xl text-indigo-300 font-medium text-sm hover:bg-indigo-500/25 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          >
            <i className="fas fa-microphone text-indigo-400"></i>
            Voice
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CHAT VIEW
   ═══════════════════════════════════════════ */
function ChatView({ state, messages, onSend, onBack, isListening, isSpeaking, onStartListen, onStopListen, activeMode, onChangeMode, interimText }: {
  state: AppState;
  messages: Message[];
  onSend: (text: string, image?: string) => void;
  onBack: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  onStartListen: () => void;
  onStopListen: () => void;
  activeMode: ModeId;
  onChangeMode: (mode: ModeId) => void;
  interimText: string;
}) {
  const [input, setInput] = useState('');
  const [showModePicker, setShowModePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDictating, setIsDictating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dictationRef = useRef<any>(null);
  const dictationTimeoutRef = useRef<any>(null);

  const mode = MODES.find(m => m.id === activeMode) || MODES[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() || selectedImage) {
      onSend(input.trim(), selectedImage || undefined);
      setInput('');
      setSelectedImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Dictation (Part 15)
  const startDictation = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN';

    recognition.onresult = (event: any) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setInput(text);
      // Reset auto-send timer
      if (dictationTimeoutRef.current) clearTimeout(dictationTimeoutRef.current);
      dictationTimeoutRef.current = setTimeout(() => {
        if (text.trim()) {
          onSend(text.trim());
          setInput('');
          setIsDictating(false);
        }
      }, 7000);
    };

    recognition.onend = () => {
      setIsDictating(false);
      if (dictationTimeoutRef.current) clearTimeout(dictationTimeoutRef.current);
    };

    recognition.onerror = () => setIsDictating(false);

    try {
      recognition.start();
      setIsDictating(true);
      dictationRef.current = recognition;
    } catch(e) {}
  };

  const stopDictation = () => {
    if (dictationRef.current) {
      try { dictationRef.current.stop(); } catch(e) {}
    }
    setIsDictating(false);
    if (dictationTimeoutRef.current) clearTimeout(dictationTimeoutRef.current);
  };

  // Quick action suggestions
  const quickActions = getQuickActions(activeMode);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/90 backdrop-blur-xl border-b border-white/5 relative z-20">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
          <i className="fas fa-arrow-left text-white text-sm"></i>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{mode.icon}</span>
            <h2 className="text-white font-semibold text-sm truncate">{mode.name} Mode</h2>
            {state.activeModes[activeMode] && <div className="w-1.5 h-1.5 rounded-full bg-green-400" />}
          </div>
          <p className="text-gray-500 text-[11px]">{mode.nameHi} मोड • {mode.voiceGender === 'female' ? '👩' : '👨'} {mode.voiceGender} voice</p>
        </div>
        <button
          onClick={() => setShowModePicker(!showModePicker)}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <i className="fas fa-layer-group text-gray-400 text-sm"></i>
        </button>
        <button
          onClick={isListening ? onStopListen : onStartListen}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${isListening ? 'bg-red-500/20 border border-red-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
        >
          <i className={`fas fa-microphone text-sm ${isListening ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}></i>
        </button>
      </div>

      {/* Mode picker dropdown */}
      {showModePicker && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowModePicker(false)} />
          <div className="absolute top-14 right-4 z-40 bg-gray-800/98 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-2 min-w-[220px] animate-fade-in">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => { onChangeMode(m.id); setShowModePicker(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${activeMode === m.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <span className="text-lg">{m.icon}</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{m.name}</p>
                  <p className="text-gray-500 text-[11px]">{m.nameHi}</p>
                </div>
                {state.activeModes[m.id] && <span className="w-2 h-2 rounded-full bg-green-400" />}
                {activeMode === m.id && <i className="fas fa-check text-indigo-400 text-xs"></i>}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ background: `linear-gradient(180deg, ${mode.accentBg.replace('0.1', '0.02')} 0%, transparent 100%)` }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4" style={{ backgroundColor: mode.accentBg }}>
              {mode.icon}
            </div>
            <h3 className="text-white font-bold text-lg mb-1">{mode.name} Mode</h3>
            <p className="text-gray-500 text-sm mb-6">
              {mode.id === 'dosti' && 'दोस्ताना बातचीत — कुछ भी पूछो!'}
              {mode.id === 'professional' && 'Deep Q&A — Tech, Career, Legal, Health...'}
              {mode.id === 'girlfriend' && 'Sweet & caring conversations 💕'}
              {mode.id === 'teacher' && 'Class 1 से MBA/Medical तक — सब पढ़ाऊंगा!'}
              {mode.id === 'contentWriting' && '60-second scripts for Instagram/YouTube'}
              {mode.id === 'story' && 'कहानी लिखो — topic बताइए!'}
              {mode.id === 'prompt' && 'Image upload → prompt generate'}
              {mode.id === 'normal' && 'कुछ भी पूछिए या बोलिए!'}
            </p>
            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => onSend(action)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-xs hover:bg-white/10 transition-all"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20'}`}>
                {msg.role === 'user' ? getInitials(state.userName) : 'DK'}
              </div>
              <div className={`rounded-2xl px-4 py-2.5 ${msg.role === 'user' ? 'bg-indigo-500/15 text-white rounded-tr-sm border border-indigo-500/10' : 'bg-white/[0.04] text-gray-100 rounded-tl-sm border border-white/5'}`}>
                {msg.image && (
                  <div className="mb-2">
                    <img src={msg.image} alt="uploaded" className="rounded-lg max-w-full max-h-40 object-cover" />
                    <p className="text-[10px] text-gray-500 mt-1">📷 Image attached</p>
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{formatMessage(msg.content)}</div>
                <p className="text-[9px] text-gray-600 mt-1.5">{new Date(msg.timestamp).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        ))}

        {interimText && (
          <div className="flex justify-end animate-fade-in">
            <div className="bg-indigo-500/10 border border-indigo-500/10 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-sm text-indigo-300 italic">{interimText}...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected image preview */}
      {selectedImage && (
        <div className="px-4 py-2 bg-gray-900/50 border-t border-white/5">
          <div className="relative inline-block">
            <img src={selectedImage} alt="preview" className="h-14 rounded-lg border border-white/10" />
            <button onClick={() => setSelectedImage(null)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg">✕</button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 bg-gray-900/90 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all flex-shrink-0 active:scale-95"
            title="Upload image for understanding"
          >
            <i className="fas fa-image text-gray-500 text-sm"></i>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isDictating ? 'बोलिए... (auto-send in 7s)' : 'Type a message...'}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-400/40 focus:ring-1 focus:ring-indigo-400/20 transition-all"
            />
          </div>

          {input.trim() ? (
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center hover:bg-indigo-600 transition-all flex-shrink-0 active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              <i className="fas fa-paper-plane text-white text-sm"></i>
            </button>
          ) : (
            <button
              onClick={isDictating ? stopDictation : startDictation}
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95 ${isDictating ? 'bg-red-500/20 border border-red-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
              title="Voice dictation"
            >
              <i className={`fas fa-microphone text-sm ${isDictating ? 'text-red-400 animate-pulse' : 'text-gray-500'}`}></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getQuickActions(mode: ModeId): string[] {
  switch (mode) {
    case 'dosti': return ['क्या हाल है?', 'कुछ मज़ेदार बताओ', 'Aaj ka mood'];
    case 'professional': return ['YouTube growth tips', 'Online earning', 'Career advice'];
    case 'girlfriend': return ['I miss you', 'Good morning', 'Tell me something sweet'];
    case 'teacher': return ['Maths समझाओ', 'Science concepts', 'English grammar'];
    case 'contentWriting': return ['New script लिखो', 'Script review', 'Tech niche script'];
    case 'story': return ['गाँव की कहानी', 'Love story', 'Suspense thriller'];
    case 'prompt': return ['Image upload करें', 'Thumbnail prompt', 'Style analysis'];
    default: return ['What can you do?', 'Features बताओ', 'Mode switch करो'];
  }
}

function formatMessage(text: string): React.ReactNode {
  // Simple markdown-like formatting
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold
    let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    // Bullet points
    if (formatted.startsWith('• ') || formatted.startsWith('- ')) {
      formatted = `<span class="text-indigo-300">•</span> ${formatted.substring(2)}`;
    }
    return <span key={i} dangerouslySetInnerHTML={{ __html: formatted }} className="block" />;
  });
}

/* ═══════════════════════════════════════════
   SETTINGS VIEW
   ═══════════════════════════════════════════ */
function SettingsView({ state, onBack, onUpdate, onToast }: {
  state: AppState;
  onBack: () => void;
  onUpdate: (updates: Partial<AppState>) => void;
  onToast: (msg: string) => void;
}) {
  const [section, setSection] = useState<string | null>(null);
  const [screenGuardPin, setScreenGuardPin] = useState('');
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showBossVerification, setShowBossVerification] = useState(false);
  const [bossAnswer, setBossAnswer] = useState('');
  const [bossStep, setBossStep] = useState(0);

  const toggleMode = (modeId: ModeId) => {
    const newModes = { ...state.activeModes };
    const mode = MODES.find(m => m.id === modeId);
    if (!mode) return;
    if (!newModes[modeId] && mode.mutuallyExclusive) {
      for (const excl of mode.mutuallyExclusive) newModes[excl] = false;
    }
    newModes[modeId] = !newModes[modeId];
    onUpdate({ activeModes: newModes });
    onToast(`${mode.icon} ${mode.name} Mode ${newModes[modeId] ? 'ON' : 'OFF'}`);
  };

  const setupScreenGuard = () => {
    if (screenGuardPin.length >= 4) {
      onUpdate({ screenGuard: { ...state.screenGuard, enabled: true, pin: screenGuardPin } });
      setShowPinSetup(false);
      setScreenGuardPin('');
      onToast('🛡️ Screen Guard Active!');
    }
  };

  const handleBossVerify = () => {
    if (bossStep < BOSS_VERIFICATION.length) {
      if (bossAnswer.trim().toLowerCase() === BOSS_VERIFICATION[bossStep].a.toLowerCase()) {
        if (bossStep === BOSS_VERIFICATION.length - 1) {
          onUpdate({ bossVerified: true });
          onToast('👑 Boss Verified!');
          setShowBossVerification(false);
        } else {
          setBossStep(bossStep + 1);
          setBossAnswer('');
        }
      } else {
        setBossAnswer('');
        onToast('❌ गलत जवाब!');
      }
    }
  };

  if (section === 'privacy') {
    return (
      <SettingsPage title="Privacy & Security" onBack={() => setSection(null)}>
        <div className="space-y-4">
          <InfoCard icon="🔒" title="Local Storage (100% Device)">
            <ul className="text-gray-400 text-sm space-y-1.5">
              <li>• User/Assistant names — device local only</li>
              <li>• Conversation memory — local, auto-expires 12 days</li>
              <li>• Screen Guard PIN & photos — local only</li>
              <li>• Contacts mapping — local only</li>
            </ul>
          </InfoCard>
          <InfoCard icon="☁️" title="Firebase Sync (Settings Only)">
            <ul className="text-gray-400 text-sm space-y-1.5">
              <li>• Mode toggles & settings synced for multi-device</li>
              <li>• NOT shared with anyone else</li>
              <li>• No personal data synced</li>
            </ul>
          </InfoCard>
          <InfoCard icon="🎤" title="Microphone & Camera">
            <ul className="text-gray-400 text-sm space-y-1.5">
              <li>• Mic: Voice input & conversation only</li>
              <li>• Camera: Screen Guard captures only</li>
              <li>• Photos never leave device</li>
            </ul>
          </InfoCard>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
            <p className="text-amber-300 text-sm">⚠️ DK honestly answers privacy questions based on this actual setup — never oversells protection beyond what's implemented.</p>
          </div>
        </div>
      </SettingsPage>
    );
  }

  if (section === 'contacts') {
    return (
      <SettingsPage title="My Contacts" onBack={() => setSection(null)}>
        <div className="space-y-3">
          <p className="text-gray-500 text-xs">Web app cannot read phone contacts. Add manually:</p>
          {state.contacts.map((c, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-sm border border-indigo-500/20">
                {c.name[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{c.name}</p>
                <p className="text-gray-500 text-xs">{c.number}</p>
              </div>
              <button onClick={() => onUpdate({ contacts: state.contacts.filter((_, idx) => idx !== i) })} className="text-red-400/70 hover:text-red-400 p-2">
                <i className="fas fa-trash text-xs"></i>
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const name = prompt('Contact name:');
              if (name) {
                const number = prompt('Phone number:');
                if (number) onUpdate({ contacts: [...state.contacts, { name, number }] });
              }
            }}
            className="w-full py-3 bg-white/5 border border-dashed border-white/15 rounded-xl text-gray-400 text-sm hover:bg-white/10 transition-all"
          >
            + Add Contact
          </button>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mt-4">
            <p className="text-blue-300 text-xs">💡 Deep links supported: tel:, sms:, wa.me, mailto:, YouTube, Maps</p>
          </div>
        </div>
      </SettingsPage>
    );
  }

  if (section === 'controlCenter') {
    return (
      <SettingsPage title="Control Center" onBack={() => setSection(null)}>
        <p className="text-gray-500 text-xs mb-4">All registered modes & their current state:</p>
        <div className="space-y-2">
          {MODES.map(m => (
            <div key={m.id} className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xl">{m.icon}</span>
                <div>
                  <p className="text-white text-sm font-medium">{m.name}</p>
                  <p className="text-gray-600 text-[11px]">{m.nameHi} • {m.voiceGender} voice</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-[11px] font-semibold ${state.activeModes[m.id] ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-gray-500/15 text-gray-500 border border-gray-500/20'}`}>
                {state.activeModes[m.id] ? 'ON' : 'OFF'}
              </div>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-3"><span className="text-xl">🛡️</span><p className="text-white text-sm font-medium">Screen Guard</p></div>
              <div className={`px-3 py-1 rounded-full text-[11px] font-semibold ${state.screenGuard.enabled ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-gray-500/15 text-gray-500 border border-gray-500/20'}`}>
                {state.screenGuard.enabled ? 'ON' : 'OFF'}
              </div>
            </div>
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-3"><span className="text-xl">🔲</span><p className="text-white text-sm font-medium">Pocket Mode</p></div>
              <div className={`px-3 py-1 rounded-full text-[11px] font-semibold ${state.pocketMode ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-gray-500/15 text-gray-500 border border-gray-500/20'}`}>
                {state.pocketMode ? 'ON' : 'OFF'}
              </div>
            </div>
          </div>
        </div>
      </SettingsPage>
    );
  }

  if (section === 'screenGuardPhotos') {
    return (
      <SettingsPage title="Guard Photos" onBack={() => setSection(null)}>
        {state.screenGuard.capturedPhotos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📷</div>
            <p className="text-gray-500 text-sm">No captured photos yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {state.screenGuard.capturedPhotos.map((p, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden border border-white/10">
                <img src={p.data} alt="captured" className="w-full h-32 object-cover" />
                <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] text-gray-300 px-2 py-1">
                  {new Date(p.timestamp).toLocaleString('hi-IN')}
                </p>
              </div>
            ))}
          </div>
        )}
      </SettingsPage>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/90 backdrop-blur-xl border-b border-white/5">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
          <i className="fas fa-arrow-left text-white text-sm"></i>
        </button>
        <h2 className="text-white font-bold text-lg">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Profile */}
        <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">👤 Profile</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">User Name</span>
              <span className="text-white text-sm font-medium bg-white/5 px-3 py-1 rounded-lg">{state.userName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Assistant Name</span>
              <span className="text-white text-sm font-medium bg-white/5 px-3 py-1 rounded-lg">{state.assistantName}</span>
            </div>
          </div>
        </div>

        {/* Boss Verification */}
        <div className="bg-amber-500/5 rounded-2xl p-4 border border-amber-500/15">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-400">🔒</span>
              <h3 className="text-amber-300 font-semibold text-sm">Boss Verification</h3>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${state.bossVerified ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-gray-500/15 text-gray-400 border border-gray-500/20'}`}>
              {state.bossVerified ? '✅ VERIFIED' : 'NOT VERIFIED'}
            </span>
          </div>
          <p className="text-gray-500 text-xs mb-2">Identity-recognition only. No edit/reset UI.</p>
          {!state.bossVerified && (
            <button onClick={() => { setShowBossVerification(true); setBossStep(0); setBossAnswer(''); }} className="text-amber-400 text-xs font-medium hover:text-amber-300">
              Verify Now →
            </button>
          )}
          {showBossVerification && (
            <div className="mt-3 space-y-2 animate-fade-in">
              <p className="text-gray-300 text-xs">{BOSS_VERIFICATION[bossStep].q}</p>
              <input
                type="text"
                value={bossAnswer}
                onChange={(e) => setBossAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBossVerify()}
                placeholder="Answer..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                autoFocus
              />
              <button onClick={handleBossVerify} className="w-full py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-300 text-sm font-medium">
                Submit ({bossStep + 1}/{BOSS_VERIFICATION.length})
              </button>
            </div>
          )}
        </div>

        {/* Personality Modes */}
        <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">🎭 Personality Modes</h3>
          <p className="text-gray-600 text-[11px] mb-3">Toggle ON/OFF — also controllable by voice command</p>
          <div className="space-y-1">
            {MODES.filter(m => m.id !== 'normal').map(m => (
              <div key={m.id} className="flex items-center justify-between py-2.5 px-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{m.icon}</span>
                  <div>
                    <span className="text-white text-sm">{m.name}</span>
                    <span className="text-gray-600 text-[11px] ml-2">{m.voiceGender === 'female' ? '👩' : '👨'}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleMode(m.id)}
                  className={`w-11 h-6 rounded-full transition-all relative ${state.activeModes[m.id] ? 'bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-gray-700'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${state.activeModes[m.id] ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Screen Guard */}
        <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span>🛡️</span>
              <h3 className="text-white font-semibold text-sm">Screen Guard</h3>
            </div>
            <button
              onClick={() => {
                if (state.screenGuard.enabled) {
                  onUpdate({ screenGuard: { ...state.screenGuard, enabled: false } });
                  onToast('🛡️ Screen Guard OFF');
                } else {
                  setShowPinSetup(!showPinSetup);
                }
              }}
              className={`w-11 h-6 rounded-full transition-all relative ${state.screenGuard.enabled ? 'bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-gray-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${state.screenGuard.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <p className="text-gray-600 text-[11px]">Detects unauthorized touch/motion. Siren + photo capture.</p>
          {state.screenGuard.enabled && (
            <div className="mt-2 flex gap-2">
              <span className="text-green-400 text-xs">✅ Active</span>
              <button onClick={() => setSection('screenGuardPhotos')} className="text-indigo-400 text-xs hover:text-indigo-300">View Photos →</button>
            </div>
          )}
          {showPinSetup && !state.screenGuard.enabled && (
            <div className="mt-3 space-y-2 animate-fade-in">
              <input
                type="password"
                maxLength={6}
                value={screenGuardPin}
                onChange={(e) => setScreenGuardPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4-6 digit PIN"
                className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-400/50 tracking-[0.3em] text-center"
              />
              <button
                onClick={setupScreenGuard}
                disabled={screenGuardPin.length < 4}
                className="w-full py-2.5 bg-indigo-500 rounded-xl text-white text-sm font-medium disabled:opacity-40 transition-all"
              >
                Set PIN & Activate 🛡️
              </button>
            </div>
          )}
        </div>

        {/* Pocket Mode */}
        <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🔲</span>
              <h3 className="text-white font-semibold text-sm">Pocket Mode</h3>
            </div>
            <button
              onClick={() => {
                onUpdate({ pocketMode: !state.pocketMode });
                onToast(`🔲 Pocket Mode ${!state.pocketMode ? 'ON' : 'OFF'}`);
              }}
              className={`w-11 h-6 rounded-full transition-all relative ${state.pocketMode ? 'bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-gray-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${state.pocketMode ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <p className="text-gray-600 text-[11px] mt-1">Black screen, touch disabled, voice only. Exit via voice command.</p>
        </div>

        {/* Navigation items */}
        <div className="space-y-2">
          {[
            { id: 'contacts', icon: '📱', label: 'My Contacts', sub: 'Name → Number mapping' },
            { id: 'controlCenter', icon: '🎛️', label: 'Control Center', sub: 'All modes status' },
            { id: 'privacy', icon: '🔐', label: 'Privacy & Security', sub: 'Data & permissions info' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className="w-full flex items-center gap-3 bg-white/[0.03] rounded-2xl p-4 border border-white/5 hover:bg-white/[0.06] transition-all active:scale-[0.99]"
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-gray-600 text-[11px]">{item.sub}</p>
              </div>
              <i className="fas fa-chevron-right text-gray-600 text-xs"></i>
            </button>
          ))}
        </div>

        {/* Version */}
        <div className="text-center py-6">
          <p className="text-gray-700 text-[11px]">DK AI v1.0 • Built with ❤️ for Boss</p>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/90 backdrop-blur-xl border-b border-white/5">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
          <i className="fas fa-arrow-left text-white text-sm"></i>
        </button>
        <h2 className="text-white font-bold">{title}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
      <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">{icon} {title}</h3>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   POCKET MODE OVERLAY
   ═══════════════════════════════════════════ */
function PocketModeOverlay() {
  return (
    <div className="fixed inset-0 bg-black z-[200] flex items-center justify-center">
      <p className="text-gray-900 text-[10px] select-none">Pocket Mode Active — Say "DK, Pocket Mode OFF"</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [toast, setToast] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Persist state
  useEffect(() => { saveState(state); }, [state]);

  // Init speech synthesis
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }, []);

  // Init speech recognition
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN';

    recognition.onresult = (event: any) => {
      let interim = '', final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setInterimText(interim);
      if (final) {
        handleVoiceInput(final.trim());
        setInterimText('');
      }
    };

    recognition.onerror = (event: any) => {
      if ((event.error === 'no-speech' || event.error === 'aborted') && shouldListenRef.current) {
        setTimeout(() => { try { recognition.start(); } catch(e) {} }, 300);
      }
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        setTimeout(() => { try { recognition.start(); } catch(e) {} }, 300);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    return () => { shouldListenRef.current = false; try { recognition.stop(); } catch(e) {} };
  }, []);

  // Page Visibility (Part 21)
  useEffect(() => {
    const handler = () => {
      if (document.hidden) return;
      setState(prev => ({
        ...prev,
        activeModes: { normal: true, dosti: true, professional: false, girlfriend: false, teacher: false, contentWriting: false, story: false, prompt: false },
        currentScreen: 'orb',
      }));
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    shouldListenRef.current = true;
    try { recognitionRef.current.start(); setIsListening(true); } catch(e) {}
  }, []);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(e) {}
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string, gender: 'male' | 'female' = 'female') => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[*#_~`🔒👑✅❌💕📚💼🤝📖✍️🎨🛡️🔲🚀✨👋🎭📱🎛️🔐•]/g, ''));
    u.lang = 'hi-IN';
    u.rate = 0.95;
    u.pitch = gender === 'female' ? 1.1 : 0.85;
    const voices = synthRef.current.getVoices();
    let v = voices.find(v => v.lang.includes('hi') && (gender === 'female' ? /female|priya|lekha/i.test(v.name) : /male|ravi|hemant/i.test(v.name)));
    if (!v) v = voices.find(v => v.lang.includes('hi'));
    if (!v) v = voices.find(v => v.lang.includes('en'));
    if (v) u.voice = v;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(u);
  }, []);

  const getActiveChatMode = useCallback((modes: Record<ModeId, boolean>): ModeId => {
    const p: ModeId[] = ['girlfriend', 'professional', 'teacher', 'story', 'contentWriting', 'prompt', 'dosti', 'normal'];
    for (const m of p) if (modes[m]) return m;
    return 'normal';
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleVoiceInput = useCallback((text: string) => {
    const lower = text.toLowerCase();

    // Pocket mode exit
    if (state.pocketMode && (/pocket.*off|pocket mode off/.test(lower))) {
      setState(prev => ({ ...prev, pocketMode: false }));
      showToast('🔲 Pocket Mode OFF');
      speak('Pocket Mode band kar diya');
      return;
    }

    // Mode switch commands
    const cmds: { re: RegExp; mode: ModeId | string; on: boolean }[] = [
      { re: /professional.*on|प्रोफेशनल.*ऑन/, mode: 'professional', on: true },
      { re: /professional.*off/, mode: 'professional', on: false },
      { re: /girlfriend.*on/, mode: 'girlfriend', on: true },
      { re: /girlfriend.*off/, mode: 'girlfriend', on: false },
      { re: /teacher.*on|शिक्षक.*ऑन|टीचर.*ऑन/, mode: 'teacher', on: true },
      { re: /teacher.*off|टीचर.*ऑफ/, mode: 'teacher', on: false },
      { re: /dosti.*on|दोस्ती.*ऑन/, mode: 'dosti', on: true },
      { re: /dosti.*off|दोस्ती.*ऑफ/, mode: 'dosti', on: false },
      { re: /story.*on|कहानी.*ऑन/, mode: 'story', on: true },
      { re: /story.*off|कहानी.*ऑफ/, mode: 'story', on: false },
      { re: /content.*on|कंटेंट.*ऑन/, mode: 'contentWriting', on: true },
      { re: /content.*off|कंटेंट.*ऑफ/, mode: 'contentWriting', on: false },
      { re: /prompt.*on|प्रॉम्प्ट.*ऑन/, mode: 'prompt', on: true },
      { re: /prompt.*off|प्रॉम्प्ट.*ऑफ/, mode: 'prompt', on: false },
      { re: /pocket.*on|पॉकेट.*ऑन/, mode: 'pocket', on: true },
      { re: /pocket.*off|पॉकेट.*ऑफ/, mode: 'pocket', on: false },
    ];

    for (const cmd of cmds) {
      if (cmd.re.test(lower)) {
        if (cmd.mode === 'pocket') {
          setState(prev => ({ ...prev, pocketMode: cmd.on }));
          showToast(`🔲 Pocket Mode ${cmd.on ? 'ON' : 'OFF'}`);
          speak(`Pocket Mode ${cmd.on ? 'chalu' : 'band'}`);
        } else {
          const modeObj = MODES.find(m => m.id === cmd.mode);
          if (modeObj) {
            setState(prev => {
              const newModes = { ...prev.activeModes };
              if (cmd.on && modeObj.mutuallyExclusive) {
                for (const excl of modeObj.mutuallyExclusive) newModes[excl] = false;
              }
              newModes[cmd.mode as ModeId] = cmd.on;
              return { ...prev, activeModes: newModes };
            });
            showToast(`${modeObj.icon} ${modeObj.name} Mode ${cmd.on ? 'ON' : 'OFF'}`);
            speak(`${modeObj.name} mode ${cmd.on ? 'on' : 'off'} kar diya`, modeObj.voiceGender);
          }
        }
        return;
      }
    }

    // Regular message
    const currentMode = getActiveChatMode(state.activeModes);
    if (state.currentScreen === 'orb') {
      setState(prev => ({ ...prev, currentScreen: 'chat', activeChatMode: currentMode }));
    }

    const userMsg: Message = { id: generateId(), role: 'user', content: text, timestamp: Date.now(), mode: currentMode };
    setState(prev => addMessage(prev, currentMode, userMsg));

    // Thinking filler
    setTimeout(() => speak(getThinkingFiller(), MODES.find(m => m.id === currentMode)?.voiceGender || 'female'), 200);

    // Generate response
    setTimeout(() => {
      const response = generateResponse(text, {
        mode: currentMode,
        userName: state.userName,
        assistantName: state.assistantName,
        activeModes: state.activeModes,
        conversationHistory: (state.conversations[currentMode] || []).map(m => ({ role: m.role, content: m.content })),
      });
      const assistantMsg: Message = { id: generateId(), role: 'assistant', content: response, timestamp: Date.now(), mode: currentMode };
      setState(prev => addMessage(prev, currentMode, assistantMsg));
      speak(response.replace(/[*#_~`]/g, '').substring(0, 300), MODES.find(m => m.id === currentMode)?.voiceGender || 'female');
    }, 1200);
  }, [state, speak, getActiveChatMode, showToast]);

  const handleSend = useCallback((text: string, image?: string) => {
    const currentMode = getActiveChatMode(state.activeModes);
    const userMsg: Message = { id: generateId(), role: 'user', content: text, timestamp: Date.now(), mode: currentMode, image };
    setState(prev => addMessage(prev, currentMode, userMsg));

    setTimeout(() => {
      const response = generateResponse(text, {
        mode: currentMode,
        userName: state.userName,
        assistantName: state.assistantName,
        activeModes: state.activeModes,
        conversationHistory: (state.conversations[currentMode] || []).map(m => ({ role: m.role, content: m.content })),
      });
      const assistantMsg: Message = { id: generateId(), role: 'assistant', content: response, timestamp: Date.now(), mode: currentMode };
      setState(prev => addMessage(prev, currentMode, assistantMsg));
    }, 600);
  }, [state, getActiveChatMode]);

  const handleSetupComplete = (userName: string, assistantName: string) => {
    setState(prev => ({ ...prev, userName, assistantName, setupComplete: true, currentScreen: 'orb' }));
  };

  // RENDER
  if (!state.setupComplete) return <FirstTimeSetup onComplete={handleSetupComplete} />;

  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950/80 text-white overflow-hidden relative">
      {toast && <ToastNotification message={toast} onDismiss={() => setToast(null)} />}
      {state.pocketMode && <PocketModeOverlay />}

      <div className="h-full w-full max-w-lg mx-auto relative">
        {state.currentScreen === 'orb' && (
          <OrbScreen
            state={state}
            onOpenChat={() => {
              setState(prev => ({ ...prev, currentScreen: 'chat', activeChatMode: getActiveChatMode(prev.activeModes) }));
              startListening();
            }}
            onOpenSettings={() => setState(prev => ({ ...prev, currentScreen: 'settings' }))}
            isListening={isListening}
            isSpeaking={isSpeaking}
            onStartListen={startListening}
          />
        )}
        {state.currentScreen === 'chat' && (
          <ChatView
            state={state}
            messages={state.conversations[state.activeChatMode] || []}
            onSend={handleSend}
            onBack={() => { setState(prev => ({ ...prev, currentScreen: 'orb' })); stopListening(); }}
            isListening={isListening}
            isSpeaking={isSpeaking}
            onStartListen={startListening}
            onStopListen={stopListening}
            activeMode={state.activeChatMode}
            onChangeMode={(mode) => setState(prev => ({ ...prev, activeChatMode: mode }))}
            interimText={interimText}
          />
        )}
        {state.currentScreen === 'settings' && (
          <SettingsView
            state={state}
            onBack={() => setState(prev => ({ ...prev, currentScreen: 'orb' }))}
            onUpdate={(updates) => setState(prev => ({ ...prev, ...updates }))}
            onToast={showToast}
          />
        )}
      </div>
    </div>
  );
}
