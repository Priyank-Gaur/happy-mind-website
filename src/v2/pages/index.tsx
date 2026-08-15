import { V2Link, useV2Navigate } from "@/v2/lib/router";
import { useEffect, useState, useRef } from "react";
import { ClipboardCheck, CircleCheck, BookOpen, Sparkles, Gamepad2, Play, Headphones, Users, MessageCircle, CircleHelp, LifeBuoy, Clock, Lightbulb, ChevronLeft, ChevronRight, Calendar, LoaderCircle, Star, Music, Volume2, VolumeX, ArrowRight, PhoneCall, X } from "lucide-react";
import calmMorningUrl from "@/v2/assets/audio/calm-morning.mp3";
import { Button } from "@/v2/components/ui/button";
import { Progress } from "@/v2/components/ui/progress";
import { DashboardShell } from "@/v2/components/dashboard-shell";
import dashboardMascot from "@/v2/assets/dashboard-mascot.png";
import logoImg from "@/v2/assets/happimynd-logo.png";
import happilifeImg from "@/v2/assets/images/happilife.webp";
import happilearnImg from "@/v2/assets/images/happilearn.webp";
import happibuddyImg from "@/v2/assets/images/happibuddy.webp";
import bookSessionImg from "@/v2/assets/images/book-session.webp";
import calmMorningImg from "@/v2/assets/images/audio/calm-morning.webp";
import ambientDeepImg from "@/v2/assets/images/audio/ambient-deep.webp";
import forestAmbienceImg from "@/v2/assets/images/audio/forest-ambience.webp";
import relImg from "@/v2/assets/articles/relationships.jpeg";
import mentalImg from "@/v2/assets/articles/mental vibrancy.jpeg";
import lifeImg from "@/v2/assets/articles/life transistions.jpeg";
import selfImg from "@/v2/assets/articles/selfawareness.jpeg";
import { useAuth } from "@/v2/lib/auth";
import { useAssessmentPhase } from "@/v2/lib/assessment";
import { toast } from "sonner";
import { cn } from "@/v2/lib/utils";
import { BookSessionDialog } from "@/v2/components/book-session-dialog";
import { consumeBookingResume } from "@/v2/lib/bookings";

export default DashboardPage;

function DashboardPage() {
  const navigate = useV2Navigate();
  const { authed, hydrated } = useAuth();

  // Gate the dashboard behind the login page.
  useEffect(() => {
    if (hydrated && !authed) navigate({ to: "/login", search: { redirect: "/" } });
  }, [hydrated, authed, navigate]);

  // Render a calm loader during SSR/hydration and while redirecting, so the
  // dashboard never flashes to a signed-out visitor.
  if (!hydrated || !authed) return <AuthLoading />;

  return (
    <DashboardShell>
      {/* <TopContactBanner /> */}
      <HeroAssessment />
      <QuickActions />
      <ContinueJourney />
      <ResourcesPreview />
      <ServicesPreview />
      <WhatPeopleSay />
      <SupportBanner />
    </DashboardShell>
  );
}

function AuthLoading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-lavender/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-aqua/30 blur-3xl" />
      </div>
      <div className="relative flex flex-col items-center gap-4">
        <img src={logoImg} alt="HappiMynd Logo" className="h-9 w-auto object-contain" />
        <LoaderCircle className="h-6 w-6 animate-spin text-lavender-deep" />
      </div>
    </div>
  );
}

const CAROUSEL_CARDS = [
  {
    title: "Understand yourself before trying to change yourself.",
    subtitle:
      "The HappiLIFE Assessment uncovers your patterns, strengths, and growth opportunities through guided self-reflection.",
  },
  {
    title: "Personalized insights, not generic advice.",
    subtitle:
      "Receive meaningful perspectives based on your responses to help you make more conscious decisions and move forward with clarity.",
  },
  {
    title: "Not ready for the full assessment? Start with Quizzard.",
    subtitle:
      "Take a quick personality insight check to discover new perspectives in just a few minutes.",
  },
  {
    title: "Growth begins with awareness.",
    subtitle:
      "Small moments of self-reflection today can lead to better choices, stronger emotional resilience, and lasting personal growth.",
  },
  {
    title: "Track how you grow over time.",
    subtitle:
      "Return to your assessment and insights whenever you're ready to understand your progress and evolving patterns.",
  },
];

function HeroCarouselBox() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_CARDS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentCard = CAROUSEL_CARDS[activeSlide];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="mt-6 flex w-full max-w-xl sm:max-w-2xl flex-col gap-3 rounded-2xl bg-white p-5 shadow-soft border border-white/80 transition-all sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Slide indicators */}
        <div className="flex items-center gap-1.5">
          {CAROUSEL_CARDS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                activeSlide === idx
                  ? "w-6 bg-gradient-brand shadow-glow"
                  : "w-2 bg-foreground/20 hover:bg-foreground/40",
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setActiveSlide((prev) => (prev - 1 + CAROUSEL_CARDS.length) % CAROUSEL_CARDS.length)
            }
            className="grid h-7 w-7 place-items-center rounded-full text-foreground/70 transition hover:bg-lavender/30 hover:text-foreground cursor-pointer"
            aria-label="Previous insight"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % CAROUSEL_CARDS.length)}
            className="grid h-7 w-7 place-items-center rounded-full text-foreground/70 transition hover:bg-lavender/30 hover:text-foreground cursor-pointer"
            aria-label="Next insight"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        key={activeSlide}
        className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-1"
      >
        <p className="text-base font-bold text-foreground sm:text-lg leading-snug">
          {currentCard.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
          {currentCard.subtitle}
        </p>
      </div>
    </div>
  );
}

function HeroAssessment() {
  const { phase, progressPercent } = useAssessmentPhase();

  const getContent = () => {
    switch (phase) {
      case "not-started":
        return {
          h1: "Start Your HappiLIFE Self-Check-In",
          body: "Gain a clearer understanding of your current patterns, strengths, and growth opportunities through a guided self-reflection experience designed to help you move forward with confidence.",
          progressLabel: "Not Started",
          progressValue: 0,
          primaryCta: "Start Assessment",
          secondaryCta: "Quizzard",
          isCompleted: false,
        };
      case "completed":
        return {
          h1: "Your HappiLIFE Insights Are Ready!",
          body: "Your self-reflection is complete. Explore your personalized growth insights and discover practical next steps to strengthen awareness, resilience, and everyday decision-making.",
          progressLabel: "100% Completed",
          progressValue: 100,
          primaryCta: "View My Report",
          secondaryCta: "QUIZZARD",
          isCompleted: true,
        };
      case "in-progress":
      default:
        return {
          h1: "Complete Your HappiLIFE Self Check In",
          body: "Understand your emotional wellbeing through a guided Self Check In designed to help you gain personalized insights.",
          progressLabel: `${progressPercent}% completed`,
          progressValue: progressPercent || 65,
          primaryCta: "Continue Assessment",
          secondaryCta: "Quizzard",
          isCompleted: false,
        };
    }
  };

  const content = getContent();

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-hero p-8 shadow-card md:p-12">
      {/* soft blobs */}
      <div className="absolute -top-10 right-10 h-32 w-32 rounded-full bg-white/40 blur-2xl" />
      <div className="absolute bottom-0 left-1/2 h-40 w-40 rounded-full bg-lavender/50 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-lavender-deep">
            <Sparkles className="h-3.5 w-3.5" /> HappiLIFE Journey
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.5rem]">
            {content.h1}
          </h2>
          <p className="mt-3 max-w-xl text-base text-foreground/70 leading-relaxed">
            {content.body}
          </p>

          <div className="mt-6 max-w-md">
            <div className="mb-2 flex items-center justify-between text-sm font-medium">
              <span className="text-foreground/70">Your progress</span>
              <span className={cn("font-semibold", content.isCompleted ? "text-emerald-600 flex items-center gap-1" : "text-lavender-deep")}>
                {content.isCompleted && <CircleCheck className="h-4 w-4 inline text-emerald-600" />}
                {content.progressLabel}
              </span>
            </div>
            <Progress
              value={content.progressValue}
              className="h-3 overflow-hidden rounded-full bg-white/60 [&>div]:bg-gradient-brand"
            />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <V2Link to="/assessment">
              <Button
                size="lg"
                className="h-12 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
              >
                {content.primaryCta}
              </Button>
            </V2Link>
            <div className="group relative inline-flex items-center">
              <a href="https://quizzard.happimynd.com/" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-white px-7 text-sm font-semibold text-foreground border border-white/70 shadow-soft transition hover:bg-white"
                >
                  {content.secondaryCta}
                </Button>
              </a>
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-full bg-lavender-deep px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 shadow-soft transition-opacity duration-200 group-hover:opacity-100">
                Mini Self Check In
                <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-lavender-deep" />
              </span>
            </div>
          </div>

          {/* Carousel Box below */}
          <HeroCarouselBox />
        </div>

        <div className="relative hidden flex-col items-center justify-self-end lg:flex">
          <div className="absolute inset-0 rounded-full bg-white/40 blur-2xl" />
          <div className="relative z-10 mb-3 max-w-[280px] rounded-2xl bg-white/95 px-5 py-3 text-center shadow-soft border border-white/80">
            <p className="text-sm font-semibold leading-snug text-foreground">
              Hi, this is Happi!
              <br />
              Welcome to HappiMynd.
            </p>
            <div className="absolute -bottom-1.5 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white/90" />
          </div>
          <img
            src={dashboardMascot}
            alt="HappiMynd mascot HAPPI waving hello"
            width={420}
            height={420}
            className="relative h-auto w-[300px] drop-shadow-lg xl:w-[360px]"
          />
        </div>
      </div>
    </section>
  );
}

const quickActions = [
  {
    title: "Resources",
    desc: "Explore articles, audio sessions, and wellbeing guides.",
    cta: "Explore Resources",
    icon: BookOpen,
    gradient: "bg-gradient-lavender",
    iconBg: "bg-white/70 text-lavender-deep",
    to: "/resources",
  },
  {
    title: "Services",
    desc: "Discover support services designed for emotional wellbeing.",
    cta: "View Services",
    icon: Sparkles,
    gradient: "bg-gradient-aqua",
    iconBg: "bg-white/70 text-sky-700",
    to: "/services",
  },
  {
    title: "Games",
    desc: "Relax, reset, and recharge with mindful games and activities.",
    cta: "Play & Explore",
    icon: Gamepad2,
    gradient: "bg-gradient-peach",
    iconBg: "bg-white/70 text-orange-700",
    to: "/games",
  },
  {
    title: "View Plans",
    desc: "Explore conscious growth plans for self-reflection, companion chat, and expert guidance.",
    cta: "View Plans",
    icon: Sparkles,
    gradient: "bg-gradient-mint",
    iconBg: "bg-white/70 text-emerald-700",
    to: "/services/$slug",
    params: { slug: "happiself" },
  },
];

function QuickActions() {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {quickActions.map((a) => {
        const Icon = a.icon;
        return (
          <V2Link
            key={a.title}
            to={a.to as any}
            params={(a as any).params}
            className="group relative overflow-hidden rounded-3xl p-6 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
          >
            <div className="absolute inset-0 rounded-3xl transition-all duration-300 group-hover:scale-105" />
            <div className={`absolute inset-0 rounded-3xl ${a.gradient} opacity-100`} />
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/30 blur-xl transition-transform duration-500 group-hover:scale-125" />
            <div className="relative">
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl ${a.iconBg} shadow-soft`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">{a.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">{a.desc}</p>
              <div className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                {a.cta} <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </V2Link>
        );
      })}
    </section>
  );
}

function ContinueJourney() {
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const { phase: assessmentPhase } = useAssessmentPhase();

  // Reopen the booking dialog when the visitor returns from login mid-booking
  useEffect(() => {
    if (consumeBookingResume()) setBookDialogOpen(true);
  }, []);

  const getHappiLifeCardDetails = () => {
    switch (assessmentPhase) {
      case "not-started":
        return {
          title: "Start Your HappiLIFE Self-Check-In",
          badge: "Not Started",
          actionText: "Start Assessment",
          timeText: "15 min check-in",
        };
      case "completed":
        return {
          title: "HappiLIFE Insights Ready",
          badge: "Completed ✓",
          actionText: "View Report",
          timeText: "Report available",
        };
      case "in-progress":
      default:
        return {
          title: "Finish Your HappiLIFE check-in",
          badge: "Self Check In",
          actionText: "Resume",
          timeText: "5 min left",
        };
    }
  };

  const happiLifeCard = getHappiLifeCardDetails();

  return (
    <section>
      <SectionHeader title="Continue Your Journey" subtitle="Pick up right where you left off." />
      <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4">
        {/* Card 1: Self Check In (First one is fine) */}
        <V2Link
          to="/assessment"
          className="group min-w-[260px] snap-start cursor-pointer rounded-3xl bg-white/95 p-5 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-card flex flex-col"
        >
          <div className="relative h-32 overflow-hidden rounded-2xl bg-gradient-lavender">
            <div className="absolute inset-0 grid place-items-center">
              <ClipboardCheck className="h-10 w-10 text-white/80" strokeWidth={1.5} />
            </div>
            <img
              src={happilifeImg}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[50%_45%] transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/40 blur-2xl" />
          </div>
          <span className="mt-4 inline-block self-start rounded-full bg-lavender/40 px-3 py-1 text-xs font-semibold text-lavender-deep whitespace-nowrap">
            {happiLifeCard.badge}
          </span>
          <h4 className="mt-2 text-base font-semibold leading-snug text-foreground flex-1">
            {happiLifeCard.title}
          </h4>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground w-full">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />{happiLifeCard.timeText}
            </span>
            <span className="font-semibold text-lavender-deep opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
              {happiLifeCard.actionText} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </V2Link>


        {/* Card 2: HappiLEARN Service */}
        <V2Link
          to="/services/happilearn"
          className="group min-w-[260px] snap-start cursor-pointer rounded-3xl bg-white/95 p-5 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-card flex flex-col"
        >
          <div className="relative h-32 overflow-hidden rounded-2xl bg-gradient-peach">
            <div className="absolute inset-0 grid place-items-center">
              <BookOpen className="h-10 w-10 text-white/80" strokeWidth={1.5} />
            </div>
            <img
              src={happilearnImg}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[50%_55%] transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/40 blur-2xl" />
          </div>
          <span className="mt-4 inline-block self-start rounded-full bg-peach/50 px-3 py-1 text-xs font-semibold text-orange-800 whitespace-nowrap">
            Service
          </span>
          <h4 className="mt-2 text-base font-semibold leading-snug text-foreground flex-1">
            HappiLEARN - Self-Paced Growth
          </h4>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground w-full">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Interactive Modules
            </span>
            <span className="font-semibold text-lavender-deep opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </V2Link>

        {/* Card 3: HappiBUDDY Service */}
        <V2Link
          to="/services/happibuddy"
          className="group min-w-[260px] snap-start cursor-pointer rounded-3xl bg-white/95 p-5 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-card flex flex-col"
        >
          <div className="relative h-32 overflow-hidden rounded-2xl bg-gradient-aqua">
            <div className="absolute inset-0 grid place-items-center">
              <MessageCircle className="h-10 w-10 text-white/80" strokeWidth={1.5} />
            </div>
            <img
              src={happibuddyImg}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[50%_55%] transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/40 blur-2xl" />
          </div>
          <span className="mt-4 inline-block self-start rounded-full bg-aqua/40 px-3 py-1 text-xs font-semibold text-sky-800 whitespace-nowrap">
            Service
          </span>
          <h4 className="mt-2 text-base font-semibold leading-snug text-foreground flex-1">
            HappiBUDDY - 24/7 Support
          </h4>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground w-full">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Dedicated Chat Buddy
            </span>
            <span className="font-semibold text-lavender-deep opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
              Connect <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </V2Link>

        {/* Card 4: Book a Session (Opens Dialog) */}
        <div
          onClick={() => setBookDialogOpen(true)}
          className="group min-w-[260px] snap-start cursor-pointer rounded-3xl bg-white/95 p-5 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-card flex flex-col"
        >
          <div className="relative h-32 overflow-hidden rounded-2xl bg-gradient-mint">
            <div className="absolute inset-0 grid place-items-center">
              <Calendar className="h-10 w-10 text-white/80" strokeWidth={1.5} />
            </div>
            <img
              src={bookSessionImg}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[50%_62%] transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/40 blur-2xl" />
          </div>
          <span className="mt-4 inline-block self-start rounded-full bg-mint/40 px-3 py-1 text-xs font-semibold text-emerald-800 whitespace-nowrap">
            Session
          </span>
          <h4 className="mt-2 text-base font-semibold leading-snug text-foreground flex-1">
            Book a Session
          </h4>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground w-full">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              1-on-1 Expert Support
            </span>
            <span className="font-semibold text-emerald-700 opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
              Book Now <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>

      <BookSessionDialog
        open={bookDialogOpen}
        onOpenChange={setBookDialogOpen}
        service={{ key: "solv", name: "SOLV" }}
      />
    </section>
  );
}

const dashboardResources = [
  // Articles
  {
    type: "Articles",
    cat: "Self Awareness",
    title: "Your Anxiety Isn't a Personality Trait. It's an Unmet Need.",
    time: "3 min read",
    gradient: "bg-gradient-lavender",
    img: selfImg,
    slug: "anxiety-is-an-unmet-need",
    icon: BookOpen,
    to: "/articles/$slug",
    params: { slug: "anxiety-is-an-unmet-need" },
    thumb: selfImg,
  },
  {
    type: "Articles",
    cat: "Mental Vibrancy",
    title: "You Don't Need More Motivation. You Need Your Nervous System Back.",
    time: "3 min read",
    gradient: "bg-gradient-aqua",
    img: mentalImg,
    slug: "your-nervous-system-not-motivation",
    icon: BookOpen,
    to: "/articles/$slug",
    params: { slug: "your-nervous-system-not-motivation" },
    thumb: mentalImg,
  },
  {
    type: "Articles",
    cat: "Relationships",
    title: "The Relationship Pattern You Keep Repeating Isn't About Love.",
    time: "3 min read",
    gradient: "bg-gradient-mint",
    img: relImg,
    slug: "relationship-pattern-you-keep-repeating",
    icon: BookOpen,
    to: "/articles/$slug",
    params: { slug: "relationship-pattern-you-keep-repeating" },
    thumb: relImg,
  },
  // Audio
  {
    type: "Audio",
    cat: "Guided Audio",
    title: "Calm Morning",
    time: "2:10 min listen",
    gradient: "bg-gradient-peach",
    img: calmMorningImg,
    imgPos: "50% 70%",
    icon: Headphones,
    to: "/resources",
    params: {},
    hash: "audio",
  },
  {
    type: "Audio",
    cat: "Guided Audio",
    title: "Ambient Deep",
    time: "3:34 min listen",
    gradient: "bg-gradient-lavender",
    img: ambientDeepImg,
    imgPos: "50% 75%",
    icon: Headphones,
    to: "/resources",
    params: {},
    hash: "audio",
  },
  {
    type: "Audio",
    cat: "Reflection Audio",
    title: "Morning Forest Ambience",
    time: "0:30 min listen",
    gradient: "bg-gradient-mint",
    img: forestAmbienceImg,
    imgPos: "50% 60%",
    icon: Headphones,
    to: "/resources",
    params: {},
    hash: "audio",
  },
  // Videos (dashboard preview — 3 cards with real YouTube thumbnails)
  {
    type: "Video",
    cat: "Perspective Studio",
    title: "Stress 101: Understanding the Basics and Mastering Stress Management",
    time: "Watch on YouTube",
    gradient: "bg-gradient-aqua",
    icon: Play,
    to: "/resources" as any,
    params: {},
    hash: "video",
    ytUrl: "https://youtu.be/WS2hxJWc2hk",
    thumb: "https://i.ytimg.com/vi/WS2hxJWc2hk/hqdefault.jpg",
  },
  {
    type: "Video",
    cat: "Perspective Studio",
    title: "Ultimate Relaxation Guide: 8 Tips for Boosting Mental Health",
    time: "Watch on YouTube",
    gradient: "bg-gradient-peach",
    icon: Play,
    to: "/resources" as any,
    params: {},
    hash: "video",
    ytUrl: "https://youtu.be/xDEaQ0gwvlI",
    thumb: "https://i.ytimg.com/vi/xDEaQ0gwvlI/hqdefault.jpg",
  },
  {
    type: "Video",
    cat: "Perspective Studio",
    title: "Student Stress Solutions: Effective Strategies for Managing Academic Pressure",
    time: "Watch on YouTube",
    gradient: "bg-gradient-lavender",
    icon: Play,
    to: "/resources" as any,
    params: {},
    hash: "video",
    ytUrl: "https://youtu.be/GGbevOpaWn4",
    thumb: "https://i.ytimg.com/vi/GGbevOpaWn4/hqdefault.jpg",
  },
];

function ResourcesPreview() {
  const [activeTab, setActiveTab] = useState<"Articles" | "Audio" | "Video">("Articles");
  const resourcesScrollRef = useRef<HTMLDivElement>(null);

  const filteredResources = dashboardResources.filter((r) => r.type === activeTab);

  const scrollContainer = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right",
  ) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section>
      <SectionHeader
        title="Growth Resources"
        subtitle="Handpicked reads, audio, and video sessions for your day."
        action="Browse all"
        to="/resources"
        hash={activeTab.toLowerCase()}
        onPrev={() => scrollContainer(resourcesScrollRef, "left")}
        onNext={() => scrollContainer(resourcesScrollRef, "right")}
      />

      {/* Category Tabs */}
      <div className="mt-4 flex flex-wrap gap-2.5">
        {(["Articles", "Audio", "Video"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold shadow-soft transition-all duration-200 cursor-pointer ${activeTab === tab
              ? "bg-gradient-brand text-white shadow-glow"
              : "bg-white/80 text-foreground/70 hover:bg-lavender/30 hover:text-lavender-deep"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Mobile Horizontal Snap Carousel (Perspective Studio Style) */}
      <div
        ref={resourcesScrollRef}
        className="mt-5 flex sm:hidden snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {filteredResources.map((r) => {
          const Icon = r.icon;
          const ytUrl = (r as any).ytUrl as string | undefined;
          const thumb = (r as any).thumb as string | undefined;
          const inner = (
            <>
              <div>
                <div className={`relative h-40 ${r.gradient} overflow-hidden`}>
                  {(r as any).img ? (
                    <img
                      src={(r as any).img}
                      alt={r.title}
                      loading="lazy"
                      style={{ objectPosition: (r as any).imgPos ?? "50% 25%" }}
                      className="h-full w-full object-cover"
                    />
                  ) : thumb ? (
                    <>
                      <img
                        src={thumb}
                        alt={r.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {r.type === "Video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-lavender-deep shadow-glow">
                            <Play className="h-5 w-5 fill-current" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/60">
                        <Icon className="h-5 w-5 text-lavender-deep" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-lavender-deep">
                    {r.cat}
                  </span>
                  <h4 className="mt-1 text-sm font-bold leading-snug text-foreground line-clamp-2">
                    {r.title}
                  </h4>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-muted/20">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {r.time}
                  </span>
                  <span className="font-semibold text-foreground">
                    {r.type === "Articles" ? "Read" : r.type === "Audio" ? "Listen" : "Watch"}
                  </span>
                </div>
              </div>
            </>
          );
          const cls =
            "group w-[260px] shrink-0 snap-start flex flex-col justify-between overflow-hidden rounded-3xl bg-white/95 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-card";
          return ytUrl ? (
            <a key={r.title} href={ytUrl} target="_blank" rel="noopener noreferrer" className={cls}>
              {inner}
            </a>
          ) : (
            <V2Link
              key={r.title}
              to={r.to as any}
              params={r.params as any}
              hash={(r as any).hash || undefined}
              className={cls}
            >
              {inner}
            </V2Link>
          );
        })}
      </div>

      {/* Desktop Grid */}
      <div className="mt-5 hidden sm:grid gap-5 md:grid-cols-3">
        {filteredResources.map((r) => {
          const Icon = r.icon;
          const ytUrl = (r as any).ytUrl as string | undefined;
          const thumb = (r as any).thumb as string | undefined;
          const img = (r as any).img as string | undefined;
          const inner = (
            <>
              <div>
                <div className={`relative h-52 ${r.gradient} overflow-hidden`}>
                  {img ? (
                    <img
                      src={img}
                      alt={r.title}
                      loading="lazy"
                      style={{ objectPosition: (r as any).imgPos ?? "50% 25%" }}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : thumb ? (
                    <>
                      <img
                        src={thumb}
                        alt={r.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {r.type === "Video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-lavender-deep shadow-glow">
                            <Play className="h-6 w-6 fill-current" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/60">
                        <Icon className="h-6 w-6 text-lavender-deep" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-lavender-deep">
                    {r.cat}
                  </span>
                  <h4 className="mt-1.5 text-base font-semibold leading-snug text-foreground line-clamp-2">
                    {r.title}
                  </h4>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {r.time}
                  </span>
                  <span className="font-semibold text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {r.type === "Articles" ? "Read" : r.type === "Audio" ? "Listen" : "Watch"}
                  </span>
                </div>
              </div>
            </>
          );
          const cls =
            "group flex flex-col justify-between overflow-hidden rounded-3xl bg-white/95 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-card";
          return ytUrl ? (
            <a key={r.title} href={ytUrl} target="_blank" rel="noopener noreferrer" className={cls}>
              {inner}
            </a>
          ) : (
            <V2Link
              key={r.title}
              to={r.to as any}
              params={r.params as any}
              hash={(r as any).hash || undefined}
              className={cls}
            >
              {inner}
            </V2Link>
          );
        })}
      </div>
    </section>
  );
}

const services = [
  {
    title: "HappiSELF",
    desc: "Daily practices for inner strength, mood tracking, and guided meditation.",
    icon: Sparkles,
    gradient: "bg-gradient-lavender",
    slug: "happiself",
  },
  {
    title: "HappiBUDDY",
    desc: "A confidential companion for daily self-reflection and emotional logs.",
    icon: Users,
    gradient: "bg-gradient-aqua",
    slug: "happibuddy",
  },
  {
    title: "HappiTALK",
    desc: "Confidential, professional online counseling and chats with qualified experts.",
    icon: MessageCircle,
    gradient: "bg-gradient-peach",
    slug: "happitalk",
  },
  {
    title: "SOLV",
    desc: "Active 1:1 problem-solving sessions to feel sorted and clear.",
    icon: CircleHelp,
    gradient: "bg-gradient-lavender",
    slug: "solv",
  },
  {
    title: "Quizzard",
    desc: "Explore 25+ mini quizzes designed for quick personalized growth insights.",
    icon: CircleHelp,
    gradient: "bg-gradient-mint",
    externalUrl: "https://quizzard.happimynd.com/",
  },
];

function ServicesPreview() {
  return (
    <section>
      <SectionHeader
        title="Services for You"
        subtitle="Human, warm, and always in your corner."
        action="See all services"
        to="/services"
      />
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {services.map((s) => {
          const Icon = s.icon;
          const cardInner = (
            <>
              <div>
                <div
                  className={`grid h-14 w-14 place-items-center rounded-2xl ${s.gradient} shadow-soft`}
                >
                  <Icon className="h-6 w-6 text-foreground/80" strokeWidth={2} />
                </div>
                <h4 className="mt-5 text-lg font-bold tracking-tight text-foreground">{s.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">{s.desc}</p>
              </div>
              <div className="mt-5">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-lavender-deep group-hover:underline">
                  Learn more <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </>
          );
          const cardClass =
            "group relative overflow-hidden rounded-3xl bg-white/95 p-6 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-card flex flex-col justify-between cursor-pointer";

          return s.externalUrl ? (
            <a
              key={s.title}
              href={s.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
            >
              {cardInner}
            </a>
          ) : (
            <V2Link key={s.title} to="/services" search={{ service: s.slug }} className={cardClass}>
              {cardInner}
            </V2Link>
          );
        })}
      </div>
    </section>
  );
}

const userReviews = [
  {
    name: "Priya S.",
    testimonial:
      "HappiMynd helped me understand myself better without feeling judged. It's like having a gentle guide.",
    rating: 5,
  },
  {
    name: "Rahul M.",
    testimonial:
      "Our team's conscious awareness has transformed how we work together. The change is remarkable.",
    rating: 5,
  },
  {
    name: "Ananya K.",
    testimonial:
      "Finally, a space that feels safe and welcoming. I've grown so much in just a few months.",
    rating: 5,
  },
  {
    name: "Vikram P.",
    testimonial:
      "The journey approach made all the difference. No pressure, just progress at my own pace.",
    rating: 5,
  },
  {
    name: "Meera J.",
    testimonial: "Simple yet profound. HappiMynd gave me tools I use every single day.",
    rating: 5,
  },
  {
    name: "Arjun T.",
    testimonial: "Our organisation saw real change. Employees are more engaged and connected.",
    rating: 5,
  },
  {
    name: "Sneha R.",
    testimonial: "I was skeptical at first, but the calm approach won me over completely.",
    rating: 5,
  },
  {
    name: "Karthik N.",
    testimonial: "The experts are compassionate and truly listen. A rare find in today's world.",
    rating: 5,
  },
  {
    name: "Pooja N.",
    testimonial: "Clarity came slowly, but it stayed. That's what made the difference for me.",
    rating: 5,
  },
  {
    name: "Siddharth A.",
    testimonial:
      "I've tried many approaches before, but this one finally stuck. The changes felt real, not forced.",
    rating: 5,
  },
  {
    name: "Neha L.",
    testimonial:
      "We noticed a shift within weeks. Better conversations, healthier mindsets, and stronger collaboration.",
    rating: 5,
  },
  {
    name: "Kapil R.",
    testimonial: "It didn't feel like a program - it felt like a journey built around me.",
    rating: 5,
  },
  {
    name: "Alaya M.",
    testimonial:
      "What stood out was how practical everything was. I could actually apply the insights to my daily life.",
    rating: 5,
  },
  {
    name: "Ananya Raj S.",
    testimonial:
      "The experience felt thoughtful and human. I wasn't rushed or judged - just steadily guided forward.",
    rating: 5,
  },
];

function WhatPeopleSay() {
  const reviewsScrollRef = useRef<HTMLDivElement>(null);

  const scrollReviews = (direction: "left" | "right") => {
    if (reviewsScrollRef.current) {
      const amount = direction === "left" ? -340 : 340;
      reviewsScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">What People Say</h3>
          <p className="mt-1 text-sm text-muted-foreground hidden sm:block">
            Real experiences from individuals and teams who have embarked on their conscious growth
            journey with HappiMynd.
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 pb-1"></div>
      </div>

      {/* Continuous Flowing Marquee Review Slider */}
      <div
        ref={reviewsScrollRef}
        className="mt-5 relative overflow-x-auto pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="animate-marquee flex gap-5 shrink-0">
          {[...userReviews, ...userReviews].map((r, i) => (
            <div
              key={i}
              className="group w-[290px] sm:w-[340px] shrink-0 flex flex-col justify-between overflow-hidden rounded-3xl bg-white/95 p-6 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-foreground/90 font-medium">
                  "{r.testimonial}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-muted/20">
                <h5 className="text-sm font-bold text-foreground">{r.name}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportBanner() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-hero p-8 shadow-card md:p-10">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/40 blur-3xl" />
      <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
            We're here whenever you need support.
          </h3>
          <p className="mt-2 max-w-xl text-sm text-foreground/70 sm:text-base">
            Reach out any time - a friendly human is always a message away.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <V2Link to="/support">
            <Button className="h-11 rounded-full bg-gradient-brand px-6 text-sm font-semibold text-white shadow-glow hover:opacity-95">
              <CircleHelp className="mr-2 h-4 w-4" /> Raise a Query
            </Button>
          </V2Link>
          <V2Link to="/support">
            <Button
              variant="ghost"
              className="h-11 rounded-full bg-white/80 px-6 text-sm font-semibold hover:bg-white"
            >
              FAQs
            </Button>
          </V2Link>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
  to,
  hash,
  onPrev,
  onNext,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  to?: string;
  hash?: string;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground hidden sm:block">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {action && to && (
          <V2Link
            to={to}
            hash={hash}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-lavender-deep hover:underline cursor-pointer"
          >
            {action} <ArrowRight className="h-4 w-4" />
          </V2Link>
        )}
        {onPrev && onNext && (
          <div className="flex items-center gap-1.5 sm:hidden">
            <button
              onClick={onPrev}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow-soft border border-white/80 transition hover:bg-white hover:text-foreground active:scale-95 cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={onNext}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow-soft border border-white/80 transition hover:bg-white hover:text-foreground active:scale-95 cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TopContactBanner() {
  return (
    <div className="relative mt-0.5 md:mt-1 mb-2.5 md:mb-3 overflow-hidden rounded-xl bg-gradient-brand py-2 px-3.5 md:py-2.5 md:px-4 shadow-glow text-white transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-white shrink-0 shadow-soft">
            <PhoneCall className="h-3.5 w-3.5" />
          </span>
          <p className="font-semibold text-white leading-snug">Connect With Us Today!</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
          <a href="tel:08044186869">
            <Button
              size="sm"
              className="h-7.5 rounded-full bg-white text-lavender-deep hover:bg-white/90 px-3 text-xs font-bold shadow-soft transition cursor-pointer"
            >
              <PhoneCall className="mr-1.5 h-3.5 w-3.5 text-lavender-deep" /> Call 08044186869
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
