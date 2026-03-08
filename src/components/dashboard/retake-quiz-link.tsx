"use client";

import { useRouter } from "next/navigation";
import { useQuizStore } from "@/stores/quiz-store";

export function RetakeQuizLink() {
  const router = useRouter();
  const reset = useQuizStore((s) => s.reset);

  const handleRetake = () => {
    reset();
    router.push("/onboarding");
  };

  return (
    <button
      onClick={handleRetake}
      className="text-primary hover:underline font-medium"
    >
      Retake quiz
    </button>
  );
}
