import { V2Link, useV2Navigate } from "@/v2/lib/router";
import { useState, useEffect, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CircleCheck, ClipboardCheck, Clock, Download, ExternalLink, FileText, History, Info, LoaderCircle, Sparkles, TriangleAlert, X } from "lucide-react";
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
  viewReport,
  getReport,
  getAllReports,
  useAssessmentPhase,
} from "@/v2/lib/assessment";
import type { Question, ReportItem, ApiError } from "@/v2/lib/assessment";

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

  // ── checkifany on mount ──────────────────────────────────────────────────
  const checkQuery = useQuery({
    queryKey: ["assessment", "checkifany"],
    queryFn: checkIfAny,
    enabled: appState === "checking",
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: 1,
  });

  // Transition once data arrives — useEffect avoids setting state during render
  useEffect(() => {
    if (appState !== "checking") return;
    if (checkQuery.isSuccess) {
      setHasCompletedBefore(checkQuery.data?.data === "Yes");
      setAppState("intro");
    } else if (checkQuery.isError) {
      setAppState("error");
    }
  }, [appState, checkQuery.isSuccess, checkQuery.isError, checkQuery.data]);

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

      {appState === "report" && <ReportScreen />}

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
        h1: "Complete Your HappiLIFE Self Check In",
        body: "Understand your emotional wellbeing through a guided Self Check In designed to help you gain personalized insights.",
        primaryCta: "Continue Assessment",
      };
    }
    return {
      h1: "Start Your HappiLIFE Self-Check-In",
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
            <>
              <Button
                size="lg"
                variant="outline"
                onClick={onStart}
                className="h-12 rounded-full border-lavender-deep/30 bg-white px-6 text-sm font-semibold text-lavender-deep hover:bg-lavender/30"
              >
                Retake Assessment
              </Button>

              <Button
                size="lg"
                onClick={onViewReport}
                className="h-12 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
              >
                <FileText className="mr-2 h-4 w-4" />
                View My Report
              </Button>
            </>
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

  // Handle max-attempts from query result
  if (pageData?.max_attempts_reached) {
    onMaxAttempts();
    return null;
  }

  // Sort by question ID for a deterministic, consistent page order across sessions
  const questions: Question[] = (pageData?.questions ?? []).slice().sort((a, b) => a.id - b.id);
  const overview = pageData?.overview;
  // last_page is not in the API response — calculate it
  const lastPage = overview
    ? Math.ceil(overview.total / Math.max(overview.perPage, 1))
    : 1;

  // ── Save option mutation ──────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: saveOption,
    onError: (err) => {
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

  // ── Determine if all visible questions are answered ───────────────────────
  const allAnswered = questions.every(
    (q) =>
      localSelections[q.id] !== undefined ||
      (q.selected_option_id !== undefined && q.selected_option_id !== null),
  );

  // ── Handle Next / Submit ──────────────────────────────────────────────────
  const handleNext = () => {
    if (!overview) return;

    if (
      overview.answered + Object.keys(localSelections).length >= overview.total ||
      overview.current_page >= lastPage
    ) {
      // Last page — clear persisted selections and complete
      try { localStorage.removeItem(cacheKey); } catch { /* ignore */ }
      onComplete();
      return;
    }

    // Fetch the next page (keep selections in localStorage — they carry over)
    queryClient.invalidateQueries({ queryKey: ["assessment", "current-page"] });
    refetch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Handle Back ──────────────────────────────────────────────────────────
  const handleBack = () => {
    if (!overview || overview.current_page <= 1) return;
    const lastQuestionId = questions[questions.length - 1]?.id;
    const lastOptionId =
      localSelections[lastQuestionId] ??
      questions[questions.length - 1]?.selected_option_id ??
      null;

    if (lastOptionId) {
      updateMutation.mutate(lastOptionId);
    } else {
      queryClient.invalidateQueries({ queryKey: ["assessment", "current-page"] });
      refetch();
    }
  };

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
    return <ErrorBanner message="No questions returned from the server." onRetry={() => refetch()} />;
  }

  const isLastPage =
    overview.current_page >= lastPage ||
    overview.answered + questions.length >= overview.total;

  const progressPct = Math.round((overview.answered / Math.max(overview.total, 1)) * 100);

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
              {overview.answered} of {overview.total} answered
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
          {overview.total - overview.answered} left
        </div>
      </div>

      {/* Questions */}
      <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-10">
        {questions.map((q, idx) => {
          const currentSelected =
            localSelections[q.id] ?? q.selected_option_id ?? null;
          const questionNumber = (overview.current_page - 1) * overview.perPage + idx + 1;
          return (
            <QuestionCard
              key={q.id}
              index={questionNumber}
              question={q.question}
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
        <Button
          onClick={handleNext}
          disabled={!allAnswered || saveMutation.isPending}
          size="lg"
          className="h-12 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50"
        >
          {saveMutation.isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isLastPage ? "Submit Self Check In" : "Next"}
        </Button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Completing screen — calls complete-assessment, then transitions
// ---------------------------------------------------------------------------

function CompletingScreen({ onDone }: { onDone: () => void }) {
  const completeQuery = useQuery({
    queryKey: ["assessment", "complete"],
    queryFn: completeAssessment,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // Transition to report state after success — useEffect avoids calling onDone during render
  useEffect(() => {
    if (completeQuery.isSuccess) {
      onDone();
    }
  }, [completeQuery.isSuccess, onDone]);

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

type ReportTab = "report" | "history";

function ReportScreen() {
  const [activeTab, setActiveTab] = useState<ReportTab>("report");
  const [pdfLoading, setPdfLoading] = useState(false);

  // ── view-report ───────────────────────────────────────────────────────────
  const {
    data: viewData,
    isLoading: viewLoading,
    isError: viewError,
    error: viewErr,
    refetch: refetchView,
  } = useQuery({
    queryKey: ["assessment", "view-report"],
    queryFn: viewReport,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const webReportUrl =
    viewData?.url ?? viewData?.data?.url ?? null;

  // ── get-all-report ────────────────────────────────────────────────────────
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
    enabled: activeTab === "history",
  });

  const reports: ReportItem[] = historyData?.data ?? [];

  // ── get-report (PDF) ──────────────────────────────────────────────────────
  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const resp = await getReport();
      const url = resp.url ?? resp.data?.url;
      if (!url) throw new Error("No download URL returned.");
      // Trigger download
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

      {/* Tab navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("report")}
          className={cn(
            "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all",
            activeTab === "report"
              ? "bg-gradient-brand text-white shadow-glow"
              : "bg-white text-foreground/70 hover:bg-lavender/20",
          )}
        >
          <FileText className="h-4 w-4" /> My Report
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all",
            activeTab === "history"
              ? "bg-gradient-brand text-white shadow-glow"
              : "bg-white text-foreground/70 hover:bg-lavender/20",
          )}
        >
          <History className="h-4 w-4" /> History
        </button>
      </div>

      {/* Report tab */}
      {activeTab === "report" && (
        <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-10">
          {viewLoading && <FullPageSpinner label="Loading your report…" />}

          {viewError && (
            <ErrorBanner
              message={
                (viewErr instanceof Error ? viewErr.message : null) ??
                "Could not load your report. Please try again."
              }
              onRetry={() => refetchView()}
            />
          )}

          {!viewLoading && !viewError && (
            <div className="space-y-6">
              {webReportUrl ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <a
                      href={webReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Full Report
                    </a>
                    <Button
                      onClick={handleDownloadPdf}
                      disabled={pdfLoading}
                      variant="outline"
                      size="lg"
                      className="h-12 rounded-full border-lavender-deep/30 bg-white px-7 text-sm font-semibold text-lavender-deep hover:bg-lavender/30 disabled:opacity-50"
                    >
                      {pdfLoading ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          Generating PDF…
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Inline preview iframe */}
                  <div className="overflow-hidden rounded-2xl border border-lavender/40 bg-lavender/10">
                    <iframe
                      src={webReportUrl}
                      title="HappiLIFE Report"
                      className="h-[600px] w-full border-0"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <FileText className="h-12 w-12 text-lavender-deep/40" />
                  <p className="text-sm text-foreground/60">
                    Your report URL isn't available yet. Please try downloading the PDF directly.
                  </p>
                  <Button
                    onClick={handleDownloadPdf}
                    disabled={pdfLoading}
                    className="h-12 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow"
                  >
                    {pdfLoading ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Generating PDF…
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" /> Download PDF Report
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* History tab */}
      {activeTab === "history" && (
        <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-10">
          <h3 className="mb-6 text-lg font-bold">Past Assessments</h3>

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
                return (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-lavender/40 bg-lavender/10 px-5 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white shadow-glow">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Assessment #{reports.length - idx}</p>
                        <p className="text-xs text-foreground/55">Completed on {date}</p>
                      </div>
                    </div>
                    {r.report_url && (
                      <a
                        href={r.report_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-lavender/40 px-4 text-xs font-semibold text-lavender-deep hover:bg-lavender/60 transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View
                      </a>
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
  children,
}: {
  index: number;
  question: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-lavender/60 pb-8 last:border-none last:pb-0 [&+&]:pt-8">
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-bold text-lavender-deep">Q{index}.</span>
        <h3 className="text-lg font-semibold leading-snug sm:text-xl">
          {question}
          {optional && (
            <span className="ml-2 text-xs font-medium text-foreground/50">(Optional)</span>
          )}
        </h3>
      </div>
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
