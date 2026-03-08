interface DayInLifeProps {
  text: string;
}

export function DayInLife({ text }: DayInLifeProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-8 shadow-sm">
      <h2 className="text-xl font-bold mb-4">A Day in Your Life</h2>
      <p className="text-muted-foreground leading-relaxed text-base">
        {text}
      </p>
    </div>
  );
}
