"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumGateProps {
  children: React.ReactNode;
  isPremium: boolean;
  title?: string;
}

export function PremiumGate({ children, isPremium, title }: PremiumGateProps) {
  if (isPremium) return <>{children}</>;

  return (
    <div className="relative rounded-2xl border-2 border-border bg-card shadow-md overflow-hidden">
      {title && (
        <div className="px-5 pt-4 pb-2">
          <h3 className="font-heading text-sm font-semibold text-muted-foreground">{title}</h3>
        </div>
      )}
      <div className="pointer-events-none select-none blur-[6px] opacity-60 p-5">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 backdrop-blur-[2px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/10 to-teal-500/10 mb-3">
          <Lock className="h-6 w-6 text-blue-500" />
        </div>
        <p className="font-heading text-sm font-semibold mb-1">Premium Analytics</p>
        <p className="text-xs text-muted-foreground mb-3 max-w-[200px] text-center">
          Upgrade to access detailed insights and reports
        </p>
        <Button size="sm" className="btn-gradient rounded-xl text-xs">
          Upgrade Now
        </Button>
      </div>
    </div>
  );
}
