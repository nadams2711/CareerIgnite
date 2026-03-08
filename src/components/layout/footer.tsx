import { Flame } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-teal-500">
              <Flame className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold gradient-text">CareerIgnite</span>
            <span className="text-border">|</span>
            <span>Spark your future</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CareerIgnite. Career data is indicative only.
          </p>
        </div>
      </div>
    </footer>
  );
}
