import { useQuery } from "@tanstack/react-query";
import { startAssessment, checkIfAny, assessmentStatus, getAllReports } from "./api";
import { auth } from "@/v2/lib/auth";

export type AssessmentPhase = "not-started" | "in-progress" | "completed";

export interface AssessmentPhaseData {
  phase: AssessmentPhase;
  progressPercent: number;
  answered: number;
  total: number;
  hasCompletedBefore: boolean;
  /**
   * True if the user has EVER finished at least one attempt, sourced from
   * get-all-report (a real list of completed attempts) rather than
   * checkifany/assessment-status, which only reflect the *latest* attempt —
   * those flip back to "not completed" as soon as a new attempt is started,
   * which is not what "should I show View Report" should mean once retakes
   * are allowed.
   */
  hasAnyCompletedReport: boolean;
  /** True once the backend's own attempt cap (currently 6) has been hit */
  maxAttemptsReached: boolean;
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
    refetchOnWindowFocus: false,
  });

  // Query 2: Start / resume assessment to get total and answered question counts.
  // IMPORTANT: this shares the exact same query key ("assessment","current-page")
  // as the actual in-progress assessment flow (see assessment.tsx InProgressFlow).
  // start-assessment is a "start OR resume" endpoint with server-side page
  // tracking and no client-supplied cursor, so calling it independently from
  // every page that renders the header (15+ pages via TopHeaderBar) was firing
  // a background "resume" call on every navigation — which could shift the
  // server's notion of "current page" out from under an active attempt.
  // Sharing the query key means React Query dedupes/caches this across every
  // call site instead of firing a fresh network request each time.
  const startQuery = useQuery({
    queryKey: ["assessment", "current-page"],
    queryFn: startAssessment,
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  // Query 3: Assessment completion status
  const statusQuery = useQuery({
    queryKey: ["assessment", "status"],
    queryFn: assessmentStatus,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  // Query 4: All completed reports — the authoritative "has ever completed" signal
  const reportsQuery = useQuery({
    queryKey: ["assessment", "all-reports"],
    queryFn: getAllReports,
    staleTime: 1000 * 30,
    retry: 1,
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  const isLoading = checkQuery.isLoading || startQuery.isLoading || statusQuery.isLoading;
  const isError = checkQuery.isError && startQuery.isError;
  
  const checkMessage = checkQuery.data?.message ?? checkQuery.data?.data;
  const reportsRaw = reportsQuery.data as { data?: unknown } | undefined;
  const reportsListLength =
    Array.isArray(reportsRaw?.data)
      ? reportsRaw.data.length
      : Array.isArray(reportsQuery.data)
      ? (reportsQuery.data as unknown[]).length
      : 0;

  const hasCompletedBefore =
    checkMessage === "Yes" || statusQuery.data?.completed === true;
  const hasAnyCompletedReport =
    reportsListLength > 0 || hasCompletedBefore;

  const maxAttemptsReached = Boolean(startQuery.data?.max_attempts_reached);
  const overview = startQuery.data?.overview; // top-level, not under 'data'
  const answered = overview?.answered ?? 0;
  const total = overview?.total ?? 0;
  const lastPage = overview ? Math.ceil(total / Math.max(overview.perPage, 1)) : 1;

  let phase: AssessmentPhase = "not-started";
  let progressPercent = 0;

  if (hasAnyCompletedReport || maxAttemptsReached || (answered >= total && total > 0)) {
    phase = "completed";
    progressPercent = 100;
  } else if (overview) {
    if (answered > 0 && answered < total) {
      phase = "in-progress";
      progressPercent = Math.min(99, Math.max(1, Math.round((answered / total) * 100)));
    } else {
      phase = "not-started";
      progressPercent = 0;
    }
  } else if (hasCompletedBefore) {
    phase = "completed";
    progressPercent = 100;
  }

  const refetch = () => {
    checkQuery.refetch();
    startQuery.refetch();
    statusQuery.refetch();
    reportsQuery.refetch();
  };

  return {
    phase,
    progressPercent,
    answered,
    total,
    hasCompletedBefore,
    hasAnyCompletedReport,
    maxAttemptsReached,
    isLoading,
    isError,
    refetch,
  };
}
