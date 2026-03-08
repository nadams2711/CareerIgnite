import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSchoolsForExplorer } from "@/lib/actions/school.actions";
import { SchoolCard } from "@/components/school/school-card";
import { SchoolExplorerFilters } from "@/components/school/school-explorer-filters";
import { Skeleton } from "@/components/ui/skeleton";
import type { AustralianState } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Explore Schools",
};

export default async function SchoolsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");
  if (session.user.role !== "SCHOOL_ADMIN") redirect("/dashboard");

  const params = await searchParams;
  const schools = await getSchoolsForExplorer(
    params.state as AustralianState | undefined,
    params.search,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Explore <span className="gradient-text">Schools</span>
        </h1>
        <p className="mt-2 text-white/70">
          {schools.length} schools across Australia. See what students are interested in.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <SchoolExplorerFilters />
      </Suspense>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {schools.map((school) => (
          <SchoolCard key={school.code} school={school} />
        ))}
      </div>

      {schools.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-lg text-white/70">
            No schools found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
}
