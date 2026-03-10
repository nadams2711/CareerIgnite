"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { RIASEC_SCENARIOS } from "@/lib/constants";
import { SwipeCard } from "./swipe-card";

export function RiasecQuiz() {
  const { currentCard, riasecAnswers, addRiasecAnswer, setCurrentCard, setCurrentStep } =
    useQuizStore();

  const scenario = RIASEC_SCENARIOS[currentCard];

  if (!scenario) return null;

  const handleSwipe = (liked: boolean) => {
    addRiasecAnswer({
      scenarioId: scenario.id,
      liked,
      riasecType: scenario.riasecType,
    });

    if (currentCard < RIASEC_SCENARIOS.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      // Done with swipes — advance to skills step
      setCurrentStep(3);
    }
  };

  return (
    <div className="mx-auto max-w-lg flex flex-col items-center">
      <SwipeCard
        key={scenario.id}
        emoji={scenario.emoji}
        text={scenario.text}
        onSwipe={handleSwipe}
        cardNumber={currentCard + 1}
        totalCards={RIASEC_SCENARIOS.length}
      />
    </div>
  );
}
