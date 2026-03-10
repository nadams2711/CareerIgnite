import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Stakeholders } from "@/components/landing/stakeholders";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    if (session.user.role === "SCHOOL_ADMIN" && session.user.adminSchoolCode) {
      redirect(`/school/${session.user.adminSchoolCode}/dashboard`);
    }
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Stakeholders />
      </main>
      <Footer />
    </div>
  );
}
