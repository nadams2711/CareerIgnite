interface CareerImpactProps {
  text: string;
}

export function CareerImpact({ text }: CareerImpactProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 p-8 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Why This Matters</h2>
      <p className="text-muted-foreground leading-relaxed text-base">
        {text}
      </p>
    </div>
  );
}
