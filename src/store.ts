import { AppState, ModeId, Message, ScreenGuardConfig } from './types';

const STORAGE_KEY = 'dk_ai_state';
const CONVERSATION_EXPIRY_DAYS = 12;

const defaultState: AppState = {
  userName: '',
  assistantName: 'DK',
  setupComplete: false,
  activeModes: {
    normal: true,
    dosti: true,
    professional: false,
    girlfriend: false,
    teacher: false,
    contentWriting: false,
    story: false,
    prompt: false,
  },
  currentScreen: 'orb',
  activeChatMode: 'normal',
  screenGuard: {
    enabled: false,
    pin: '',
    capturedPhotos: [],
  },
  pocketMode: false,
  bossVerified: false,
  contacts: [],
  conversations: {
    normal: [],
    dosti: [],
    professional: [],
    girlfriend: [],
    teacher: [],
    contentWriting: [],
    story: [],
    prompt: [],
  },
};

export function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Clean expired conversations
      const cutoff = Date.now() - CONVERSATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      const conversations = { ...defaultState.conversations };
      for (const mode of Object.keys(parsed.conversations || {}) as ModeId[]) {
        if (parsed.conversations[mode]) {
          conversations[mode] = parsed.conversations[mode].filter(
            (m: Message) => m.timestamp > cutoff
          );
        }
      }
      return { ...defaultState, ...parsed, conversations, bossVerified: false };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return { ...defaultState };
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function addMessage(state: AppState, mode: ModeId, message: Message): AppState {
  const conversations = { ...state.conversations };
  conversations[mode] = [...(conversations[mode] || []), message];
  return { ...state, conversations };
}

export function clearConversation(state: AppState, mode: ModeId): AppState {
  const conversations = { ...state.conversations };
  conversations[mode] = [];
  return { ...state, conversations };
}

export function getInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
