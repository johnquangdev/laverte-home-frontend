"use client";

import { useCallback, useEffect, useState } from "react";

import { QUIZ_COMPLETED_STORAGE_KEY } from "@/constants/home";

export const useQuizCompleted = () => {
  const [completed, setCompleted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setCompleted(localStorage.getItem(QUIZ_COMPLETED_STORAGE_KEY) === "1");
    setIsReady(true);
  }, []);

  const markCompleted = useCallback(() => {
    localStorage.setItem(QUIZ_COMPLETED_STORAGE_KEY, "1");
    setCompleted(true);
  }, []);

  return { completed, isReady, markCompleted };
};
