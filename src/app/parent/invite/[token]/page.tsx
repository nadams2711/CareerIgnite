"use client";

import { useState, use } from "react";
import { claimParentInvite } from "@/lib/actions/parent.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Heart, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ParentInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [childName, setChildName] = useState("");
  const [error, setError] = useState("");

  const handleClaim = async () => {
    if (!email || !name) return;
    setLoading(true);
    setError("");
    try {
      const result = await claimParentInvite(token, email, name);
      setChildName(result.childName || "your child");
      setClaimed(true);
    } catch (err: any) {
      setError(err.message || "Failed to claim invite");
    } finally {
      setLoading(false);
    }
  };

  if (claimed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-background">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">You are connected!</h1>
            <p className="text-muted-foreground mb-6">
              You can now view {childName}&apos;s career plan and progress.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/parent/dashboard?email=${encodeURIComponent(email)}`}>View Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Flame className="h-7 w-7 text-blue-600" />
          </div>
          <CardTitle className="text-xl">CareerIgnite Parent Portal</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Your child has invited you to view their career plan.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Your Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Smith"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Your Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@email.com"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            onClick={handleClaim}
            disabled={loading || !email || !name}
            className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
            Connect to My Child
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            You will be able to view your child&apos;s career plan, progress, and school trends.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
