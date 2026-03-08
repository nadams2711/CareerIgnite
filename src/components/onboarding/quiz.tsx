"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { SWIPE_SCENARIOS } from "@/lib/constants";
import { getSwipeQuizResults } from "@/lib/actions/quiz.actions";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { SwipeCard } from "./swipe-card";

export function Quiz() {
  const { currentCard, swipeAnswers, addSwipeAnswer, setCurrentCard, setResults, setIsLoading, setCurrentStep } =
    useQuizStore();

  const scenario = SWIPE_SCENARIOS[currentCard];

  if (!scenario) return null;

  const handleSwipe = async (liked: boolean) => {
    addSwipeAnswer({ scenarioId: scenario.id, liked });

    if (currentCard < SWIPE_SCENARIOS.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      // Last card — show calculating screen then get results
      setCurrentStep(3); // calculating
      setIsLoading(true);
      try {
        const allAnswers = [
          ...swipeAnswers.filter((a) => a.scenarioId !== scenario.id),
          { scenarioId: scenario.id, liked },
        ];
        const results = await getSwipeQuizResults(allAnswers);
        // Short delay for the animation
        await new Promise((r) => setTimeout(r, 2000));
        setResults(results);

        // Save state, grade, and interests to DB
        const { selectedState, selectedGrade } = useQuizStore.getState();
        if (selectedState) {
          try {
            await updateUserProfile({
              state: selectedState,
              grade: selectedGrade ?? undefined,
              interests: results.topCategories,
            });
          } catch {
            // User might not be logged in yet
          }
        }
      } catch (error) {
        console.error("Failed to get quiz results:", error);
        setCurrentStep(2); // back to quiz on error
      } finally {
        setIsLoading(false);
      }
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
        totalCards={SWIPE_SCENARIOS.length}
      />
    </div>
  );
}
