import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SchoolRegisterForm } from "@/components/school/school-register-form";

export const metadata = {
  title: "Register Your School | CareerIgnite",
};

export default async function SchoolRegisterPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  // If already an admin, redirect to their dashboard
  if (session.user.role === "SCHOOL_ADMIN" && session.user.adminSchoolCode) {
    redirect(`/school/${session.user.adminSchoolCode}/dashboard`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold gradient-text">
          Register Your School
        </h1>
        <p className="mt-2 text-muted-foreground">
          Access analytics and insights about your students&apos; career interests
        </p>
      </div>
      <SchoolRegisterForm />
    </div>
  );
}
