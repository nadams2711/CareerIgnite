import { notFound } from "next/navigation";
import Image from "next/image";
import { getCareerBySlug, getAllCareerSlugs } from "@/lib/actions/career.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { PathwayTabs } from "@/components/careers/pathway-tabs";
import { DayInLife } from "@/components/careers/day-in-life";
import { CareerProgressionAI } from "@/components/careers/career-progression-ai";
import { CareerImpact } from "@/components/careers/career-impact";
import { CareerChallenges } from "@/components/careers/career-challenges";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatSalaryTeen, formatGrowthRateTeen } from "@/lib/utils";
import { CAREER_CATEGORIES } from "@/lib/constants";
import { CareerCoachDialog } from "@/components/coach/career-coach-dialog";
import { formatSalaryRange, formatGrowthRate } from "@/lib/utils";
import type { CareerChallengesData } from "@/types";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const career = await getCareerBySlug(slug);
  if (!career) return { title: "Career Not Found" };
  return { title: career.title };
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [career, user] = await Promise.all([
    getCareerBySlug(slug),
    getCurrentUser().catch(() => null),
  ]);

  if (!career) notFound();

  const categoryInfo = CAREER_CATEGORIES[career.category];
  // progression field no longer used — AI generates it dynamically
  const challenges = (career as any).challenges as CareerChallengesData | null;
  const userState = user?.state ?? undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero */}
      <div className={`relative rounded-3xl bg-gradient-to-br ${categoryInfo.gradient} text-white overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 h-40 w-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-5 left-5 h-32 w-32 rounded-full bg-white blur-2xl" />
        </div>

        {/* Full-size white layer with image, then gradient overlay to blend */}
        {career.image && (
          <div className="absolute inset-0 pointer-events-none">
            {/* White base — same size as hero, hides image white edges */}
            <div className="absolute inset-0 bg-white" />
            {/* Image on the white base, pinned to bottom-right */}
            <div className="absolute right-0 bottom-0 w-72 h-full sm:w-96">
              <Image
                src={career.image}
                alt=""
                fill
                className="object-contain object-bottom p-6"
                sizes="384px"
                priority
              />
            </div>
            {/* Category gradient on top — fades the image into the hero colour */}
            <div className={`absolute inset-0 bg-gradient-to-br ${categoryInfo.gradient} opacity-85`} />
          </div>
        )}

        <div className="relative z-20 p-8 sm:p-12 sm:pb-10">
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm mb-4">
            {categoryInfo.label}
          </Badge>
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{career.title}</h1>
          <p className="mt-4 text-white/85 leading-relaxed text-lg max-w-2xl">
            {career.description}
          </p>
        </div>
      </div>

      {/* Quick stats pills */}
      <div className="flex flex-wrap gap-3">
        <div className="rounded-2xl bg-card border-2 border-border px-5 py-3 shadow-lg flex items-center gap-2">
          <span className="text-lg font-bold">{formatSalaryTeen(career.salaryLow, career.salaryHigh)}</span>
          <span className="text-muted-foreground text-sm">per year</span>
        </div>
        <div className="rounded-2xl bg-card border-2 border-border px-5 py-3 shadow-lg flex items-center gap-2">
          <span className="text-lg font-bold">{formatGrowthRateTeen(career.growthRate)}</span>
        </div>
        <div className="rounded-2xl bg-card border-2 border-border px-5 py-3 shadow-lg flex items-center gap-2">
          <span className="text-lg font-bold">{career.skills.length} skills</span>
          <span className="text-muted-foreground text-sm">to master</span>
        </div>
      </div>

      {/* Pathways — prominently placed near top */}
      <Card className="rounded-2xl shadow-lg border-2 border-border border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="text-xl font-bold">How to Get There</CardTitle>
        </CardHeader>
        <CardContent>
          <PathwayTabs pathways={career.pathways} defaultState={userState} />
        </CardContent>
      </Card>

      {/* Day in the Life */}
      {career.dayInLife && <DayInLife text={career.dayInLife} />}

      {/* Career Progression — AI-generated */}
      <CareerProgressionAI careerTitle={career.title} />

      {/* Why This Matters */}
      {career.impact && <CareerImpact text={career.impact} />}

      {/* Pros & Cons */}
      {challenges && <CareerChallenges challenges={challenges} />}

      {/* Skills */}
      <div className="rounded-2xl bg-card border-2 border-border p-8 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Skills You&apos;ll Build</h2>
        <div className="flex flex-wrap gap-2">
          {career.skills.map((skill) => (
            <Badge
              key={skill}
              className={`bg-gradient-to-r ${categoryInfo.gradient} text-white border-0 text-sm px-3 py-1.5`}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* AI Coach CTA */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold mb-2">Still got questions?</h2>
        <p className="text-muted-foreground mb-4">Chat with the AI Coach about this career</p>
        <CareerCoachDialog
          careerTitle={career.title}
          careerSlug={career.slug}
          salary={formatSalaryRange(career.salaryLow, career.salaryHigh)}
          growthRate={formatGrowthRate(career.growthRate)}
        />
      </div>
    </div>
  );
}
