/**
 * All the words in Minny's world. Edit freely — make them yours. 💗
 * (Placeholders are written to feel warm and personal; swap in real
 * memories, inside jokes and nicknames to make it even more "her".)
 */

export type IconKey = "smile" | "eye" | "heart" | "habits" | "pout" | "soul";

export const MEMORY_CARDS: { icon: IconKey; title: string; teaser: string; message: string[] }[] = [
  {
    icon: "smile",
    title: "Your Smile",
    teaser: "The one that fixes everything",
    message: [
      "There's a moment right before you smile — and I've learned to watch for it.",
      "Your smile doesn't just show up on your face. It walks into the room, and suddenly everything feels lighter.",
      "Minny, never let anyone make you smile less.",
    ],
  },
  {
    icon: "eye",
    title: "Your Eyes",
    teaser: "Little universes",
    message: [
      "Your eyes say things your words are too shy to say.",
      "They sparkle when you're happy, soften when you care, and somehow always make people feel seen.",
      "I could get lost in them — and honestly, I wouldn't mind.",
    ],
  },
  {
    icon: "heart",
    title: "Your Kind Heart",
    teaser: "Soft, warm, rare",
    message: [
      "You care so quietly and so completely that people don't even realize how lucky they are.",
      "The world has too many loud hearts and not enough gentle ones like yours.",
      "Please remember: kindness like yours deserves to be returned in full.",
    ],
  },
  {
    icon: "habits",
    title: "Your Little Habits",
    teaser: "The tiny things I notice",
    message: [
      "The little things you do without even thinking — that's what I notice the most.",
      "The way you tuck your hair back. The way you get excited about small things. The way you're just… you.",
      "They're tiny, but they're my favourite parts of your day.",
    ],
  },
  {
    icon: "pout",
    title: "Your Cute Anger",
    teaser: "Dangerously adorable",
    message: [
      "Even when you're upset, you're somehow the cutest person alive.",
      "The little pout. The 'I'm not talking to you' face. The way it melts in two minutes flat.",
      "Fine, I'll say it: I secretly don't mind making you a tiny bit angry. 💗",
    ],
  },
  {
    icon: "soul",
    title: "Your Beautiful Soul",
    teaser: "The prettiest part",
    message: [
      "You're beautiful on the outside — but that's honestly the least interesting thing about you.",
      "It's your soul that makes people feel safe, happy and a little more hopeful.",
      "Minny, you are a rare kind of beautiful. Never forget that.",
    ],
  },
];

export type BoxFx = "hearts" | "petals" | "confetti" | "stars";
export type BoxMood = "excited" | "shy" | "surprised" | "love" | "celebrate";

export const SURPRISE_BOXES: {
  id: string;
  emoji: string;
  label: string;
  tone: "rose" | "blush" | "hot" | "lav" | "gold";
  title: string;
  body: string;
  mood: BoxMood;
  say: string;
  fx: BoxFx;
}[] = [
  {
    id: "open",
    emoji: "🎁",
    label: "Open Me",
    tone: "rose",
    title: "A tiny reminder",
    body: "You are the kind of person people feel lucky to know. Not because you try — but because you simply are.",
    mood: "excited",
    say: "Ooh, what's inside?!",
    fx: "hearts",
  },
  {
    id: "secret",
    emoji: "💌",
    label: "A Secret Message",
    tone: "blush",
    title: "Psst… a secret",
    body: "Here's something I don't say enough: you make my days softer, happier and a lot more fun. Thank you for being you.",
    mood: "shy",
    say: "Eep… for me?",
    fx: "hearts",
  },
  {
    id: "little",
    emoji: "🌸",
    label: "A Little Surprise",
    tone: "hot",
    title: "Flowers, just for you",
    body: "I wanted to give you the prettiest flowers in the world, but you're already prettier than all of them. So here are petals instead.",
    mood: "surprised",
    say: "Wait — petals?!",
    fx: "petals",
  },
  {
    id: "special",
    emoji: "💗",
    label: "Something Special",
    tone: "lav",
    title: "One Forever-Hug Coupon",
    body: "Valid for one (1) very long, very warm hug. Redeemable anytime, anywhere, no expiry date. Terms: you must smile afterwards.",
    mood: "love",
    say: "Hug accepted 💗",
    fx: "stars",
  },
  {
    id: "last",
    emoji: "✨",
    label: "One Last Surprise",
    tone: "gold",
    title: "Happy Birthday, Minny!",
    body: "May this year be softer to you than the last, kinder than you expect, and full of everything that makes you smile. Keep scrolling — there's more waiting for you.",
    mood: "celebrate",
    say: "Happy Birthday to me!",
    fx: "confetti",
  },
];

export const WHY_LINES: string[] = [
  "Because you make ordinary moments feel special.",
  "Because your smile can change the mood of an entire day.",
  "Because you are uniquely YOU.",
  "Because the world is a little prettier with you in it.",
];
export const WHY_END = "And that's why today belongs to you. 💗";

export const LETTER: string[] = [
  "My Minny,",
  "",
  "Happy almost-birthday. I know it isn't quite the day yet, but I couldn't wait — some feelings don't like to sit still, and mine about you never do.",
  "",
  "Another year of you is another year the world gets a little softer, a little warmer, a little more worth showing up for. I hope this year hands you everything you quietly hope for and a few things you haven't even thought to wish yet.",
  "",
  "Thank you for being exactly the kind of person worth building a silly little website for. Play the games, smile at the hearts, and know that this is only the small version of how much I adore you.",
  "",
  "Always yours 🤍",
];

export const COMPLIMENTS = [
  "You make the whole world feel warmer just by being in it.",
  "Your kindness is quietly the most beautiful thing about you.",
  "Nobody smiles like you do — it's honestly unfair to everyone else.",
  "You're proof that soft hearts are the strongest ones.",
  "You're the reason ordinary days turn into good memories.",
];

export const SECRETS = [
  "Secret #1: I smile every time I think of how you laugh.",
  "Secret #2: Your name is my favourite thing to say.",
  "Secret #3: I made this whole little world just to see you smile at it.",
];

export type WheelKey = "compliment" | "secret" | "wish" | "surprise" | "hug" | "love";
export const WHEEL: { key: WheelKey; label: string; emoji: string; line1: string; line2: string }[] = [
  { key: "compliment", label: "Get a Compliment 💗", emoji: "💗", line1: "Get a", line2: "Compliment" },
  { key: "secret", label: "Open a Secret 💌", emoji: "💌", line1: "Open a", line2: "Secret" },
  { key: "wish", label: "Make a Wish ✨", emoji: "✨", line1: "Make a", line2: "Wish" },
  { key: "surprise", label: "Birthday Surprise 🎁", emoji: "🎁", line1: "Birthday", line2: "Surprise" },
  { key: "hug", label: "Virtual Hug 🤗", emoji: "🤗", line1: "Virtual", line2: "Hug" },
  { key: "love", label: "More Love 💕", emoji: "💕", line1: "More", line2: "Love" },
];

/**
 * 📸 OUR MEMORIES — photos and clips, in the order they appear in the album
 * and in "Play Our Movie". Files live in /public/photos and /public/videos.
 */
export type MemoryItem = { type: "image" | "video"; src: string; /** upright phone-portrait media is shown whole instead of cropped */ portrait?: boolean };
export const MEMORY_ITEMS: MemoryItem[] = [
  { type: "image", src: "/photos/photo-01.jpg" },
  { type: "video", src: "/videos/clip-01.mp4" },
  { type: "image", src: "/photos/photo-02.jpg" },
  { type: "video", src: "/videos/clip-02.mp4" },
  { type: "image", src: "/photos/photo-03.jpg" },
  { type: "video", src: "/videos/clip-03.mp4", portrait: true },
  { type: "image", src: "/photos/photo-04.jpg" },
  { type: "video", src: "/videos/clip-04.mp4" },
  { type: "image", src: "/photos/photo-05.jpg" },
  { type: "video", src: "/videos/clip-05.mp4" },
  { type: "image", src: "/photos/photo-06.jpg" },
  { type: "video", src: "/videos/clip-06.mp4" },
  { type: "video", src: "/videos/clip-07.mp4" },
  { type: "video", src: "/videos/clip-08.mp4" },
  { type: "video", src: "/videos/clip-09.mp4" },
  { type: "video", src: "/videos/clip-10.mp4", portrait: true },
];

/** 🎲 Truth or Dare */
export const TRUTHS = [
  "What's the smallest moment with me that you secretly replay in your head?",
  "What made you smile about me for the first time?",
  "What's one thing you've never told me because it felt too soft to say out loud?",
  "What song reminds you of me, and why?",
  "What's your favorite memory of us so far?",
  "What's something about me you find impossible not to love?",
];
export const DARES = [
  "Send me a voice note right now saying one thing you love about me.",
  "Text me the cheesiest pickup line you can think of.",
  "Send me a selfie with your best 'birthday girl' pose.",
  "Write me a two-line poem right now, no matter how bad it is.",
  "Send me a throwback photo of us (or of you, if it's just you here).",
  "Tell me your plan for how we should celebrate this birthday.",
];

/** 💞 Love Wheel (every slice has a little prompt) */
export type PromptSlice = { label: string; prompt: string };
export const LOVE_WHEEL: PromptSlice[] = [
  { label: "Compliment", prompt: "Tell me one thing you love about yourself today — I'll add ten more." },
  { label: "Memory Lane", prompt: "What's a memory of us that instantly makes you smile?" },
  { label: "Confession", prompt: "Confess something small and sweet you've never said out loud." },
  { label: "Silly Dare", prompt: "Send me the silliest face you can make, right now." },
  { label: "Future Plan", prompt: "Describe one adventure you want us to go on someday." },
  { label: "Song Dedication", prompt: "What song would you dedicate to us, and why?" },
  { label: "Cute Question", prompt: "What's your favorite way for someone to show they care?" },
  { label: "Voice Note", prompt: "Send me a 10-second voice note just saying hi." },
  { label: "Nickname", prompt: "Give me a brand new nickname, right now, no overthinking." },
  { label: "Promise", prompt: "Make me one small, sweet promise for this year." },
  { label: "Photo Swap", prompt: "Send a photo that makes you happy today." },
  { label: "Love Poem", prompt: "Say one line of poetry about love — bad rhymes totally allowed." },
];

/** 🔒 Romance Wheel (password-locked) */
export const ROMANCE_WHEEL: PromptSlice[] = [
  { label: "Kiss 30 Sec", prompt: "Kiss for 30 seconds, no rushing it." },
  { label: "Make Out", prompt: "Time for a proper make-out session." },
  { label: "Cuddle", prompt: "Just cuddle for a while, no phones." },
  { label: "Give Massage", prompt: "Give a slow, relaxing massage." },
  { label: "Whisper Naughty", prompt: "Whisper something a little naughty in their ear." },
  { label: "Slow Dance", prompt: "Slow dance together, even without music." },
  { label: "Compliments", prompt: "Take turns giving each other compliments." },
  { label: "Blindfold", prompt: "Try the blindfold challenge — trust exercise." },
  { label: "Pick Date", prompt: "You choose the next date activity." },
  { label: "Forehead Kiss", prompt: "Give a slow forehead kiss." },
  { label: "5-Min Cuddle", prompt: "Five full minutes of cuddling, timed." },
  { label: "You Choose", prompt: "Your partner decides what happens next." },
  { label: "Truth or Dare", prompt: "Play a round of romantic truth or dare." },
  { label: "First Kiss", prompt: "Recreate your very first kiss." },
  { label: "Stay Close", prompt: "Stay close for 1 minute without speaking." },
];
