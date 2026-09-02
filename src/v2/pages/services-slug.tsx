import { useV2Navigate } from "@/v2/lib/router";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { Sparkles, Phone, LifeBuoy, Check, ShieldCheck, Award, Users, Star, TrendingUp, Repeat, HeartHandshake, UserCog, Lock, Info, EyeOff, BadgeCheck, ChevronLeft, ChevronRight, ArrowLeft, Smartphone, Download, Quote } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { Button } from "@/v2/components/ui/button";
import { Input } from "@/v2/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/v2/components/ui/accordion";
import { cn } from "@/v2/lib/utils";
import { cart } from "@/v2/lib/cart-store";
import { toast } from "sonner";
import { BookSessionDialog, type BookServiceContext } from "@/v2/components/book-session-dialog";
import { PaymentBreakdownModal } from "@/v2/components/payment-breakdown-modal";
import { consumeBookingResume } from "@/v2/lib/bookings";
import { getCatalog } from "@/v2/data/service-catalog";
import { payForBundle, fetchPackages, type Package } from "@/v2/lib/website-api";
import { auth } from "@/v2/lib/auth";
import { checkAuthOrRedirect } from "@/v2/lib/auth-guard";
import viewPlansHeroImg from "@/v2/assets/view-plans-mascot.png";
import logoImg from "@/v2/assets/happimynd-logo.png";

const FAQS = [
  {
    q: "What is included in each plan?",
    a: "Every plan includes guided self-reflection, personalized growth tools, and progress tracking. Higher tiers unlock companion support, one-on-one growth conversations, expert-led sessions, and community access.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes. Move to a higher plan at any time and only pay the difference. Your progress and journey carry over seamlessly.",
  },
  {
    q: "How does checkout work?",
    a: "Choose a plan, click Buy Now, and complete a secure payment. Access to your plan is activated instantly inside your HappiMynd dashboard.",
  },
  {
    q: "What is the difference between SOLV and HappiTALK?",
    a: "SOLV is a structured one-on-one growth conversation with a certified growth expert. HappiTALK is therapeutic counselling delivered by a professional psychologist for deeper emotional support.",
  },
  {
    q: "Will I always be connected with the same expert?",
    a: "Yes. We strive to keep you connected with the same expert throughout your journey, helping build trust, continuity, and a deeper understanding of your growth. In the rare event of a change, your new expert will be assigned all your previous journey and they shall carefully review your progress, session history, and reports to ensure a seamless transition and uninterrupted support.",
  },
  {
    q: "Are the sessions confidential?",
    a: "Absolutely. Every conversation, note, and reflection is fully confidential and protected by strict privacy standards.",
  },
  {
    q: "Can I buy a one-off service instead of a plan?",
    a: "Yes. You can book individual SOLV or HappiTALK sessions without committing to a subscription.",
  },
];

export default SharedPricingPage;

type Plan = {
  id: string;
  planId: number;
  name: string;
  price: number;
  /** Original price, shown struck through next to the selling price. */
  mrp?: number;
  billing: string;
  who: string;
  value: string;
  highlight?: boolean;
  badge?: string;
};

const PLANS: Plan[] = [
  {
    id: "starter",
    planId: 35,
    name: "SELF STARTER",
    price: 199,
    billing: "1 Month",
    who: "Best place to begin",
    value: "Best place to begin",
  },
  {
    id: "plus",
    planId: 36,
    name: "BUDDY",
    price: 399,
    billing: "1 Month",
    who: "Adds companion support and more guided help",
    value: "Adds companion support and more guided help",
  },
  {
    id: "q",
    planId: 37,
    name: "BUDDY PLUS",
    price: 799,
    billing: "3 Months",
    who: "Stay consistent with structured growth",
    value: "Stay consistent with structured growth",
  },
  {
    id: "qplus",
    planId: 38,
    name: "CARE 3X",
    price: 1499,
    billing: "3 Months",
    who: "Adds deeper expert support",
    value: "Adds deeper expert support",
  },
  {
    id: "half",
    planId: 39,
    name: "CARE 6X",
    price: 2499,
    mrp: 2999,
    billing: "6 Months",
    who: "Sustained progress with continued support",
    value: "Sustained progress with continued support",
  },
  {
    id: "annual",
    planId: 40,
    name: "CARE 12X",
    price: 8999,
    mrp: 17999,
    billing: "12 Months",
    who: "Complete ecosystem access - best value",
    value: "Complete ecosystem access - best value",
    highlight: true,
    badge: "Best Value",
  },
];

const USPS = [
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: EyeOff, label: "Confidential & Private" },
  { icon: BadgeCheck, label: "Expert-backed Framework" },
  { icon: Repeat, label: "Flexible Subscriptions" },
  { icon: HeartHandshake, label: "Personalized Journey" },
];

const COMPARE_CATEGORIES: {
  name: string;
  items: { label: string; values: (boolean | number | null)[] }[];
}[] = [
    {
      name: "Foundation",
      items: [
        { label: "Access to Assessments", values: [true, true, true, true, true, true] },
        { label: "Daily Guided Self-Reflection - HappiSelf", values: [true, true, true, true, true, true] },
        {
          label: "Expert-curated Learning Resources - HappiLearn",
          values: [true, true, true, true, true, true],
        },
        {
          label: "Short Growth Quizzes & Check-ins",
          values: [true, true, true, true, true, true],
        },
        {
          label: "Private & Confidential experience",
          values: [true, true, true, true, true, true],
        },
      ],
    },
    {
      name: "Personalized Support",
      items: [
        { label: "Personalized Reports", values: [true, true, true, true, true, true] },
        { label: "Conscious Growth Blueprint", values: [false, true, true, true, true, true] },
        { label: "24×7 Expert Chat - HappiBuddy", values: [false, true, true, true, true, true] },
      ],
    },
    {
      name: "Expert Guidance",
      items: [
        {
          label: "One-on-One Growth Conversations - SOLV",
          values: [null, 1, 1, 1, 1, 1],
        },
        {
          label: "Therapist-led Counselling Sessions - HappiTalk",
          values: [null, null, null, 3, 6, 12],
        },
        { label: "Smart Growth Reminders", values: [false, false, false, true, true, true] },
      ],
    },
    {
      name: "Community",
      items: [
        { label: "Live Growth Webinars", values: [false, false, false, true, true, true] },
        { label: "Exclusive HappiVibe Community", values: [false, false, false, true, true, true] },
      ],
    },
  ];

function renderFeatureLabel(label: string) {
  const serviceNames = ["HappiSelf", "HappiLearn", "HappiBuddy", "SOLV", "HappiTalk", "HappiVibe"];
  const regex = new RegExp(`(${serviceNames.join("|")})`, "g");
  const parts = label.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        serviceNames.includes(part) ? (
          <span key={index} className="font-bold text-foreground">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
}

const INCLUDED = [
  {
    title: "Guided self-reflection",
    desc: "Structured prompts that help you understand yourself better.",
  },
  { title: "Personalized growth tools", desc: "Daily practices tuned to where you are today." },
  { title: "Progress tracking", desc: "See how you evolve over weeks and months." },
  { title: "Confidential experience", desc: "Your reflections stay fully private, always." },
  { title: "Access across devices", desc: "Pick up your journey on web or mobile, anywhere." },
  { title: "Clear next steps for growth", desc: "Always know what to do next, without guesswork." },
];

const WHY = [
  {
    icon: Layers,
    title: "One journey. Every stage of your growth.",
    desc: "From quick self-check-ins to expert conversations and therapeutic support, every service is connected to guide your growth-at every step.",
  },
  {
    icon: Sparkles,
    title: "Growth that speaks your language.",
    desc: "With multilingual assessments and experiences designed for diverse users, self-awareness becomes more accessible, personal, and inclusive.",
  },
  {
    icon: HeartHandshake,
    title: "More value. More possibilities.",
    desc: "Access an integrated ecosystem of assessments, learning, self-care, AI guidance, expert coaching, and therapy through thoughtfully designed plans that maximize value at every stage.",
  },
  {
    icon: Sparkles,
    title: "Simple entry, immediate value",
    desc: "No lengthy onboarding - you get useful reflections from day one.",
  },
  {
    icon: UserCog,
    title: "Guided path to self-reliance",
    desc: "Structure that builds your own capacity, not dependency.",
  },
  {
    icon: Award,
    title: "Clarity to move forward",
    desc: "Every interaction ends with something actionable.",
  },
];

const REVIEWS: { name: string; role?: string; text: string }[] = [
  {
    name: "Ritika M.",
    text: "I started with the Growth Starter plan just to explore, but the daily practices and assessments made it much easier to stay consistent. It felt like I was finally investing in myself.",
  },
  {
    name: "Ankit S.",
    text: "The plans are thoughtfully structured. I liked that I could begin with a smaller commitment and move up only when I felt ready. It never felt overwhelming.",
  },
  {
    name: "Neha P.",
    text: "Having everything in one place - from assessments to guided activities - made the experience so much more accessible than trying multiple apps or resources.",
  },
  {
    name: "Rahul K.",
    text: "Growth Plus was the right balance for me. The combination of self-guided tools and expert conversations helped me stay accountable without feeling dependent.",
  },
  {
    name: "Shreya A.",
    text: "I appreciated that the platform focuses on understanding yourself first instead of immediately jumping into solutions. It made every feature feel more meaningful.",
  },
  {
    name: "Vivek R.",
    text: "The Quarterly plan helped me build consistency. Having support spread over a few months made it easier to actually apply what I was learning instead of forgetting it after a week.",
  },
  {
    name: "Priyanshi T.",
    text: "What stood out was the value. Every plan clearly builds on the previous one, so upgrading felt like a natural next step rather than paying for features I didn't need.",
  },
  {
    name: "Karan J.",
    text: "I wasn't sure which plan to choose at first, but the comparison made the decision simple. I knew exactly what I was getting and picked the one that matched my goals.",
  },
  {
    name: "Aditi N.",
    text: "The expert sessions complemented the self-guided journey really well. I could reflect on my own and still reach out whenever I needed a deeper conversation.",
  },
  {
    name: "Saurabh G.",
    text: "It's rare to find a platform where every feature feels connected. The assessments, learning resources and expert support all work together to make personal growth feel achievable.",
  },
];

function Layers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  );
}

const COMPARE_ITEMS = COMPARE_CATEGORIES.flatMap((cat) => cat.items);

function ComparePlansSection({
  plans,
  onBuy,
}: {
  plans: Plan[];
  onBuy: (p: Plan) => void;
}) {
  const scrollTableRef = useRef<HTMLDivElement>(null);

  const scrollToPlan = (planId: string) => {
    const container = scrollTableRef.current;
    const target = document.getElementById(`plan-col-${planId}`);
    if (container && target) {
      const stickyWidth = window.innerWidth < 640 ? 135 : 0;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const targetLeft = target.offsetLeft - stickyWidth - 8;
      const finalScroll = Math.min(maxScroll, Math.max(0, targetLeft));
      container.scrollTo({ left: finalScroll, behavior: "smooth" });
    }
  };

  return (
    <section
      id="compare"
      className="rounded-[2rem] bg-white p-4 shadow-soft border border-lavender/30 sm:p-8"
    >
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl font-bold tracking-tight sm:text-3xl">Compare Growth Plans</h2>
        <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
          Everything you unlock as your journey grows. Compare every plan side by side to choose the
          level of support that is right for you.
        </p>
      </div>

      {/* Mobile Quick Plan Selector Pills */}
      <div className="flex sm:hidden overflow-x-auto gap-1.5 pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {plans.map((p) => (
          <button
            key={p.id}
            onClick={() => scrollToPlan(p.id)}
            className="shrink-0 rounded-full border border-lavender/50 bg-lavender/15 px-3 py-1 text-xs font-semibold text-foreground hover:bg-lavender-deep hover:text-white transition-all cursor-pointer"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div
        ref={scrollTableRef}
        className="w-full overflow-x-auto pt-6 pb-4 px-1 [scrollbar-width:thin] relative"
      >
        <div className="flex gap-2 sm:gap-3 min-w-[980px] lg:min-w-0">
          {/* Left Sticky Column */}
          <div className="sticky left-0 z-20 flex w-[140px] shrink-0 flex-col border-r border-lavender/30 bg-white shadow-md sm:w-[220px] sm:shadow-none sm:border-r-0">
            <div className="flex h-16 items-center px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm">
              Features
            </div>
            <div className="flex h-11 items-center px-2 text-xs font-bold text-foreground border-b border-lavender/30 sm:text-sm">
              Subscription Fee
            </div>
            <div className="flex h-10 items-center px-2 text-xs font-bold text-foreground border-b border-lavender/30 sm:text-sm">
              Validity
            </div>
            {COMPARE_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex h-[58px] items-center px-2 py-1 text-[11px] font-medium leading-snug text-foreground/85 border-b border-lavender/20 sm:text-xs md:text-sm"
              >
                {renderFeatureLabel(item.label)}
              </div>
            ))}
            <div className="h-16" />
          </div>

          {/* Plan Columns (Cards that pop up on hover) */}
          {plans.map((plan, planIndex) => (
            <div
              key={plan.id}
              id={`plan-col-${plan.id}`}
              className="group relative flex w-[135px] shrink-0 flex-col rounded-[2rem] border border-lavender/30 bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-lavender-deep/50 hover:shadow-[0_12px_30px_rgba(139,92,246,0.2)] hover:z-20 sm:min-w-[135px] sm:w-auto sm:flex-1"
            >
              {/* Plan Header */}
              <div className="relative flex h-16 items-center justify-center rounded-t-[2rem] bg-gradient-brand px-2 text-center text-xs font-bold leading-tight text-white transition-all duration-300 group-hover:brightness-105 sm:text-sm">
                <span className="relative z-10">{plan.name}</span>
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-full bg-gradient-brand px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-[0_0_14px_rgba(139,92,246,0.7)] border border-white/90 ring-2 ring-lavender-deep/30 transition-all duration-300 group-hover:scale-105 sm:px-3 sm:text-[10px]">
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex h-11 items-center justify-center gap-1 border-b border-lavender/30 px-1 sm:gap-1.5">
                {plan.mrp && (
                  <span className="text-xs font-semibold text-muted-foreground line-through sm:text-xs">
                    ₹{plan.mrp.toLocaleString()}
                  </span>
                )}
                <span className="text-sm font-extrabold text-foreground sm:text-lg">
                  ₹{plan.price.toLocaleString()}
                </span>
              </div>

              {/* Validity */}
              <div className="flex h-10 items-center justify-center border-b border-lavender/30">
                <span className="text-xs font-semibold text-muted-foreground sm:text-sm">
                  {plan.billing}
                </span>
              </div>

              {/* Feature Values */}
              {COMPARE_ITEMS.map((item) => {
                const value = item.values[planIndex];
                return (
                  <div
                    key={item.label}
                    className="flex h-[58px] items-center justify-center py-1 border-b border-lavender/20"
                  >
                    {value === true ? (
                      <span className="grid h-4.5 w-4.5 place-items-center rounded-full bg-lavender-deep text-white shadow-soft ring-2 ring-lavender/40 sm:h-5 sm:w-5">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </span>
                    ) : value === false || value === null ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-lavender/30" />
                    ) : (
                      <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-lavender-deep/15 px-1.5 text-xs font-bold text-lavender-deep border border-lavender-deep/30 sm:text-sm">
                        {value}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Buy Button */}
              <div className="flex items-center justify-center px-1.5 pb-2.5 pt-1 sm:px-2">
                <Button
                  size="sm"
                  onClick={() => onBuy(plan)}
                  className="w-full rounded-full bg-gradient-brand text-xs font-bold text-white shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-[0_0_18px_rgba(139,92,246,0.65)] hover:brightness-110 active:scale-95 cursor-pointer px-2 py-1.5"
                >
                  Buy Plan
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs sm:text-sm font-medium text-foreground/80 leading-relaxed w-full">
        *Experts in HappiTALK sessions within plans are allocated by HappiMynd. SOLV sessions are
        thoughtfully matched with an expert from our psychologist panel.
      </p>
    </section>
  );
}

const GROWTH_PACKAGE_IDS = new Set([17, 18, 19, 20, 21, 22]);

function SharedPricingPage() {
  const navigate = useV2Navigate();
  const { slug } = useParams();
  const [reviewIdx, setReviewIdx] = useState(0);
  const [isReviewPaused, setIsReviewPaused] = useState(false);
  const [whyPageIndex, setWhyPageIndex] = useState(0);
  const [isWhyPaused, setIsWhyPaused] = useState(false);
  const [apiPackages, setApiPackages] = useState<Package[]>([]);

  // Fetch growth packages dynamically from GET /api/v1/packages
  useEffect(() => {
    fetchPackages().then((pkgs) => {
      if (pkgs && pkgs.length > 0) setApiPackages(pkgs);
    }).catch(() => {});
  }, []);

const VALIDITY_MAP: Record<number, string> = {
  17: "1 Month",
  18: "1 Month",
  19: "3 Months",
  20: "3 Months",
  21: "6 Months",
  22: "12 Months",
};

  const dynamicPlans: Plan[] = useMemo(() => {
    const growth = apiPackages.filter((pkg) => GROWTH_PACKAGE_IDS.has(pkg.id));
    if (growth.length === 0) return PLANS;
    return growth.map((pkg) => {
      const plan = pkg.plans?.[0];
      const sellingPrice = plan?.selling_price ?? plan?.price ?? 0;
      const mrp = plan?.price && plan.price > sellingPrice ? plan.price : undefined;
      const rawDuration = plan?.duration?.name;
      const durationName = (rawDuration && rawDuration !== "Onetime pay")
        ? rawDuration
        : (VALIDITY_MAP[pkg.id] ?? "1 Month");
      const isBestValue = pkg.name.toUpperCase().includes("12X");
      return {
        id: String(pkg.id),
        planId: plan?.id ?? 12,
        name: pkg.name,
        price: sellingPrice,
        mrp,
        billing: durationName,
        who: pkg.description || "Growth plan",
        value: pkg.description || "Growth plan",
        highlight: isBestValue,
        badge: isBestValue ? "Best Value" : undefined,
      };
    });
  }, [apiPackages]);

  // Unified Booking Flow dialog state
  const [bookOpen, setBookOpen] = useState(false);
  const [bookingServiceContext, setBookingServiceContext] = useState<BookServiceContext | null>(null);

  // Payment breakdown modal state
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [selectedPlanForBreakdown, setSelectedPlanForBreakdown] = useState<Plan | null>(null);
  const [buyingPlanId, setBuyingPlanId] = useState<number | null>(null);

  // Reopen the booking dialog when the visitor returns from login mid-booking
  useEffect(() => {
    if (consumeBookingResume()) setBookOpen(true);
  }, []);

  // Auto-scroll 'Why Choose HappiMynd' 3-item pages every 4 seconds
  useEffect(() => {
    if (isWhyPaused) return;
    const timer = setInterval(() => {
      setWhyPageIndex((p) => (p === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(timer);
  }, [isWhyPaused]);

  // Auto-scroll reviews carousel every 4 seconds unless hovered/touched
  useEffect(() => {
    if (isReviewPaused) return;
    const timer = setInterval(() => {
      setReviewIdx((i) => (i + 1) % REVIEWS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isReviewPaused]);

  // Auto-scroll 'What's included in every plan' cards on mobile
  const includedScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = includedScrollRef.current;
    if (!el) return;

    let isPaused = false;
    const handlePause = () => {
      isPaused = true;
    };
    const handleResume = () => {
      isPaused = false;
    };

    el.addEventListener("mouseenter", handlePause);
    el.addEventListener("mouseleave", handleResume);
    el.addEventListener("touchstart", handlePause, { passive: true });
    el.addEventListener("touchend", handleResume, { passive: true });

    const interval = setInterval(() => {
      if (isPaused || !el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 240, behavior: "smooth" });
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      el.removeEventListener("mouseenter", handlePause);
      el.removeEventListener("mouseleave", handleResume);
      el.removeEventListener("touchstart", handlePause);
      el.removeEventListener("touchend", handleResume);
    };
  }, []);

  const buyPlan = (p: Plan) => {
    if (!checkAuthOrRedirect(navigate, `/services/${slug}`, "Please log in to purchase a plan.")) {
      return;
    }
    setSelectedPlanForBreakdown(p);
    setBreakdownOpen(true);
  };

  const handleExecutePlanPayment = async (couponId?: number) => {
    if (!selectedPlanForBreakdown) return;
    const p = selectedPlanForBreakdown;
    const catalog = getCatalog(slug);
    const planId = p.planId ?? (parseInt(p.id, 10) || 12);
    const token = auth.get()?.token;

    setBuyingPlanId(planId);

    try {
      // POST /api/v1/payment -> returns hosted Razorpay checkout link
      const res = await payForBundle(
        {
          plan_id: planId,
          amount: p.price,
          coupen_id: couponId ?? 0,
        },
        token,
      );

      console.log("🌐 [Website API] Payment Link Response:", res);

      if (res?.link) {
        toast.success("Redirecting to secure payment gateway…");
        window.location.href = res.link;
        return;
      } else {
        toast.success(`Purchased ${p.name} plan!`);
        setBreakdownOpen(false);
      }
    } catch (err: any) {
      console.warn("Bundle payment notice:", err);
      toast.error(err?.message ?? `Failed to initiate payment for ${p.name}`);
    } finally {
      setBuyingPlanId(null);
    }
  };

  const buyIndividual = (name: string, key: string, price: number) => {
    const serviceKey = key.toLowerCase() === "happitalk" ? "happitalk" : "solv";
    setBookingServiceContext({
      key: serviceKey,
      name: serviceKey === "happitalk" ? "HappiTALK" : "SOLV",
      plan: {
        id: serviceKey === "happitalk" ? "21" : "8",
        name: `${serviceKey === "happitalk" ? "HappiTALK" : "SOLV"} 1:1 Session`,
        price,
        billing: "Per Session",
      },
    });
    setBookOpen(true);
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/services" });
    }
  };

  const nextReview = () => setReviewIdx((i) => (i + 1) % REVIEWS.length);
  const prevReview = () => setReviewIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);

  return (
    <DashboardShell
      header={
        <TopHeaderBar
          title="Start with HappiMynd"
          subtitle="Choose a plan to get started"
          emoji=""
        />
      }
    >
      {/* Back Button */}
      <div className="mb-2">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-foreground/80 shadow-soft border border-white/80 transition hover:bg-white hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 text-lavender-deep" /> Back
        </button>
      </div>

      {/* SECTION 1 — Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-card sm:p-10">
        {/* Mascot sitting cleanly on bottom-right edge */}
        <img
          src={viewPlansHeroImg}
          alt="HappiMynd Services Mascot"
          className="pointer-events-none absolute bottom-0 right-6 hidden h-auto w-[160px] max-h-[92%] object-contain object-bottom md:block xl:right-12 xl:w-[190px]"
        />

        <div className="relative flex flex-col md:max-w-[65%]">
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Begin Your Conscious Growth Journey Today
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Explore plans built for self-reflection, guided support, and long-term growth. Compare
            what is included in each level and choose the plan that fits your growth journey and
            matches your current stage.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {USPS.map((u) => {
              const Icon = u.icon;
              return (
                <span
                  key={u.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-lavender/50 bg-white/70 px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-soft"
                >
                  <Icon className="h-3.5 w-3.5 text-lavender-deep" strokeWidth={2} /> {u.label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3 — What's included in every plan (Auto moving card carousel on mobile) */}
      <section className="rounded-[2rem] bg-white p-5 shadow-card sm:p-8">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-xl font-bold tracking-tight sm:text-3xl">
            What's included in every plan
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
            The baseline you get from day one - before you even consider going deeper.
          </p>
        </div>

        {/* Mobile Auto-scrolling Card Carousel */}
        <div
          ref={includedScrollRef}
          className="flex sm:hidden snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {INCLUDED.map((f) => (
            <div
              key={f.title}
              className="w-[240px] shrink-0 snap-start flex items-start gap-3 rounded-2xl bg-lavender/15 px-4 py-4"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-lavender-deep shadow-soft">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{f.title}</div>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INCLUDED.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3 rounded-2xl bg-lavender/15 px-4 py-4"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-lavender-deep shadow-soft">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{f.title}</div>
                <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — Prefer individual services */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Prefer Individual Services?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a one-on-one session at your pace.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              key: "solv",
              name: "SOLV",
              icon: LifeBuoy,
              price: 599,
              priceLabel: "₹599",
              suffix: "Per Session",
              desc: "One-on-one growth conversation with a certified growth expert.",
            },
            {
              key: "happitalk",
              name: "HappiTALK",
              icon: Phone,
              price: 999,
              priceLabel: "₹999 onwards",
              suffix: "Per Session",
              desc: "Therapeutic counselling with a professional psychologist.",
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.key} className="flex flex-col rounded-3xl bg-white p-6 shadow-soft">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-base font-semibold">{s.name}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{s.priceLabel}</span>
                  <span className="text-xs text-muted-foreground">+ Taxes · {s.suffix}</span>
                </div>
                <Button
                  onClick={() => buyIndividual(s.name, s.key, s.price)}
                  className="mt-5 rounded-full bg-gradient-brand text-white shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-[0_0_18px_rgba(139,92,246,0.65)] hover:brightness-110 active:scale-95 cursor-pointer font-bold"
                >
                  Book Now
                </Button>
              </div>
            );
          })}
        </div>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          <li>Individual HappiTALK bookings let you choose your psychologist.</li>
          <li>
            SOLV sessions are thoughtfully matched with an expert from our psychologist panel.
          </li>
        </ul>
      </section>

      {/* SECTION 5 — Compare Plans */}
      <ComparePlansSection plans={dynamicPlans} onBuy={buyPlan} />

      {/* SECTION 6 — Why choose HappiMynd */}
      <section
        onMouseEnter={() => setIsWhyPaused(true)}
        onMouseLeave={() => setIsWhyPaused(false)}
        onTouchStart={() => setIsWhyPaused(true)}
        onTouchEnd={() => setIsWhyPaused(false)}
      >
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Why Choose HappiMynd?</h2>
            <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
              What makes this feel different from every other platform
            </p>
          </div>
          {/* Controls visible on mobile */}
          <div className="flex gap-2 sm:hidden">
            <button
              onClick={() => setWhyPageIndex((p) => (p === 0 ? 1 : 0))}
              className="grid h-8 w-8 place-items-center rounded-full border border-lavender/50 bg-white/70 text-lavender-deep hover:bg-lavender/20 cursor-pointer transition-transform active:scale-95"
              aria-label="Previous why page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setWhyPageIndex((p) => (p === 0 ? 1 : 0))}
              className="grid h-8 w-8 place-items-center rounded-full border border-lavender/50 bg-white/70 text-lavender-deep hover:bg-lavender/20 cursor-pointer transition-transform active:scale-95"
              aria-label="Next why page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop View: All 6 cards in grid (Same as before) */}
        <div className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                className="flex items-start gap-3 rounded-3xl bg-white p-5 shadow-soft"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-lavender/40 text-lavender-deep">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{t.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View: 3 items per page slider */}
        <div className="sm:hidden overflow-hidden rounded-3xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${whyPageIndex * 100}%)` }}
          >
            {/* Page 1 (Items 0, 1, 2) */}
            <div className="w-full shrink-0 flex flex-col gap-3">
              {WHY.slice(0, 3).map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.title}
                    className="flex items-start gap-3 rounded-3xl bg-white/85 p-4 shadow-soft"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-lavender/40 text-lavender-deep">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{t.title}</div>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Page 2 (Items 3, 4, 5) */}
            <div className="w-full shrink-0 flex flex-col gap-3">
              {WHY.slice(3, 6).map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.title}
                    className="flex items-start gap-3 rounded-3xl bg-white/85 p-4 shadow-soft"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-lavender/40 text-lavender-deep">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{t.title}</div>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Page Indicator Dots */}
        <div className="mt-4 flex sm:hidden items-center justify-center gap-2">
          {[0, 1].map((page) => (
            <button
              key={page}
              onClick={() => setWhyPageIndex(page)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                page === whyPageIndex
                  ? "w-6 bg-lavender-deep shadow-glow"
                  : "w-2 bg-lavender/50 hover:bg-lavender-deep/50",
              )}
              aria-label={`Go to why page ${page + 1}`}
            />
          ))}
        </div>
      </section>

      {/* SECTION 7 — Credibility */}
      <section className="rounded-[2rem] bg-gradient-to-br from-lavender/30 via-white to-white p-5 shadow-card sm:p-10">
        <div className="mb-4 text-center sm:mb-8">
          <h2 className="text-xl font-bold tracking-tight sm:text-3xl text-foreground">
            Let's Grow Consciously Together
          </h2>
          <p className="mx-auto mt-1 max-w-2xl text-xs text-muted-foreground sm:mt-2 sm:text-base">
            Join lakhs of people choosing HappiMynd for better life.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4 sm:gap-6">
          {[
            { stat: "2L+", label: "Platform Users", icon: Users },
            { stat: "4.7", label: "User Rating", icon: Star },
            { stat: "91%", label: "Adoption Rate", icon: TrendingUp },
            { stat: "No.1", label: "Most Reviewed Platform", icon: Award },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center rounded-2xl bg-white/90 p-3.5 shadow-soft border border-lavender/30 sm:p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-card"
              >
                <div className="mb-1.5 grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-white shadow-soft sm:h-11 sm:w-11 sm:mb-2.5">
                  <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" strokeWidth={2.5} />
                </div>
                <div className="bg-gradient-brand bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-4xl lg:text-5xl">
                  {s.stat}
                </div>
                <div className="mt-1 text-xs font-bold text-foreground sm:mt-2.5 sm:text-base">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 8 — Reviews */}
      <section
        onMouseEnter={() => setIsReviewPaused(true)}
        onMouseLeave={() => setIsReviewPaused(false)}
        onTouchStart={() => setIsReviewPaused(true)}
        onTouchEnd={() => setIsReviewPaused(false)}
        className="rounded-[2rem] bg-white p-5 shadow-card sm:p-10"
      >
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What People Say</h2>
            <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
              Real experiences from people who trust HappiMynd
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevReview}
              className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-lavender/50 bg-white/70 text-lavender-deep hover:bg-lavender/20 cursor-pointer transition-transform active:scale-95"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextReview}
              className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-lavender/50 bg-white/70 text-lavender-deep hover:bg-lavender/20 cursor-pointer transition-transform active:scale-95"
              aria-label="Next review"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop View: Smooth 3-card sliding carousel */}
        <div className="hidden sm:block overflow-hidden rounded-3xl">
          <div
            className="flex transition-transform duration-500 ease-out -mx-2"
            style={{ transform: `translateX(-${(reviewIdx * 100) / 3}%)` }}
          >
            {[...REVIEWS, ...REVIEWS.slice(0, 3)].map((r, idx) => (
              <div key={`${r.name}-${idx}`} className="w-1/3 shrink-0 px-2">
                <div className="h-full flex flex-col justify-between rounded-3xl bg-lavender/15 p-6 transition-all duration-300 hover:bg-lavender/25">
                  <div>
                    <Quote className="h-5 w-5 text-lavender-deep" />
                    <p className="mt-3 text-sm text-foreground/85 leading-relaxed">"{r.text}"</p>
                  </div>
                  <div className="mt-5 flex items-center gap-3 text-xs">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-white text-xs font-bold shadow-soft">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-sm">{r.name}</div>
                      {r.role && r.role.trim() !== "" && (
                        <div className="text-xs text-muted-foreground">{r.role}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View: Single review card slider */}
        <div className="sm:hidden overflow-hidden rounded-3xl bg-lavender/15">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${reviewIdx * 100}%)` }}
          >
            {REVIEWS.map((r) => (
              <div key={r.name} className="w-full shrink-0 flex flex-col justify-between p-6">
                <div>
                  <Quote className="h-6 w-6 text-lavender-deep" />
                  <p className="mt-3 text-base font-medium leading-relaxed text-foreground/90">
                    "{r.text}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-xs font-bold text-white shadow-soft">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{r.name}</div>
                    {r.role && r.role.trim() !== "" && (
                      <div className="text-xs text-muted-foreground">{r.role}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicator Dots for Desktop and Mobile */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setReviewIdx(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                i === reviewIdx
                  ? "w-6 bg-lavender-deep shadow-glow"
                  : "w-2 bg-lavender/50 hover:bg-lavender-deep/50",
              )}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* SECTION 9 — App download */}
      <section className="rounded-[2rem] bg-gradient-to-br from-white via-lavender/20 to-white p-5 shadow-card sm:p-10">
        <div className="grid gap-6 md:grid-cols-[1fr_260px] md:items-center">
          <div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-lavender/40 px-3.5 py-1 text-xs font-semibold text-lavender-deep">
              <Smartphone className="h-3.5 w-3.5" /> Mobile App
            </span>
            <h2 className="mt-3 text-xl font-bold tracking-tight sm:text-3xl">
              Unlock Growth Everywhere
            </h2>
            <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
              Download the app to stay connected to your journey wherever you are.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs sm:text-sm">
              {[
                "24/7 Buddy Support",
                "Access Our Valuable Resources",
                "Earn Points and\u00a0 Get Exciting Rewards",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-lavender-deep shrink-0" strokeWidth={2.5} /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button className="rounded-full bg-gradient-brand text-xs sm:text-sm text-white shadow-glow hover:opacity-95">
                <Download className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Download the App
              </Button>
            </div>
          </div>
          {/* Mobile phone mockup with white background and centered HappiMynd logo */}
          <div className="mx-auto flex h-[360px] w-[180px] flex-col justify-between overflow-hidden rounded-[2.5rem] border-[7px] border-slate-900 bg-white p-3 shadow-card relative">
            {/* Top Speaker / Notch Pill */}
            <div className="mx-auto h-3 w-16 shrink-0 rounded-full bg-slate-900 mb-2" />

            {/* Centered HappiMynd Logo */}
            <div className="flex flex-1 flex-col items-center justify-center px-1 text-center">
              <img
                src={logoImg}
                alt="HappiMynd Logo"
                className="h-auto max-h-24 w-auto max-w-[155px] object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Bottom Home Indicator */}
            <div className="mx-auto h-1 w-12 shrink-0 rounded-full bg-slate-300 mt-2" />
          </div>
        </div>
      </section>

      {/* SECTION 10 — Important Notes */}
      <section className="rounded-[2rem] border border-lavender/50 bg-lavender/15 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-lavender-deep shadow-soft">
            <Info className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <div className="text-base font-semibold">Important notes</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/85">
              <li>
                Experts in HappiTALK sessions within subscription plans are allocated by HappiMynd.
              </li>
              <li>
                SOLV sessions are thoughtfully matched with an expert from our psychologist panel.
              </li>
              <li>Individual HappiTALK bookings let you choose your psychologist.</li>
              <li>All subscription fees are exclusive of applicable taxes.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-[2rem] bg-white p-6 shadow-card sm:p-10">
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything you might want to know before choosing a plan.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-lavender/40 last:border-0"
            >
              <AccordionTrigger className="text-left text-sm font-semibold sm:text-base">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <span className="hidden">
        <Users /> <Lock /> <ShieldCheck />
      </span>

      <BookSessionDialog
        open={bookOpen}
        onOpenChange={setBookOpen}
        service={bookingServiceContext}
      />

      {selectedPlanForBreakdown && (
        <PaymentBreakdownModal
          open={breakdownOpen}
          onOpenChange={setBreakdownOpen}
          itemName={selectedPlanForBreakdown.name}
          itemDescription={selectedPlanForBreakdown.value || `${selectedPlanForBreakdown.name} Plan`}
          basePrice={selectedPlanForBreakdown.price}
          planId={selectedPlanForBreakdown.planId ?? (parseInt(selectedPlanForBreakdown.id, 10) || 12)}
          onConfirmPayment={handleExecutePlanPayment}
          isLoading={buyingPlanId === (selectedPlanForBreakdown.planId ?? (parseInt(selectedPlanForBreakdown.id, 10) || 12))}
        />
      )}
    </DashboardShell>
  );
}
