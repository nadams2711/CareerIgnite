import type { CategoryInfo, RiasecType } from "@/types";
import type {
  AustralianState,
  CareerCategory,
  PathwayType,
} from "@prisma/client";

export const AUSTRALIAN_STATES: {
  value: AustralianState;
  label: string;
  full: string;
}[] = [
  { value: "NSW", label: "NSW", full: "New South Wales" },
  { value: "VIC", label: "VIC", full: "Victoria" },
  { value: "QLD", label: "QLD", full: "Queensland" },
  { value: "WA", label: "WA", full: "Western Australia" },
  { value: "SA", label: "SA", full: "South Australia" },
  { value: "TAS", label: "TAS", full: "Tasmania" },
  { value: "NT", label: "NT", full: "Northern Territory" },
  { value: "ACT", label: "ACT", full: "Australian Capital Territory" },
];

export const CAREER_CATEGORIES: Record<CareerCategory, CategoryInfo> = {
  TECHNOLOGY: {
    label: "Technology",
    color: "#3b82f6",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    darkBgColor: "dark:bg-blue-900/30",
    darkTextColor: "dark:text-blue-300",
    icon: "Monitor",
    gradient: "from-blue-500 to-violet-500",
  },
  HEALTH: {
    label: "Health",
    color: "#f43f5e",
    bgColor: "bg-rose-100",
    textColor: "text-rose-800",
    darkBgColor: "dark:bg-rose-900/30",
    darkTextColor: "dark:text-rose-300",
    icon: "Heart",
    gradient: "from-rose-500 to-pink-500",
  },
  TRADES: {
    label: "Trades",
    color: "#f97316",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    darkBgColor: "dark:bg-orange-900/30",
    darkTextColor: "dark:text-orange-300",
    icon: "Wrench",
    gradient: "from-orange-500 to-amber-500",
  },
  CREATIVE: {
    label: "Creative",
    color: "#a855f7",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    darkBgColor: "dark:bg-purple-900/30",
    darkTextColor: "dark:text-purple-300",
    icon: "Palette",
    gradient: "from-purple-500 to-pink-500",
  },
  BUSINESS: {
    label: "Business",
    color: "#10b981",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-800",
    darkBgColor: "dark:bg-emerald-900/30",
    darkTextColor: "dark:text-emerald-300",
    icon: "Briefcase",
    gradient: "from-emerald-500 to-cyan-500",
  },
  EDUCATION: {
    label: "Education",
    color: "#06b6d4",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-800",
    darkBgColor: "dark:bg-cyan-900/30",
    darkTextColor: "dark:text-cyan-300",
    icon: "GraduationCap",
    gradient: "from-cyan-500 to-blue-500",
  },
  SCIENCE: {
    label: "Science",
    color: "#6366f1",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-800",
    darkBgColor: "dark:bg-indigo-900/30",
    darkTextColor: "dark:text-indigo-300",
    icon: "Flask",
    gradient: "from-indigo-500 to-blue-500",
  },
  SPORTS: {
    label: "Sports",
    color: "#84cc16",
    bgColor: "bg-lime-100",
    textColor: "text-lime-800",
    darkBgColor: "dark:bg-lime-900/30",
    darkTextColor: "dark:text-lime-300",
    icon: "Dumbbell",
    gradient: "from-lime-500 to-emerald-500",
  },
  SERVICES: {
    label: "Services",
    color: "#f59e0b",
    bgColor: "bg-amber-100",
    textColor: "text-amber-800",
    darkBgColor: "dark:bg-amber-900/30",
    darkTextColor: "dark:text-amber-300",
    icon: "UtensilsCrossed",
    gradient: "from-amber-500 to-orange-500",
  },
};

export const PATHWAY_TYPES: Record<
  PathwayType,
  { label: string; icon: string; color: string }
> = {
  UNIVERSITY: { label: "University", icon: "GraduationCap", color: "#3b82f6" },
  TAFE: { label: "TAFE", icon: "BookOpen", color: "#10b981" },
  TRADE: { label: "Trade", icon: "Wrench", color: "#f97316" },
  APPRENTICESHIP: {
    label: "Apprenticeship",
    icon: "HardHat",
    color: "#eab308",
  },
  SPORTS: {
    label: "Sports Academy",
    icon: "Dumbbell",
    color: "#84cc16",
  },
  ARTS: { label: "Arts Pathway", icon: "Palette", color: "#a855f7" },
};

// Swipe quiz scenarios — each maps to 1-2 career categories
export const SWIPE_SCENARIOS: {
  id: number;
  emoji: string;
  text: string;
  categories: CareerCategory[];
}[] = [
  { id: 1, emoji: "\uD83D\uDCBB", text: "You're up at midnight fixing a bug and finally crack it", categories: ["TECHNOLOGY"] },
  { id: 2, emoji: "\uD83C\uDFD7\uFE0F", text: "You just finished building a deck and stand back to admire it", categories: ["TRADES"] },
  { id: 3, emoji: "\uD83C\uDFA8", text: "You designed a logo that went viral on social media", categories: ["CREATIVE"] },
  { id: 4, emoji: "\uD83C\uDFE5", text: "You helped a patient walk again after months of rehab", categories: ["HEALTH"] },
  { id: 5, emoji: "\uD83D\uDCCA", text: "You spotted a trend in the data nobody else noticed", categories: ["TECHNOLOGY", "SCIENCE"] },
  { id: 6, emoji: "\uD83C\uDF73", text: "You created a new dish and the whole restaurant loved it", categories: ["SERVICES"] },
  { id: 7, emoji: "\u26A1", text: "You rewired a house and everything works perfectly", categories: ["TRADES"] },
  { id: 8, emoji: "\uD83C\uDFC3", text: "You coached an athlete to their personal best", categories: ["SPORTS"] },
  { id: 9, emoji: "\uD83C\uDFAC", text: "You edited a video that got a million views", categories: ["CREATIVE"] },
  { id: 10, emoji: "\uD83D\uDCCB", text: "You organised an event and everything ran smoothly", categories: ["BUSINESS"] },
  { id: 11, emoji: "\uD83D\uDD2C", text: "You discovered something in the lab nobody expected", categories: ["SCIENCE"] },
  { id: 12, emoji: "\uD83D\uDC69\u200D\uD83C\uDFEB", text: "You explained something and saw the lightbulb moment", categories: ["EDUCATION"] },
  { id: 13, emoji: "\uD83D\uDCB0", text: "You closed a deal that made your whole team celebrate", categories: ["BUSINESS"] },
  { id: 14, emoji: "\uD83E\uDE7A", text: "You stayed calm in an emergency and knew exactly what to do", categories: ["HEALTH"] },
  { id: 15, emoji: "\uD83D\uDEE1\uFE0F", text: "You caught a hacker trying to break into the system", categories: ["TECHNOLOGY"] },
];

// Deep quiz questions — 15 multi-select questions in 5 sections
export const DEEP_QUIZ_QUESTIONS: {
  id: number;
  section: string;
  question: string;
  subtitle: string;
  options: { id: string; label: string; categories: CareerCategory[] }[];
}[] = [
  // ── Section 1: Interests & Activities ──
  {
    id: 101,
    section: "Interests & Activities",
    question: "What kind of stuff gets you genuinely excited?",
    subtitle: "Pick everything that sounds like your vibe.",
    options: [
      { id: "101a", label: "Coding or building websites", categories: ["TECHNOLOGY"] },
      { id: "101b", label: "Drawing, painting or designing", categories: ["CREATIVE"] },
      { id: "101c", label: "Playing or watching sport", categories: ["SPORTS"] },
      { id: "101d", label: "Helping friends with their problems", categories: ["HEALTH", "EDUCATION"] },
      { id: "101e", label: "Cooking or trying new food", categories: ["SERVICES"] },
      { id: "101f", label: "Building or fixing things around the house", categories: ["TRADES"] },
      { id: "101g", label: "Starting side hustles or selling stuff", categories: ["BUSINESS"] },
      { id: "101h", label: "Science experiments or nature documentaries", categories: ["SCIENCE"] },
    ],
  },
  {
    id: 102,
    section: "Interests & Activities",
    question: "What would you do on a free Saturday?",
    subtitle: "No homework, no commitments — what's the plan?",
    options: [
      { id: "102a", label: "Game all day or tinker with tech", categories: ["TECHNOLOGY"] },
      { id: "102b", label: "Go to the gym or play a sport", categories: ["SPORTS"] },
      { id: "102c", label: "Make music, art or film something", categories: ["CREATIVE"] },
      { id: "102d", label: "Volunteer or hang with younger kids", categories: ["EDUCATION", "HEALTH"] },
      { id: "102e", label: "Work on a project to make money", categories: ["BUSINESS"] },
      { id: "102f", label: "Go bushwalking or explore nature", categories: ["SCIENCE"] },
      { id: "102g", label: "Build or renovate something", categories: ["TRADES"] },
      { id: "102h", label: "Try a new café or cook something fancy", categories: ["SERVICES"] },
    ],
  },
  {
    id: 103,
    section: "Interests & Activities",
    question: "If you could work on any dream project, what would it be?",
    subtitle: "Go big — no limits.",
    options: [
      { id: "103a", label: "Build an app that millions of people use", categories: ["TECHNOLOGY"] },
      { id: "103b", label: "Direct a film or create a viral campaign", categories: ["CREATIVE"] },
      { id: "103c", label: "Design and build your own house", categories: ["TRADES"] },
      { id: "103d", label: "Discover a cure for a disease", categories: ["HEALTH", "SCIENCE"] },
      { id: "103e", label: "Coach an Olympic team", categories: ["SPORTS"] },
      { id: "103f", label: "Start a company from scratch", categories: ["BUSINESS"] },
      { id: "103g", label: "Open a restaurant or food truck", categories: ["SERVICES"] },
      { id: "103h", label: "Write a book or create a course", categories: ["EDUCATION"] },
    ],
  },

  // ── Section 2: Work Style ──
  {
    id: 201,
    section: "Work Style",
    question: "How do you prefer to work?",
    subtitle: "Think about when you're most productive.",
    options: [
      { id: "201a", label: "In a team, bouncing ideas around", categories: ["BUSINESS", "EDUCATION", "SERVICES"] },
      { id: "201b", label: "Solo with headphones on, deep focus", categories: ["TECHNOLOGY", "CREATIVE", "SCIENCE"] },
      { id: "201c", label: "Hands-on, physically doing something", categories: ["TRADES", "SPORTS"] },
      { id: "201d", label: "Face-to-face with people, helping them", categories: ["HEALTH", "EDUCATION"] },
      { id: "201e", label: "Leading a group and making decisions", categories: ["BUSINESS"] },
      { id: "201f", label: "A mix — different tasks every day", categories: ["SERVICES", "CREATIVE"] },
    ],
  },
  {
    id: 202,
    section: "Work Style",
    question: "What kind of routine sounds best?",
    subtitle: "Some people love structure, others love chaos.",
    options: [
      { id: "202a", label: "Set schedule, clear tasks, predictable days", categories: ["EDUCATION", "BUSINESS", "SCIENCE"] },
      { id: "202b", label: "Flexible hours, work when inspiration hits", categories: ["CREATIVE", "TECHNOLOGY"] },
      { id: "202c", label: "Shift work — early starts or late nights, variety", categories: ["HEALTH", "SERVICES", "TRADES"] },
      { id: "202d", label: "Active and outdoors most of the day", categories: ["TRADES", "SPORTS", "SCIENCE"] },
      { id: "202e", label: "Mix of office and out-and-about", categories: ["BUSINESS", "HEALTH"] },
      { id: "202f", label: "Travel and new places regularly", categories: ["SERVICES", "CREATIVE", "SPORTS"] },
    ],
  },
  {
    id: 203,
    section: "Work Style",
    question: "Where would you love to work?",
    subtitle: "Picture your ideal workspace.",
    options: [
      { id: "203a", label: "A modern office or co-working space", categories: ["TECHNOLOGY", "BUSINESS"] },
      { id: "203b", label: "A creative studio or workshop", categories: ["CREATIVE"] },
      { id: "203c", label: "Outdoors — building sites, farms, nature", categories: ["TRADES", "SCIENCE"] },
      { id: "203d", label: "A hospital, clinic or wellness centre", categories: ["HEALTH"] },
      { id: "203e", label: "A school, uni or training facility", categories: ["EDUCATION", "SPORTS"] },
      { id: "203f", label: "A restaurant, hotel or event space", categories: ["SERVICES"] },
    ],
  },

  // ── Section 3: School & Skills ──
  {
    id: 301,
    section: "School & Skills",
    question: "Which subjects do you actually enjoy?",
    subtitle: "Not what you're best at — what you look forward to.",
    options: [
      { id: "301a", label: "Maths or physics", categories: ["TECHNOLOGY", "SCIENCE"] },
      { id: "301b", label: "Biology or chemistry", categories: ["HEALTH", "SCIENCE"] },
      { id: "301c", label: "Art, design, music or media", categories: ["CREATIVE"] },
      { id: "301d", label: "English, drama or humanities", categories: ["EDUCATION", "CREATIVE"] },
      { id: "301e", label: "PE, sport or outdoor ed", categories: ["SPORTS"] },
      { id: "301f", label: "IT, coding or digital tech", categories: ["TECHNOLOGY"] },
      { id: "301g", label: "Business studies or economics", categories: ["BUSINESS"] },
      { id: "301h", label: "Workshop, woodwork or engineering studies", categories: ["TRADES"] },
      { id: "301i", label: "Home economics, food tech or hospitality", categories: ["SERVICES"] },
      { id: "301j", label: "Psychology, society & culture or health", categories: ["HEALTH", "EDUCATION"] },
    ],
  },
  {
    id: 302,
    section: "School & Skills",
    question: "What are you naturally good at?",
    subtitle: "The stuff that comes easy — your superpowers.",
    options: [
      { id: "302a", label: "Solving puzzles and logical thinking", categories: ["TECHNOLOGY", "SCIENCE"] },
      { id: "302b", label: "Being creative and coming up with ideas", categories: ["CREATIVE"] },
      { id: "302c", label: "Talking to people and reading the room", categories: ["BUSINESS", "SERVICES", "EDUCATION"] },
      { id: "302d", label: "Staying calm under pressure", categories: ["HEALTH", "SPORTS"] },
      { id: "302e", label: "Working with your hands", categories: ["TRADES"] },
      { id: "302f", label: "Organising and planning things", categories: ["BUSINESS", "EDUCATION"] },
      { id: "302g", label: "Being physically strong or coordinated", categories: ["SPORTS", "TRADES"] },
      { id: "302h", label: "Paying attention to tiny details", categories: ["SCIENCE", "HEALTH", "TECHNOLOGY"] },
    ],
  },
  {
    id: 303,
    section: "School & Skills",
    question: "How do you learn best?",
    subtitle: "Everyone's brain works differently.",
    options: [
      { id: "303a", label: "Watching videos or tutorials", categories: ["TECHNOLOGY", "CREATIVE"] },
      { id: "303b", label: "Reading and taking notes", categories: ["SCIENCE", "EDUCATION"] },
      { id: "303c", label: "Doing it hands-on, trial and error", categories: ["TRADES", "SPORTS"] },
      { id: "303d", label: "Discussing with others and debating", categories: ["BUSINESS", "EDUCATION"] },
      { id: "303e", label: "Practising over and over until I nail it", categories: ["HEALTH", "SPORTS"] },
      { id: "303f", label: "Experimenting and testing ideas", categories: ["SCIENCE", "TECHNOLOGY", "CREATIVE"] },
    ],
  },

  // ── Section 4: Values & Goals ──
  {
    id: 401,
    section: "Values & Goals",
    question: "What matters most to you in a future career?",
    subtitle: "Pick what you really care about.",
    options: [
      { id: "401a", label: "Making good money", categories: ["TECHNOLOGY", "BUSINESS"] },
      { id: "401b", label: "Helping people or making a difference", categories: ["HEALTH", "EDUCATION"] },
      { id: "401c", label: "Creative freedom and self-expression", categories: ["CREATIVE"] },
      { id: "401d", label: "Job security and stability", categories: ["HEALTH", "TRADES", "EDUCATION"] },
      { id: "401e", label: "Being my own boss", categories: ["BUSINESS", "TRADES", "SERVICES"] },
      { id: "401f", label: "Staying active and not stuck at a desk", categories: ["SPORTS", "TRADES"] },
      { id: "401g", label: "Working on cool, cutting-edge stuff", categories: ["TECHNOLOGY", "SCIENCE"] },
    ],
  },
  {
    id: 402,
    section: "Values & Goals",
    question: "What kind of impact do you want to have?",
    subtitle: "Think about your legacy.",
    options: [
      { id: "402a", label: "Build something people use every day", categories: ["TECHNOLOGY", "TRADES"] },
      { id: "402b", label: "Keep people healthy and safe", categories: ["HEALTH"] },
      { id: "402c", label: "Inspire or educate the next generation", categories: ["EDUCATION", "SPORTS"] },
      { id: "402d", label: "Create art or content that moves people", categories: ["CREATIVE"] },
      { id: "402e", label: "Grow a business and create jobs", categories: ["BUSINESS"] },
      { id: "402f", label: "Protect the environment or solve big problems", categories: ["SCIENCE"] },
      { id: "402g", label: "Make experiences that bring people together", categories: ["SERVICES", "CREATIVE"] },
    ],
  },
  {
    id: 403,
    section: "Values & Goals",
    question: "What lifestyle do you want?",
    subtitle: "Career shapes your whole life — what's the dream?",
    options: [
      { id: "403a", label: "Work from anywhere, flexible hours", categories: ["TECHNOLOGY", "CREATIVE", "BUSINESS"] },
      { id: "403b", label: "Stable 9-to-5 with weekends off", categories: ["EDUCATION", "BUSINESS", "SCIENCE"] },
      { id: "403c", label: "High energy, fast-paced, never boring", categories: ["HEALTH", "SPORTS", "SERVICES"] },
      { id: "403d", label: "Outdoor work, not stuck inside", categories: ["TRADES", "SCIENCE", "SPORTS"] },
      { id: "403e", label: "Build something of my own over time", categories: ["BUSINESS", "TRADES", "CREATIVE"] },
      { id: "403f", label: "Travel and see the world through work", categories: ["SERVICES", "CREATIVE", "SPORTS"] },
    ],
  },

  // ── Section 5: Personality ──
  {
    id: 501,
    section: "Personality",
    question: "How would your mates describe you?",
    subtitle: "Be honest — what do people say about you?",
    options: [
      { id: "501a", label: "The smart / nerdy one", categories: ["TECHNOLOGY", "SCIENCE"] },
      { id: "501b", label: "The creative one", categories: ["CREATIVE"] },
      { id: "501c", label: "The sporty / active one", categories: ["SPORTS"] },
      { id: "501d", label: "The caring / empathetic one", categories: ["HEALTH", "EDUCATION"] },
      { id: "501e", label: "The leader / organiser", categories: ["BUSINESS"] },
      { id: "501f", label: "The handy / practical one", categories: ["TRADES"] },
      { id: "501g", label: "The social butterfly / people person", categories: ["SERVICES", "BUSINESS"] },
    ],
  },
  {
    id: 502,
    section: "Personality",
    question: "How do you handle pressure?",
    subtitle: "When things get hectic, what's your move?",
    options: [
      { id: "502a", label: "I stay calm and think it through logically", categories: ["TECHNOLOGY", "SCIENCE", "HEALTH"] },
      { id: "502b", label: "I thrive on it — pressure makes me better", categories: ["SPORTS", "HEALTH", "BUSINESS"] },
      { id: "502c", label: "I get creative and find unconventional solutions", categories: ["CREATIVE", "TECHNOLOGY"] },
      { id: "502d", label: "I lean on my team and communicate more", categories: ["EDUCATION", "SERVICES"] },
      { id: "502e", label: "I take action immediately — just do something", categories: ["TRADES", "SPORTS"] },
      { id: "502f", label: "I plan and organise my way out of it", categories: ["BUSINESS", "EDUCATION"] },
    ],
  },
  {
    id: 503,
    section: "Personality",
    question: "What's your leadership style?",
    subtitle: "Even if you're not a 'leader type' — how do you influence others?",
    options: [
      { id: "503a", label: "Lead by example — work harder than everyone", categories: ["TRADES", "SPORTS"] },
      { id: "503b", label: "Inspire with ideas and vision", categories: ["CREATIVE", "BUSINESS"] },
      { id: "503c", label: "Support and encourage — bring out the best in people", categories: ["EDUCATION", "HEALTH"] },
      { id: "503d", label: "Analyse the situation and make smart calls", categories: ["TECHNOLOGY", "SCIENCE"] },
      { id: "503e", label: "Take charge and make fast decisions", categories: ["BUSINESS", "HEALTH"] },
      { id: "503f", label: "Connect people and build relationships", categories: ["SERVICES", "EDUCATION"] },
    ],
  },
];

// ── RIASEC Types ──
export const RIASEC_TYPES: Record<
  RiasecType,
  { label: string; teenName: string; color: string; emoji: string; teenDescription: string }
> = {
  R: {
    label: "Realistic",
    teenName: "The Builder",
    color: "#f97316",
    emoji: "\uD83D\uDD27",
    teenDescription: "You like working with your hands, building things, and being physically active. You prefer doing over talking.",
  },
  I: {
    label: "Investigative",
    teenName: "The Thinker",
    color: "#6366f1",
    emoji: "\uD83E\uDDE0",
    teenDescription: "You love figuring things out, asking questions, and diving deep into how stuff works. Curiosity is your superpower.",
  },
  A: {
    label: "Artistic",
    teenName: "The Creator",
    color: "#a855f7",
    emoji: "\uD83C\uDFA8",
    teenDescription: "You express yourself through creativity — art, music, writing, design. You see the world differently and that's your strength.",
  },
  S: {
    label: "Social",
    teenName: "The Helper",
    color: "#f43f5e",
    emoji: "\u2764\uFE0F",
    teenDescription: "You're the person everyone comes to. You love helping, teaching, and making sure people around you are okay.",
  },
  E: {
    label: "Enterprising",
    teenName: "The Leader",
    color: "#10b981",
    emoji: "\uD83D\uDE80",
    teenDescription: "You take charge, pitch ideas, and make things happen. You're competitive, persuasive, and always thinking big.",
  },
  C: {
    label: "Conventional",
    teenName: "The Organiser",
    color: "#3b82f6",
    emoji: "\uD83D\uDCCB",
    teenDescription: "You love order, planning, and getting things done efficiently. Spreadsheets? Checklists? Oddly satisfying.",
  },
};

// RIASEC swipe scenarios — 18 scenarios, 3 per type
export const RIASEC_SCENARIOS: {
  id: number;
  emoji: string;
  text: string;
  riasecType: RiasecType;
}[] = [
  // Realistic (The Builder)
  { id: 1, emoji: "\uD83D\uDD27", text: "You just fixed a friend's bike and it rides perfectly", riasecType: "R" },
  { id: 2, emoji: "\u26A1", text: "You spent the weekend building furniture from scratch", riasecType: "R" },
  { id: 3, emoji: "\uD83C\uDF31", text: "You rigged up a speaker system for a party using spare parts", riasecType: "R" },

  // Investigative (The Thinker)
  { id: 4, emoji: "\uD83D\uDD2C", text: "You stayed up late binge-watching a documentary about space", riasecType: "I" },
  { id: 5, emoji: "\uD83E\uDDE0", text: "You found a pattern in the data that nobody else noticed", riasecType: "I" },
  { id: 6, emoji: "\uD83E\uDDEA", text: "You designed an experiment to figure out the best study hack", riasecType: "I" },

  // Artistic (The Creator)
  { id: 7, emoji: "\uD83C\uDFA8", text: "You spent all weekend on a digital art piece and lost track of time", riasecType: "A" },
  { id: 8, emoji: "\uD83C\uDFB5", text: "You wrote a song and your friends keep asking to hear it", riasecType: "A" },
  { id: 9, emoji: "\uD83C\uDFAC", text: "You filmed and edited a short video that blew up at school", riasecType: "A" },

  // Social (The Helper)
  { id: 10, emoji: "\uD83D\uDC69\u200D\uD83C\uDFEB", text: "You tutored a younger student and they finally got it", riasecType: "S" },
  { id: 11, emoji: "\u2764\uFE0F", text: "You organised a fundraiser and the whole school got behind it", riasecType: "S" },
  { id: 12, emoji: "\uD83E\uDE79", text: "A friend was going through it and you knew exactly what to say", riasecType: "S" },

  // Enterprising (The Leader)
  { id: 13, emoji: "\uD83D\uDCB0", text: "You started a side hustle and made your first $500", riasecType: "E" },
  { id: 14, emoji: "\uD83C\uDFC6", text: "You captained your team to a come-from-behind win", riasecType: "E" },
  { id: 15, emoji: "\uD83D\uDE80", text: "You pitched an idea to your teacher and convinced them to try it", riasecType: "E" },

  // Conventional (The Organiser)
  { id: 16, emoji: "\uD83D\uDCCB", text: "You made a study planner that got you through exams stress-free", riasecType: "C" },
  { id: 17, emoji: "\uD83D\uDCCA", text: "You built a spreadsheet to track your savings \u2014 oddly satisfying", riasecType: "C" },
  { id: 18, emoji: "\uD83D\uDCC1", text: "You reorganised the team's shared drive and everyone could finally find stuff", riasecType: "C" },
];

// Work values for RIASEC quiz
export const WORK_VALUES: {
  key: string;
  emoji: string;
  label: string;
  teenDescription: string;
}[] = [
  { key: "achievement", emoji: "\uD83C\uDFC6", label: "Achievement", teenDescription: "Feeling proud of what you accomplish and being challenged" },
  { key: "independence", emoji: "\uD83E\uDD85", label: "Independence", teenDescription: "Being able to do things your own way without someone breathing down your neck" },
  { key: "recognition", emoji: "\u2B50", label: "Recognition", teenDescription: "Getting credit for your work and being known for what you do" },
  { key: "relationships", emoji: "\uD83E\uDD1D", label: "Relationships", teenDescription: "Working with people you actually like and building real connections" },
  { key: "stability", emoji: "\uD83D\uDEE1\uFE0F", label: "Stability", teenDescription: "Knowing your job is secure and you can count on a steady income" },
  { key: "worklife", emoji: "\u2600\uFE0F", label: "Work-Life Balance", teenDescription: "Having time for your hobbies, friends, and life outside of work" },
];

// RIASEC to career category bridge (for backward compat)
export const RIASEC_TO_CATEGORIES: Record<RiasecType, CareerCategory[]> = {
  R: ["TRADES", "SPORTS"],
  I: ["SCIENCE", "TECHNOLOGY"],
  A: ["CREATIVE"],
  S: ["HEALTH", "EDUCATION", "SERVICES"],
  E: ["BUSINESS"],
  C: ["BUSINESS", "TECHNOLOGY"],
};

// Reverse mapping: CareerCategory → RiasecType[] (derived from RIASEC_TO_CATEGORIES)
export const CATEGORIES_TO_RIASEC: Record<CareerCategory, RiasecType[]> = (() => {
  const result: Record<string, RiasecType[]> = {};
  for (const [type, categories] of Object.entries(RIASEC_TO_CATEGORIES) as [RiasecType, CareerCategory[]][]) {
    for (const cat of categories) {
      if (!result[cat]) result[cat] = [];
      if (!result[cat].includes(type)) result[cat].push(type);
    }
  }
  return result as Record<CareerCategory, RiasecType[]>;
})();

// Legacy quiz questions kept for reference / backwards compat
export const QUIZ_QUESTIONS: {
  id: number;
  question: string;
  subtitle: string;
  options: { id: string; label: string; categories: CareerCategory[] }[];
}[] = [
  {
    id: 1,
    question: "What kind of activities do you enjoy most?",
    subtitle: "Pick all that resonate with you.",
    options: [
      { id: "1a", label: "Building or fixing things", categories: ["TRADES"] },
      { id: "1b", label: "Working with technology", categories: ["TECHNOLOGY"] },
      { id: "1c", label: "Helping people", categories: ["HEALTH", "EDUCATION"] },
      { id: "1d", label: "Creating art or media", categories: ["CREATIVE"] },
      { id: "1e", label: "Analysing data or problems", categories: ["SCIENCE", "TECHNOLOGY"] },
      { id: "1f", label: "Playing or coaching sports", categories: ["SPORTS"] },
      { id: "1g", label: "Leading or organising", categories: ["BUSINESS"] },
      { id: "1h", label: "Cooking or hospitality", categories: ["SERVICES"] },
    ],
  },
  {
    id: 2,
    question: "What's your ideal work environment?",
    subtitle: "Where do you see yourself thriving?",
    options: [
      { id: "2a", label: "Outdoors or on-site", categories: ["TRADES"] },
      { id: "2b", label: "Office with computers", categories: ["TECHNOLOGY", "BUSINESS"] },
      { id: "2c", label: "Hospital or clinic", categories: ["HEALTH"] },
      { id: "2d", label: "Studio or creative space", categories: ["CREATIVE"] },
      { id: "2e", label: "Laboratory or research facility", categories: ["SCIENCE"] },
      { id: "2f", label: "Gym or sports facility", categories: ["SPORTS"] },
      { id: "2g", label: "Classroom", categories: ["EDUCATION"] },
      { id: "2h", label: "Kitchen or restaurant", categories: ["SERVICES"] },
    ],
  },
  {
    id: 3,
    question: "Which school subjects do you enjoy most?",
    subtitle: "Think about what you look forward to in your timetable.",
    options: [
      { id: "3a", label: "Mathematics", categories: ["TECHNOLOGY", "SCIENCE", "BUSINESS"] },
      { id: "3b", label: "Science", categories: ["HEALTH", "SCIENCE"] },
      { id: "3c", label: "English or Humanities", categories: ["EDUCATION", "CREATIVE"] },
      { id: "3d", label: "Art, Design or Media", categories: ["CREATIVE"] },
      { id: "3e", label: "PE or Sport", categories: ["SPORTS"] },
      { id: "3f", label: "IT or Digital Technologies", categories: ["TECHNOLOGY"] },
      { id: "3g", label: "Business Studies", categories: ["BUSINESS"] },
      { id: "3h", label: "Workshop or Design Technology", categories: ["TRADES"] },
    ],
  },
  {
    id: 4,
    question: "What matters most to you in a career?",
    subtitle: "Choose what drives you.",
    options: [
      { id: "4a", label: "High salary", categories: ["TECHNOLOGY", "BUSINESS"] },
      { id: "4b", label: "Job security", categories: ["HEALTH", "TRADES", "EDUCATION"] },
      { id: "4c", label: "Creative freedom", categories: ["CREATIVE"] },
      { id: "4d", label: "Helping others", categories: ["HEALTH", "EDUCATION"] },
      { id: "4e", label: "Physical activity", categories: ["TRADES", "SPORTS"] },
      { id: "4f", label: "Variety and new experiences", categories: ["SERVICES", "CREATIVE"] },
      { id: "4g", label: "Work-life balance", categories: ["EDUCATION", "BUSINESS"] },
    ],
  },
  {
    id: 5,
    question: "Which of these could you see yourself doing?",
    subtitle: "Imagine your future self at work.",
    options: [
      { id: "5a", label: "Writing code", categories: ["TECHNOLOGY"] },
      { id: "5b", label: "Designing graphics", categories: ["CREATIVE"] },
      { id: "5c", label: "Wiring a house", categories: ["TRADES"] },
      { id: "5d", label: "Treating patients", categories: ["HEALTH"] },
      { id: "5e", label: "Coaching athletes", categories: ["SPORTS"] },
      { id: "5f", label: "Teaching students", categories: ["EDUCATION"] },
      { id: "5g", label: "Managing projects", categories: ["BUSINESS"] },
      { id: "5h", label: "Researching data", categories: ["SCIENCE", "TECHNOLOGY"] },
    ],
  },
];
