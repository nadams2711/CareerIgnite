"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getParentChildren, getParentInsights, getChildCareerMatches, generateParentTimeline } from "@/lib/actions/parent.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Flame, Heart, GraduationCap, TrendingUp, School,
  CheckCircle, Circle, MapPin, Sparkles, Users,
  BarChart3, Globe, Star, Route,
} from "lucide-react";
import { CAREER_CATEGORIES } from "@/lib/constants";
import type { TimelineStep } from "@/types";
import type { CareerCategory } from "@prisma/client";
import Link from "next/link";
import { ParentCoachCard } from "@/components/coach/parent-coach-card";
import { ParentCareerCard } from "@/components/parent/parent-career-card";
import { InterestBars } from "@/components/parent/interest-bars";
import { CareerPopularity } from "@/components/parent/career-popularity";

type InsightsData = {
  stateInterests: { category: string; count: number; percentage: number }[];
  totalStudents: number;
  trendingCareers: { slug: string; count: number }[];
  careerPopularity: Record<string, number>;
};

// What each interest category says about the child — parent-friendly language
const CATEGORY_PARENT_INSIGHTS: Record<string, { trait: string; strength: string }> = {
  TECHNOLOGY: {
    trait: "Your child loves solving puzzles and figuring out how things work. They get energised by cracking problems and digging deep until they find the answer.",
    strength: "This persistence and logical thinking is exactly what tech careers need — from building apps to analysing data to cybersecurity.",
  },
  TRADES: {
    trait: "Your child enjoys working with their hands and seeing real, physical results. They take pride in building or fixing something tangible.",
    strength: "This hands-on mindset is a natural fit for trades — careers where they can create, fix, and build things that last.",
  },
  CREATIVE: {
    trait: "Your child has a creative spark — they see the world differently and love expressing ideas through design, art, or media.",
    strength: "This creative vision is valued in careers across design, media, marketing, and the arts.",
  },
  HEALTH: {
    trait: "Your child genuinely wants to help others. They stay calm under pressure, and people naturally trust them in tough moments.",
    strength: "This empathy and composure is exactly what healthcare needs — careers where they make a direct, life-changing difference.",
  },
  SCIENCE: {
    trait: "Your child is naturally curious — they want to understand why things are the way they are, and they notice patterns others miss.",
    strength: "This analytical mind drives science careers — where research and insights can change how we understand the world.",
  },
  BUSINESS: {
    trait: "Your child is a natural organiser and leader. They see opportunities others don't and know how to get things done.",
    strength: "This drive and people-sense is the foundation of business careers — leading teams, managing projects, and building ventures.",
  },
  EDUCATION: {
    trait: "Your child lights up when helping someone understand something new. They're patient, explain things well, and care about others' growth.",
    strength: "This gift for communication and mentoring makes great educators — careers shaping the next generation.",
  },
  SPORTS: {
    trait: "Your child is competitive, driven, and loves pushing themselves physically. They thrive on energy and performance.",
    strength: "This discipline and passion for peak performance underpins sports careers — from the field to coaching to sports science.",
  },
  SERVICES: {
    trait: "Your child is a people person who loves creating great experiences. They enjoy busy environments and take pride in making others happy.",
    strength: "This warmth and service mindset is perfect for hospitality, events, and service careers.",
  },
};

// Timeline step styling (mirrors the plan page)
const timelineTypeConfig: Record<string, { gradient: string; bg: string; text: string; emoji: string }> = {
  school: { gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", emoji: "\uD83D\uDCDA" },
  transition: { gradient: "from-amber-500 to-orange-500", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", emoji: "\uD83D\uDD04" },
  study: { gradient: "from-emerald-500 to-cyan-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", emoji: "\uD83C\uDF93" },
  work: { gradient: "from-indigo-500 to-blue-500", bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300", emoji: "\uD83D\uDCBC" },
};

// Skill rating labels for parent-friendly display
const SKILL_LABELS: Record<string, string> = {
  math: "Math & Numbers",
  writing: "Writing & Communication",
  creative: "Creative & Design",
  tech: "Tech & Digital",
  people: "People & Teamwork",
  handson: "Hands-on & Physical",
};

export default function ParentDashboardPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [parentData, setParentData] = useState<any>(null);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeChild, setActiveChild] = useState(0);
  const [quizCareers, setQuizCareers] = useState<any[]>([]);
  const [generatedTimeline, setGeneratedTimeline] = useState<TimelineStep[]>([]);

  // Fetch career matches, timeline, and insights for a child
  const fetchChildData = async (child: any) => {
    const planCareers = child.plans[0]?.careers;
    let careerSlugs: string[] = [];
    let careerIds: string[] = [];

    if (planCareers && planCareers.length > 0) {
      careerSlugs = planCareers.map((pc: any) => pc.career.slug);
      careerIds = planCareers.map((pc: any) => pc.career.id);
      setQuizCareers([]);
    } else if (child.interests?.length > 0) {
      // Reconstruct career matches from quiz results
      const matches = await getChildCareerMatches(
        child.interests,
        child.skillRatings as Record<string, number> | null
      );
      setQuizCareers(matches);
      careerSlugs = matches.map((c: any) => c.slug);
      careerIds = matches.map((c: any) => c.id);
    } else {
      setQuizCareers([]);
    }

    // Generate timeline if no saved plan timeline exists
    const savedTimeline = child.plans[0]?.timeline as TimelineStep[] | null;
    if (savedTimeline && savedTimeline.length > 0) {
      setGeneratedTimeline(savedTimeline);
    } else if (careerIds.length > 0 && child.state) {
      const tl = await generateParentTimeline(careerIds, child.state);
      setGeneratedTimeline(tl);
    } else {
      setGeneratedTimeline([]);
    }

    const insightsData = await getParentInsights(child.state, careerSlugs);
    setInsights(insightsData);
  };

  const handleLookup = async (lookupEmail?: string) => {
    const target = lookupEmail || email;
    if (!target) return;
    setLoading(true);
    try {
      const data = await getParentChildren(target);
      setParentData(data);
      setSubmitted(true);

      if (data && data.children.length > 0) {
        await fetchChildData(data.children[0].child);
      }
    } catch {
      setParentData(null);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when active child changes
  const handleChildChange = async (index: number) => {
    setActiveChild(index);
    if (!parentData) return;
    const child = parentData.children[index]?.child;
    if (!child) return;
    await fetchChildData(child);
  };

  // Auto-load if email came from invite flow
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
      handleLookup(emailParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Email Entry Screen ───
  if (!submitted && !loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-[oklch(0.935_0.01_240)]">
        <Card className="w-full max-w-md border-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-teal-500">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="font-[family-name:var(--font-space-grotesk)]">
              Parent Dashboard
            </CardTitle>
            <p className="text-sm text-[oklch(0.42_0.01_240)] mt-1">
              Enter your email to view your child&apos;s career progress.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            />
            <Button
              onClick={() => handleLookup()}
              disabled={loading || !email}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
            >
              {loading ? "Looking up..." : "View Dashboard"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Loading Screen ───
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-[oklch(0.935_0.01_240)]">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm text-[oklch(0.42_0.01_240)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ─── No Data Screen ───
  if (!parentData || parentData.children.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-[oklch(0.935_0.01_240)]">
        <Card className="w-full max-w-md text-center border-2">
          <CardContent className="p-8">
            <Heart className="h-12 w-12 text-[oklch(0.42_0.01_240)] mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No connections found</h2>
            <p className="text-[oklch(0.42_0.01_240)] mb-4">
              Ask your child to send you an invite link from their CareerIgnite dashboard.
            </p>
            <Button variant="outline" onClick={() => { setSubmitted(false); setEmail(""); }}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const children = parentData.children;
  const currentLink = children[activeChild];
  const child = currentLink.child;
  const latestPlan = child.plans[0];
  const hasQuiz = (child.interests?.length || 0) > 0;
  const hasState = !!child.state;
  const hasPlan = child.plans.length > 0;
  const progress = [hasState, hasQuiz, hasPlan].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[oklch(0.935_0.01_240)]">
      {/* ─── Gradient Header ─── */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <Flame className="h-6 w-6" />
                <span className="font-[family-name:var(--font-space-grotesk)]">CareerIgnite</span>
              </Link>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
                Parent View
              </Badge>
            </div>
          </div>
          <div className="mt-6">
            <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-space-grotesk)]">
              Welcome, {parentData.name || "Parent"}
            </h1>
            <p className="mt-1 text-white/80 text-sm">
              {children.length === 1
                ? "Track your child's career exploration journey."
                : `Tracking ${children.length} children's career journeys.`}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ─── Child Tabs (if multiple) ─── */}
        {children.length > 1 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {children.map((link: any, i: number) => (
              <button
                key={link.id}
                onClick={() => handleChildChange(i)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap border-2 ${
                  activeChild === i
                    ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white border-transparent shadow-md"
                    : "bg-[oklch(0.995_0.002_240)] border-[oklch(0.85_0.01_240)] text-foreground hover:border-blue-300"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                {link.child.name || "Student"}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ════════ Left Column (2/3) ════════ */}
          <div className="lg:col-span-2 space-y-6">
            {/* ─── Section A: Child Overview ─── */}
            <Card className="border-2 border-[oklch(0.85_0.01_240)] bg-[oklch(0.995_0.002_240)] shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)]">
                      {child.name || "Student"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[oklch(0.42_0.01_240)] mt-0.5">
                      {child.state && (
                        <Badge variant="outline" className="border-[oklch(0.85_0.01_240)]">
                          <MapPin className="h-3 w-3 mr-1" />
                          {child.state}
                        </Badge>
                      )}
                      {child.grade && (
                        <Badge variant="outline" className="border-[oklch(0.85_0.01_240)]">
                          {child.grade}
                        </Badge>
                      )}
                      {child.school && (
                        <span className="flex items-center gap-1">
                          <School className="h-3.5 w-3.5" /> {child.school.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress steps */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Journey Progress</span>
                    <span className="text-sm text-[oklch(0.42_0.01_240)]">{progress}/3</span>
                  </div>
                  <Progress value={(progress / 3) * 100} className="h-2" />
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  {[
                    { done: hasState, label: "State selected" },
                    { done: hasQuiz, label: "Quiz completed" },
                    { done: hasPlan, label: "Plan created" },
                  ].map((step) => (
                    <span key={step.label} className="flex items-center gap-1.5">
                      {step.done ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-[oklch(0.42_0.01_240)]" />
                      )}
                      <span className={step.done ? "text-foreground" : "text-[oklch(0.42_0.01_240)]"}>
                        {step.label}
                      </span>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ─── Section B: Quiz Results / Interests ─── */}
            {hasQuiz && (
              <Card className="border-2 border-[oklch(0.85_0.01_240)] bg-[oklch(0.995_0.002_240)] shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-[family-name:var(--font-space-grotesk)]">
                    <Star className="h-5 w-5 text-blue-600" />
                    Quiz Results &mdash; What We Learned About {child.name || "Your Child"}
                  </CardTitle>
                  <p className="text-sm text-[oklch(0.42_0.01_240)]">
                    Based on their career quiz responses, here&apos;s what stands out.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Interest category badges */}
                  <div>
                    <p className="text-sm font-semibold mb-3">Top interest areas</p>
                    <div className="flex flex-wrap gap-2">
                      {child.interests.map((interest: string) => {
                        const catInfo = CAREER_CATEGORIES[interest as CareerCategory];
                        if (!catInfo) return null;
                        return (
                          <Badge
                            key={interest}
                            className={`bg-gradient-to-r ${catInfo.gradient} text-white border-0 px-3 py-1.5 text-sm`}
                          >
                            {catInfo.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personality insights per category */}
                  <div className="space-y-4">
                    {child.interests.slice(0, 3).map((interest: string) => {
                      const catInfo = CAREER_CATEGORIES[interest as CareerCategory];
                      const insight = CATEGORY_PARENT_INSIGHTS[interest];
                      if (!catInfo || !insight) return null;
                      return (
                        <div key={interest} className="rounded-xl border border-[oklch(0.85_0.01_240)] bg-[oklch(0.935_0.01_240)] p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${catInfo.gradient}`} />
                            <span className={`text-sm font-bold ${catInfo.textColor}`}>
                              {catInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {insight.trait}
                          </p>
                          <p className="text-sm text-[oklch(0.42_0.01_240)] leading-relaxed mt-1">
                            {insight.strength}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interest strength bars */}
                  {child.interests.length > 0 && (
                    <InterestBars
                      title="Interest strength"
                      data={child.interests.map((interest: string, i: number) => ({
                        category: interest,
                        count: child.interests.length - i,
                        percentage: Math.round(
                          ((child.interests.length - i) / child.interests.length) * 100
                        ),
                      }))}
                    />
                  )}

                  {/* Skill ratings grid */}
                  {child.skillRatings && Object.keys(child.skillRatings as Record<string, number>).length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-3">Self-rated strengths</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(child.skillRatings as Record<string, number>).map(
                          ([skill, rating]) => {
                            const label = SKILL_LABELS[skill] || skill.replace(/_/g, " ");
                            return (
                              <div
                                key={skill}
                                className="rounded-xl border border-[oklch(0.85_0.01_240)] bg-[oklch(0.935_0.01_240)] p-3 text-center"
                              >
                                <div className="text-lg mb-0.5">
                                  {"\u2B50".repeat(Math.min(rating, 5))}
                                </div>
                                <span className="text-xs font-medium text-[oklch(0.42_0.01_240)]">
                                  {label}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ─── Section C: Career Matches ─── */}
            {latestPlan ? (
              <Card className="border-2 border-[oklch(0.85_0.01_240)] bg-[oklch(0.995_0.002_240)] shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-[family-name:var(--font-space-grotesk)]">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    {latestPlan.title}
                  </CardTitle>
                  <p className="text-sm text-[oklch(0.42_0.01_240)]">
                    {child.name || "Your child"}&apos;s saved career plan — tap to explore each career.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {latestPlan.careers.map((pc: any, i: number) => (
                      <ParentCareerCard
                        key={pc.id}
                        career={pc.career}
                        rank={i + 1}
                        popularity={insights?.careerPopularity[pc.career.slug]}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : quizCareers.length > 0 ? (
              <Card className="border-2 border-[oklch(0.85_0.01_240)] bg-[oklch(0.995_0.002_240)] shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-[family-name:var(--font-space-grotesk)]">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Quiz-Matched Careers
                  </CardTitle>
                  <p className="text-sm text-[oklch(0.42_0.01_240)]">
                    Based on {child.name || "your child"}&apos;s quiz results, these careers are the best fit.
                    They haven&apos;t saved a formal plan yet.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quizCareers.map((career: any, i: number) => (
                      <ParentCareerCard
                        key={career.id}
                        career={career}
                        rank={i + 1}
                        popularity={insights?.careerPopularity[career.slug]}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* ─── Section C2: Roadmap / Timeline ─── */}
            {generatedTimeline.length > 0 && (
              <Card className="border-2 border-[oklch(0.85_0.01_240)] bg-[oklch(0.995_0.002_240)] shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-[family-name:var(--font-space-grotesk)]">
                    <Route className="h-5 w-5 text-blue-600" />
                    {child.name || "Your Child"}&apos;s Roadmap
                  </CardTitle>
                  <p className="text-sm text-[oklch(0.42_0.01_240)]">
                    {latestPlan?.timeline
                      ? "The step-by-step pathway from school to career."
                      : "A suggested pathway based on quiz results — this updates when a plan is saved."}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-0">
                    {/* Vertical line */}
                    <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-emerald-400 to-indigo-400" />

                    {generatedTimeline.map((step) => {
                      const config = timelineTypeConfig[step.type] || timelineTypeConfig.school;
                      return (
                        <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                          {/* Dot */}
                          <div
                            className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm bg-gradient-to-br ${config.gradient}`}
                          >
                            <span className="text-sm">{config.emoji}</span>
                          </div>
                          {/* Content */}
                          <div className="flex-1 pt-0.5">
                            <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${config.bg} ${config.text}`}>
                              {step.year}
                            </span>
                            <h4 className="font-bold mt-1">{step.title}</h4>
                            <p className="text-sm text-[oklch(0.42_0.01_240)] mt-0.5">{step.description}</p>
                            {step.details && step.details.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {step.details.map((detail, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <Circle className="h-3 w-3 mt-1 shrink-0 text-[oklch(0.42_0.01_240)]" />
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ─── Section E: School Trends ─── */}
            {child.school?.insights?.[0] && (() => {
              const insight = child.school.insights[0];
              const interests = insight.interestCounts as Record<string, number>;
              const sorted = Object.entries(interests)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6);
              const totalCount = Object.values(interests).reduce((a, b) => a + b, 0);

              return (
                <Card className="border-2 border-[oklch(0.85_0.01_240)] bg-[oklch(0.995_0.002_240)] shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-[family-name:var(--font-space-grotesk)]">
                      <School className="h-5 w-5 text-blue-600" />
                      School Trends — {child.school.name}
                    </CardTitle>
                    <p className="text-sm text-[oklch(0.42_0.01_240)]">
                      What students at this school are interested in ({insight.studentCount} students)
                    </p>
                  </CardHeader>
                  <CardContent>
                    <InterestBars
                      data={sorted.map(([cat, count]) => ({
                        category: cat,
                        count,
                        percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
                      }))}
                    />
                  </CardContent>
                </Card>
              );
            })()}
          </div>

          {/* ════════ Right Column (1/3) ════════ */}
          <div className="space-y-6">
            {/* ─── Section D: What Other Students Are Exploring ─── */}
            {insights && (
              <>
                {/* State-wide interests */}
                {insights.stateInterests.length > 0 && child.state && (
                  <Card className="border-2 border-[oklch(0.85_0.01_240)] bg-[oklch(0.995_0.002_240)] shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base font-[family-name:var(--font-space-grotesk)]">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        {child.state} Interests
                      </CardTitle>
                      <p className="text-xs text-[oklch(0.42_0.01_240)]">
                        What {insights.totalStudents.toLocaleString()} students across{" "}
                        {child.state} are exploring
                      </p>
                    </CardHeader>
                    <CardContent>
                      <InterestBars data={insights.stateInterests} />
                    </CardContent>
                  </Card>
                )}

                {/* Career popularity */}
                {(() => {
                  const careerList = latestPlan
                    ? latestPlan.careers.map((pc: any) => ({ title: pc.career.title, slug: pc.career.slug }))
                    : quizCareers.map((c: any) => ({ title: c.title, slug: c.slug }));
                  if (careerList.length === 0) return null;
                  return (
                    <Card className="border-2 border-[oklch(0.85_0.01_240)] bg-[oklch(0.995_0.002_240)] shadow-md">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base font-[family-name:var(--font-space-grotesk)]">
                          <Users className="h-5 w-5 text-blue-600" />
                          Career Popularity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CareerPopularity
                          careers={careerList}
                          popularity={insights.careerPopularity}
                        />
                      </CardContent>
                    </Card>
                  );
                })()}

                {/* Trending careers nationally */}
                {insights.trendingCareers.length > 0 && (
                  <Card className="border-2 border-[oklch(0.85_0.01_240)] bg-[oklch(0.995_0.002_240)] shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base font-[family-name:var(--font-space-grotesk)]">
                        <Globe className="h-5 w-5 text-blue-600" />
                        Trending Nationally
                      </CardTitle>
                      <p className="text-xs text-[oklch(0.42_0.01_240)]">
                        Most popular careers across Australia right now
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {insights.trendingCareers.map((trend, i) => (
                          <Link
                            key={trend.slug}
                            href={`/careers/${trend.slug}`}
                            className="flex items-center gap-3 rounded-xl border border-[oklch(0.85_0.01_240)] bg-[oklch(0.935_0.01_240)] p-3 transition-colors hover:bg-[oklch(0.91_0.01_240)]"
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-teal-500">
                              <span className="text-white font-bold text-xs">{i + 1}</span>
                            </div>
                            <span className="text-sm font-medium capitalize truncate">
                              {trend.slug.replace(/-/g, " ")}
                            </span>
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500 ml-auto shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* ─── Section F: AI Parent Coach ─── */}
            <ParentCoachCard
              parentEmail={email}
              childName={child.name || undefined}
              planCareers={latestPlan?.careers.map((pc: any) => pc.career.title)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
