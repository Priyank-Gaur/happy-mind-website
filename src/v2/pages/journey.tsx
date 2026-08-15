import { V2Link } from "@/v2/lib/router";
import { useMemo, useState } from "react";
import { Search, Play, BookOpen, ClipboardCheck, Headphones, Bookmark, Calendar, Download, Sparkles, MessageCircle, Users, Heart, Trophy, Clock, CircleCheck, CircleDot, Activity as ActivityIcon, FileText, Video, Lightbulb } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { Button } from "@/v2/components/ui/button";
import { Input } from "@/v2/components/ui/input";
import { useAssessmentPhase } from "@/v2/lib/assessment";

export default JourneyPage;
type FilterKey = "all" | "services" | "resources" | "assessments" | "sessions" | "purchases";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "services", label: "Services" },
  { key: "resources", label: "Resources" },
  { key: "assessments", label: "Self Check Ins" },
  { key: "sessions", label: "Sessions" },
  { key: "purchases", label: "Purchases" },
];

import { useProtectedRoute } from "@/v2/lib/auth-guard";

function JourneyPage() {
  useProtectedRoute("Please log in to view your journey.");
  const matches = () => true;

  return (
    <DashboardShell
      header={
        <TopHeaderBar
          title="My Journey"
          emoji=""
          subtitle="Track your activities, revisit important moments, and continue building your HappiMynd experience."
        />
      }
    >
      <JourneyHero />

      <ContinueCard visible={true} />

      <ActiveServices matches={matches} />

      <AssessmentHistory matches={matches} />

      <SavedResources matches={matches} />

      <SessionsBookings matches={matches} />

      <PurchaseHistory matches={matches} />
    </DashboardShell>
  );
}

/* ------------------------------- Hero ------------------------------- */

const summary = [
  {
    label: "Journey Since",
    value: "Mar 12, 2025",
    icon: Calendar,
    gradient: "bg-gradient-lavender",
  },
  { label: "Resources Explored", value: "24", icon: BookOpen, gradient: "bg-gradient-aqua" },
  { label: "Active Services", value: "3", icon: Sparkles, gradient: "bg-gradient-peach" },
  {
    label: "Self Check In",
    value: "In Progress",
    icon: ClipboardCheck,
    gradient: "bg-gradient-mint",
  },
];

function JourneyHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-hero p-8 shadow-card md:p-10">
      <div className="absolute -top-10 right-16 h-32 w-32 rounded-full bg-white/40 blur-2xl" />
      <div className="absolute bottom-0 left-1/2 h-40 w-40 rounded-full bg-lavender/50 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-lavender-deep">
            <ActivityIcon className="h-3.5 w-3.5" /> A personal timeline of growth
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Every small step, gathered in one calm place.
          </h2>
          <p className="mt-3 max-w-xl text-base text-foreground/70">
            Revisit what you've explored, resume what matters, and see your journey unfold - gently,
            at your own pace.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {summary.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-2xl bg-white/95 p-4 shadow-soft border border-white/80"
              >
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.gradient}`}>
                  <Icon className="h-5 w-5 text-foreground/80" strokeWidth={2} />
                </div>
                <p className="mt-3 text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className="mt-0.5 text-lg font-bold tracking-tight">{s.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Filters --------------------------- */

function FilterBar({ filter, onFilter }: { filter: FilterKey; onFilter: (k: FilterKey) => void }) {
  return (
    <section className="flex flex-wrap items-center gap-2 rounded-3xl bg-white/90 p-4 shadow-soft border border-white/60">
      {filters.map((f) => {
        const active = filter === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onFilter(f.key)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
              active
                ? "bg-gradient-brand text-white shadow-glow"
                : "bg-white text-foreground/70 shadow-soft hover:bg-lavender/30 hover:text-lavender-deep"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </section>
  );
}

/* ------------------------ Continue Where You Left ------------------------ */

function ContinueCard({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <section>
      <SectionHeader
        title="Continue Where You Left Off"
        subtitle="Pick up right where you paused - no pressure."
      />
      <article className="relative mt-5 overflow-hidden rounded-3xl bg-gradient-lavender p-6 shadow-soft md:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-lavender-deep">
              <BookOpen className="h-3.5 w-3.5" /> HappiLEARN · Module 3
            </span>
            <h4 className="mt-3 text-xl font-bold sm:text-2xl">
              Understanding Your Emotional Triggers
            </h4>
            <p className="mt-2 max-w-xl text-sm text-foreground/70">
              You paused at Lesson 2 of 5 - a short 6-minute reflection is waiting for you.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> 6 min left
              </span>
              <span className="inline-flex items-center gap-1">
                <CircleDot className="h-3.5 w-3.5 text-lavender-deep" /> 40% complete
              </span>
            </div>
          </div>
          <Button
            size="lg"
            className="h-12 shrink-0 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow hover:opacity-95"
          >
            Continue
          </Button>
        </div>
      </article>
    </section>
  );
}

/* ----------------------------- Active Services ----------------------------- */

type StatusKey = "Active" | "Completed" | "Upcoming" | "Expired";

const statusStyles: Record<StatusKey, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Completed: "bg-lavender/50 text-lavender-deep",
  Upcoming: "bg-aqua/50 text-sky-800",
  Expired: "bg-rose-100 text-rose-700",
};

const activeServices: {
  name: string;
  status: StatusKey;
  note: string;
  action: string;
  icon: typeof Sparkles;
  gradient: string;
}[] = [
  {
    name: "HappiLIFE",
    status: "Completed",
    note: "Self Check In insights ready",
    action: "View Insights",
    icon: ClipboardCheck,
    gradient: "bg-gradient-lavender",
  },
  {
    name: "HappiBUDDY",
    status: "Active",
    note: "Ongoing conversation with your buddy",
    action: "Continue Chat",
    icon: MessageCircle,
    gradient: "bg-gradient-aqua",
  },
  {
    name: "SOLV",
    status: "Upcoming",
    note: "Session on Jul 14 · 5:30 PM",
    action: "Join Session",
    icon: Users,
    gradient: "bg-gradient-peach",
  },
  {
    name: "HappiSELF",
    status: "Active",
    note: "Practice in progress · Day 4 of 7",
    action: "Resume",
    icon: Heart,
    gradient: "bg-gradient-mint",
  },
];

function ActiveServices({ matches }: { matches: (s: string) => boolean }) {
  const { phase: assessmentPhase } = useAssessmentPhase();

  const dynamicActiveServices = useMemo(() => {
    const list = [...activeServices];
    const happiLifeIndex = list.findIndex((s) => s.name === "HappiLIFE");
    if (happiLifeIndex !== -1) {
      if (assessmentPhase === "not-started") {
        list[happiLifeIndex] = {
          ...list[happiLifeIndex],
          status: "Upcoming",
          note: "Self Check In not started yet",
          action: "Start Assessment",
        };
      } else if (assessmentPhase === "in-progress") {
        list[happiLifeIndex] = {
          ...list[happiLifeIndex],
          status: "Active",
          note: "Self Check In in progress",
          action: "Continue Assessment",
        };
      } else {
        list[happiLifeIndex] = {
          ...list[happiLifeIndex],
          status: "Completed",
          note: "Self Check In insights ready",
          action: "View Insights",
        };
      }
    }
    return list;
  }, [assessmentPhase]);

  const items = dynamicActiveServices.filter((s) => matches(s.name + " " + s.note));

  return (
    <section>
      <SectionHeader title="Active Services" subtitle="Everything you're currently engaged with." />
      {items.length === 0 ? (
        <EmptyState
          text="No active services yet. Explore what could support you today."
          ctaText="Browse Services"
          to="/services"
        />
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.name}
                className="group rounded-3xl bg-white/95 p-5 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${s.gradient} shadow-soft`}
                  >
                    <Icon className="h-5 w-5 text-foreground/80" strokeWidth={2} />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[s.status]}`}
                  >
                    {s.status}
                  </span>
                </div>
                <h4 className="mt-4 text-base font-bold tracking-tight">{s.name}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.note}</p>
                <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lavender-deep transition group-hover:gap-2">
                  {s.action}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ---------------------------- Recent Timeline ---------------------------- */

type TimelineEvent = {
  title: string;
  meta: string;
  icon: typeof BookOpen;
  tint: string;
};

const timeline: { group: string; items: TimelineEvent[] }[] = [
  {
    group: "Today",
    items: [
      {
        title: "Read: Why You Keep Repeating the Same Relationship Pattern",
        meta: "Article · 8 min read",
        icon: BookOpen,
        tint: "bg-gradient-lavender",
      },
      {
        title: "Started a Guided Audio: Morning Reset",
        meta: "Audio · 10 min",
        icon: Headphones,
        tint: "bg-gradient-aqua",
      },
    ],
  },
  {
    group: "Yesterday",
    items: [
      {
        title: "Saved: The Quiet Cost of Ignoring Small Emotions",
        meta: "Bookmarked to Saved Resources",
        icon: Bookmark,
        tint: "bg-gradient-peach",
      },
      {
        title: "Booked a SOLV Session",
        meta: "Scheduled for Jul 14, 5:30 PM",
        icon: Calendar,
        tint: "bg-gradient-mint",
      },
    ],
  },
  {
    group: "Last Week",
    items: [
      {
        title: "Completed HappiLIFE Self Check In",
        meta: "Report available",
        icon: ClipboardCheck,
        tint: "bg-gradient-lavender",
      },
      {
        title: "Watched: Perspective Studio - Life Transitions",
        meta: "Video · 12 min",
        icon: Video,
        tint: "bg-gradient-aqua",
      },
    ],
  },
];

function RecentTimeline({ matches }: { matches: (s: string) => boolean }) {
  const filtered = useMemo(
    () =>
      timeline
        .map((g) => ({
          ...g,
          items: g.items.filter((i) => matches(i.title + " " + i.meta)),
        }))
        .filter((g) => g.items.length > 0),
    [matches],
  );
  return (
    <section>
      <SectionHeader
        title="Recent Activity"
        subtitle="A gentle log of what you've been engaging with."
      />
      {filtered.length === 0 ? (
        <EmptyState
          text="Your journey starts here. Complete your first Self Check In or explore a resource to begin building your timeline."
          ctaText="Explore Resources"
          to="/resources"
        />
      ) : (
        <div className="mt-5 rounded-3xl bg-white/90 p-6 shadow-soft border border-white/60 md:p-8">
          <ol className="relative space-y-8">
            {filtered.map((g) => (
              <li key={g.group}>
                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-lavender-deep">
                  {g.group}
                </p>
                <ul className="relative space-y-4 pl-6 before:absolute before:left-[11px] before:top-1 before:h-full before:w-px before:bg-lavender/60">
                  {g.items.map((it) => {
                    const Icon = it.icon;
                    return (
                      <li key={it.title} className="relative">
                        <span
                          className={`absolute -left-6 top-1 grid h-6 w-6 place-items-center rounded-full ${it.tint} shadow-soft ring-4 ring-white`}
                        >
                          <Icon className="h-3 w-3 text-foreground/80" strokeWidth={2.4} />
                        </span>
                        <div className="rounded-2xl bg-white/70 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-soft">
                          <p className="text-sm font-semibold leading-snug">{it.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{it.meta}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

/* --------------------------- Assessment History --------------------------- */

function AssessmentHistory({ matches }: { matches: (s: string) => boolean }) {
  if (
    !matches("happilife assessment") &&
    !matches("happilife self check in") &&
    !matches("self check in")
  )
    return null;
  return (
    <section>
      <SectionHeader title="Self Check In History" subtitle="Your check-ins over time." />
      <article className="mt-5 grid gap-6 rounded-3xl bg-white/95 p-6 shadow-soft border border-white/80 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lavender/50 px-3 py-1 text-xs font-bold text-lavender-deep">
              <ClipboardCheck className="h-3.5 w-3.5" /> HappiLIFE
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              <CircleCheck className="h-3 w-3" /> Completed
            </span>
          </div>
          <h4 className="mt-3 text-lg font-bold tracking-tight sm:text-xl">
            Emotional Wellbeing Baseline
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Completed on <span className="font-semibold text-foreground">Jul 02, 2026</span> · Your
            personalized report is ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="h-11 rounded-full bg-gradient-brand px-6 text-sm font-semibold text-white shadow-glow hover:opacity-95">
            View Report
          </Button>
          <Button
            variant="ghost"
            disabled
            className="h-11 rounded-full bg-white/70 px-6 text-sm font-semibold text-muted-foreground"
          >
            Retake · Coming Soon
          </Button>
        </div>
      </article>
    </section>
  );
}

/* ----------------------------- Saved Resources ----------------------------- */

const saved = [
  {
    type: "Article",
    title: "The Quiet Cost of Ignoring Small Emotions",
    meta: "6 min read",
    icon: FileText,
    gradient: "bg-gradient-lavender",
  },
  {
    type: "Guided Audio",
    title: "Grounding Breath · Evening Reset",
    meta: "8 min audio",
    icon: Headphones,
    gradient: "bg-gradient-aqua",
  },
  {
    type: "Perspective Studio",
    title: "Reframing Life Transitions",
    meta: "Video · 12 min",
    icon: Video,
    gradient: "bg-gradient-peach",
  },
  {
    type: "Quick Insight",
    title: "Small habits, compounded, become identity.",
    meta: "1 min read",
    icon: Lightbulb,
    gradient: "bg-gradient-mint",
  },
];

function SavedResources({ matches }: { matches: (s: string) => boolean }) {
  const items = saved.filter((s) => matches(s.title + " " + s.type));
  return (
    <section>
      <SectionHeader
        title="Saved Resources"
        subtitle="Everything you've bookmarked to revisit."
        action="Browse all"
      />
      {items.length === 0 ? (
        <EmptyState
          text="No resources saved yet. Explore articles, sessions, or insights."
          ctaText="Explore Resources"
          to="/resources"
        />
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((r) => {
            const Icon = r.icon;
            return (
              <article
                key={r.title}
                className="group overflow-hidden rounded-3xl bg-white/95 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <div className={`relative h-28 ${r.gradient}`}>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80">
                      <Icon className="h-5 w-5 text-lavender-deep" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-lavender-deep">
                    {r.type}
                  </span>
                  <h4 className="mt-1.5 text-sm font-semibold leading-snug">{r.title}</h4>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{r.meta}</span>
                    <button className="font-semibold text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      Open
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ---------------------------- Sessions & Bookings ---------------------------- */

const sessions: {
  service: string;
  date: string;
  status: StatusKey;
  action: string;
}[] = [
  {
    service: "SOLV - 1:1 Coaching",
    date: "Jul 14, 2026 · 5:30 PM",
    status: "Upcoming",
    action: "Join Session",
  },
  {
    service: "HappiTALK - Group Circle",
    date: "Jul 22, 2026 · 7:00 PM",
    status: "Upcoming",
    action: "View Details",
  },
  {
    service: "SOLV - Discovery Call",
    date: "Jun 28, 2026 · 6:00 PM",
    status: "Completed",
    action: "Book Again",
  },
  {
    service: "HappiBUDDY - Kickoff",
    date: "May 10, 2026 · 4:00 PM",
    status: "Completed",
    action: "Book Again",
  },
];

function SessionsBookings({ matches }: { matches: (s: string) => boolean }) {
  const items = sessions.filter((s) => matches(s.service));
  return (
    <section>
      <SectionHeader
        title="Sessions & Bookings"
        subtitle="Upcoming and past sessions in one place."
      />
      {items.length === 0 ? (
        <EmptyState
          text="No sessions yet. Book a session to start your one-on-one journey."
          ctaText="View Services"
          to="/services"
        />
      ) : (
        <div className="mt-5 overflow-hidden rounded-3xl bg-white/95 shadow-soft border border-white/80">
          <ul className="divide-y divide-lavender/30">
            {items.map((s) => (
              <li
                key={s.service + s.date}
                className="grid grid-cols-1 gap-3 p-5 transition hover:bg-lavender/10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto] md:items-center md:gap-6"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{s.service}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground md:hidden">{s.date}</p>
                </div>
                <p className="hidden text-sm text-muted-foreground md:block">{s.date}</p>
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[s.status]}`}
                >
                  {s.status}
                </span>
                <button className="justify-self-start rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-white shadow-glow transition hover:opacity-95 md:justify-self-end">
                  {s.action}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/* ------------------------------ Purchase History ------------------------------ */

const purchases: {
  service: string;
  date: string;
  amount: string;
  status: StatusKey;
}[] = [
  { service: "SOLV - 4 Session Pack", date: "Jun 15, 2026", amount: "₹6,400", status: "Active" },
  { service: "HappiSELF - Annual", date: "Mar 12, 2026", amount: "₹2,999", status: "Active" },
  {
    service: "HappiLEARN - Course Bundle",
    date: "Jan 08, 2026",
    amount: "₹1,499",
    status: "Completed",
  },
  { service: "HappiTALK - Group Series", date: "Dec 01, 2025", amount: "₹899", status: "Expired" },
];

function PurchaseHistory({ matches }: { matches: (s: string) => boolean }) {
  const items = purchases.filter((p) => matches(p.service));
  return (
    <section>
      <SectionHeader
        title="Purchase History"
        subtitle="A record of everything you've invested in yourself."
      />
      {items.length === 0 ? (
        <EmptyState
          text="No purchases yet. Explore services designed to support you."
          ctaText="View Services"
          to="/services"
        />
      ) : (
        <div className="mt-5 overflow-hidden rounded-3xl bg-white/95 shadow-soft border border-white/80">
          <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.6fr)_auto_auto] gap-6 border-b border-lavender/30 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground md:grid">
            <span>Service</span>
            <span>Purchase Date</span>
            <span>Amount</span>
            <span>Status</span>
            <span className="justify-self-end">Invoice</span>
          </div>
          <ul className="divide-y divide-lavender/30">
            {items.map((p) => (
              <li
                key={p.service + p.date}
                className="grid grid-cols-1 gap-2 p-5 transition hover:bg-lavender/10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.6fr)_auto_auto] md:items-center md:gap-6 md:py-4"
              >
                <p className="text-sm font-semibold">{p.service}</p>
                <p className="text-xs text-muted-foreground">{p.date}</p>
                <p className="text-sm font-semibold">{p.amount}</p>
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[p.status]}`}
                >
                  {p.status}
                </span>
                <button
                  className="inline-flex items-center gap-1.5 justify-self-start rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-lavender-deep shadow-soft transition hover:bg-lavender/20 md:justify-self-end"
                  aria-label={`Download invoice for ${p.service}`}
                >
                  <Download className="h-3.5 w-3.5" /> Invoice
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/* ------------------------------- Achievements ------------------------------- */

const achievements = [
  {
    title: "First Self Check In",
    desc: "Complete your HappiLIFE check-in.",
    gradient: "bg-gradient-lavender",
  },
  { title: "7-Day Streak", desc: "Show up for yourself all week.", gradient: "bg-gradient-aqua" },
  {
    title: "Mindful Explorer",
    desc: "Read 10 articles across topics.",
    gradient: "bg-gradient-peach",
  },
  {
    title: "Reflection Ritual",
    desc: "Complete 5 Guided Audio sessions.",
    gradient: "bg-gradient-mint",
  },
];

function Achievements() {
  return (
    <section>
      <SectionHeader
        title="Achievements"
        subtitle="Milestones you'll unlock as your journey grows."
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {achievements.map((a) => (
          <article
            key={a.title}
            className={`relative overflow-hidden rounded-3xl ${a.gradient} p-6 shadow-soft`}
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/40 blur-2xl" />
            <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white/70 shadow-soft">
              <Trophy className="h-5 w-5 text-lavender-deep" strokeWidth={2} />
            </div>
            <h4 className="relative mt-4 text-base font-bold tracking-tight">{a.title}</h4>
            <p className="relative mt-1 text-sm text-foreground/70">{a.desc}</p>
            <span className="relative mt-4 inline-block rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-lavender-deep">
              Coming Soon
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- Shared --------------------------------- */

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && (
        <button className="hidden shrink-0 text-sm font-semibold text-lavender-deep hover:underline sm:inline-flex sm:items-center sm:gap-1">
          {action}
        </button>
      )}
    </div>
  );
}

function EmptyState({ text, ctaText, to }: { text: string; ctaText: string; to: string }) {
  return (
    <div className="mt-5 rounded-3xl bg-white/90 p-8 text-center shadow-soft border border-white/60">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-lavender shadow-soft">
        <Sparkles className="h-5 w-5 text-lavender-deep" />
      </div>
      <p className="mx-auto mt-4 max-w-md text-sm text-foreground/70">{text}</p>
      <V2Link
        to={to}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
      >
        {ctaText}
      </V2Link>
    </div>
  );
}

/* Play icon is unused import guard — remove if TS complains */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _Play = Play;
