"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { School, Heart, ArrowRight, KeyRound } from "lucide-react";

export function Stakeholders() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Not just for students
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Schools get cohort insights. Parents stay in the loop. Everyone wins.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <div className="rounded-2xl border-0 bg-card p-8 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <School className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">For Schools</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              See what your cohort is interested in, which pathways are trending,
              and how your school compares. Data-driven career counselling.
            </p>
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={() => signIn("google", { callbackUrl: "/school/register" })}
            >
              Register Your School
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-2xl border-0 bg-card p-8 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">For Parents</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Stay connected to your child&apos;s career exploration. See their
              plan, track progress, and understand where they&apos;re headed.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="gap-2 rounded-xl">
                <Link href="/parent/invite">
                  <KeyRound className="h-4 w-4" />
                  I Have a Code
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2 rounded-xl">
                <Link href="/parent/dashboard">
                  Parent Login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
