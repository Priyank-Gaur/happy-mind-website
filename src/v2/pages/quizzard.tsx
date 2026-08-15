import { V2Link } from "@/v2/lib/router";
import { useState } from "react";
import { ArrowUpRight, Award, Baby, BatteryCharging, Brain, ChevronDown, CloudRain, Compass, Drama, Eye, Flame, Gauge, GraduationCap, Heart, HeartCrack, CircleHelp, Hourglass, LayoutGrid, Languages, ChartLine, MessageCircle, MessagesSquare, Moon, PersonStanding, Repeat, Rocket, Scale, School, Shield, Smile, Sparkles, Sun, Target, Timer, UserMinus, UserRound, Users, Waves, Zap } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { Button } from "@/v2/components/ui/button";
import quizzardHeroImg from "@/v2/assets/quizzard-mascot.png";

export default QuizzardPage;

const QUIZZARD_URL = "https://quizzard.happimynd.com/";

const features = [
  {
    icon: Languages,
    title: "35 Languages",
    desc: "Accessible in the language you're most comfortable with.",
  },
  {
    icon: Timer,
    title: "Under 60 Seconds",
    desc: "Complete a check-in in less than a minute.",
  },
  {
    icon: LayoutGrid,
    title: "25+ Mini Quizzes",
    desc: "Explore different areas of emotional and personal growth.",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    desc: "Receive meaningful results immediately after completion.",
  },
];

const quizzes = [
  { title: "HappiEQ", icon: Brain },
  { title: "My Personality", icon: UserRound },
  { title: "Emotional Regulation Levels", icon: Waves },
  { title: "Sleep Management", icon: Moon },
  { title: "Anger Management", icon: Flame },
  { title: "Body & Self Image", icon: PersonStanding },
  { title: "Work Life Balance", icon: Scale },
  { title: "Campus Aggression", icon: School },
  { title: "Postnatal Postpartum", icon: Baby },
  { title: "Stress Management", icon: Gauge },
  { title: "Inner Worry Management", icon: CloudRain },
  { title: "Couple Relationship", icon: Heart },
  { title: "Self Esteem", icon: Award },
  { title: "Self Motivation", icon: Target },
  { title: "Loss in Life", icon: HeartCrack },
  { title: "Family Wellness", icon: Users },
  { title: "HappiGuide / SOLV Session", icon: Sparkles },
  { title: "Social Anxiety", icon: Eye },
  { title: "Burnout Risk", icon: BatteryCharging },
  { title: "Emotional Exhaustion", icon: Moon },
  { title: "General Wellbeing Check", icon: Compass },
  { title: "Focus & Attention", icon: Target },
  { title: "Anxiety Screen", icon: CloudRain },
  { title: "Depression Screen", icon: Moon },
];

const benefits = [
  {
    icon: Repeat,
    title: "Repeat Anytime",
    desc: "Track your shifts over time with quick re-checks whenever you want.",
  },
  {
    icon: Shield,
    title: "100% Private",
    desc: "Your responses are completely confidential and secure.",
  },
  {
    icon: Rocket,
    title: "Science Backed",
    desc: "Grounded in psychological frameworks adapted for daily use.",
  },
  {
    icon: ChartLine,
    title: "Actionable Insights",
    desc: "Clear takeaways and recommended next steps for your growth.",
  },
];

const alsoExplore = [
  {
    name: "HappiTALK",
    slug: "happitalk",
    icon: MessageCircle,
    desc: "Therapeutic support with a professional psychologist.",
  },
  {
    name: "SOLV",
    slug: "solv",
    icon: Compass,
    desc: "One-on-one growth conversations to help you find your next step.",
  },
  {
    name: "HappiBUDDY",
    slug: "happibuddy",
    icon: MessagesSquare,
    desc: "A 24/7 chat companion for the moments in between.",
  },
];

function QuizzardPage() {
  return (
    <DashboardShell
      header={
        <TopHeaderBar
          title="Try Quizzard 🧩"
          emoji=""
          subtitle="Mini quizzes that fit into any moment of your day."
        />
      }
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-white/95 p-6 shadow-card border border-white/80 sm:p-8 md:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lavender/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-aqua/30 blur-3xl" />

        {/* Mascot sitting cleanly on bottom-right edge */}
        <img
          src={quizzardHeroImg}
          alt="HappiMynd Quizzard Mascot"
          className="pointer-events-none absolute bottom-0 right-6 hidden h-auto w-[160px] max-h-[92%] object-contain object-bottom md:block xl:right-12 xl:w-[190px]"
        />

        <div className="relative text-left md:max-w-[65%]">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            One Minute. Meaningful Insights.
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base">
            A collection of quick, science-backed mini-check-ins designed to help you better
            understand how you're feeling, thinking, and growing. Explore different aspects of
            your life to grow conscious.
          </p>

          <Button
            asChild
            size="lg"
            className="mt-8 h-12 rounded-full bg-gradient-brand px-8 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
          >
            <a href={QUIZZARD_URL} target="_blank" rel="noopener noreferrer">
              Try Now <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="rounded-3xl bg-white/95 p-6 shadow-soft border border-white/80 transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="grid h-11 w-11 place-items-center rounded-full bg-lavender/40">
                <Icon className="h-5 w-5 text-lavender-deep" strokeWidth={2} />
              </div>
              <div className="mt-4 text-base font-bold text-foreground">{f.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Explore Every Dimension */}
      <ExploreDimensions />

      {/* Why Quizzard */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-hero p-6 shadow-soft sm:p-8 md:p-12">
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-lavender/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-aqua/30 blur-3xl" />

        <div className="relative text-center">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Why Quizzard?
          </h3>
          <p className="mt-3 text-sm text-foreground/70 sm:text-base md:text-lg">
            Tiny moments of reflection, compounding into real self-awareness.
          </p>
        </div>

        <div className="relative mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="flex gap-4 rounded-3xl bg-white/90 p-5 shadow-soft border border-white/80 transition hover:-translate-y-1 hover:bg-white hover:shadow-card"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lavender/40">
                  <Icon className="h-4.5 w-4.5 text-lavender-deep" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold leading-snug text-foreground">{b.title}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Also Explore */}
      <section className="mt-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Also Explore</h3>
          <V2Link
            to="/support"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-lavender-deep hover:underline"
          >
            <CircleHelp className="h-3.5 w-3.5" /> Need Support?
          </V2Link>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {alsoExplore.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.slug}
                className="group flex flex-col rounded-3xl bg-white p-6 shadow-soft border border-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <div className="grid h-11 w-11 place-items-center rounded-full bg-lavender/40 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5 text-lavender-deep" strokeWidth={2} />
                </div>
                <div className="mt-4 text-base font-bold text-foreground">{s.name}</div>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
                <Button
                  asChild
                  className="mt-5 self-start rounded-full bg-gradient-brand px-6 text-sm font-bold text-white shadow-glow transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  <V2Link to={`/services/${s.slug}`}>
                    Buy Now
                  </V2Link>
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </DashboardShell>
  );
}

/* ---------------- Explore Every Dimension ---------------- */

const INITIAL_VISIBLE = 12;

const chipStyles = [
  "bg-gradient-lavender",
  "bg-gradient-aqua",
  "bg-gradient-peach",
  "bg-gradient-mint",
];

function ExploreDimensions() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? quizzes : quizzes.slice(0, INITIAL_VISIBLE);

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-white/70 p-6 shadow-soft border border-white/80 sm:p-8 md:p-10">
      <div className="pointer-events-none absolute -right-24 top-10 h-56 w-56 rounded-full bg-lavender/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-10 h-56 w-56 rounded-full bg-mint/30 blur-3xl" />

      <div className="relative text-center">
        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          Explore Every Dimension
        </h3>
        <p className="mt-3 text-sm text-foreground/70 sm:text-base md:text-lg">
          Choose an area you'd like to better understand today.
        </p>
      </div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((q, i) => {
          const Icon = q.icon;
          return (
            <a
              key={q.title}
              href={QUIZZARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Try the ${q.title} quiz`}
              className="quiz-tile group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-soft border border-lavender/25 transition-all duration-300 hover:-translate-y-1 hover:border-lavender/60 hover:shadow-card"
              style={{ animationDelay: `${(i % INITIAL_VISIBLE) * 45}ms` }}
            >
              {/* Hover wash */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-lavender opacity-0 transition-opacity duration-300 group-hover:opacity-25" />

              <span
                className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                  chipStyles[i % chipStyles.length]
                } shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
              >
                <Icon className="h-5 w-5 text-foreground/80" strokeWidth={2} />
              </span>

              <span className="relative min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-foreground sm:text-[15px]">
                  {q.title}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-lavender-deep">
                  Try Now
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </span>

              <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lavender/25 text-lavender-deep transition-all duration-300 group-hover:bg-gradient-brand group-hover:text-white group-hover:shadow-glow">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </a>
          );
        })}
      </div>

      <div className="relative mt-7 flex justify-center">
        <button
          onClick={() => setShowAll((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-semibold text-lavender-deep border border-lavender/40 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-lavender/15 hover:shadow-card cursor-pointer sm:text-sm"
        >
          {showAll ? "Show fewer quizzes" : `Show all ${quizzes.length} quizzes`}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </section>
  );
}
