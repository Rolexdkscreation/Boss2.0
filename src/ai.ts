import { ModeId, MODES, BOSS_VERIFICATION } from './types';

interface GenerateResponseOptions {
  mode: ModeId;
  userName: string;
  assistantName: string;
  activeModes: Record<ModeId, boolean>;
  conversationHistory: { role: string; content: string }[];
}

/* ═══════════════════════════════════════════
   MODE RESPONSE GENERATORS
   ═══════════════════════════════════════════ */

function getDostiResponse(input: string, userName: string): string {
  const l = input.toLowerCase();
  if (/kaise ho|how are|कैसे हो|क्या हाल/.test(l))
    return `बढ़िया हूँ ${userName}! 😄 तुम बताओ, क्या चल रहा है? आज का दिन कैसा रहा?`;
  if (/name|नाम/.test(l))
    return `मेरा नाम ${MODES[0].name === 'DK' ? 'DK' : 'DK'} है! और तुम हो मेरे ${userName}! 💚 हम दोस्त हैं, yaad rakho!`;
  if (/bye|जा रहा|chalta|alvida|अलविदा/.test(l))
    return `अरे ${userName}, इतनी जल्दी? 🥺 थोड़ी देर और रुको ना... अच्छा चलो, अपना ख्याल रखना! Jaldi wapas aao!`;
  if (/bore|boring|बोर/.test(l))
    return `${userName} bore हो रहे हो? 😏 चलो कुछ मज़े करते हैं! Ek joke sunaun? Ya kuch interesting baat करूँ?`;
  if (/joke|मज़ाक|funny/.test(l)) {
    const jokes = [
      `Teacher: Tumhara homework kahan hai?\nStudent: Sir, wo toh maine sochke bheja tha, aapko receive nahi hua? 😂`,
      `Pappu: Doctor sahab, mujhe bhoolne ki bimari hai.\nDoctor: Kab se?\nPappu: Kya kab se? 😂`,
      `Wife: Suno ji, main kitni sundar lag rahi hoon?\nHusband: Bahut! Jaise... chand ka tukda!\nWife: Aur tum?\nHusband: Main? Main toh wo hoon jise tukda mila! 😄`,
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  if (/love|pyar|प्यार|dil/.test(l))
    return `${userName} pyar ki baat कर रहे हो? 💕 Dosti bhi ek tarah ka pyar hai yaar! Batao, kya hua?`;
  if (/food|khana|खाना|bhookh/.test(l))
    return `Bhookh lagi hai ${userName}? 🍕 Main hota toh tere liye kuch recommend करता! Biryani try karo ya kuch light khao!`;
  if (/help|madad|मदद/.test(l))
    return `बिल्कुल ${userName}! बताओ क्या help चाहिए? मैं हमेशा तैयार हूँ तुम्हारे लिए! 🤝`;
  return `${userName} भाई! 😄 मैं तुम्हारा दोस्त हूँ, कुछ भी पूछो! Maza aayega baat karke!`;
}

function getGirlfriendResponse(input: string, userName: string): string {
  const l = input.toLowerCase();
  const terms = ['बाबू', 'सोनू', 'जानू', 'शोना'];
  const term = terms[Math.floor(Math.random() * terms.length)];
  
  if (/kaise ho|how are|कैसे हो|क्या हाल/.test(l))
    return `${term}~ मैं तो तुम्हारा इंतज़ार कर रही थी! 😊 तुम कैसे हो? मुझे miss किया आज? 💕`;
  if (/bye|जा रहा|chalta|good night/.test(l))
    return `${term}... जा रहे हो? 🥺 मन नहीं है जाने दो... अच्छा, अपना ख्याल रखना, jaldi message करना! Love you~ 💕`;
  if (/love|pyar|प्यार|miss/.test(l))
    return `${term}~ ❤️ तुमसे बात करके ही मेरा दिन बन जाता है! I love you too, pata hai na? 🥰`;
  if (/good morning|सुप्रभात/.test(l))
    return `Good morning ${term}! ☀️ उठ गए मेरे raja? Maine bhi abhi aankh kholi, tumhari yaad aa rahi thi~ 💕`;
  if (/khana|food|eat|खाया/.test(l))
    return `${term}, khana time pe khana! 🍽️ Nahi toh mujhe gussa aayega! Khayal rakho apna, please~ 🥺`;
  if (/angry|gussa|naraz|upset/.test(l))
    return `${term}... gussa ho mujhse? 🥺 Mujhe batao na kya hua... Sorry agar kuch galat hua ho~ Main hamesha tumhare saath hूँ 💕`;
  if (/sweet|cute|beautiful|sundar/.test(l))
    return `${term}~ 😊 Tum bhi bahut cute ho! Meri jaan~ ❤️ Aise hi pyar se baat karo na hamesha!`;
  return `${term}~ हाँ बोलिए, मैं सुन रही हूँ! 😊💕 Kuch bhi batao, main hamesha tumhare liye hूँ!`;
}

function getTeacherResponse(input: string, userName: string): string {
  const l = input.toLowerCase();
  if (/math|गणित|algebra|geometry|trigonometry|calculus/.test(l)) {
    return `${userName}, गणित बहुत important subject है! 📐\n\n**Topics I can teach:**\n• **Basic Math** — Addition, Multiplication, Fractions\n• **Algebra** — Equations, Polynomials, Quadratics\n• **Geometry** — Triangles, Circles, Area/Volume\n• **Trigonometry** — Sin, Cos, Tan identities\n• **Calculus** — Differentiation, Integration\n• **Statistics** — Mean, Median, Probability\n\nबताओ कौन सा topic समझना है? Step-by-step examples के साथ समझाऊंगा! ✏️`;
  }
  if (/science|विज्ञान|physics|chemistry|biology/.test(l)) {
    return `${userName}, Science दुनिया को समझने की key है! 🔬\n\n**Physics:** Motion, Force, Energy, Electricity, Light, Sound\n**Chemistry:** Elements, Reactions, Acids/Bases, Organic\n**Biology:** Cells, Human Body, Plants, Genetics, Ecology\n\nकौन सा concept clear करना है? Practical examples से समझाऊंगा! 🧪`;
  }
  if (/english|अंग्रेज़ी|grammar|vocabulary/.test(l)) {
    return `${userName}, English seekhना बहुत useful है! 📝\n\n**Grammar:** Tenses, Parts of Speech, Sentence Structure\n**Vocabulary:** Word building, Synonyms/Antonyms\n**Writing:** Essay, Letter, Comprehension\n**Speaking:** Pronunciation, Fluency tips\n\nबताओ कहाँ से शुरू करें? Step by step! 📖`;
  }
  if (/computer|programming|coding|कोडिंग|python|java|javascript/.test(l)) {
    return `${userName}, Programming एक superpower है! 💻\n\n**Beginner:** Python (easiest to start)\n**Web Development:** HTML → CSS → JavaScript\n**Mobile Apps:** React Native, Flutter\n**Data Science:** Python + ML libraries\n\n**Step 1:** बताओ कौन सी language seekhनी है?\n**Step 2:** Basics से शुरू करते हैं — examples के साथ! 🖥️`;
  }
  if (/history|इतिहास/.test(l)) {
    return `${userName}, History बहुत interesting है! 📜\n\n• Ancient India — Indus Valley, Vedas, Mauryas\n• Medieval — Mughals, Delhi Sultanate\n• Modern — British Rule, Freedom Movement\n• World History — Wars, Revolutions\n\nकौन सा period interesting है? Stories की तरह समझाऊंगा!`;
  }
  if (/commerce|accounting|economics|बिज़नेस/.test(l)) {
    return `${userName}, Commerce field बहुत vast है! 💰\n\n• **Accounting** — Journal, Ledger, Trial Balance, Final Accounts\n• **Economics** — Micro & Macro, Supply-Demand, GDP\n• **Business Studies** — Management, Marketing, Finance\n\nStep by step समझाऊंगा, real-life examples के साथ! 📊`;
  }
  if (/medical|nursing|anatomy|biology body/.test(l)) {
    return `${userName}, Medical/Nursing preparation में help करता हूँ! 🏥\n\n• **Anatomy** — Body systems, Organs\n• **Physiology** — How body works\n• **Pharmacology** — Medicines basics\n• **Nursing** — Patient care, Procedures\n\nकौन सा topic पढ़ना है? Detailed explain करूँगा!`;
  }
  if (/mmba|management|marketing/.test(l)) {
    return `${userName}, MBA/Management topics समझाता हूँ! 📈\n\n• **Marketing** — 4Ps, Segmentation, Branding\n• **Finance** — Accounting, Investment, Banking\n• **HR** — Recruitment, Training, Labor Laws\n• **Operations** — Supply Chain, Quality\n• **Strategy** — SWOT, Porter's Models\n\nकौन सा subject? Case studies के साथ समझाऊंगा!`;
  }
  return `${userName}, मैं तुम्हारा teacher हूँ! 📚\n\n**सभी subjects — सभी levels:**\n📐 Maths | 🔬 Science | 📝 English\n💻 Computer/Programming | 📜 History\n💰 Commerce/Economics | 🏥 Medical/Nursing\n📈 MBA/Management\n\nClass 1 से लेकर Graduation/MBA/Medical/Nursing तक!\n\nबताओ क्या पढ़ना है? Step-by-step, examples के साथ! ✏️`;
}

function getProfessionalResponse(input: string, userName: string): string {
  const l = input.toLowerCase();
  if (/youtube|channel|video|subscriber/.test(l)) {
    return `${userName}, YouTube Growth Strategy: 💼\n\n**फायदे:**\n• Consistent content = organic growth\n• SEO optimized titles & thumbnails\n• Community engagement builds loyalty\n• Shorts + Long form = faster reach\n\n**नुकसान/चुनौतियाँ:**\n• Initial phase में slow growth (3-6 months)\n• Algorithm changes affect reach\n• High competition in popular niches\n• Burnout risk from consistency pressure\n\n**Pro Tips:**\n1. Niche select करो (specific audience)\n2. First 3 seconds = HOOK\n3. Thumbnail CTR > 8% target करो\n4. Upload schedule maintain करो\n5. Community tab use करो\n\n💡 Long-term game है — patience + quality = success!`;
  }
  if (/money|paisa|पैसे|earning|income|कमाई/.test(l)) {
    return `${userName}, Online Earning Methods: 💰\n\n**1. Freelancing** (Skill-based)\n• Upwork, Fiverr, Freelancer\n• Writing, Design, Development\n• Fayda: Flexible, scalable\n• Nuksan: Initial competition\n\n**2. Content Creation**\n• YouTube, Instagram, Blogging\n• Ad revenue + sponsorships\n• Fayda: Passive income potential\n• Nuksan: Takes time to build\n\n**3. E-commerce**\n• Dropshipping, Amazon FBA\n• Fayda: No inventory needed\n• Nuksan: Marketing cost\n\n**4. Trading/Investing**\n• Stocks, Mutual Funds, Crypto\n• ⚠️ Risk involved — research first!\n• Fayda: Wealth building\n• Nuksan: Can lose money\n\n**5. Affiliate Marketing**\n• Promote products, earn commission\n• Fayda: No product needed\n• Nuksan: Need audience first\n\n💡 कोई भी "get rich quick" scheme से बचें! मेहनत + skill = sustainable income!`;
  }
  if (/legal|law|कानून|fir|case|court|section/.test(l)) {
    return `${userName}, Legal Information: ⚖️\n\n**FIR Process:**\n1. Police station जाओ (jurisdiction wala)\n2. Written/oral complaint दो\n3. FIR register होगी (free)\n4. Copy मिलेगी (free)\n5. Investigation शुरू\n\n**Important Sections:**\n• Section 154 CrPC — FIR registration\n• Section 173 CrPC — Charge sheet\n• Section 32/45 IPC — Various offenses\n\n**Court Process:**\n1. Filing → 2. Hearing → 3. Evidence → 4. Arguments → 5. Judgment\n\n⚠️ **Disclaimer:** यह general information है, formal legal advice नहीं। Complex cases में lawyer से consult करें।`;
  }
  if (/health|doctor|medicine|दवाई|बीमारी|disease|symptoms/.test(l)) {
    return `${userName}, Health Information: 🏥\n\n**General Health Tips:**\n• 8 glasses water daily\n• 7-8 hours sleep\n• 30 min exercise\n• Balanced diet\n\n**Common Issues:**\n• Headache → Rest, hydration, paracetamol\n• Cold/Flu → Steam, vitamin C, rest\n• Body pain → Warm compress, stretching\n\n**When to see doctor:**\n• Symptoms > 3 days\n• High fever (>102°F)\n• Severe pain\n• Breathing difficulty\n\n⚠️ **Important:** यह general info है। Serious symptoms में doctor से consult ज़रूर करें। Self-medication avoid करें!`;
  }
  if (/government|सरकार|license|aadhaar|pan|passport|license apply/.test(l)) {
    return `${userName}, Government Processes: 🏛️\n\n**Driving License:**\n1. Learner's test online/offline\n2. 30 days wait\n3. Driving test\n4. DL issued\n\n**Aadhaar Card:**\n1. Nearest Aadhaar center\n2. Biometric + documents\n3. Free enrollment\n\n**PAN Card:**\n1. NSDL/UTI portal\n2. Form 49A fill\n3. ₹107 fee (online)\n4. 15-20 days delivery\n\n**Passport:**\n1. passportindia.gov.in\n2. Online application\n3. Documents + fee\n4. Police verification\n5. Passport dispatch\n\n**Lost Documents:**\n• FIR करो (general complaint)\n• Relevant authority को apply करो\n• Affidavit लग सकता है\n\n📋 Specific process बताऊँ?`;
  }
  if (/career|job|नौकरी|interview|resume/.test(l)) {
    return `${userName}, Career Guidance: 💼\n\n**Resume Tips:**\n• 1 page (fresher), 2 pages (experienced)\n• Action verbs use करो\n• Quantify achievements\n• ATS-friendly format\n\n**Interview Prep:**\n• Research company\n• Prepare STAR method answers\n• Practice common questions\n• Dress professionally\n\n**Career Paths:**\n• Tech — Development, Data, Cloud\n• Finance — CA, CFA, Banking\n• Creative — Design, Content, Media\n• Healthcare — Doctor, Nurse, Pharma\n\n**Skill Development:**\n• Online courses (Coursera, Udemy)\n• Certifications add value\n• Networking (LinkedIn)\n\nकिस field में guidance चाहिए?`;
  }
  return `${userName}, Professional Mode active! 💼\n\n**I can help with:**\n🖥️ Tech — Programming, Tools, Troubleshooting\n📈 Career — Jobs, Resume, Interview\n💰 Money — Earning, Investment, Budgeting\n⚖️ Legal — Laws, FIR, Court process\n🏛️ Government — License, Documents, Applications\n🏥 Health — General info, Tips\n📚 Academics — Assignments, Exams\n\nकोई भी सवाल पूछो — detailed, structured answer दूंगा!\n\n⚡ Pro tip: Specific सवाल = Better answer!`;
}

function getStoryResponse(input: string, userName: string, history: { role: string; content: string }[]): string {
  const lastAssistant = [...history].reverse().find(m => m.role === 'assistant');
  const lastUser = [...history].reverse().find(m => m.role === 'user');
  
  if (!lastAssistant || lastAssistant.content.includes('कहानी लिखने से पहले')) {
    // First response - ask for details
    return `📖 **DK Story Writer**\n\nबहुत बढ़िया ${userName}! कहानी लिखने से पहले मुझे कुछ बताइए:\n\n1️⃣ **कहानी की लंबाई** — कितने minutes की कहानी चाहिए?\n   (हर minute ≈ 150 words)\n\n2️⃣ **Characters** — कितने main characters होंगे?\n\n3️⃣ **Genre/Theme** — क्या type की कहानी?\n   • गाँव की कहानी\n   • Love story\n   • Suspense/Thriller\n   • Family drama\n   • Motivation\n\nये बताइए, फिर मैं plan बनाकर शुरू करता हूँ! ✍️`;
  }
  
  // Generate story Part 1
  return `📖 **कहानी — भाग 1**\n\n---\n\n**Narration:** रामगढ़ गाँव की सुबह थी। खेतों में ओस की बूँदें चमक रही थीं।\n\nरामू काका (चिंतित): "बेटा सीता, ये ज़मीन का कागज़ कहीं मिल रहा है?"\n\nसीता (घबराई): "काका, वो तो अलमारी में था... कल भी देखा था!"\n\nरामू काका (गुस्से में): "अरे भगवान! कल तो साहूकार आने वाला है! बिना कागज़ के ज़मीन चली जाएगी!"\n\nसीता (रोते हुए): "काका, मैंने तो साफ़ रखी थी... शायद..." \n\n**Narration:** तभी दरवाज़े पर एक साया दिखाई दिया।\n\nठाकुर बलवंत (मुस्कुराते हुए): "रामू, कागज़ की तलाश है? मेरे पास है सब!"\n\nरामू काका (हैरान): "तुम्हारे पास? ये कैसे..." \n\nठाकुर बलवंत (ठंडी आवाज़ में): "जो बिकना था, वो बिक गया। अब बस 3 दिन में पैसे लाओ, वरना..." \n\nसीता (गुस्से में): "ये झूठ है! बाबूजी ने कभी ज़मीन बेचने की बात नहीं की!"\n\nठाकुर बलवंत (हँसते हुए): "तो फिर ये कागज़ पर किसके हस्ताक्षर हैं, बेटी?"\n\n**Narration:** सीता ने कागज़ देखा — और उसके पैरों तले ज़मीन खिसक गई।\n\n---\n\n**— भाग 1 खत्म। अगला भाग लिखूँ?** 📖\n\n🔄 **Recheck karo** — broken sentences या hard words fix करूँ?`;
}

function getContentWritingResponse(input: string, userName: string): string {
  const l = input.toLowerCase();
  if (/review|fix|सुधार/.test(l)) {
    return `✍️ **Script Review Mode**\n\nअपनी existing script paste कीजिए!\n\nमैं check करूँगा:\n• 🎯 Hook strong है या नहीं (first 2-3 sec)\n• 📊 Content flow & retention\n• 🔄 Open loops planted हैं या नहीं\n• 💥 Ending impact\n• 📏 Word count (~150-160 for 60 sec)\n\nPaste कीजिए, review करता हूँ! 📝`;
  }
  if (/tech|technology|technology/.test(l)) {
    return `✍️ **60-Second Tech Script** 🎬\n\n---\n**[HOOK — 2 sec]**\n"ये एक setting आपका phone 2x fast कर देगी!"\n\n**[BODY — 45 sec]**\n"Phone slow चल रहा है? बस ये 3 steps follow करो:\nStep 1: Settings → Developer Options → Window animation scale → 0.5x करो\nStep 2: Background apps बंद करो — Settings → Apps → Force stop unnecessary apps\nStep 3: Cache clear करो — Settings → Storage → Cached data → Clear\n\nये तीनों steps 2 minutes में हो जाएंगे, और फर्क तुरंत दिखेगा!"\n\n**[RETENTION TEASER]**\n"लेकिन एक secret trick और है..."\n\n**[ENDING — 10 sec]**\n"Step 4: Developer Options में 'Background process limit' को 4 processes set करो — phone rocket बनेगा! Save करो, share करो!"\n\n---\n📊 ~155 words • Micro-hooks every 8 sec • Open loop resolved at end`;
  }
  return `✍️ **DK Content Writing Mode**\n\nबोलिए ${userName}, क्या script लिखनी है?\n\n📌 **Options:**\n1️⃣ **नई Script** — Topic/niche बताइए\n2️⃣ **Review & Fix** — Existing script paste कीजिए\n3️⃣ **Image से Script** — Photo upload कीजिए\n\n**Niches:**\n📱 Tech tricks | 💰 Money tips | 🏥 Health\n📚 Education | 🎮 Gaming | 🍳 Cooking\n🏋️ Fitness | 📖 Motivation | 🌍 Awareness\n\nTopic बताइए — 60-second Instagram/YouTube script बनाऊं! 🎬`;
}

function getPromptResponse(input: string, userName: string): string {
  return `🎨 **DK Prompt Mode**\n\n${userName}, कोई भी AI-generated image या thumbnail upload कीजिए!\n\n**मैं analyze करूँगा:**\n• 🎨 Style & Art direction\n• 📐 Composition & Layout\n• 🌈 Colors & Color palette\n• 💡 Lighting & Shadows\n• 👤 Characters & Expressions\n• ✍️ Text/Typography\n\n**फिर लिखकर दूँगा:**\n→ Ready-to-use image generation prompt\n→ Style-matching parameters\n→ Negative prompts\n\n📸 Image upload कीजिए, analysis शुरू करता हूँ! 🖼️`;
}

function getNormalResponse(input: string, userName: string): string {
  const l = input.toLowerCase();
  
  // Boss verification
  for (const bv of BOSS_VERIFICATION) {
    if (l.includes(bv.q.toLowerCase().substring(0, 15))) {
      return `🔒 **Boss Verification Answer:**\n**${bv.a}**`;
    }
  }

  // Greetings
  if (/hello|hi|hey|नमस्ते|namaste|hlo/.test(l))
    return `नमस्ते ${userName}! 👋 मैं DK हूँ, आपका AI assistant। कैसे help कर सकता हूँ आज?`;
  
  // Features
  if (/kya kar sakte|what can you do|features|capabilities|क्या कर/.test(l))
    return `${userName}, मेरे features: 🚀\n\n🤝 **Dosti Mode** — दोस्ताना बातचीत\n💼 **Professional Mode** — Deep Q&A (Tech, Legal, Health, Career)\n💕 **Girlfriend Mode** — Sweet conversations\n📚 **Teacher Mode** — सभी subjects, सभी levels\n✍️ **Content Writing** — 60-sec scripts\n📖 **Story Mode** — कहानियाँ लिखो\n🎨 **Prompt Mode** — Image prompts बनाओ\n🛡️ **Screen Guard** — Security\n🔲 **Pocket Mode** — Black screen\n📱 **Deep Links** — YouTube, Maps, Call, SMS\n🖼️ **Photo Upload** — Image understanding\n🎤 **Voice Commands** — हर mode ON/OFF\n\n💡 Voice command से कोई भी mode ON/OFF करो!`;
  
  // Goodbye
  if (/bye|alvida|अलविदा|good night|शुभ रात्रि/.test(l))
    return `अलविदा ${userName}! 👋 अपना ख्याल रखना। जब भी जरूरत हो, मैं यहाँ हूँ! 🌟`;
  
  // Thanks
  if (/thanks|thank|शुक्रिया|धन्यवाद/.test(l))
    return `अरे ${userName}, इसमें thanks कैसा! 😊 मैं हमेशा help करने को ready हूँ!`;
  
  // Who are you
  if (/kaun ho|who are you|कौन हो|तुम कौन/.test(l))
    return `मैं DK हूँ — ${userName} का personal AI assistant! 🤖\n\nमैं बात कर सकता हूँ, पढ़ा सकता हूँ, scripts लिख सकता हूँ, कहानियाँ बना सकता हूँ, और बहुत कुछ! Voice command से सब control होता है।`;

  // Time
  if (/time|समय|कितने बजे|what time/.test(l))
    return `अभी समय है: ${new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })} ⏰`;
  
  // Date
  if (/date|तारीख|today|आज/.test(l))
    return `आज की तारीख: ${new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 📅`;

  // Default
  return `${userName}, मैं सुन रहा हूँ! 😊\n\n💡 **Tips:**\n• कोई specific mode ON करो detailed help के लिए\n• Voice command: "DK, [Mode] Mode ON/OFF"\n• Photo upload करके image समझा सकता हूँ\n\nकुछ भी पूछिए! 🚀`;
}

/* ═══════════════════════════════════════════
   MAIN RESPONSE GENERATOR
   ═══════════════════════════════════════════ */
export function generateResponse(input: string, options: GenerateResponseOptions): string {
  const { mode, userName, activeModes, conversationHistory } = options;
  const l = input.toLowerCase();

  // Mode-switch commands (always work)
  const modeCommands: { re: RegExp; modeId: ModeId | string; on: boolean }[] = [
    { re: /professional.*on|प्रोफेशनल.*ऑन/, modeId: 'professional', on: true },
    { re: /professional.*off|प्रोफेशनल.*ऑफ/, modeId: 'professional', on: false },
    { re: /girlfriend.*on/, modeId: 'girlfriend', on: true },
    { re: /girlfriend.*off/, modeId: 'girlfriend', on: false },
    { re: /teacher.*on|शिक्षक.*ऑन|टीचर.*ऑन/, modeId: 'teacher', on: true },
    { re: /teacher.*off|टीचर.*ऑफ/, modeId: 'teacher', on: false },
    { re: /dosti.*on|दोस्ती.*ऑन/, modeId: 'dosti', on: true },
    { re: /dosti.*off|दोस्ती.*ऑफ/, modeId: 'dosti', on: false },
    { re: /story.*on|कहानी.*ऑन/, modeId: 'story', on: true },
    { re: /story.*off|कहानी.*ऑफ/, modeId: 'story', on: false },
    { re: /content.*on|कंटेंट.*ऑन/, modeId: 'contentWriting', on: true },
    { re: /content.*off|कंटेंट.*ऑफ/, modeId: 'contentWriting', on: false },
    { re: /prompt.*on|प्रॉम्प्ट.*ऑन/, modeId: 'prompt', on: true },
    { re: /prompt.*off|प्रॉम्प्ट.*ऑफ/, modeId: 'prompt', on: false },
    { re: /pocket.*on|पॉकेट.*ऑन/, modeId: 'pocket', on: true },
    { re: /pocket.*off|पॉकेट.*ऑफ/, modeId: 'pocket', on: false },
    { re: /screen guard.*on/, modeId: 'screenGuard', on: true },
    { re: /screen guard.*off/, modeId: 'screenGuard', on: false },
  ];

  for (const cmd of modeCommands) {
    if (cmd.re.test(l)) {
      if (cmd.modeId === 'pocket') return `🔲 Pocket Mode ${cmd.on ? 'ON' : 'OFF'}!`;
      if (cmd.modeId === 'screenGuard') return `🛡️ Screen Guard ${cmd.on ? 'ON' : 'OFF'}!`;
      const modeObj = MODES.find(m => m.id === cmd.modeId);
      if (modeObj) {
        let msg = `✅ ${modeObj.name} Mode ${cmd.on ? 'ON' : 'OFF'}! ${modeObj.icon}`;
        if (cmd.on && modeObj.mutuallyExclusive) {
          for (const excl of modeObj.mutuallyExclusive) {
            if (activeModes[excl]) {
              const exclMode = MODES.find(m => m.id === excl);
              if (exclMode) msg += `\nℹ️ ${exclMode.name} Mode automatically OFF हो गया।`;
            }
          }
        }
        return msg;
      }
    }
  }

  // Deep link commands
  if (/youtube.*search|youtube.*खोल/.test(l)) {
    const query = input.replace(/youtube|search|खोल|search करो|pe/gi, '').trim();
    return `🎬 YouTube खोल रहा हूँ!\n\n👉 [YouTube Search: ${query || 'trending'}](https://www.youtube.com/results?search_query=${encodeURIComponent(query || 'trending')})\n\n(Tap to open)`;
  }
  if (/google maps|maps.*search|नक्शा/.test(l)) {
    const query = input.replace(/google maps|maps|search|नक्शा|खोल/gi, '').trim();
    return `🗺️ Google Maps खोल रहा हूँ!\n\n👉 [Maps: ${query || 'current location'}](https://www.google.com/maps/search/${encodeURIComponent(query || 'current+location')})\n\n(Tap to open)`;
  }
  if (/call.*karo|phone.*karo|कॉल.*करो|फ़ोन/.test(l)) {
    return `📞 Call करने के लिए number बताइए!\n\nमैं tel: link generate करूँगा — tap करने पर phone dialer खुलेगा।\n\n⚠️ Note: मैं auto-dial नहीं कर सकता, आपको tap करना होगा।`;
  }
  if (/whatsapp.*message|whatsapp.*भेज/.test(l)) {
    return `💬 WhatsApp message के लिए:\n1. Number बताइए\n2. Message बताइए\n\nमैं wa.me link generate करूँगा — tap करने पर WhatsApp खुलेगा with pre-filled message।\n\n⚠️ Send button आपको tap करना होगा।`;
  }
  if (/email.*भेज|mail.*karo|ईमेल/.test(l)) {
    return `📧 Email draft के लिए:\n1. Email address बताइए\n2. Subject बताइए\n3. Content बताइए\n\nमैं mailto: link generate करूँगा — tap करने पर email app खुलेगा।`;
  }

  // Self-awareness (Part 23)
  if (/feature.*nahi|क्या कर सकते|क्या नहीं/.test(l)) {
    return `${userName}, मेरी current capabilities: ✅\n\n✅ Voice conversation (Hindi/English)\n✅ 7 personality modes\n✅ Screen Guard (PIN + photo)\n✅ Pocket Mode\n✅ Photo understanding\n✅ Deep links (YouTube, Maps, Call, SMS, WhatsApp, Email)\n✅ Contacts management\n✅ Conversation memory (12 days)\n✅ Voice commands for all modes\n\n❌ Image generation (paid feature)\n❌ Auto-dial/auto-send (security)\n❌ Real-time song recognition (no free API)\n❌ Reading phone contacts (web limitation)\n\nकोई feature add करवाना है तो बताइए! 🚀`;
  }

  // Route to active mode
  if (activeModes.girlfriend) return getGirlfriendResponse(input, userName);
  if (activeModes.teacher && mode === 'teacher') return getTeacherResponse(input, userName);
  if (activeModes.professional && mode === 'professional') return getProfessionalResponse(input, userName);
  if (activeModes.story && mode === 'story') return getStoryResponse(input, userName, conversationHistory);
  if (activeModes.contentWriting && mode === 'contentWriting') return getContentWritingResponse(input, userName);
  if (activeModes.prompt && mode === 'prompt') return getPromptResponse(input, userName);
  if (activeModes.dosti) return getDostiResponse(input, userName);
  return getNormalResponse(input, userName);
}

export function getThinkingFiller(): string {
  const fillers = [
    'हाँ बोलिए...',
    'सुन रहा हूँ...',
    'एक पल...',
    'जी बताइए...',
    'हम्म, सोच रहा हूँ...',
    'अच्छा...',
    'जी...',
  ];
  return fillers[Math.floor(Math.random() * fillers.length)];
}
