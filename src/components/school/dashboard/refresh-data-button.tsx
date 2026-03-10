"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { computeSchoolInsights } from "@/lib/actions/school-admin.actions";

export function RefreshDataButton({ schoolCode }: { schoolCode: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRefresh = async () => {
    setLoading(true);
    setMessage(null);
    const result = await computeSchoolInsights(schoolCode);
    setLoading(false);
    if (result.success) {
      setMessage("Data refreshed!");
      router.refresh();
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage(result.error || "Failed to refresh");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={loading}
        className="rounded-xl gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Refreshing..." : "Refresh Data"}
      </Button>
      {message && (
        <span className="text-xs text-white/60">{message}</span>
      )}
    </div>
  );
}
