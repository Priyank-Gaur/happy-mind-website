import { V2Link, useV2Navigate, useSearch } from "@/v2/lib/router";
import { useState, useEffect } from "react";
import { Compass, Sparkles, MessagesSquare, BookOpen, Phone, LifeBuoy, Check, Image, ShieldCheck, Layers, HeartHandshake, Route as RouteIcon, Lightbulb, Users, ArrowRight } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import viewPlansHeroImg from "@/v2/assets/service-page-mascot.png";
import happilifeBanner from "@/v2/assets/images/services/happilife-banner.webp";
import happiselfBanner from "@/v2/assets/images/services/happiself-banner.webp";
import happibuddyBanner from "@/v2/assets/images/services/happibuddy-banner.webp";
import happilearnBanner from "@/v2/assets/images/services/happilearn-banner.webp";
import solvBanner from "@/v2/assets/images/services/solv-banner.webp";
import happitalkBanner from "@/v2/assets/images/services/happitalk-banner.webp";
import { Button } from "@/v2/components/ui/button";
import { cn } from "@/v2/lib/utils";
import { useAssessmentPhase } from "@/v2/lib/assessment";

type ServicesSearch = {
  service?: string;
};

export default ServicesPage;
type ServiceKey =
  | "happilife"
  | "happiself"
  | "happibuddy"
  | "happilearn"
  | "solv"
  | "happitalk";

type Service = {
  key: ServiceKey;
  name: string;
  tabLabel: string;
  shortLine: string;
  description: string;
  usps: string[];
  bestFor: string;
  icon: typeof Compass;
  bannerImage?: string;
  bannerAlt?: string;
  /** Tailwind aspect class matching the banner's own proportions. */
  bannerAspect?: string;
};

const SERVICES: Record<ServiceKey, Service> = {
  happilife: {
    key: "happilife",
    name: "HappiLIFE",
    tabLabel: "Start with Awareness",
    shortLine: "Start with awareness.",
    description:
      "A guided self-reflection experience that helps you understand where you are and what needs attention.",
    usps: [
      "Guided self-reflection across key life dimensions",
      "Personalized insights you can act on",
      "A clear starting point before choosing deeper support",
    ],
    bestFor: "Users who want clarity before taking the next step.",
    icon: Compass,
    bannerImage: happilifeBanner,
    bannerAlt: "Person reflecting with a journal in a calm, warm space.",
    bannerAspect: "aspect-[1535/768]",
  },
  happiself: {
    key: "happiself",
    name: "HappiSELF",
    tabLabel: "Daily Growth",
    shortLine: "Build everyday growth.",
    description:
      "Daily practices, reflections, and simple tools that help you stay consistent without feeling overwhelmed.",
    usps: [
      "Easy daily growth practices",
      "Short reflections that fit real life",
      "Helps build consistency over time",
    ],
    bestFor: "Users who want a simple routine for self-growth.",
    icon: Sparkles,
    bannerImage: happiselfBanner,
    bannerAlt: "Person using HappiSELF daily practices on a phone.",
    bannerAspect: "aspect-[1535/514]",
  },
  happibuddy: {
    key: "happibuddy",
    name: "HappiBUDDY",
    tabLabel: "Companion Support",
    shortLine: "A companion when you need one.",
    description:
      "A 24/7 chat companion that helps you pause, reflect, and stay steady in everyday moments.",
    usps: [
      "24/7 companion support",
      "Helps you talk things through in the moment",
      "Makes support feel available between sessions",
    ],
    bestFor: "Users who want support on demand and in real time.",
    icon: MessagesSquare,
    bannerImage: happibuddyBanner,
    bannerAlt: "Person chatting with a HappiBUDDY companion on a phone.",
    bannerAspect: "aspect-[1535/514]",
  },
  happilearn: {
    key: "happilearn",
    name: "HappiLEARN",
    tabLabel: "Learn & Practice",
    shortLine: "Learn at your own pace.",
    description:
      "Curated learning resources that help you turn insight into action through practical, easy-to-use content.",
    usps: [
      "Expert-curated resources",
      "Simple learning for everyday use",
      "Helps convert awareness into action",
    ],
    bestFor: "Users who want practical ideas, not just information.",
    icon: BookOpen,
    bannerImage: happilearnBanner,
    bannerAlt: "Person exploring HappiLEARN content on a tablet.",
    bannerAspect: "aspect-[1535/330]",
  },
  solv: {
    key: "solv",
    name: "SOLV",
    tabLabel: "Growth Conversations",
    shortLine: "One-on-one growth conversations.",
    description:
      "A focused conversation with a growth expert to help you think through a situation and find your next step.",
    usps: [
      "1:1 growth conversation",
      "Practical support for a specific need",
      "Clear direction without feeling clinical",
    ],
    bestFor: "Users who want to talk something through and move forward.",
    icon: LifeBuoy,
    bannerImage: solvBanner,
    bannerAlt: "One-on-one SOLV session with a growth expert.",
    bannerAspect: "aspect-[1535/337]",
  },
  happitalk: {
    key: "happitalk",
    name: "HappiTALK",
    tabLabel: "Therapeutic Support",
    shortLine: "Therapeutic support with a psychologist.",
    description:
      "A supportive counselling experience for users who want deeper guided care with a psychologist.",
    usps: [
      "Therapeutic counselling support",
      "Professional psychological guidance",
      "For deeper and more structured support",
    ],
    bestFor:
      "Users who need therapeutic support and a more clinical conversation.",
    icon: Phone,
    bannerImage: happitalkBanner,
    bannerAlt: "Person on a video call with a HappiTALK expert.",
    bannerAspect: "aspect-[1535/338]",
  },
};

const ORDER: ServiceKey[] = [
  "happilife",
  "happiself",
  "happibuddy",
  "happilearn",
  "solv",
  "happitalk",
];

const WHY_HAPPIMYND = [
  { icon: Layers, text: "One connected ecosystem, not scattered tools" },
  { icon: RouteIcon, text: "Support that fits different stages of growth" },
  { icon: HeartHandshake, text: "Companion support when you need it most" },
  { icon: Lightbulb, text: "Clear starting points with no confusion" },
  { icon: Users, text: "Designed to help you become more self-aware and self-reliant" },
  { icon: ShieldCheck, text: "A simple first step toward better support" },
];

type GoalCard = {
  goal: string;
  desc: string;
  serviceKey: ServiceKey;
  serviceName: string;
  serviceLine: string;
  cta: string;
  to: "assessment" | "plans";
};

const GOAL_CARDS: GoalCard[] = [
  {
    goal: "Understand Yourself Better",
    desc: "Discover your strengths, patterns and growth opportunities.",
    serviceKey: "happilife",
    serviceName: "HappiLIFE",
    serviceLine:
      "Gain deep insights into your emotional patterns and personal growth.",
    cta: "Your Self Check-In",
    to: "assessment",
  },
  {
    goal: "Build Healthier Everyday Habits",
    desc: "Create small routines that strengthen your emotional resilience.",
    serviceKey: "happiself",
    serviceName: "HappiSELF",
    serviceLine:
      "Interactive daily practices that help you build awareness and resilience.",
    cta: "Explore HappiSELF",
    to: "plans",
  },
  {
    goal: "Learn New Perspectives & Life Skills",
    desc: "Expand the way you think, respond and grow.",
    serviceKey: "happilearn",
    serviceName: "HappiLEARN",
    serviceLine:
      "Expert-curated learning resources designed for everyday growth.",
    cta: "Explore HappiLEARN",
    to: "plans",
  },
  {
    goal: "Reflect Through Guided Conversations",
    desc: "Sometimes clarity begins with simply talking it through.",
    serviceKey: "happibuddy",
    serviceName: "HappiBUDDY",
    serviceLine:
      "A confidential companion space for guided reflection and meaningful conversations.",
    cta: "Explore HappiBUDDY",
    to: "plans",
  },
  {
    goal: "Navigate Important Life Decisions",
    desc: "Gain clarity before taking your next step.",
    serviceKey: "solv",
    serviceName: "SOLV",
    serviceLine:
      "One-on-one conversations with growth experts for important life decisions.",
    cta: "Explore SOLV",
    to: "plans",
  },
  {
    goal: "Seek Therapeutic Support",
    desc: "Professional support when life feels overwhelming.",
    serviceKey: "happitalk",
    serviceName: "HappiTALK",
    serviceLine:
      "Confidential therapeutic conversations with experienced experts.",
    cta: "Explore HappiTALK",
    to: "plans",
  },
];

function GoalFlipCard({ card }: { card: GoalCard }) {
  const [flipped, setFlipped] = useState(false);
  const Icon = SERVICES[card.serviceKey].icon;

  const handleCardClick = (e: React.MouseEvent) => {
    // If user clicked/tapped directly on the button or link inside the card, allow navigation
    if ((e.target as HTMLElement).closest("a, button")) {
      return;
    }
    // Toggle flip on single tap on mobile / click on desktop
    setFlipped((f) => !f);
  };

  const handleMouseEnter = () => {
    // Only flip on mouse enter if device supports real hover
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
      setFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    // Only flip back on mouse leave if device supports real hover
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
      setFlipped(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${card.goal} - reveal ${card.serviceName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      className="flip-perspective group relative min-h-[220px] sm:min-h-[240px] w-full max-w-[220px] aspect-square rounded-[26px] outline-none focus-visible:ring-2 focus-visible:ring-lavender-deep/50 select-none cursor-pointer touch-manipulation"
    >
      <div
        className="flip-inner h-full w-full"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div className="flip-face flip-front flex flex-col items-center justify-center gap-2 rounded-[26px] border border-lavender/20 bg-white p-3.5 text-center shadow-soft sm:gap-3 sm:p-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lavender/40 text-lavender-deep sm:h-11 sm:w-11">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0 px-1">
            <h3 className="text-xs font-bold leading-snug tracking-tight text-foreground sm:text-base">
              {card.goal}
            </h3>
            <p className="mt-1 text-[11px] leading-normal text-muted-foreground sm:text-xs">
              {card.desc}
            </p>
          </div>
        </div>

        {/* Back */}
        <div className="flip-face flip-back flex flex-col items-center justify-between gap-2 rounded-[26px] bg-gradient-brand p-3.5 text-center text-white shadow-card sm:p-4">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-2xl bg-white/20 sm:h-10 sm:w-10">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0 my-auto px-1 w-full">
            <div className="text-xs font-bold leading-snug text-white sm:text-base">
              {card.serviceName}
            </div>
            <p className="mt-0.5 text-[11px] leading-normal text-white/90 sm:text-xs">
              {card.serviceLine}
            </p>
          </div>
          <Button
            asChild
            className="mt-1 h-auto min-h-[30px] w-full max-w-[98%] shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-lavender-deep shadow-soft transition hover:-translate-y-0.5 hover:bg-white hover:shadow-card sm:min-h-[32px] sm:px-3 sm:text-xs"
          >
            {card.to === "assessment" ? (
              <V2Link to="/assessment" className="inline-flex items-center justify-center w-full text-center whitespace-normal break-words leading-tight text-lavender-deep">
                <span className="text-[10px] sm:text-xs font-semibold leading-tight text-center text-lavender-deep">{card.cta}</span>
              </V2Link>
            ) : (
              <V2Link to={`/services/${card.serviceKey}`} className="inline-flex items-center justify-center w-full text-center whitespace-normal break-words leading-tight text-lavender-deep">
                <span className="text-[10px] sm:text-xs font-semibold leading-tight text-center text-lavender-deep">{card.cta}</span>
              </V2Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ServicesPage() {
  const navigate = useV2Navigate();
  const search = useSearch();
  const { phase: assessmentPhase } = useAssessmentPhase();
  const initial = (search.service && ORDER.includes(search.service as ServiceKey))
    ? (search.service as ServiceKey)
    : "happilife";
  const [selected, setSelected] = useState<ServiceKey>(initial);

  useEffect(() => {
    if (search.service && ORDER.includes(search.service as ServiceKey)) {
      setSelected(search.service as ServiceKey);
    }
  }, [search.service]);

  const handleSelectService = (key: ServiceKey) => {
    setSelected(key);
    navigate({
      to: "/services",
      search: { service: key },
      replace: true,
    });
  };

  const service = SERVICES[selected];

  const getHappiLifePrimaryCta = () => {
    switch (assessmentPhase) {
      case "not-started":
        return "Start Assessment";
      case "completed":
        return "View My Report";
      case "in-progress":
      default:
        return "Continue Assessment";
    }
  };

  return (
    <DashboardShell
      header={
        <TopHeaderBar
          title="Services"
          emoji=""
          subtitle="Find the support that fits where you are today."
        />
      }
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-white/70 p-8 shadow-soft sm:p-12">
        {/* Mascot sitting cleanly on bottom-right edge */}
        <img
          src={viewPlansHeroImg}
          alt="HappiMynd Services Mascot"
          className="pointer-events-none absolute bottom-0 right-4 hidden h-full max-h-full w-auto object-contain object-bottom md:block md:w-[240px] lg:w-[290px] xl:right-8 xl:w-[340px]"
        />

        <div className="relative text-left md:max-w-[65%]">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Explore Our Services
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            From self-reflection to daily support and expert conversations,
            explore services designed to help you understand yourself, build
            momentum, and move forward with clarity.
          </p>
        </div>
      </section>

      {/* Service tabs */}
      <section id="service-tabs">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ORDER.map((key) => {
            const s = SERVICES[key];
            const Icon = s.icon;
            const active = key === selected;
            return (
              <button
                key={key}
                onClick={() => handleSelectService(key)}
                className={cn(
                  "group flex flex-col items-start gap-3 rounded-3xl p-4 text-left shadow-soft transition-all duration-300",
                  "hover:-translate-y-1 hover:shadow-card",
                  active
                    ? "bg-gradient-brand text-white shadow-glow"
                    : "bg-white/80 text-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-2xl transition",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-lavender/40 text-lavender-deep",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div
                    className={cn(
                      "mt-0.5 text-xs leading-snug",
                      active ? "text-white/85" : "text-muted-foreground",
                    )}
                  >
                    {s.tabLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Service detail — no unmount key or animation delay for instant 0ms response */}
      <section className="rounded-[2rem] bg-white/80 p-6 shadow-card sm:p-10">
        <div className="relative mb-8">
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-[1.75rem] border border-white/60 shadow-card",
              service.bannerImage
                ? (service.bannerAspect ?? "aspect-[1535/514]")
                : "aspect-[21/9] bg-gradient-lavender",
            )}
          >
            {service.bannerImage ? (
              <img
                src={service.bannerImage}
                alt={service.bannerAlt || service.name}
                loading="eager"
                decoding="sync"
                className="h-full w-full object-cover transition-opacity duration-150"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-center">
                <div className="flex flex-col items-center gap-3 text-lavender-deep/80">
                  <Image className="h-10 w-10" strokeWidth={1.5} />
                  <div className="text-sm font-medium">Service Image</div>
                  <div className="text-xs text-muted-foreground">{service.name}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {service.name}
          </h2>
          <p className="mt-2 text-lg font-medium text-lavender-deep sm:text-xl">
            {service.shortLine}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
            {service.description}
          </p>

          <ul className="mt-6 grid gap-3">
            {service.usps.map((u) => (
              <li key={u} className="flex items-start gap-2.5 text-sm sm:text-base">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-brand text-white">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-foreground/85">{u}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            {service.key === "happilife" ? (
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-gradient-brand px-7 text-white shadow-glow transition hover:opacity-95"
                >
                  <V2Link to="/assessment">
                    {getHappiLifePrimaryCta()}
                  </V2Link>
                </Button>
                {assessmentPhase !== "not-started" && (
                  <a href="https://quizzard.happimynd.com/" target="_blank" rel="noopener noreferrer">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full border-lavender-deep/30 bg-white px-7 text-foreground shadow-soft transition hover:bg-white"
                    >
                      {assessmentPhase === "completed" ? "QUIZZARD" : "Quizzard"}
                    </Button>
                  </a>
                )}
              </div>
            ) : (
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-brand px-7 shadow-glow transition hover:opacity-95"
              >
                <V2Link to={`/services/${service.key}`}>
                  View Plans
                </V2Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Not Sure Where To Begin? */}
      <section className="rounded-[2rem] bg-white/95 p-6 shadow-card sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl text-lavender-deep">Not Sure Where To Begin?</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Different services support different stages of your conscious growth.{" "}
            <span className="hidden sm:inline">
              <span className="underline decoration-lavender-deep decoration-2 font-semibold text-lavender-deep">Hover</span> over a goal to discover the service built for it.
            </span>
            <span className="sm:hidden">
              <span className="underline decoration-lavender-deep decoration-2 font-semibold text-lavender-deep">Click</span> on a goal to discover the service built for it.
            </span>
          </p>
        </div>
        <div className="grid grid-cols-2 place-items-center gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {GOAL_CARDS.map((card) => (
            <GoalFlipCard key={card.goal} card={card} />
          ))}
        </div>
      </section>

      {/* Why HappiMynd */}
      <section className="rounded-[2rem] bg-gradient-lavender/60 p-6 shadow-soft backdrop-blur-xl sm:p-10">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Why choose HappiMynd?</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_HAPPIMYND.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 shadow-soft"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lavender/40 text-lavender-deep">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="text-sm font-medium text-foreground/90">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="rounded-[2rem] bg-gradient-lavender p-6 shadow-card backdrop-blur-xl sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Continue Your Growth Journey</h2>
          <p className="mt-3 text-sm text-foreground/80 sm:text-base">
            Whether you are looking for greater self-awareness, expert guidance, or everyday practices for growth, HappiMynd brings everything together in one connected ecosystem designed to help you move forward with clarity and confidence.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-full bg-gradient-brand px-7 shadow-glow transition hover:opacity-95">
            <V2Link to={`/services/${selected}`}>
              Choose Your Plan
            </V2Link>
          </Button>
        </div>
      </section>
    </DashboardShell>
  );
}
