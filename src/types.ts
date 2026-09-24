export type ModeId = 'normal' | 'dosti' | 'professional' | 'girlfriend' | 'teacher' | 'contentWriting' | 'story' | 'prompt';

export interface Mode {
  id: ModeId;
  name: string;
  nameHi: string;
  icon: string;
  accentColor: string;
  accentBg: string;
  voiceGender: 'male' | 'female';
  defaultOn: boolean;
  mutuallyExclusive?: ModeId[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  mode: ModeId;
  image?: string;
}

export interface ConversationMemory {
  mode: ModeId;
  messages: Message[];
  lastAccessed: number;
}

export interface ScreenGuardConfig {
  enabled: boolean;
  pin: string;
  referencePhoto?: string;
  capturedPhotos: { data: string; timestamp: number }[];
}

export interface AppState {
  userName: string;
  assistantName: string;
  setupComplete: boolean;
  activeModes: Record<ModeId, boolean>;
  currentScreen: 'orb' | 'chat' | 'settings' | 'setup';
  activeChatMode: ModeId;
  screenGuard: ScreenGuardConfig;
  pocketMode: boolean;
  bossVerified: boolean;
  contacts: { name: string; number: string }[];
  conversations: Record<ModeId, Message[]>;
  geminiApiKey: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export const MODES: Mode[] = [
  { id: 'normal', name: 'Normal', nameHi: 'सामान्य', icon: '💬', accentColor: '#6366f1', accentBg: 'rgba(99,102,241,0.1)', voiceGender: 'female', defaultOn: true },
  { id: 'dosti', name: 'Dosti', nameHi: 'दोस्ती', icon: '🤝', accentColor: '#10b981', accentBg: 'rgba(16,185,129,0.1)', voiceGender: 'female', defaultOn: true },
  { id: 'professional', name: 'Professional', nameHi: 'प्रोफेशनल', icon: '💼', accentColor: '#3b82f6', accentBg: 'rgba(59,130,246,0.1)', voiceGender: 'male', defaultOn: false, mutuallyExclusive: ['girlfriend'] },
  { id: 'girlfriend', name: 'Girlfriend', nameHi: 'गर्लफ्रेंड', icon: '💕', accentColor: '#ec4899', accentBg: 'rgba(236,72,153,0.1)', voiceGender: 'female', defaultOn: false, mutuallyExclusive: ['professional'] },
  { id: 'teacher', name: 'Teacher', nameHi: 'शिक्षक', icon: '📚', accentColor: '#f59e0b', accentBg: 'rgba(245,158,11,0.1)', voiceGender: 'female', defaultOn: false },
  { id: 'contentWriting', name: 'Content Writing', nameHi: 'कंटेंट राइटिंग', icon: '✍️', accentColor: '#8b5cf6', accentBg: 'rgba(139,92,246,0.1)', voiceGender: 'female', defaultOn: false },
  { id: 'story', name: 'Story', nameHi: 'कहानी', icon: '📖', accentColor: '#ef4444', accentBg: 'rgba(239,68,68,0.1)', voiceGender: 'female', defaultOn: false },
  { id: 'prompt', name: 'Prompt', nameHi: 'प्रॉम्प्ट', icon: '🎨', accentColor: '#14b8a6', accentBg: 'rgba(20,184,166,0.1)', voiceGender: 'female', defaultOn: false },
];

export const BOSS_VERIFICATION = [
  { q: "Boss, aapne mera naam DK kyun rakha?", a: "धीरज कुमार सिंह" },
  { q: "Boss, aapka date of birth kya hai?", a: "16-12-2002" },
];
