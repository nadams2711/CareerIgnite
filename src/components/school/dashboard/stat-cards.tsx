"use client";

import { Users, ClipboardCheck, TrendingUp } from "lucide-react";

interface StatCardsProps {
  studentCount: number;
  quizCompletionRate: number;
  topInterest: string | null;
}

export function StatCards({ studentCount, quizCompletionRate, topInterest }: StatCardsProps) {
  const stats = [
    {
      label: "Registered Students",
      value: studentCount.toLocaleString(),
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Quiz Completion",
      value: `${quizCompletionRate}%`,
      icon: ClipboardCheck,
      gradient: "from-cyan-500 to-cyan-600",
    },
    {
      label: "Top Interest",
      value: topInterest || "—",
      icon: TrendingUp,
      gradient: "from-teal-500 to-teal-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border-2 border-border bg-card p-5 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient}`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="font-heading text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
