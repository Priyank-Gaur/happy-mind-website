import { V2Link, useV2Navigate } from "@/v2/lib/router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CircleCheck, ClipboardCheck, Clock, Download, FileText, History, Info, LoaderCircle, Sparkles, TriangleAlert, X } from "lucide-react";
import { Button } from "@/v2/components/ui/button";
import { Progress } from "@/v2/components/ui/progress";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { cn } from "@/v2/lib/utils";
import { toast } from "sonner";
import {
  checkIfAny,
  startAssessment,
  saveOption,
  updateLastAnswer,
  completeAssessment,
  getReport,
  getAllReports,
  useAssessmentPhase,
} from "@/v2/lib/assessment";
import type { Question, AssessmentOverview, ReportItem, ApiError } from "@/v2/lib/assessment";
import { fetchSubscribedServices } from "@/v2/lib/website-api";
import { useAuth } from "@/v2/lib/auth";
import { CouponPurchaseDialog } from "@/v2/components/coupon-purchase-dialog";

export default AssessmentPage;
// ---------------------------------------------------------------------------
// App-level state machine
// ---------------------------------------------------------------------------

type AppState =
  | "checking"      // initial — calling checkifany
  | "intro"         // show intro modal before starting / after a prior completion
  | "in-progress"   // actively answering questions
  | "completing"    // calling complete-assessment
  | "report"        // show report + download
  | "max-attempts"  // user has hit the 6-attempt cap
  | "error";        // unrecoverable API error on initial check

import { useProtectedRoute } from "@/v2/lib/auth-guard";

function AssessmentPage() {
  useProtectedRoute("Please log in to take the assessment.");
  const [appState, setAppState] = useState<AppState>("checking");
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false);
  const queryClient = useQueryClient();

  // ── checkifany on mount ──────────────────────────────────────────────────
  const checkQuery = useQuery({
    queryKey: ["assessment", "checkifany"],
    queryFn: checkIfAny,
    enabled: appState === "checking",
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: 1,
  });

  // checkifany/assessment-status only reflect the LATEST attempt — once a new
  // attempt is started they flip back to "not completed" even though an
  // earlier one genuinely finished. get-all-report is the real list of
  // completed attempts, so it's the reliable "has this user ever finished
  // one" signal for deciding whether to show the reports screen.
  const reportsQuery = useQuery({
    queryKey: ["assessment", "all-reports"],
    queryFn: getAllReports,
    enabled: appState === "checking",
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: 1,
  });

  // Transition once data arrives — useEffect avoids setting state during render.
  // If the user has completed at least one attempt ever, skip the intro modal
  // and go straight to the reports screen (past attempts + take another) —
  // this applies on first load, on refresh, and when navigating directly to
  // /assessment.
  useEffect(() => {
    if (appState !== "checking") return;
    if (checkQuery.isSuccess && (reportsQuery.isSuccess || reportsQuery.isError)) {
      const checkMessage = checkQuery.data?.message ?? checkQuery.data?.data;
      const reportsRaw = reportsQuery.data as { data?: unknown } | undefined;
      const reportsListLength =
        Array.isArray(reportsRaw?.data)
          ? reportsRaw.data.length
          : Array.isArray(reportsQuery.data)
          ? (reportsQuery.data as unknown[]).length
          : 0;

      const completed =
        checkMessage === "Yes" ||
        reportsListLength > 0;
      setHasCompletedBefore(completed);
      setAppState(completed ? "report" : "intro");
    } else if (checkQuery.isError) {
      setAppState("error");
    }
  }, [
    appState,
    checkQuery.isSuccess,
    checkQuery.isError,
    checkQuery.data,
    reportsQuery.isSuccess,
    reportsQuery.isError,
    reportsQuery.data,
  ]);

  const handleRetake = async () => {
    // Clear any persisted selections from the previous attempt so the new
    // attempt starts with a clean slate.
    try {
      const raw = localStorage.getItem("happimynd_auth_v1");
      const token = raw ? (JSON.parse(raw)?.token as string | undefined) : undefined;
      const key = token ? `happi_assessment_sel_${token.slice(-12)}` : "happi_assessment_sel";
      localStorage.removeItem(key);
    } catch { /* ignore */ }
    // REMOVE (not just invalidate) both current-page and all-reports caches so
    // InProgressFlow doesn't briefly serve stale completed data while refetching.
    // all-reports must also be removed so that when the user eventually
    // completes the retake and lands on ReportScreen, it fetches a fresh list
    // instead of briefly showing the stale empty array from the initial load.
    queryClient.removeQueries({ queryKey: ["assessment", "current-page"] });
    queryClient.removeQueries({ queryKey: ["assessment", "all-reports"] });
    await queryClient.invalidateQueries({ queryKey: ["assessment"] });
    setAppState("in-progress");
  };

  return (
    <DashboardShell
      header={
        <TopHeaderBar
          title="HappiLIFE Self Check In"
          emoji=""
          subtitle="A guided self-reflection experience - take it slow, be honest, and enjoy the process."
        />
      }
    >
      {appState === "checking" && <FullPageSpinner label="Loading your profile…" />}

      {appState === "error" && (
        <ErrorBanner
          message="We couldn't connect to the assessment service. Please check your connection and try again."
          onRetry={() => {
            setAppState("checking");
          }}
        />
      )}

      {appState === "intro" && (
        <IntroModal
          hasCompletedBefore={hasCompletedBefore}
          onStart={() => setAppState("in-progress")}
          onViewReport={() => setAppState("report")}
        />
      )}

      {appState === "in-progress" && (
        <InProgressFlow
          onMaxAttempts={() => setAppState("max-attempts")}
          onComplete={() => setAppState("completing")}
        />
      )}

      {appState === "completing" && (
        <CompletingScreen onDone={() => setAppState("report")} />
      )}

      {appState === "report" && <ReportScreen onRetake={handleRetake} />}

      {appState === "max-attempts" && <MaxAttemptsScreen />}
    </DashboardShell>
  );
}

// ---------------------------------------------------------------------------
// Shared micro-components
// ---------------------------------------------------------------------------

function FullPageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 py-16">
      <LoaderCircle className="h-8 w-8 animate-spin text-lavender-deep" />
      {label && <p className="text-sm font-medium text-foreground/60">{label}</p>}
    </div>
  );
}

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
      <TriangleAlert className="h-8 w-8 text-rose-400" />
      <p className="text-sm text-rose-700">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="rounded-full border-rose-300 text-rose-700 hover:bg-rose-100"
        >
          Try again
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Intro Modal
// ---------------------------------------------------------------------------

function IntroModal({
  hasCompletedBefore,
  onStart,
  onViewReport,
}: {
  hasCompletedBefore: boolean;
  onStart: () => void;
  onViewReport: () => void;
}) {
  const navigate = useV2Navigate();
  const { phase } = useAssessmentPhase();

  const handleClose = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/" });
    }
  };

  const getHeaderAndBody = () => {
    if (phase === "completed" || hasCompletedBefore) {
      return {
        h1: "Your HappiLIFE Insights Are Ready!",
        body: "Your self-reflection is complete. Explore your personalized growth insights and discover practical next steps to strengthen awareness, resilience, and everyday decision-making.",
        primaryCta: "View My Report",
      };
    }
    if (phase === "in-progress") {
      return {
        h1: "Complete Your HappiLIFE",
        body: "Understand your emotional wellbeing through a guided Self Check In designed to help you gain personalized insights.",
        primaryCta: "Continue Assessment",
      };
    }
    return {
      h1: "Start Your HappiLIFE",
      body: "Gain a clearer understanding of your current patterns, strengths, and growth opportunities through a guided self-reflection experience designed to help you move forward with confidence.",
      primaryCta: "Start Assessment",
    };
  };

  const { h1, body, primaryCta } = getHeaderAndBody();

  const instructions = [
    {
      n: 1,
      title: "Answer honestly.",
      body: "Choose the option that genuinely reflects your experiences and perspective.",
    },
    {
      n: 2,
      title: "Trust your first response.",
      body: "Avoid overthinking. Your first instinct often provides the most meaningful insight.",
    },
    {
      n: 3,
      title: "Complete every question.",
      body: "Every response contributes toward creating your personalized Self Check In.",
    },
    {
      n: 4,
      title: "Finish in one sitting.",
      body: "The Self Check In takes approximately 15-20 minutes. If you leave midway, your progress will be saved.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-foreground/40 px-4 py-10">
      <div className="relative w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-card sm:p-10">
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-lavender/40 text-foreground/70 transition hover:bg-lavender cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="inline-flex items-center gap-2 rounded-full bg-lavender/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-lavender-deep">
          <Sparkles className="h-3.5 w-3.5" /> HappiLIFE Self Check In
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {h1}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-foreground/70 sm:text-base leading-relaxed">
          {body}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {instructions.map((i) => (
            <div
              key={i.n}
              className="flex gap-4 rounded-2xl border border-lavender/60 bg-gradient-to-br from-white to-lavender/20 p-5"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white shadow-glow">
                {i.n}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">{i.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-foreground/65">{i.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-lavender/25 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-lavender-deep" />
          <p className="text-xs leading-relaxed text-foreground/70">
            HappiLIFE is a guided self-reflection Self Check In designed to help you understand
            important dimensions of your life through structured insights.
          </p>
        </div>

        <div className="mt-8 flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
          <button
            onClick={handleClose}
            className="text-sm font-semibold text-foreground/60 transition hover:text-foreground cursor-pointer"
          >
            Maybe Later
          </button>

          {(phase === "completed" || hasCompletedBefore) ? (
            <Button
              size="lg"
              onClick={onViewReport}
              className="h-12 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
            >
              <FileText className="mr-2 h-4 w-4" />
              View My Report
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={onStart}
              className="h-12 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
            >
              {primaryCta}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}


// ---------------------------------------------------------------------------
// In-Progress Flow
// ---------------------------------------------------------------------------

function InProgressFlow({
  onMaxAttempts,
  onComplete,
}: {
  onMaxAttempts: () => void;
  onComplete: () => void;
}) {
  const queryClient = useQueryClient();

  // ── Persistent selections (survive page refresh / tab close) ─────────────
  // Cache key is scoped to the logged-in user so different accounts don't share state
  const cacheKey = (() => {
    try {
      const raw = localStorage.getItem("happimynd_auth_v1");
      const token = raw ? (JSON.parse(raw)?.token as string | undefined) : undefined;
      return token ? `happi_assessment_sel_${token.slice(-12)}` : "happi_assessment_sel";
    } catch { return "happi_assessment_sel"; }
  })();

  const [localSelections, setLocalSelections] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(cacheKey);
      return saved ? (JSON.parse(saved) as Record<number, number>) : {};
    } catch { return {}; }
  });

  // Persist selections to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(localSelections));
    } catch { /* storage quota exceeded — fail silently */ }
  }, [localSelections, cacheKey]);

  // ── Fetch current page of questions ──────────────────────────────────────
  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["assessment", "current-page"],
    queryFn: startAssessment,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: 1,
  });

  // ── Skip-question validation (which unanswered question to scroll to) ────
  const [showValidation, setShowValidation] = useState(false);
  const questionRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Clear any "please answer this" highlighting whenever the page changes
  useEffect(() => {
    setShowValidation(false);
  }, [pageData?.overview?.current_page]);

  // Handle max-attempts from query result
  // API may return status: "true" (string) or max_attempts_reached: true (boolean)
  const isMaxAttempts =
    pageData?.max_attempts_reached === true ||
    pageData?.status === "true";

  useEffect(() => {
    if (isMaxAttempts) {
      onMaxAttempts();
    }
  }, [isMaxAttempts, onMaxAttempts]);

  // Detect cooldown / empty response from the API.
  // The server returns no questions/overview in two cases:
  //   1. User completed within the last minute (cooldown) — message says "recently completed"
  //   2. Some other server-side issue returning an empty payload
  // We treat ANY response with no questions + no overview + not max-attempts as a
  // cooldown/empty state and show a retry screen instead of the harsh error banner.
  const isEmptyResponse =
    !pageData?.questions?.length &&
    !pageData?.overview &&
    !isMaxAttempts;

  // ── Cooldown timer (timestamp-based, never resets mid-countdown) ─────────
  // cooldownEndAt is set ONCE when a cooldown response first arrives and
  // never touched again — this prevents the bug where useEffect re-running
  // (e.g. from a background query refetch) would call setCooldownSeconds(60)
  // and restart the countdown from 60.
  const cooldownEndAtRef = useRef<number>(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // When we first detect a cooldown (empty response), stamp the end time.
  useEffect(() => {
    if (!isEmptyResponse) return;
    // Only stamp once per cooldown session — if the ref is already set and
    // still in the future, don't overwrite it.
    if (cooldownEndAtRef.current > Date.now()) return;
    cooldownEndAtRef.current = Date.now() + 60_000;
    setCooldownSeconds(60);
  }, [isEmptyResponse]);

  // Countdown tick — runs every second while a cooldown is active.
  // Clears itself when the cooldown expires. Never touches cooldownEndAtRef.
  useEffect(() => {
    if (!isEmptyResponse || cooldownEndAtRef.current === 0) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((cooldownEndAtRef.current - Date.now()) / 1000));
      setCooldownSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    };
    tick(); // immediate first tick
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isEmptyResponse]);

  // Auto-retry when cooldown expires — keeps polling until the server
  // returns actual questions (not another cooldown response).
  useEffect(() => {
    if (!isEmptyResponse || cooldownSeconds > 0) return;
    // Cooldown expired but still no questions — retry every 3 seconds
    // until the server is ready (max 10 retries before giving up).
    let retries = 0;
    const maxRetries = 10;
    const poll = () => {
      if (retries >= maxRetries) return;
      retries++;
      refetch();
    };
    poll(); // immediate first attempt
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [isEmptyResponse, cooldownSeconds, refetch]);

  // Sort by question ID for a deterministic, consistent page order across sessions
  const questions: Question[] = (pageData?.questions ?? []).slice().sort((a, b) => a.id - b.id);
  const overview = pageData?.overview;
  const rawOverview = overview as (AssessmentOverview & { per_page?: number }) | undefined;
  // Lock in the per-page count from the first fetched page so that lastPage
  // stays consistent even when the final page has fewer items.
  const firstPageCountRef = useRef<number>(0);
  if (firstPageCountRef.current === 0 && questions.length > 0) {
    firstPageCountRef.current = questions.length;
  }
  const perPage = Math.max(
    overview?.perPage ?? rawOverview?.per_page ?? firstPageCountRef.current ?? 5,
    1,
  );

  // The API's overview.total can fluctuate between pages (e.g. returns 115 on
  // page 1 but 93 on page 10). Track the highest total ever seen so that
  // lastPage never shrinks mid-assessment — a shrinking lastPage is what
  // causes the "Submit" button to appear prematurely.
  const maxTotalRef = useRef<number>(0);
  if (overview && overview.total > maxTotalRef.current) {
    maxTotalRef.current = overview.total;
  }
  const canonicalTotal = Math.max(maxTotalRef.current, overview?.total ?? 0);

  // last_page is not in the API response — calculate it
  const lastPage = canonicalTotal > 0
    ? Math.ceil(canonicalTotal / perPage)
    : 1;

  // ── Save option mutation ──────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: saveOption,
    onSuccess: (data) => {
      // API returns message: "completed" (string) when the last answer is saved.
      // We intentionally do NOT auto-complete here — the answer is saved on the
      // server, but the user must click the Submit button to finalize.
      // This avoids the jarring experience of the assessment auto-submitting
      // the instant they select the last option.
      if (data?.message === "completed") {
        toast.success("All questions answered — click Submit to finish.");
      }
    },
    onError: (err) => {
      const statusCode = (err as ApiError)?.statusCode;
      // 419 is CSRF mismatch/session expiration on background save.
      // Selection is recorded locally in state and localStorage, so we log a warning
      // rather than interrupting the user with error toasts.
      if (statusCode === 419 || (err instanceof Error && err.message.includes("419"))) {
        console.warn("Background save-option CSRF session refresh notice (419). Answer stored locally.", err);
        return;
      }
      const msg =
        err instanceof Error ? err.message : "Failed to save your answer. Please try again.";
      toast.error(msg);
    },
  });

  // ── Update last answer mutation ───────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: updateLastAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment", "current-page"] });
    },
    onError: (err) => {
      const statusCode = (err as ApiError)?.statusCode;
      if (statusCode === 419 || (err instanceof Error && err.message.includes("419"))) {
        console.warn("Background update notice (419). Local state preserved.", err);
        return;
      }
      const msg = err instanceof Error ? err.message : "Failed to update answer.";
      toast.error(msg);
    },
  });

  // ── Handle option selection ───────────────────────────────────────────────
  const handleSelect = (questionId: number, optionQuestionId: number) => {
    // Update local state (persisted to localStorage automatically via useEffect)
    setLocalSelections((prev) => ({ ...prev, [questionId]: optionQuestionId }));
    // Persist to API silently — no query invalidation so questions stay on screen
    saveMutation.mutate(optionQuestionId);
  };

  // ── Determine which visible questions are (un)answered ────────────────────
  const isQuestionAnswered = (q: Question) =>
    localSelections[q.id] !== undefined ||
    (q.selected_option_id !== undefined && q.selected_option_id !== null);

  const allAnswered = questions.every(isQuestionAnswered);
  const firstUnanswered = questions.find((q) => !isQuestionAnswered(q));

  // ── Handle Next / Submit ──────────────────────────────────────────────────
  // IMPORTANT: whether the assessment is "done" is decided from a FRESH
  // server response, never from local/cumulative counts. Deciding it from
  // overview.answered + Object.keys(localSelections).length >= overview.total
  // (computed before ever asking the server for the next page) was the root
  // cause of the "Submitted with no PDF" bug — that math can be wrong when
  // the server's own total/answered drifts between calls, and it was
  // triggering onComplete() without ever confirming there were really no
  // questions left. Now we always fetch the next page first and only treat
  // it as finished if that fresh fetch genuinely comes back with none.
  const [isAdvancing, setIsAdvancing] = useState(false);

  const handleNext = async () => {
    if (!overview) return;

    // Don't allow moving forward if anything on this page is unanswered —
    // scroll to the first unanswered question and highlight it instead.
    if (!allAnswered) {
      setShowValidation(true);
      if (firstUnanswered) {
        questionRefs.current
          .get(firstUnanswered.id)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      toast.error("Please answer every question on this page before continuing.");
      return;
    }

    setIsAdvancing(true);
    try {
      const result = await refetch();
      const nextQuestions = result.data?.questions ?? [];

      if (nextQuestions.length === 0) {
        // Server-confirmed: nothing left to answer. Safe to submit — but
        // first verify the server's own counters agree. If the API returns
        // zero questions while overview.answered < overview.total, something
        // is wrong on the server side and we should NOT silently submit an
        // incomplete assessment.
        const freshOverview = result.data?.overview;
        if (
          freshOverview &&
          freshOverview.total > 0 &&
          freshOverview.answered < freshOverview.total
        ) {
          toast.error(
            `The server returned no more questions but shows ${freshOverview.answered} of ${freshOverview.total} answered. Please try again.`,
          );
          return;
        }
        try { localStorage.removeItem(cacheKey); } catch { /* ignore */ }
        onComplete();
        return;
      }

      // More questions came back — they're already rendering from pageData.
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsAdvancing(false);
    }
  };

  // ── Handle Back ──────────────────────────────────────────────────────────
  const handleBack = () => {
    if (!overview || overview.current_page <= 1) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    const lastQuestionId = questions[questions.length - 1]?.id;
    const lastOptionId =
      localSelections[lastQuestionId] ??
      questions[questions.length - 1]?.selected_option_id ??
      null;

    if (lastOptionId) {
      updateMutation.mutate(lastOptionId);
    } else {
      // Single refetch() — see note in handleNext about avoiding double calls.
      refetch();
    }
  };

  if (isMaxAttempts) return null;

  // Cooldown screen: the server blocks new attempts for 1 minute after completion.
  // Show a countdown and auto-retry when it expires.
  if (isEmptyResponse) {
    return (
      <section className="mx-auto max-w-2xl text-center">
        <div className="rounded-[2rem] bg-white p-8 shadow-card sm:p-14">
          <div className="relative mx-auto grid h-28 w-28 place-items-center">
            <div className="absolute inset-0 rounded-full bg-lavender/40 blur-2xl" />
            <div className="relative grid h-24 w-24 place-items-center rounded-full bg-lavender text-lavender-deep shadow-soft">
              <Clock className="h-12 w-12" strokeWidth={2} />
            </div>
          </div>

          <h2 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
            Getting Your Next Assessment Ready
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-foreground/70 sm:text-base">
            You just completed an assessment. Please wait a moment before starting a new one.
          </p>

          {cooldownSeconds > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-lavender/30 px-5 py-2.5 text-sm font-semibold text-lavender-deep">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Starting in {cooldownSeconds}s…
            </div>
          )}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={() => refetch()}
              size="lg"
              className="h-12 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
            >
              {cooldownSeconds > 0 ? "Try Now" : "Start Assessment"}
            </Button>
            <V2Link to="/">
              <Button
                size="lg"
                variant="ghost"
                className="h-12 rounded-full px-7 text-sm font-semibold text-foreground/60 hover:bg-lavender/30"
              >
                Return to Dashboard
              </Button>
            </V2Link>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) return <FullPageSpinner label="Loading questions…" />;

  if (isError) {
    const apiErr = error as ApiError;
    return (
      <ErrorBanner
        message={apiErr?.message ?? "Failed to load questions. Please try again."}
        onRetry={() => refetch()}
      />
    );
  }

  if (!overview || questions.length === 0) {
    if (overview && overview.answered >= canonicalTotal && canonicalTotal > 0) {
      onComplete();
      return <FullPageSpinner label="Loading your completed assessment report…" />;
    }
    return <ErrorBanner message="No questions returned from the server." onRetry={() => refetch()} />;
  }

  // Display-only heuristic for the button label ("Next" vs "Submit"). The
  // actual decision to submit is always server-verified in handleNext, so a
  // wrong guess here only mislabels a button for one page, not skips work.
  const isLastPage = overview.current_page >= lastPage;

  // Calculate dynamic answered count so the top header bar and question cards on screen match 100%
  const firstQuestionNumber = (overview.current_page - 1) * perPage + 1;
  const currentAnswersOnThisPage = questions.filter(isQuestionAnswered).length;
  const totalAnswered = Math.min(
    canonicalTotal,
    firstQuestionNumber - 1 + currentAnswersOnThisPage,
  );

  const progressPct = Math.round((totalAnswered / Math.max(canonicalTotal, 1)) * 100);

  return (
    <section className="space-y-6">
      {/* Progress header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/95 p-5 shadow-soft border border-white/80 sm:p-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground/50">
            <V2Link to="/" className="hover:text-foreground/80">
              Self Check In
            </V2Link>
            <span>/</span>
            <span className="text-lavender-deep">HappiLIFE</span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div className="text-xs font-medium text-foreground/60">
              Page {overview.current_page} of {lastPage} &nbsp;·&nbsp;{" "}
              {totalAnswered} of {canonicalTotal} answered
            </div>
            <div className="text-xs font-semibold text-lavender-deep">{progressPct}%</div>
          </div>
          <Progress
            value={progressPct}
            className="mt-2 h-2.5 overflow-hidden rounded-full bg-lavender/40 [&>div]:bg-gradient-brand [&>div]:transition-all [&>div]:duration-500"
          />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-lavender/40 px-4 py-2 text-xs font-semibold text-lavender-deep">
          <Clock className="h-3.5 w-3.5" />
          {Math.max(0, canonicalTotal - totalAnswered)} left
        </div>
      </div>

      {/* Questions */}
      <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-10">
        {questions.map((q, idx) => {
          const currentSelected =
            localSelections[q.id] ?? q.selected_option_id ?? null;
          const questionNumber = firstQuestionNumber + idx;
          const unanswered = showValidation && !isQuestionAnswered(q);
          return (
            <QuestionCard
              key={q.id}
              index={questionNumber}
              question={q.question}
              invalid={unanswered}
              cardRef={(el) => {
                if (el) questionRefs.current.set(q.id, el);
                else questionRefs.current.delete(q.id);
              }}
            >
              <SingleChoiceGroup
                name={`q-${q.id}`}
                options={q.options.map((o) => ({ id: o.id, label: o.option }))}
                selected={currentSelected}
                onSelect={(optionId) => handleSelect(q.id, optionId)}
                saving={false}
              />
            </QuestionCard>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={overview.current_page <= 1 || updateMutation.isPending}
          className="h-11 rounded-full px-5 text-sm font-semibold text-foreground/70 hover:bg-lavender/30 cursor-pointer disabled:opacity-40"
        >
          {updateMutation.isPending ? (
            <LoaderCircle className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <ArrowLeft className="mr-1.5 h-4 w-4" />
          )}
          Back
        </Button>
        <div className="flex flex-col items-end gap-2">
          {showValidation && !allAnswered && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
              <TriangleAlert className="h-3.5 w-3.5" />
              Please answer every question to continue
            </p>
          )}
          <Button
            onClick={handleNext}
            disabled={saveMutation.isPending || isAdvancing}
            size="lg"
            className={cn(
              "h-12 rounded-full px-7 text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50",
              !allAnswered && showValidation ? "bg-rose-500 hover:bg-rose-600" : "bg-gradient-brand",
            )}
          >
            {(saveMutation.isPending || isAdvancing) && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLastPage ? "Submit Self Check In" : "Next"}
          </Button>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Completing screen — calls complete-assessment, then transitions
// ---------------------------------------------------------------------------

function CompletingScreen({ onDone }: { onDone: () => void }) {
  const queryClient = useQueryClient();
  const completeQuery = useQuery({
    queryKey: ["assessment", "complete"],
    queryFn: completeAssessment,
    retry: 1,
    refetchOnWindowFocus: false,
    // staleTime: 0 — MUST re-fire every time CompletingScreen mounts.
    // Previous value was Infinity, which meant on retakes the cached success
    // from attempt 1 was reused without actually calling complete-assessment
    // on the server. The server never marked attempt 2 as completed, so
    // get-all-report only returned 1 attempt.
    staleTime: 0,
  });

  // Transition to report state after success — useEffect avoids calling onDone during render.
  // Also invalidate every cache the dashboard/header/journey pages read completion
  // status from, so "completed" shows up immediately instead of waiting out their
  // staleTime — this is what was making the dashboard keep showing "Start
  // Assessment" for a while right after a successful submission.
  useEffect(() => {
    if (completeQuery.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["assessment", "checkifany"] });
      queryClient.invalidateQueries({ queryKey: ["assessment", "status"] });
      queryClient.invalidateQueries({ queryKey: ["assessment", "current-page"] });
      // view-report is cached with staleTime: Infinity and all-reports needs
      // to pick up the attempt that was just completed — without these, a
      // repeat attempt would keep showing the previous attempt's report.
      // IMPORTANT: removeQueries (not invalidateQueries) for all-reports so
      // that ReportScreen doesn't briefly serve the stale empty array from the
      // initial checking phase. removeQueries wipes the cache entry → ReportScreen
      // sees isLoading: true → shows spinner → fresh fetch returns actual reports.
      queryClient.removeQueries({ queryKey: ["assessment", "all-reports"] });
      queryClient.invalidateQueries({ queryKey: ["assessment", "view-report"] });
      try { localStorage.setItem("happi_assessment_completed_at", String(Date.now())); } catch { /* ignore */ }
      onDone();
    }
  }, [completeQuery.isSuccess, onDone, queryClient]);

  if (completeQuery.isError) {
    const msg =
      completeQuery.error instanceof Error
        ? completeQuery.error.message
        : "Failed to submit assessment. Please try again.";
    return (
      <ErrorBanner
        message={msg}
        onRetry={() => completeQuery.refetch()}
      />
    );
  }

  return <FullPageSpinner label="Submitting your assessment…" />;
}


// ---------------------------------------------------------------------------
// Report Screen
// ---------------------------------------------------------------------------

function ReportScreen({ onRetake }: { onRetake: () => void }) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const { user } = useAuth();

  // ── Subscription check — only subscribed users can download PDFs ─────────
  const [hasActiveBundle, setHasActiveBundle] = useState<boolean | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);

  useEffect(() => {
    if (!user?.token) {
      setHasActiveBundle(false);
      return;
    }
    fetchSubscribedServices(user.token)
      .then((data) => {
        const has = data.packages?.some(
          (p) => p.is_subscribed && p.plans?.some((pl) => pl.is_subscribed),
        ) ?? false;
        setHasActiveBundle(has);
      })
      .catch(() => setHasActiveBundle(false));
  }, [user?.token]);

  // ── Retake cooldown (server requires 1-minute gap between attempts) ──────
  const COOLDOWN_MS = 60_000;
  const completedAt = (() => {
    try {
      const ts = localStorage.getItem("happi_assessment_completed_at");
      return ts ? Number(ts) : 0;
    } catch { return 0; }
  })();

  const [cooldownRemaining, setCooldownRemaining] = useState(() =>
    Math.max(0, Math.ceil((completedAt + COOLDOWN_MS - Date.now()) / 1000)),
  );

  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemaining > 0]);

  const canRetakeNow = cooldownRemaining <= 0;

  // ── get-all-report ────────────────────────────────────────────────────────
  // Always fetched (not gated behind clicking the History tab) — this list is
  // the whole point of "past attempts + download", so it shouldn't depend on
  // the user discovering a second tab to see it.
  const {
    data: historyData,
    isLoading: historyLoading,
    isError: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["assessment", "all-reports"],
    queryFn: getAllReports,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  // Defensive parsing: tolerate a few plausible response shapes for the
  // completed-attempts list in case the real API doesn't exactly match
  // { data: ReportItem[] } (e.g. a nested paginated resource, or a
  // differently-named top-level key).
  const rawHistory = historyData as unknown;
  const reports: ReportItem[] = (() => {
    if (Array.isArray((rawHistory as { data?: unknown })?.data)) {
      return (rawHistory as { data: ReportItem[] }).data;
    }
    const nested = (rawHistory as { data?: { data?: unknown } })?.data?.data;
    if (Array.isArray(nested)) return nested as ReportItem[];
    const reportsKey = (rawHistory as { reports?: unknown })?.reports;
    if (Array.isArray(reportsKey)) return reportsKey as ReportItem[];
    if (Array.isArray(rawHistory)) return rawHistory as ReportItem[];
    return [];
  })();

  // Debug: log the raw API response and parsed reports to help diagnose
  // the "only 1 of 2 attempts shows" issue.
  if (historyData) {
    console.log("[ReportScreen] all-reports raw:", JSON.stringify(historyData, null, 2));
    console.log("[ReportScreen] parsed reports count:", reports.length, reports.map(r => ({ id: r.id, ended_at: r.ended_at })));
  }

  // Figure out which row is the latest attempt by date rather than assuming
  // the API returns them in a particular order, so the highlight is correct
  // either way.
  const latestReport =
    reports.length > 0
      ? reports.reduce((latest, r) => {
          const rTime = new Date(r.ended_at ?? r.created_at).getTime();
          const latestTime = new Date(latest.ended_at ?? latest.created_at).getTime();
          return rTime > latestTime ? r : latest;
        }, reports[0])
      : null;
  const latestReportId = latestReport?.id ?? null;
  // Same field-name fallback chain as the Past Assessments list — this data
  // source is confirmed working, unlike the separate view-report/iframe flow
  // that used to live in "My Report" (it was unreliable and got removed).
  const latestReportUrl = latestReport
    ? latestReport.report_url || latestReport.url || latestReport.pdf_url ||
      latestReport.download_url || latestReport.report || null
    : null;

  // Scroll to the "My Report" section when arriving here via a dashboard
  // "View Report" link (those links append #latest-report to the URL).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#latest-report") return;
    const el = document.getElementById("latest-report");
    if (!el) return;
    // Small delay so layout has settled before measuring scroll position.
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy(0, -100);
    }, 150);
    return () => clearTimeout(t);
  }, []);

  // ── get-report (PDF) ──────────────────────────────────────────────────────
  const handleDownloadPdf = async () => {
    if (!hasActiveBundle) {
      setPurchaseDialogOpen(true);
      return;
    }
    setPdfLoading(true);
    try {
      const resp = await getReport();
      const url = resp.url ?? resp.data?.url;
      if (!url) {
        toast.error("Report not available yet. Please try again in a moment.");
        return;
      }
      const a = document.createElement("a");
      a.href = url;
      a.download = "happilife-report.pdf";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Your report PDF is downloading.");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not download the PDF. Please try again in a moment.";
      toast.error(msg);
    } finally {
      setPdfLoading(false);
    }
  };

  // Download the latest attempt's report — prefer the URL already sitting in
  // the (working) all-reports list, only falling back to a fresh get-report
  // call if that attempt genuinely doesn't have a link yet.
  const handleDownloadLatest = async () => {
    if (latestReportUrl) {
      window.open(latestReportUrl, "_blank", "noopener,noreferrer");
      return;
    }
    await handleDownloadPdf();
  };

  return (
    <section className="space-y-6">
      {/* Success banner */}
      <div className="rounded-[2rem] bg-white p-8 shadow-card sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative mx-auto grid h-28 w-28 place-items-center">
            <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-20 blur-2xl" />
            <div className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-brand shadow-glow">
              <CircleCheck className="h-12 w-12 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h2 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
            Self Check In Complete
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-foreground/70 sm:text-base">
            Thank you for completing your HappiLIFE Self Check In. Your personalized report is
            ready below.
          </p>

          <div className="mx-auto mt-6 max-w-md space-y-2.5 rounded-2xl bg-lavender/25 p-5 text-left">
            {["Assessment Completed", "Responses Saved", "Personalized Report Ready"].map((t) => (
              <div key={t} className="flex items-center gap-3 text-sm font-medium">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-brand text-white shadow-glow">
                  <CircleCheck className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Latest report — one clear, reliable download action. */}
      <div id="latest-report">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <FileText className="h-4 w-4 text-lavender-deep" /> My Report
        </h3>
        <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-10">
          {historyLoading || hasActiveBundle === null ? (
            <FullPageSpinner label="Loading your report…" />
          ) : !hasActiveBundle ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-amber-100">
                <FileText className="h-7 w-7 text-amber-600" />
              </div>
              <div>
                <p className="text-base font-semibold">Subscribe to download your report</p>
                <p className="mt-1 max-w-sm text-sm text-foreground/60">
                  Get the SELF STARTER plan to unlock your personalized PDF report
                  with detailed insights and growth recommendations.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setPurchaseDialogOpen(true)}
                className="h-12 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
              >
                <Sparkles className="mr-2 h-4 w-4" /> Unlock Report — ₹199
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-lavender/30">
                <FileText className="h-7 w-7 text-lavender-deep" />
              </div>
              <div>
                <p className="text-base font-semibold">Your latest report is ready</p>
                {latestReport && (
                  <p className="mt-1 text-sm text-foreground/60">
                    Completed on{" "}
                    {new Date(latestReport.ended_at ?? latestReport.created_at).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "long", year: "numeric" },
                    )}
                  </p>
                )}
              </div>
              <Button
                onClick={handleDownloadLatest}
                disabled={pdfLoading}
                size="lg"
                className="h-12 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50"
              >
                {pdfLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Preparing…
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download Latest Report
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Past attempts — always visible, each with its own download link */}
      <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-10">
        <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
          <History className="h-4 w-4 text-lavender-deep" /> Past Assessments
        </h3>

        {historyLoading && <FullPageSpinner label="Loading history…" />}

        {historyError && (
          <ErrorBanner
            message="Could not load your assessment history."
            onRetry={() => refetchHistory()}
          />
        )}

        {!historyLoading && !historyError && reports.length === 0 && (
          <p className="text-center text-sm text-foreground/50 py-8">
            No completed assessments on record yet.
          </p>
        )}

        {!historyLoading && !historyError && reports.length > 0 && (
          <ul className="space-y-3">
            {reports.map((r, idx) => {
              const dateStr = r.ended_at ?? r.created_at;
              const date = dateStr ? new Date(dateStr).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }) : "—";
              // The live API's exact field name for the per-attempt report
              // link isn't confirmed yet, so try the plausible alternatives
              // rather than assuming report_url is the only one that's set.
              const downloadUrl =
                r.report_url || r.url || r.pdf_url || r.download_url || r.report || null;
              const isLatest = r.id === latestReportId;
              return (
                <li
                  key={r.id}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-all",
                    isLatest
                      ? "border-lavender-deep/60 bg-gradient-to-r from-lavender/30 to-lavender/10 shadow-soft"
                      : "border-lavender/40 bg-lavender/10",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white shadow-glow">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        Assessment #{reports.length - idx}
                        {isLatest && (
                          <span className="inline-flex items-center rounded-full bg-lavender-deep px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Latest
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-foreground/55">Completed on {date}</p>
                    </div>
                  </div>
                  {downloadUrl ? (
                    hasActiveBundle ? (
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition",
                          isLatest
                            ? "bg-gradient-brand text-white shadow-glow hover:opacity-95"
                            : "bg-lavender/40 text-lavender-deep hover:bg-lavender/60",
                        )}
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    ) : (
                      <button
                        onClick={() => setPurchaseDialogOpen(true)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-amber-50 px-4 text-xs font-medium text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
                      >
                        Subscribe to unlock
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => setPurchaseDialogOpen(true)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-amber-50 px-4 text-xs font-medium text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
                    >
                      Subscribe to unlock
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-6 text-center text-xs text-foreground/40">
          You can take the HappiLIFE Self Check In up to 6 times total.
        </p>
      </div>

      {/* Retake */}
      {reports.length < 6 && (
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={onRetake}
            disabled={!canRetakeNow}
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-lavender-deep/30 bg-white px-7 text-sm font-semibold text-lavender-deep hover:bg-lavender/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ClipboardCheck className="mr-2 h-4 w-4" />
            {canRetakeNow
              ? "Take Another Assessment"
              : `Available in ${cooldownRemaining}s`}
          </Button>
          {!canRetakeNow && (
            <p className="text-xs text-foreground/50">
              You can start a new assessment 1 minute after completing one.
            </p>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <V2Link to="/">
          <Button
            size="lg"
            className="h-12 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
          >
            Return to Dashboard
          </Button>
        </V2Link>
        <V2Link to="/resources">
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-lavender-deep/30 bg-white px-7 text-sm font-semibold text-lavender-deep hover:bg-lavender/30"
          >
            Explore Resources
          </Button>
        </V2Link>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-foreground/50">
        <ClipboardCheck className="h-3.5 w-3.5" />
        HappiLIFE Self Check In • Completed
      </div>

      <CouponPurchaseDialog
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        planId={1}
        planName="SELF STARTER"
        planPrice={199}
        onSuccess={() => setHasActiveBundle(true)}
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Max Attempts Screen
// ---------------------------------------------------------------------------

function MaxAttemptsScreen() {
  return (
    <section className="mx-auto max-w-2xl text-center">
      <div className="rounded-[2rem] bg-white p-8 shadow-card sm:p-14">
        <div className="relative mx-auto grid h-28 w-28 place-items-center">
          <div className="absolute inset-0 rounded-full bg-lavender/40 blur-2xl" />
          <div className="relative grid h-24 w-24 place-items-center rounded-full bg-lavender text-lavender-deep shadow-soft">
            <ClipboardCheck className="h-12 w-12" strokeWidth={2} />
          </div>
        </div>

        <h2 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
          Maximum Attempts Reached
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-foreground/70 sm:text-base">
          You have completed the HappiLIFE Self Check In the maximum of 6 times. Your past reports
          remain available for review.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <V2Link to="/">
            <Button
              size="lg"
              className="h-12 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
            >
              Return to Dashboard
            </Button>
          </V2Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Reusable question UI components (unchanged from original)
// ---------------------------------------------------------------------------

function QuestionCard({
  index,
  question,
  optional,
  invalid,
  cardRef,
  children,
}: {
  index: number;
  question: string;
  optional?: boolean;
  /** Highlighted as unanswered after a blocked "Next" attempt */
  invalid?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
  children: ReactNode;
}) {
  return (
    <div
      ref={cardRef}
      className={cn(
        "border-b border-lavender/60 pb-8 last:border-none last:pb-0 [&+&]:pt-8",
        invalid && "rounded-2xl border border-rose-300 bg-rose-50/60 px-4 pt-4 -mx-4 sm:-mx-0",
      )}
    >
      <div className="flex items-baseline gap-3">
        <span className={cn("text-sm font-bold", invalid ? "text-rose-600" : "text-lavender-deep")}>
          Q{index}.
        </span>
        <h3 className="text-lg font-semibold leading-snug sm:text-xl">
          {question}
          {optional && (
            <span className="ml-2 text-xs font-medium text-foreground/50">(Optional)</span>
          )}
        </h3>
      </div>
      {invalid && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-600">
          <TriangleAlert className="h-3.5 w-3.5" />
          Please select an answer for this question
        </p>
      )}
      <div className="mt-5">{children}</div>
    </div>
  );
}

/**
 * SingleChoiceGroup — now driven by real option IDs instead of strings.
 * Calls onSelect(optionQuestionId) immediately when the user picks an answer.
 */
function SingleChoiceGroup({
  name,
  options,
  selected,
  onSelect,
  saving,
}: {
  name: string;
  options: { id: number; label: string }[];
  selected: number | null;
  onSelect: (id: number) => void;
  saving?: boolean;
}) {
  return (
    <div className="grid gap-2.5">
      {options.map((opt) => {
        const active = selected === opt.id;
        return (
          <label
            key={opt.id}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-medium transition-all",
              active
                ? "border-lavender-deep bg-lavender/40 text-foreground shadow-soft"
                : "border-lavender/70 bg-white text-foreground/80 hover:border-lavender-deep/50 hover:bg-lavender/20",
              saving && "pointer-events-none opacity-70",
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.id}
              checked={active}
              onChange={() => onSelect(opt.id)}
              className="sr-only"
            />
            <span
              className={cn(
                "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition",
                active ? "border-lavender-deep bg-lavender-deep" : "border-lavender-deep/40",
              )}
            >
              {active && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
            {saving && active ? (
              <span className="flex items-center gap-1.5">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-lavender-deep" />
                {opt.label}
              </span>
            ) : (
              opt.label
            )}
          </label>
        );
      })}
    </div>
  );
}
