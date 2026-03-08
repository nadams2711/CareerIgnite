import { getCurrentUser } from "@/lib/actions/user.actions";
import { getUserPlans } from "@/lib/actions/plan.actions";
import { PlanPageClient } from "@/components/plan/plan-page-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Roadmap",
};

export default async function PlanPage() {
  const [user, plans] = await Promise.all([
    getCurrentUser().catch(() => null),
    getUserPlans().catch(() => []),
  ]);
  const initialState = user?.state ?? undefined;

  // Pass the latest saved plan's career ID mapping so the client can hydrate
  const latestPlan = plans[0] ?? null;
  const serverPlanCareerIds: Record<string, string> = {};
  if (latestPlan) {
    for (const pc of latestPlan.careers) {
      serverPlanCareerIds[pc.careerId] = pc.id;
    }
  }

  return (
    <PlanPageClient
      initialState={initialState}
      serverPlanId={latestPlan?.id ?? null}
      serverPlanCareerIds={serverPlanCareerIds}
    />
  );
}
