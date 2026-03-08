import type {
  Career,
  StatePathway,
  Plan,
  PlanCareer,
  AustralianState,
  CareerCategory,
  PathwayType,
} from "@prisma/client";

// Career with its pathways included
export type CareerWithPathways = Career & {
  pathways: StatePathway[];
};

// Plan with careers included
export type PlanWithCareers = Plan & {
  careers: (PlanCareer & {
    career: CareerWithPathways;
  })[];
};

// Swipe quiz types
export type SwipeAnswer = {
  scenarioId: number;
  liked: boolean;
};

export type QuizResults = {
  topCategories: CareerCategory[];
  matchedCareers: CareerWithPathways[];
  categoryScores: Record<string, number>;
  vibeLabel: string;
};

// Legacy quiz types (kept for compatibility)
export type QuizAnswer = {
  questionId: number;
  selectedOptions: string[];
};

// Timeline types for plan builder
export type TimelineStep = {
  id: string;
  year: string;
  title: string;
  description: string;
  type: "school" | "transition" | "study" | "work";
  details?: string[];
};

// Filter types for career browsing
export type CareerFilters = {
  search?: string;
  category?: CareerCategory;
  salaryMin?: number;
  sort?: "title" | "salary" | "growth";
};

// Category display info
export type CategoryInfo = {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  darkBgColor: string;
  darkTextColor: string;
  icon: string;
  gradient: string;
};

// Career progression step
export type CareerProgressionStep = {
  level: string;
  years: string;
  salary: string;
  description: string;
  color: string;
};

// Career challenges (pros & cons)
export type CareerChallengesData = {
  pros: string[];
  cons: string[];
};

// Company that hires for a career
export type CareerCompany = {
  name: string;
  description: string;
  url: string;
};

// Public school insights data (for /school/[code]/insights)
export type SchoolInsightsData = {
  school: {
    code: string;
    name: string;
    suburb: string;
    state: string;
  };
  studentCount: number;
  quizCompletionRate: number;
  topInterest: string | null;
  interestCounts: Record<string, number>;
  careerCounts: Record<string, number>;
  subjectCounts: Record<string, number>;
  pathwayCounts: Record<string, number>;
  skillAvgs: Record<string, number>;
  gradeCounts: Record<string, Record<string, number>>;
  engagementStats: {
    totalRegistered: number;
    quizCompleted: number;
    planCreated: number;
  };
  strengths: { skill: string; avg: number }[];
  weaknesses: { skill: string; avg: number }[];
  stateComparison: Record<string, number> | null;
};

// School explorer listing item
export type SchoolExplorerItem = {
  code: string;
  name: string;
  suburb: string;
  state: string;
  studentCount: number;
  topInterest: string | null;
  hasInsights: boolean;
};

// School dashboard data (tier-gated)
export type SchoolDashboardData = {
  // Basic (always available)
  school: {
    code: string;
    name: string;
    suburb: string;
    state: string;
    tier: "FREE" | "PREMIUM";
    trialEndsAt: string | null;
    adminName: string | null;
  };
  studentCount: number;
  quizCompletionRate: number;
  topInterests: { category: string; label: string; count: number; percentage: number }[];
  // Premium (null for free tier)
  premium: {
    interestCounts: Record<string, number>;
    careerCounts: Record<string, number>;
    subjectCounts: Record<string, number>;
    pathwayCounts: Record<string, number>;
    skillAvgs: Record<string, number>;
    gradeCounts: Record<string, Record<string, number>>;
    engagementStats: {
      totalRegistered: number;
      quizCompleted: number;
      planCreated: number;
    };
    trends: {
      period: string;
      studentCount: number;
      interestCounts: Record<string, number>;
    }[];
    competitors: {
      name: string;
      suburb: string;
      studentCount: number;
      topInterest: { category: string; percentage: number } | null;
    }[];
  } | null;
};
