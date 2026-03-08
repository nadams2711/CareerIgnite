"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map } from "lucide-react";
import { CAREER_CATEGORIES } from "@/lib/constants";
import type { PlanWithCareers } from "@/types";

interface PlanListProps {
  plans: PlanWithCareers[];
}

function PlanCard({ plan, catInfo }: { plan: PlanWithCareers; catInfo: { gradient: string } | null }) {
  const [imgError, setImgError] = useState(false);
  const topCareer = plan.careers[0]?.career;
  const showImage = topCareer?.image && !imgError;

  return (
    <div className="group relative rounded-2xl border-2 border-border bg-card shadow-md transition-all hover:scale-[1.01] hover:shadow-lg cursor-pointer overflow-hidden">
      {showImage && (
        <div className="absolute right-3 top-2 bottom-2 w-20 sm:w-24 pointer-events-none">
          <Image
            src={topCareer!.image!}
            alt=""
            fill
            className="object-contain opacity-70 group-hover:opacity-85 transition-opacity"
            sizes="128px"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="relative z-20 flex items-center gap-3 p-4">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
            catInfo?.gradient || "from-blue-500 to-teal-500"
          } shadow-sm`}
        >
          <Map className="h-4 w-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0 text-xs"
            >
              {plan.careers.length} career{plan.careers.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          <h3 className="text-base font-bold text-foreground">{plan.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-[70%]">
            {plan.careers.map((pc) => pc.career.title).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PlanList({ plans }: PlanListProps) {
  if (plans.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center">
        <p className="text-muted-foreground mb-4">You have not created any plans yet.</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/plan">Create Your First Plan</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {plans.map((plan) => {
        const topCareer = plan.careers[0]?.career;
        const catInfo = topCareer
          ? CAREER_CATEGORIES[topCareer.category]
          : null;

        return (
          <Link key={plan.id} href="/plan" className="block">
            <PlanCard plan={plan} catInfo={catInfo} />
          </Link>
        );
      })}
    </div>
  );
}
