import { useQuery } from "@tanstack/react-query";
import { startAssessment, checkIfAny, assessmentStatus } from "./api";
import { auth } from "@/v2/lib/auth";

export type AssessmentPhase = "not-started" | "in-progress" | "completed";

export interface AssessmentPhaseData {
  phase: AssessmentPhase;
  progressPercent: number;
  answered: number;
  total: number;
  hasCompletedBefore: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useAssessmentPhase(): AssessmentPhaseData {
  const token = auth.get()?.token;

  // Query 1: Check if user has completed any assessment before
  const checkQuery = useQuery({
    queryKey: ["assessment", "checkifany"],
    queryFn: checkIfAny,
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: 1,
    enabled: !!token,
  });

  // Query 2: Start / resume assessment to get total and answered question counts
  const startQuery = useQuery({
    queryKey: ["assessment", "start-assessment-phase"],
    queryFn: startAssessment,
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
    enabled: !!token,
  });

  // Query 3: Assessment completion status
  const statusQuery = useQuery({
    queryKey: ["assessment", "status"],
    queryFn: assessmentStatus,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!token,
  });

  const isLoading = checkQuery.isLoading || startQuery.isLoading || statusQuery.isLoading;
  const isError = checkQuery.isError && startQuery.isError;
  const hasCompletedBefore = checkQuery.data?.data === "Yes" || statusQuery.data?.completed === true;

  const maxAttemptsReached = Boolean(startQuery.data?.max_attempts_reached);
  const overview = startQuery.data?.overview; // top-level, not under 'data'
  const answered = overview?.answered ?? 0;
  const total = overview?.total ?? 0;
  const lastPage = overview ? Math.ceil(total / Math.max(overview.perPage, 1)) : 1;

  let phase: AssessmentPhase = "not-started";
  let progressPercent = 0;

  if (maxAttemptsReached) {
    phase = "completed";
    progressPercent = 100;
  } else if (overview) {
    if (answered > 0 && answered < total) {
      phase = "in-progress";
      progressPercent = Math.min(99, Math.max(1, Math.round((answered / total) * 100)));
    } else if (answered >= total && total > 0) {
      phase = "completed";
      progressPercent = 100;
    } else if (answered === 0) {
      if (hasCompletedBefore) {
        phase = "completed";
        progressPercent = 100;
      } else {
        phase = "not-started";
        progressPercent = 0;
      }
    }
  } else if (hasCompletedBefore) {
    phase = "completed";
    progressPercent = 100;
  }

  const refetch = () => {
    checkQuery.refetch();
    startQuery.refetch();
    statusQuery.refetch();
  };

  return {
    phase,
    progressPercent,
    answered,
    total,
    hasCompletedBefore,
    isLoading,
    isError,
    refetch,
  };
}
