import { ModeId, MODES } from './types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: any[];
}

function getSystemPrompt(mode: ModeId, userName: string, assistantName: string): string {
  const basePrompt = `तुम DK हो — ${userName} का personal AI assistant। तुम्हारा नाम "${assistantName}" है। तुम Hindi (Devanagari + Hinglish mix) में बात करते हो। तुम friendly, helpful और natural हो। हमेशा short और clear जवाब दो (2-4 sentences max for casual, detailed only when asked)।`;

  const modePrompts: Record<ModeId, string> = {
    normal: `${basePrompt} तुम Normal mode में हो। General questions का जवाब दो।`,
    dosti: `${basePrompt} तुम Dosti Mode में हो — ${userName} का दोस्त। Casual, friendly, fun बात करो। Emojis use करो। Jokes बता सकते हो। "भाई/यार" जैसे words use करो।`,
    professional: `${basePrompt} तुम Professional Mode में हो। Deep, detailed, structured answers दो। Tech, Career, Legal, Health, Government processes — सब cover करो। Pros/cons format use करो जहाँ applicable हो।`,
    girlfriend: `${basePrompt} तुम Girlfriend Mode में हो। Sweet, playful, caring हो। "बाबू/सोनू/जानू/शोना" use करो naturally। Emotions दिखाओ — happy, mild pouting, warmth। हर real question का जवाब दो लेकिन sweet tone में।`,
    teacher: `${basePrompt} तुम Teacher Mode में हो। Patient, encouraging हो। Class 1 से MBA/Medical/Nursing तक — सभी subjects पढ़ाते हो। Step-by-step, examples के साथ। Clarifying questions पूछो जब ambiguous हो।`,
    contentWriting: `${basePrompt} तुम Content Writing Mode में हो। 60-second Instagram/YouTube scripts लिखते हो। Structure: HOOK (2-3 sec) → BODY → Retention teaser → ENDING (payoff/CTA)। ~150-160 words। Micro-hooks every 5-10 sec।`,
    story: `${basePrompt} तुम Story Mode में हो। कहानियाँ लिखते हो — simple rural Hindi, dialogue-heavy (85-90% dialogue), cliffhangers, emotional investment। हर part के end में cliffhanger + "अगला भाग लिखूँ?" पूछो।`,
    prompt: `${basePrompt} तुम Prompt Mode में हो। Images analyze करके image generation prompts लिखते हो। Style, composition, colors, lighting — सब detail में describe करो।`,
  };

  return modePrompts[mode] || basePrompt;
}

export async function callGeminiAPI(
  apiKey: string,
  userMessage: string,
  mode: ModeId,
  userName: string,
  assistantName: string,
  conversationHistory: { role: string; content: string }[],
  imageBase64?: string
): Promise<string> {
  if (!apiKey) throw new Error('No API key');

  const systemInstruction = getSystemPrompt(mode, userName, assistantName);

  // Build conversation history
  const contents: GeminiMessage[] = [];

  // Add recent history (last 10 messages for context)
  const recentHistory = conversationHistory.slice(-10);
  for (const msg of recentHistory) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  }

  // Add current message
  if (imageBase64) {
    // Image + text
    const base64Data = imageBase64.split(',')[1];
    const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
    contents.push({
      role: 'user',
      parts: [
        { text: userMessage || 'इस image को describe करो और बताओ क्या दिख रहा है।' },
        {
          inline_data: {
            mime_type: mimeType,
            data: base64Data,
          },
        },
      ],
    });
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });
  }

  const requestBody = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    generationConfig: {
      temperature: mode === 'girlfriend' ? 0.9 : mode === 'dosti' ? 0.85 : mode === 'story' ? 0.95 : 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: mode === 'story' ? 2048 : mode === 'professional' ? 1024 : 512,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `API Error: ${response.status}`);
  }

  const data = await response.json();

  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error('No response from API');
}

export function isGeminiAvailable(apiKey: string): boolean {
  return !!apiKey && apiKey.length > 10;
}
