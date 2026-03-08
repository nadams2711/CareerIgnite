import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Flame className="h-12 w-12 text-blue-600 mb-4" />
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6">The page you are looking for does not exist.</p>
      <Button asChild className="bg-blue-600 hover:bg-blue-700">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
