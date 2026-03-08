import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserPlans } from "@/lib/actions/plan.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { getCareers } from "@/lib/actions/career.actions";
import { refineResultsWithSkills } from "@/lib/actions/quiz.actions";
import { PlanList } from "@/components/dashboard/plan-list";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { QuizMatches } from "@/components/dashboard/quiz-matches";
import { SuggestedActions } from "@/components/dashboard/suggested-actions";
import { InviteParent } from "@/components/dashboard/invite-parent";
import { RetakeQuizLink } from "@/components/dashboard/retake-quiz-link";
import { Button } from "@/components/ui/button";
import { Search, Map, RotateCcw, Target } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const [user, plans] = await Promise.all([getCurrentUser(), getUserPlans()]);

  // Get top careers for quiz matches
  const interests = user?.interests ?? [];
  const skillRatings = (user?.skillRatings as Record<string, number> | null) ?? {};
  const hasSkills = Object.keys(skillRatings).length > 0;
  let matchedCareers: Awaited<ReturnType<typeof getCareers>> = [];

  // Try interest categories first
  for (const interest of interests) {
    const results = await getCareers({
      category: interest as any,
      sort: "growth",
    });
    if (results.length > 0) {
      matchedCareers = results.slice(0, 3);
      break;
    }
  }

  // If no matches from interests but user has skill ratings, use skills to find careers
  if (matchedCareers.length === 0 && hasSkills) {
    const refined = await refineResultsWithSkills({}, skillRatings);
    matchedCareers = refined.matchedCareers.slice(0, 3);
  }

  const hasState = !!user?.state;
  const quizCompleted = interests.length > 0 || hasSkills;
  const hasPlans = plans.length > 0;
  const firstName = user?.name?.split(" ")[0] || "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome header + suggested action */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Hey {firstName}!{" "}
            <span className="inline-block animate-bounce">
              {quizCompleted ? "\uD83C\uDF89" : "\uD83D\uDC4B"}
            </span>
          </h1>
          <p className="mt-1 text-white/70">
            {quizCompleted
              ? "Your career journey is looking great"
              : "Let's get your career journey started"
            }
          </p>
        </div>
        <SuggestedActions
          hasState={hasState}
          quizCompleted={quizCompleted}
          hasPlans={hasPlans}
        />
      </div>

      {/* Quick actions row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProgressCard
          hasState={hasState}
          hasPlans={hasPlans}
          quizCompleted={quizCompleted}
        />
        <Link href="/careers" className="block">
          <div className="rounded-2xl bg-card border-2 border-border p-4 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer flex items-center gap-3 h-full">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Explore Careers</p>
              <p className="text-xs text-muted-foreground">Browse all careers</p>
            </div>
          </div>
        </Link>
        <Link href="/plan" className="block">
          <div className="rounded-2xl bg-card border-2 border-border p-4 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer flex items-center gap-3 h-full">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
              <Map className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Build Roadmap</p>
              <p className="text-xs text-muted-foreground">Plan your journey</p>
            </div>
          </div>
        </Link>
        {quizCompleted ? (
          <Link href="/onboarding" className="block">
            <div className="rounded-2xl bg-card border-2 border-border p-4 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer flex items-center gap-3 h-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">View My Results</p>
                <p className="text-xs text-muted-foreground">See your career matches</p>
              </div>
            </div>
          </Link>
        ) : (
          <Link href="/onboarding" className="block">
            <div className="rounded-2xl bg-card border-2 border-border p-4 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer flex items-center gap-3 h-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
                <RotateCcw className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Take Quiz</p>
                <p className="text-xs text-muted-foreground">Discover your matches</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Quiz matches — full width */}
      {matchedCareers.length > 0 && (
        <div>
          <QuizMatches careers={matchedCareers} />
          <p className="mt-2 text-sm text-muted-foreground">
            Want different results?{" "}
            <RetakeQuizLink />
          </p>
        </div>
      )}

      {/* Plans + Share with Parents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border-2 border-border bg-card shadow-md p-5">
          <h3 className="font-bold text-sm text-foreground mb-3">Your Plans</h3>
          {plans.length > 0 ? (
            <PlanList plans={plans} />
          ) : (
            <div className="text-center py-4">
              <Map className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No roadmaps yet</p>
              <Button asChild size="sm" className="btn-gradient rounded-xl">
                <Link href="/plan">Create Roadmap</Link>
              </Button>
            </div>
          )}
        </div>
        <InviteParent />
      </div>
    </div>
  );
}
