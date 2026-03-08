import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSchoolDashboardData } from "@/lib/actions/school-admin.actions";
import { SchoolDashboardClient } from "@/components/school/dashboard/school-dashboard-client";

export const metadata = {
  title: "School Dashboard | CareerIgnite",
};

export default async function SchoolDashboardPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { code } = await params;
  const data = await getSchoolDashboardData(code);

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You don&apos;t have admin access to this school&apos;s dashboard.
        </p>
      </div>
    );
  }

  return <SchoolDashboardClient data={data} />;
}
