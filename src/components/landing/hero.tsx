"use client";

import { signIn } from "next-auth/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 dark:from-blue-900 dark:via-cyan-900 dark:to-teal-900">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-300 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>For Year 10-12 Students</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find your vibe.{" "}
            <span className="text-amber-300">Spark your future.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/90 sm:text-xl">
            Career exploration built for Australian students.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="h-13 rounded-2xl bg-white px-8 text-base font-bold text-blue-700 shadow-lg hover:bg-white/90 hover:scale-[1.02] transition-all"
              onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
            >
              Take the Quiz
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-13 rounded-2xl border-2 border-white/30 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              onClick={() => signIn("google", { callbackUrl: "/careers" })}
            >
              Explore Careers
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
