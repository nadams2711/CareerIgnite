"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, KeyRound } from "lucide-react";

export default function ParentInviteCodePage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length >= 6) {
      router.push(`/parent/invite/${trimmed}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Flame className="h-7 w-7 text-blue-600" />
          </div>
          <CardTitle className="text-xl">CareerIgnite Parent Portal</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the invite code your child shared with you.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Invite Code</label>
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. ABC123"
                maxLength={8}
                className="font-mono text-center text-lg tracking-widest uppercase"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={code.trim().length < 6}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Continue
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Your child can find this code on their CareerIgnite dashboard under &quot;Share with Parents&quot;.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
