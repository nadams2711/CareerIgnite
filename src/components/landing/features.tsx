import { Zap, Route, Map, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Swipe Quiz",
    description:
      "Swipe through 15 real work scenarios in 30 seconds. No boring forms \u2014 just tap what vibes with you.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Route,
    title: "Every Pathway",
    description:
      "Uni, TAFE, trades, apprenticeships, sports academies, arts schools \u2014 see every route, not just the obvious one.",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: Map,
    title: "Your Roadmap",
    description:
      "Build a step-by-step timeline from Year 11 subjects to career entry. Save it, share it, PDF it.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Sparkles,
    title: "AI Coach",
    description:
      "Got questions? Chat with an AI coach that knows your career inside out. Ask anything.",
    gradient: "from-amber-500 to-emerald-500",
  },
];

export function Features() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Your career journey, <span className="gradient-text">simplified</span>
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Everything you need to go from &quot;I have no idea&quot; to &quot;I&apos;ve got a plan&quot;.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border-0 bg-card p-6 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
