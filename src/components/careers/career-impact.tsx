interface CareerImpactProps {
  text: string;
}

export function CareerImpact({ text }: CareerImpactProps) {
  return (
    <div className="rounded-2xl bg-card border-2 border-border p-8 shadow-md">
      <h2 className="text-xl font-bold text-card-foreground mb-4">Why This Matters</h2>
      <p className="text-card-foreground/70 leading-relaxed text-base">
        {text}
      </p>
    </div>
  );
}
