import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCareers } from "@/lib/actions/career.actions";
import { CareerCard } from "@/components/careers/career-card";
import { CareerFilters } from "@/components/careers/career-filters";
import { Skeleton } from "@/components/ui/skeleton";
import type { CareerCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Explore Careers",
};

export default async function CareersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const params = await searchParams;
  const careers = await getCareers({
    search: params.search,
    category: params.category as CareerCategory | undefined,
    salaryMin: params.salaryMin ? Number(params.salaryMin) : undefined,
    sort: (params.sort as "title" | "salary" | "growth") || "title",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Explore <span className="gradient-text">Careers</span>
        </h1>
        <p className="mt-2 text-white/70">
          {careers.length} careers to discover. Find the one that excites you.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <CareerFilters />
      </Suspense>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {careers.map((career) => (
          <CareerCard key={career.id} career={career} />
        ))}
      </div>

      {careers.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-lg text-white/70">No careers found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
