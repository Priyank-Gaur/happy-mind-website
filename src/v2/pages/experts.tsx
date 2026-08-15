import { useV2Navigate } from "@/v2/lib/router";
import { useMemo, useState, useEffect } from "react";
import { Search, ShieldCheck, BadgeCheck, Lock, UserCheck, MapPin, Languages as LanguagesIcon, CalendarCheck, Star, Sparkles, ChevronDown, ArrowRight, Check, LoaderCircle } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { Button } from "@/v2/components/ui/button";
import { Input } from "@/v2/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/v2/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/v2/components/ui/dialog";
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
import { getPendingBooking, clearPendingBooking } from "@/v2/lib/bookings";
import {
  CONCERNS,
  SESSION_PACKS,
  type Psychologist,
  type PsychologistPlan,
} from "@/v2/data/psychologists";
import {
  fetchPsychologists,
  payForHappiTalk,
  type ApiPsychologist,
  type PsychologistFilters,
} from "@/v2/lib/website-api";
import { auth } from "@/v2/lib/auth";

export default ExpertsPage;

const TRUST = [
  { icon: ShieldCheck, label: "RCI Registered Experts Available" },
  { icon: BadgeCheck, label: "Verified Mental Health Professionals" },
  { icon: Lock, label: "100% Confidential Sessions" },
  { icon: UserCheck, label: "Choose Your Own Psychologist" },
];


const inr = (n: unknown) => {
  const num = typeof n === "number" ? n : typeof n === "string" ? parseInt(n, 10) : 0;
  return `₹${(isNaN(num) ? 0 : num).toLocaleString("en-IN")}`;
};

function initials(name: unknown) {
  const str = typeof name === "string" ? name : "";
  return str
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase() || "?";
}

function getPsychologistLanguages(p: Psychologist): string[] {
  if (p.languages && p.languages.length > 0) return p.languages;
  return ["English", "Hindi"];
}

function normalizeFilterArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "number") return String(item);
      if (typeof item === "object" && item !== null) {
        const obj = item as Record<string, unknown>;
        return String(obj.name ?? obj.title ?? obj.label ?? obj.value ?? "");
      }
      return "";
    })
    .filter(Boolean);
}

function parseSummaryDetails(summary: string) {
  let experience = 0;
  const education: string[] = [];
  let approach = "";
  let helps = "";

  if (!summary) return { experience, education, approach, helps };

  // 1. Extract Experience years from summary
  const expMatch =
    summary.match(/(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp|in\s*counseling|in\s*psychology|counseling|therapy)/i) ||
    summary.match(/(?:experience|exp)\s*(?:of\s*)?(\d+)\+?\s*years?/i);
  if (expMatch && expMatch[1]) {
    experience = parseInt(expMatch[1], 10) || 0;
  }

  // 2. Extract Education / Degrees mentioned in summary
  const eduMatches = summary.match(/(?:Master's|Bachelor's|M\.?Phil|Ph\.?D|PG Diploma|M\.?A\.?|B\.?A\.?|M\.?Sc\.?|PGD)(?:[^.,;\n]+)/gi);
  if (eduMatches) {
    eduMatches.forEach((m) => {
      const cleaned = m.trim().replace(/^with\s+/i, "").replace(/\.\s*$/, "");
      if (cleaned && !education.includes(cleaned)) {
        education.push(cleaned);
      }
    });
  }

  // 3. Extract Approach / Techniques mentioned in summary
  const approachMatch =
    summary.match(/(?:techniques|approaches|modalities|frameworks)\s+(?:like|such as|including)?\s*([^.]+)/i) ||
    summary.match(/(?:using|incorporating|utilizing)\s+(?:techniques|approaches)?\s*([^.]+)/i);
  if (approachMatch && approachMatch[1]) {
    approach = approachMatch[1].trim();
  }

  // 4. Extract Who They Usually Help / Audience mentioned in summary
  const helpsMatch =
    summary.match(/(?:counseling|support|therapy|counselling)\s+to\s+([^.]+)/i) ||
    summary.match(/(?:helps|works with|deals with|assists)\s+([^.]+)/i);
  if (helpsMatch && helpsMatch[1]) {
    helps = helpsMatch[1].trim();
  }

  return { experience, education, approach, helps };
}

function matchesConcern(specializations: string[], selectedConcern: string): boolean {
  if (selectedConcern === "All") return true;
  const text = specializations.join(" ").toLowerCase();

  switch (selectedConcern) {
    case "Anxiety & Stress":
      return /anxiety|stress|phobia|panic|ocd|worry/i.test(text);
    case "Depression & Mood":
      return /depression|mood|bipolar|sadness|dysthymia|emotional/i.test(text);
    case "Relationship & Marriage":
      return /relationship|marriage|couple|marital|divorce|interpersonal|partner/i.test(text);
    case "Career & Growth":
      return /career|growth|work|academic|time management|goal|employee|counselling/i.test(text);
    case "Self-Esteem":
      return /self-esteem|self-image|confidence|self work|self-harm|self development/i.test(text);
    case "Trauma & Grief":
      return /trauma|grief|abuse|ptsd|loss/i.test(text);
    case "Family & Parenting":
      return /family|parenting|parental|child|adolescent|children/i.test(text);
    default:
      return text.includes(selectedConcern.toLowerCase());
  }
}

function matchesCity(psychologistCity: string, selectedCity: string): boolean {
  if (selectedCity === "All") return true;
  const pCity = (psychologistCity || "").toLowerCase();
  const sCity = selectedCity.toLowerCase();
  if (pCity.includes(sCity) || sCity.includes(pCity)) return true;

  if (sCity === "delhi" && (pCity.includes("delhi") || pCity.includes("gurgaon") || pCity.includes("gurugram"))) return true;
  if (sCity === "gurgaon" && (pCity.includes("gurgaon") || pCity.includes("gurugram"))) return true;
  if (sCity === "jaipur" && pCity.includes("jaipur")) return true;
  if (sCity === "mumbai" && (pCity.includes("mumbai") || pCity.includes("byculla"))) return true;

  return false;
}

function getAvailabilityDetails(p: Psychologist) {
  const rawAvail = (p.availability || "").trim();
  const lower = rawAvail.toLowerCase();
  const languagesList = getPsychologistLanguages(p).join(", ");

  let modeText = "Available for Online Sessions (via HappiTALK)";
  let modeBadge = "Online Sessions";
  let clinicAddress: string | null = null;

  if (
    lower.includes("dont take offline") ||
    lower.includes("no offline") ||
    lower.includes("no offlline")
  ) {
    modeText = "Available for Online Sessions Only (via HappiTALK)";
    modeBadge = "Online Only";
  } else if (lower === "online" || lower.startsWith("online,")) {
    modeText = "Available for Online Sessions Only (via HappiTALK)";
    modeBadge = "Online Only";
    if (rawAvail.includes(",")) {
      const extra = rawAvail.substring(rawAvail.indexOf(",") + 1).trim();
      if (extra) clinicAddress = extra;
    }
  } else if (
    rawAvail &&
    !["1000", "1200"].includes(rawAvail) &&
    !rawAvail.startsWith("English") &&
    !rawAvail.startsWith("Mon") &&
    !rawAvail.startsWith("Tues") &&
    !rawAvail.startsWith("8am")
  ) {
    modeText = "Available for Both Online & Offline Sessions";
    modeBadge = "Online & Offline";
    clinicAddress = rawAvail;
  } else if (rawAvail.startsWith("Mon") || rawAvail.startsWith("Tues") || rawAvail.startsWith("8am")) {
    modeText = "Available for Online & Offline Sessions";
    modeBadge = "Online & Offline";
    clinicAddress = `Schedule: ${rawAvail}`;
  } else {
    modeText = "Available for Online Sessions (via HappiTALK)";
    modeBadge = "Online Sessions";
  }

  return { languagesList, modeText, modeBadge, clinicAddress };
}

function ExpertsPage() {
  const navigate = useV2Navigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [concern, setConcern] = useState<string>("All");
  const [language, setLanguage] = useState<string>("All");
  const [city, setCity] = useState<string>("All");
  const [booking, setBooking] = useState<Psychologist | null>(null);

  // API state
  const [apiPsychologists, setApiPsychologists] = useState<ApiPsychologist[]>([]);
  const [apiFilters, setApiFilters] = useState<PsychologistFilters>({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch from API (re-runs when search/filter params change)
  useEffect(() => {
    setLoading(true);
    setApiError(null);
    fetchPsychologists({
      search: query || undefined,
      city: city !== "All" ? city : undefined,
      expert_category: category !== "All" ? category : undefined,
      language: language !== "All" ? language : undefined,
      limit: 100,
    })
      .then(({ psychologists, filters }) => {
        setApiPsychologists(psychologists);
        setApiFilters(filters);
      })
      .catch((err) => {
        setApiError(err?.message ?? "Failed to load psychologists.");
        toast.error(err?.message ?? "Failed to load psychologists.");
      })
      .finally(() => setLoading(false));
  }, [query, city, category, language]);

  // Map ApiPsychologist -> local Psychologist shape for re-use in existing card/dialog components
  const mappedPsychologists: Psychologist[] = apiPsychologists.map((ap) => {
    // Helper: extract a plain string from either a string or a DB relation object {id, name, ...}
    const extractStr = (v: unknown): string => {
      if (!v) return "";
      if (typeof v === "string") return v;
      if (typeof v === "number") return String(v);
      if (typeof v === "object" && v !== null) {
        const obj = v as Record<string, unknown>;
        return String(obj.name ?? obj.title ?? obj.label ?? obj.value ?? "");
      }
      return "";
    };

    const parseLanguages = (v: unknown): string[] => {
      if (!v) return ["English", "Hindi"];
      if (Array.isArray(v)) return v.map(extractStr).filter(Boolean);
      if (typeof v === "string") {
        return v.split(/[,&]|\band\b/i).map((s) => s.trim()).filter(Boolean);
      }
      if (typeof v === "object" && v !== null) {
        const str = extractStr(v);
        return str ? str.split(/[,&]|\band\b/i).map((s) => s.trim()).filter(Boolean) : ["English", "Hindi"];
      }
      return ["English", "Hindi"];
    };

    const parseSpecializations = (v: unknown): string[] => {
      if (!v) return [];
      if (Array.isArray(v)) return v.map(extractStr).filter(Boolean);
      if (typeof v === "string") {
        const parts = v.split(/[,&]|\band\b/i).map((s) => s.trim()).filter(Boolean);
        return parts.length > 0 ? parts : [v];
      }
      if (typeof v === "object" && v !== null) {
        const str = extractStr(v);
        return str ? str.split(/[,&]|\band\b/i).map((s) => s.trim()).filter(Boolean) : [];
      }
      return [];
    };

    // Price: minimum_session_price or min_price
    const rawPrice =
      ap.minimum_session_price ??
      (ap as any).min_price ??
      (ap as any).starting_price ??
      0;
    const price =
      typeof rawPrice === "number"
        ? rawPrice
        : typeof rawPrice === "string"
          ? parseInt(rawPrice, 10) || 0
          : typeof rawPrice === "object" && rawPrice !== null && "price" in rawPrice
            ? parseInt(String((rawPrice as any).price), 10) || 0
            : 0;

    const bioText = extractStr((ap as any).summary ?? (ap as any).bio ?? (ap as any).about ?? (ap as any).description);
    const summaryDetails = parseSummaryDetails(bioText);

    const slot1Obj = ap.slot1 as any;
    const slot1Availability = slot1Obj && typeof slot1Obj === "object" && slot1Obj.days ? `${slot1Obj.days} (${slot1Obj.time ?? ""})` : "";
    const availabilityStr = slot1Availability || extractStr((ap as any).availability) || "Available for Online Sessions";

    const parsePlans = (rawPlans: unknown): PsychologistPlan[] => {
      if (!rawPlans || typeof rawPlans !== "object") return [];
      const planObjs = Array.isArray(rawPlans) ? rawPlans : Object.values(rawPlans);
      return planObjs
        .filter(Boolean)
        .map((pObj: any) => {
          const custom = pObj.psychologist_custom_price || {};
          const sellingPrice = Number(custom.selling_price ?? pObj.price ?? pObj.cost_price ?? 0);
          const costPrice = Number(custom.cost_price ?? pObj.cost_price ?? pObj.price ?? 0);
          const sessionSellingPrice = Number(pObj.session_selling_price ?? sellingPrice);
          const discount = Number(custom.discount ?? pObj.discount ?? 0);

          return {
            id: Number(pObj.id ?? pObj.plan_id),
            printDuration: String(pObj.print_duration ?? "Session"),
            price: sellingPrice,
            costPrice,
            sessionSellingPrice,
            discount,
          };
        })
        .sort((a, b) => a.price - b.price);
    };

    return {
      id: String(ap.id),
      name: extractStr(ap.full_name ?? (ap as any).name),
      designation: extractStr(ap.expert_level ?? (ap as any).designation ?? (ap as any).expert_category),
      city: extractStr(ap.city),
      languages: parseLanguages(ap.languages),
      specializations: parseSpecializations(ap.specialization ?? (ap as any).specializations),
      bio: bioText,
      experience: Number(extractStr((ap as any).experience)) || summaryDetails.experience,
      availability: availabilityStr,
      category: extractStr(ap.expert_level ?? (ap as any).category ?? (ap as any).expert_category),
      premium: Boolean((ap as any).premium) || extractStr(ap.expert_level).toLowerCase().includes("premium"),
      rci: Boolean((ap as any).rci) || extractStr(ap.expert_level).toLowerCase().includes("rci"),
      startingFrom: price,
      education: (ap as any).education ? parseSpecializations((ap as any).education) : summaryDetails.education,
      experienceDetail: (ap as any).experience_detail ? parseSpecializations((ap as any).experience_detail) : [],
      approach: extractStr((ap as any).approach) || summaryDetails.approach,
      helps: extractStr((ap as any).helps) || summaryDetails.helps,
      summary: bioText,
      photo: ap.profile_picture_url || (ap as any).photo,
      slot1: ap.slot1,
      slot2: ap.slot2,
      plans: parsePlans(ap.plans),
    };
  });

  // Filter IDs for filter dropdowns
  const filterCities = ["All", ...normalizeFilterArray(apiFilters.cities)];
  const filterLanguages = ["All", ...normalizeFilterArray(apiFilters.languages)];
  const filterCategories = ["All", ...normalizeFilterArray(apiFilters.expert_levels)];
  const filterApiConcerns = ["All", ...normalizeFilterArray(apiFilters.specializations)];
  const filterConcerns = filterApiConcerns.length > 1 ? filterApiConcerns : ["All", ...CONCERNS];

  // Client-side concern filter (not supported as a query param yet)
  const filtered = useMemo(() => {
    if (concern === "All") return mappedPsychologists;
    return mappedPsychologists.filter((p) => matchesConcern(p.specializations, concern));
  }, [mappedPsychologists, concern]);

  const reset = () => {
    setQuery("");
    setCategory("All");
    setConcern("All");
    setLanguage("All");
    setCity("All");
  };



  const recommended = useMemo(() => {
    if (concern === "All") return [];
    return filtered.filter((p) => matchesConcern(p.specializations, concern)).slice(0, 4);
  }, [filtered, concern]);

  const recommendedIds = useMemo(() => new Set(recommended.map((p) => p.id)), [recommended]);
  const rest = useMemo(
    () => filtered.filter((p) => !recommendedIds.has(p.id)),
    [filtered, recommendedIds],
  );

  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    setVisibleCount(10);
  }, [query, category, concern, language, city]);

  const visibleRest = useMemo(
    () => rest.slice(0, visibleCount),
    [rest, visibleCount],
  );

  const [bookOpen, setBookOpen] = useState(false);
  const [bookingServiceContext, setBookingServiceContext] = useState<BookServiceContext | null>(
    null,
  );

  const bookPack = async (
    p: Psychologist,
    pack: { id: string | number; label: string; price: number; billing: string },
  ) => {
    setBooking(null);
    const pending = getPendingBooking();

    if (pending && pending.slot1) {
      // Step 2 complete: preferred slots were ALREADY selected!
      // Direct call to payForHappiTalk payment API with saved slot date & time
      const token = auth.get()?.token;
      const planId = Number(pack.id) || 21;
      const amount = pack.price;
      const dateStr = pending.slot1.dateFormatted;
      const timeStr = pending.slot1.slot;

      clearPendingBooking();

      try {
        const res = await payForHappiTalk(
          {
            psychologist_id: Number(p.id),
            plan_id: planId,
            amount,
            date: dateStr,
            time: timeStr,
            session: 1,
            user_recording_permission: 1,
          },
          token,
        );

        console.log("🌐 [Website API] Payment Link Response:", res);

        if (res?.link) {
          toast.success("Redirecting to secure payment gateway…");
          window.location.href = res.link;
          return;
        } else {
          toast.success(`Booking Confirmed for ${p.name}!`);
        }
      } catch (err: any) {
        console.warn("Payment API notice:", err);
        toast.error(err?.message ?? `Failed to initiate booking for ${p.name}`);
      }

      const orderId = "HM-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      const purchased = `HappiTALK - Session with ${p.name} (${pack.label})`;
      const plan = `${pack.label} (${p.name})`;

      cart.clear();
      navigate({
        to: "/checkout/success",
        search: { orderId, purchased, plan, date: dateStr, slot: timeStr },
      });
    } else {
      // No slots selected yet — open slot picker for this psychologist + selected pack
      setBookingServiceContext({
        key: "happitalk",
        name: "HappiTALK",
        initialPsychologist: p,
        plan: {
          id: String(pack.id),
          name: pack.label,
          price: pack.price,
          billing: pack.billing,
        },
        initialStep: "form",
      });
      setBookOpen(true);
    }
  };

  const pendingBooking = useMemo(() => getPendingBooking(), [bookOpen]);

  const getPsychologistPlans = (p: Psychologist | null): PsychologistPlan[] => {
    if (!p) return [];

    const basePrice = p.startingFrom > 0 ? p.startingFrom : 999;
    let rawPlans: PsychologistPlan[] = p.plans && p.plans.length > 0 ? [...p.plans] : [];

    if (rawPlans.length === 0) {
      rawPlans = [
        {
          id: 1,
          printDuration: "1 Session",
          price: basePrice,
          costPrice: basePrice,
          sessionSellingPrice: basePrice,
          discount: 0,
        },
        {
          id: 2,
          printDuration: "2 Sessions",
          price: Math.round(basePrice * 2 * 0.9),
          costPrice: basePrice * 2,
          sessionSellingPrice: Math.round(basePrice * 0.9),
          discount: 10,
        },
        {
          id: 4,
          printDuration: "4 Sessions",
          price: Math.round(basePrice * 4 * 0.8),
          costPrice: basePrice * 4,
          sessionSellingPrice: Math.round(basePrice * 0.8),
          discount: 20,
        },
      ];
    }

    const parsed = rawPlans.map((plan) => {
      let sessions = 1;
      const match = plan.printDuration.match(/(\d+)/);
      if (match) {
        sessions = parseInt(match[1], 10);
      }
      if (sessions <= 0) sessions = 1;
      return { ...plan, sessions };
    });

    const oneSessionPlan =
      parsed.find((pl) => pl.sessions === 1 || /1\s*session|single/i.test(pl.printDuration)) ??
      parsed[0];

    let oneSessionRate = basePrice;
    if (oneSessionPlan) {
      if (oneSessionPlan.sessionSellingPrice > 0) {
        oneSessionRate = oneSessionPlan.sessionSellingPrice;
      } else if (oneSessionPlan.price > 0 && oneSessionPlan.sessions === 1) {
        oneSessionRate = oneSessionPlan.price;
      }
    }
    if (oneSessionRate <= 0) oneSessionRate = basePrice;

    return parsed.map((plan) => {
      const { sessions } = plan;
      let rawSessionRate = plan.sessionSellingPrice;
      let rawPrice = plan.price;
      let rawCost = plan.costPrice;

      let ratePerSession = 0;

      if (sessions === 1) {
        ratePerSession = rawSessionRate > 0 ? rawSessionRate : rawPrice > 0 ? rawPrice : oneSessionRate;
      } else {
        if (rawSessionRate > 0) {
          ratePerSession = rawSessionRate;
        } else if (rawPrice > 0) {
          if (rawPrice <= oneSessionRate * 1.2) {
            ratePerSession = rawPrice;
          } else {
            ratePerSession = Math.round(rawPrice / sessions);
          }
        } else {
          const discountFactor = sessions === 2 ? 0.95 : sessions === 4 ? 0.8 : 0.85;
          ratePerSession = Math.round(oneSessionRate * discountFactor);
        }
      }

      if (ratePerSession <= 0) ratePerSession = oneSessionRate;

      // Strict Rule: total package price is ALWAYS ratePerSession * sessions
      const totalSellingPrice = ratePerSession * sessions;

      // Struck-through MRP benchmark
      const benchmarkTotalMRP = oneSessionRate * sessions;
      const totalCostPrice = Math.max(
        rawCost > totalSellingPrice ? rawCost : 0,
        benchmarkTotalMRP
      );

      // Save %
      let savePct = plan.discount;
      if (totalCostPrice > totalSellingPrice && totalCostPrice > 0) {
        const calculatedSave = Math.round(
          ((totalCostPrice - totalSellingPrice) / totalCostPrice) * 100
        );
        if (calculatedSave > 0) {
          savePct = Math.max(savePct, calculatedSave);
        }
      }

      return {
        id: plan.id,
        printDuration: plan.printDuration,
        price: totalSellingPrice,
        costPrice: totalCostPrice,
        sessionSellingPrice: ratePerSession,
        discount: savePct,
      };
    });
  };

  return (
    <DashboardShell
      header={<TopHeaderBar title="Expert Panel" subtitle="Choose your psychologist" emoji="" />}
    >
      {/* Pending Slots Banner */}
      {pendingBooking && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-lavender-deep/40 bg-gradient-hero p-4 text-xs shadow-soft">
          <div className="flex items-center gap-2.5 font-bold text-lavender-deep">
            <Sparkles className="h-4 w-4 shrink-0 text-lavender-deep" />
            <span>
              Preferred Slots Selected: {pendingBooking.slot1.slot} ({pendingBooking.slot1.dateFormatted}) &amp;{" "}
              {pendingBooking.slot2.slot} ({pendingBooking.slot2.dateFormatted}). Choose your psychologist below to complete booking.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setBookingServiceContext({
                key: "happitalk",
                name: "HappiTALK",
                initialStep: "form",
                initialSlots: {
                  slot1: pendingBooking.slot1,
                  slot2: pendingBooking.slot2,
                },
              });
              setBookOpen(true);
            }}
            className="rounded-full bg-white px-3.5 py-1 text-[11px] font-bold text-lavender-deep shadow-soft border border-lavender/40 hover:bg-lavender/10 cursor-pointer shrink-0 transition-all hover:scale-105"
          >
            Edit Slots
          </button>
        </div>
      )}

      {/* SECTION 1 — Hero */}
      <section className="rounded-[1.75rem] bg-white p-5 shadow-card sm:rounded-[2rem] sm:p-8 lg:p-10">
        <h1 className="text-xl font-bold tracking-tight sm:whitespace-nowrap sm:text-3xl lg:text-4xl xl:text-5xl">
          Choose the Expert That's Right for You
        </h1>
        <p className="mt-3 max-w-2xl text-xs text-muted-foreground sm:mt-4 sm:text-base lg:text-lg">
          Browse our panel of qualified psychologists and filter by your concerns, preferred
          language, city, or expertise to find someone who best fits your needs.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-2.5">
          {TRUST.map((t) => {
            const Icon = t.icon;
            return (
              <span
                key={t.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-lavender/60 bg-white px-3 py-1 text-[11px] font-medium text-foreground/75 shadow-soft sm:px-3.5 sm:py-1.5 sm:text-xs"
              >
                <Icon className="h-3.5 w-3.5 text-lavender-deep shrink-0" strokeWidth={2.2} />
                <span>{t.label}</span>
              </span>
            );
          })}
        </div>
      </section>

      {/* SECTION 2 — Search & Smart Filters */}
      <section className="rounded-[1.75rem] bg-white p-4 shadow-soft sm:rounded-[2rem] sm:p-6 lg:p-7">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:left-5 sm:h-5 sm:w-5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by psychologist name, specialization..."
            className="h-12 rounded-2xl border-border/70 bg-background/60 pl-11 text-xs shadow-none focus-visible:ring-lavender-deep/40 sm:h-14 sm:pl-14 sm:text-sm lg:text-base"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:mt-5">
          <FilterSelect
            label="Expert Category"
            value={category}
            onChange={setCategory}
            options={filterCategories.length > 1 ? filterCategories : ["All"]}
          />
          <FilterSelect
            label="I'm Looking Support For"
            value={concern}
            onChange={setConcern}
            options={filterConcerns}
          />
          <FilterSelect
            label="Language"
            value={language}
            onChange={setLanguage}
            options={filterLanguages.length > 1 ? filterLanguages : ["All"]}
          />
          <FilterSelect label="City" value={city} onChange={setCity} options={filterCities.length > 1 ? filterCities : ["All"]} />
        </div>
      </section>

      {/* Microcopy */}
      <section className="rounded-2xl border border-lavender/50 bg-lavender/15 p-4 sm:rounded-3xl sm:p-5 sm:px-7">
        <div className="text-xs font-semibold sm:text-sm">Not sure who to choose?</div>
        <p className="mt-1 max-w-3xl text-xs text-muted-foreground leading-relaxed sm:text-sm">
          Use the filters to narrow your options, or simply browse our recommendations.&nbsp; Every
          expert on HappiMynd is carefully vetted to ensure quality care.
        </p>
      </section>

      {/* SECTION 3 — Recommended Experts */}
      {loading && (
        <section className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
          <LoaderCircle className="h-6 w-6 animate-spin text-lavender-deep" />
          <span className="text-sm font-medium">Loading experts…</span>
        </section>
      )}
      {!loading && apiError && (
        <section className="rounded-[1.75rem] bg-rose-50 border border-rose-200 p-6 text-center text-sm text-rose-700">
          {apiError}
        </section>
      )}
      {!loading && !apiError && recommended.length > 0 && (
        <section>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              Recommended For Your Concern
            </h2>
            <p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:mt-2 sm:text-sm">
              Based on your selected concern, these psychologists have relevant expertise. You can
              still browse all available experts below.
            </p>
          </div>
          <div className="space-y-4 sm:space-y-5">
            {recommended.map((p, i) => (
              <ExpertCard
                key={p.id}
                expert={p}
                highlightConcern={concern}
                badge={
                  i === 0
                    ? "Best Match"
                    : i === 1
                      ? "Recommended Match"
                      : "Specializes In Your Concern"
                }
                onBook={() => setBooking(p)}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4 — All Psychologist Cards */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              {recommended.length > 0 ? "All Available Experts" : "Our Panel of Experts"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
              {filtered.length} expert{filtered.length === 1 ? "" : "s"} matching your preferences
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="space-y-6 sm:space-y-8">
            <div className="rounded-[1.75rem] bg-white p-6 text-center shadow-soft sm:rounded-[2rem] sm:p-10">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-2xl bg-lavender/40 text-lavender-deep sm:h-12 sm:w-12">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.2} />
              </div>
              <div className="mt-3 text-base font-semibold sm:mt-4 sm:text-lg">
                No exact matches found for your filter criteria.
              </div>
              <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground sm:mt-2 sm:text-sm">
                Try adjusting your search filters or explore our featured panel of qualified psychologists below.
              </p>
              <Button
                onClick={reset}
                className="mt-5 rounded-full bg-gradient-brand text-xs text-white hover:opacity-95 sm:mt-6 sm:text-sm"
              >
                Reset Filters & View All Experts
              </Button>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="border-t border-border/50 pt-6">
                <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl lg:text-2xl">
                  Featured Experts You Might Want to Consider
                </h3>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Explore these highly recommended mental health professionals from our panel.
                </p>
              </div>
              <div className="space-y-4 sm:space-y-5">
              </div>
            </div>
          </div>

        ) : (
          <div className="space-y-4 sm:space-y-5">
            {visibleRest.map((p) => (
              <ExpertCard
                key={p.id}
                expert={p}
                highlightConcern={concern}
                onBook={() => setBooking(p)}
              />
            ))}

            {rest.length > visibleCount && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-6 sm:pt-8">
                <Button
                  onClick={() => setVisibleCount((v) => Math.min(v + 10, rest.length))}
                  variant="outline"
                  className="rounded-full border-lavender-deep/40 px-6 text-xs font-bold text-lavender-deep hover:bg-lavender/20 cursor-pointer sm:text-sm"
                >
                  Load 10 More ({rest.length - visibleCount} remaining)
                </Button>
                <Button
                  onClick={() => setVisibleCount(rest.length)}
                  className="rounded-full bg-gradient-brand px-6 text-xs font-bold text-white shadow-glow hover:opacity-95 cursor-pointer sm:text-sm"
                >
                  View All ({rest.length} Experts)
                </Button>
              </div>
            )}

            {rest.length === 0 && (
              <p className="text-xs text-muted-foreground sm:text-sm">
                Every matching expert is shown in your recommendations above.
              </p>
            )}
          </div>
        )}
      </section>

      {/* SECTION 5 — FAQ */}
      <section className="rounded-[1.75rem] bg-white p-5 shadow-soft sm:rounded-[2rem] sm:p-8">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="choose">
            <AccordionTrigger className="text-left text-xs font-semibold sm:text-sm lg:text-base">
              How do I choose the right psychologist?
            </AccordionTrigger>
            <AccordionContent className="max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Use the filters to narrow your options by concern, language, city, or expertise to
              find someone who best fits your needs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="change">
            <AccordionTrigger className="text-left text-xs font-semibold sm:text-sm lg:text-base">
              Can I change my psychologist later?
            </AccordionTrigger>
            <AccordionContent className="max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Yes. If you feel another psychologist would be a better fit, our team will help you
              transition smoothly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="selection">
            <AccordionTrigger className="text-left text-xs font-semibold sm:text-sm lg:text-base">
              How are psychologists selected?
            </AccordionTrigger>
            <AccordionContent className="max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Every psychologist on HappiMynd is carefully vetted based on their qualifications,
              experience, and professional standards before joining our expert panel.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="comfort" className="border-b-0">
            <AccordionTrigger className="text-left text-xs font-semibold sm:text-sm lg:text-base">
              What if I don't feel comfortable after my first session?
            </AccordionTrigger>
            <AccordionContent className="max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Your comfort is important. If needed, we'll help you connect with another suitable
              expert to ensure you continue your journey with confidence.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* BOOK NOW — session pack modal */}
      <Dialog open={!!booking} onOpenChange={(o) => !o && setBooking(null)}>
        <DialogContent className="w-[92vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-[1.75rem] border-none bg-white p-4 shadow-card sm:max-h-[90vh] sm:rounded-[2rem] sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight sm:text-2xl">
              Choose Your Session Pack
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {booking ? `Sessions with ${booking.name} · ${booking.designation}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-3 sm:gap-4">
            {getPsychologistPlans(booking).map((plan, idx, arr) => (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border p-4 sm:p-5 transition-all duration-300",
                  idx === arr.length - 1
                    ? "border-lavender-deep/40 bg-lavender/15 shadow-glow"
                    : "border-border/70 bg-white shadow-soft hover:-translate-y-0.5",
                )}
              >
                <div>
                  {plan.discount > 0 ? (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-brand px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-glow">
                        <Sparkles className="h-3 w-3 text-amber-300 shrink-0" /> Save {plan.discount}%
                      </span>
                    </div>
                  ) : (
                    <div className="mb-3 h-6" />
                  )}
                  <div className="text-xs font-semibold sm:text-sm">{plan.printDuration} Pack</div>
                  <div className="mt-1.5 flex items-baseline gap-1 sm:mt-2">
                    <span className="text-xl font-bold sm:text-2xl">{inr(plan.sessionSellingPrice)}</span>
                    <span className="text-[11px] text-muted-foreground sm:text-xs">/ session</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground sm:text-xs">
                    <span className="font-semibold text-foreground/80">{inr(plan.price)} total</span>
                    {plan.costPrice > plan.price && (
                      <span className="line-through opacity-60">{inr(plan.costPrice)}</span>
                    )}
                  </div>
                  <p className="mt-2 flex-1 text-[11px] leading-relaxed text-muted-foreground sm:mt-3 sm:text-xs">
                    Personalized 1:1 session package ({plan.printDuration}) with {booking?.name}.
                  </p>
                </div>
                <Button
                  onClick={() =>
                    booking &&
                    bookPack(booking, {
                      id: plan.id,
                      label: `${plan.printDuration} (${booking.name})`,
                      price: plan.price,
                      billing: plan.printDuration,
                    })
                  }
                  className={cn(
                    "mt-4 w-full rounded-full cursor-pointer text-xs sm:mt-5 sm:text-sm font-bold",
                    idx === arr.length - 1
                      ? "bg-gradient-brand text-white shadow-glow hover:opacity-95"
                      : "border border-lavender-deep/30 bg-white text-lavender-deep hover:bg-lavender/10",
                  )}
                >
                  Select Pack
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground sm:mt-4 sm:text-[11px]">
            All sessions are 100% confidential. Taxes applied at checkout.
          </p>
        </DialogContent>
      </Dialog>

      <BookSessionDialog
        open={bookOpen}
        onOpenChange={setBookOpen}
        service={bookingServiceContext}
      />
    </DashboardShell>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | unknown)[];
}) {
  const safeOptions = normalizeFilterArray(options);

  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:mb-1.5 sm:text-[11px]">
        {label}
      </label>
      <Select value={typeof value === "string" ? value : "All"} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/60 text-xs sm:h-12 sm:rounded-2xl sm:text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-60 rounded-xl bg-white shadow-card sm:max-h-72 sm:rounded-2xl">
          {safeOptions.map((o) => (
            <SelectItem key={o} value={o} className="text-xs sm:text-sm">
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ExpertCard({
  expert: p,
  badge,
  highlightConcern,
  onBook,
}: {
  expert: Psychologist;
  badge?: string;
  highlightConcern: string;
  onBook: () => void;
}) {
  const [open, setOpen] = useState(false);
  const top = p.specializations.slice(0, 5);
  const more = p.specializations.length - top.length;

  return (
    <article
      className={cn(
        "group rounded-[1.5rem] border border-border/50 bg-white p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-lavender/70 hover:shadow-card sm:rounded-[2rem] sm:p-6 lg:p-7",
        badge && "border-lavender/60 bg-white",
      )}
    >
      {badge && (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-glow sm:mb-4 sm:px-3 sm:py-1 sm:text-[10px]">
          <Sparkles className="h-3 w-3" strokeWidth={2.4} /> {badge}
        </span>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_minmax(0,12rem)] sm:gap-6">
        {/* LEFT — Profile Overview */}
        <div className="flex items-start gap-3.5 sm:gap-4 lg:flex-col lg:gap-4 min-w-0 max-w-full overflow-hidden">
          <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-brand text-lg font-bold text-white shadow-glow sm:h-20 sm:w-20 sm:rounded-3xl sm:text-xl lg:h-24 lg:w-24 lg:text-2xl">
            {p.photo ? (
              <img
                src={p.photo}
                alt={p.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              initials(p.name)
            )}
          </div>
          <div className="min-w-0 flex-1 max-w-full overflow-hidden">
            <h3 className="text-base font-bold leading-tight text-foreground sm:text-lg">
              {p.name}
            </h3>
            <div className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm break-words">
              {p.designation}
            </div>
            {p.rci && (
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-lavender/35 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-lavender-deep sm:mt-2 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[10px]">
                <BadgeCheck className="h-3 w-3 shrink-0" strokeWidth={2.4} /> RCI Registered
              </span>
            )}
            <dl className="mt-2.5 space-y-1.5 text-xs text-muted-foreground sm:mt-3 sm:space-y-2 min-w-0 w-full">
              {typeof p.experience === "number" && p.experience > 0 && (
                <Meta icon={Star} text={`${p.experience} yrs exp`} />
              )}
              {p.languages && p.languages.length > 0 && (
                <Meta icon={LanguagesIcon} text={p.languages.join(", ")} />
              )}
              {p.availability && <Meta icon={CalendarCheck} text={p.availability} />}
              {p.city && <Meta icon={MapPin} text={p.city} />}
            </dl>
          </div>
        </div>

        {/* CENTER — Tags & Bio */}
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {top.map((s) => (
              <span
                key={s}
                className={cn(
                  "rounded-full border border-border/70 bg-background/50 px-2.5 py-0.5 text-[11px] font-medium text-foreground/75 sm:px-3 sm:py-1 sm:text-xs",
                  s === highlightConcern &&
                  "border-lavender-deep/40 bg-lavender/30 text-lavender-deep font-semibold",
                )}
              >
                {s}
              </span>
            ))}
            {more > 0 && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-full bg-lavender/25 px-2.5 py-0.5 text-[11px] font-semibold text-lavender-deep transition-colors hover:bg-lavender/40 cursor-pointer sm:px-3 sm:py-1 sm:text-xs"
              >
                +{more} More
              </button>
            )}
          </div>

          <p
            className={cn(
              "mt-3 text-xs leading-relaxed text-muted-foreground sm:mt-4 sm:text-sm transition-all",
              open ? "whitespace-pre-line" : "line-clamp-3",
            )}
          >
            {p.bio}
          </p>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-lavender-deep transition-opacity hover:opacity-80 cursor-pointer sm:mt-4 sm:gap-1.5 sm:text-sm"
          >
            {open ? "Show Less" : "Read Full Profile"}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300",
                open && "rotate-180",
              )}
              strokeWidth={2.2}
            />
          </button>
        </div>

        {/* RIGHT — Pricing Box */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-lavender/15 p-4 text-center sm:rounded-3xl sm:p-5">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">
              Starting From
            </div>
            <div className="mt-0.5 text-2xl font-bold tracking-tight sm:mt-1 sm:text-3xl">
              {inr(p.startingFrom)}
            </div>
            <div className="text-[11px] text-muted-foreground sm:text-xs">Per Session</div>
            <Button
              onClick={onBook}
              className="mt-3 w-full rounded-full bg-gradient-brand text-xs font-bold text-white shadow-glow transition-all duration-300 hover:brightness-110 cursor-pointer sm:mt-4 sm:text-sm"
            >
              Book Now
            </Button>
            <div className="mt-2.5 flex items-center justify-center gap-1 text-[10px] text-muted-foreground sm:mt-3 sm:gap-1.5">
              <Lock className="h-3 w-3 shrink-0" strokeWidth={2.2} />
              <span className="truncate">
                {p.sessions ? `Confidential · ${p.sessions}` : "100% Confidential"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded profile */}
      {open && (
        <div className="mt-4 rounded-2xl border border-border/60 bg-background/40 p-4 sm:mt-6 sm:rounded-3xl sm:p-6">
          <Accordion type="multiple" defaultValue={["education", "experience", "approach", "helps", "languages"]} className="w-full">
            {p.education && p.education.length > 0 && (
              <AccordionItem value="education">
                <AccordionTrigger className="text-xs font-semibold sm:text-sm">
                  Education
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5">
                    {p.education.map((e) => (
                      <Bullet key={e} text={e} />
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {p.experienceDetail && p.experienceDetail.length > 0 && (
              <AccordionItem value="experience">
                <AccordionTrigger className="text-xs font-semibold sm:text-sm">
                  Experience
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5">
                    {p.experienceDetail.map((e) => (
                      <Bullet key={e} text={e} />
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {p.approach && (
              <AccordionItem value="approach">
                <AccordionTrigger className="text-xs font-semibold sm:text-sm">
                  Approach
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-xs text-muted-foreground sm:text-sm">{p.approach}</p>
                </AccordionContent>
              </AccordionItem>
            )}

            {p.helps && (
              <AccordionItem value="helps">
                <AccordionTrigger className="text-xs font-semibold sm:text-sm">
                  Who They Usually Help
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-xs text-muted-foreground sm:text-sm">{p.helps}</p>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="languages" className="border-b-0">
              <AccordionTrigger className="text-xs font-semibold sm:text-sm">
                Languages & Availability
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1 text-xs text-muted-foreground sm:text-sm">
                  {p.languages && p.languages.length > 0 && (
                    <div>
                      <span className="font-semibold text-foreground">Languages Spoken:</span>{" "}
                      {p.languages.join(", ")}
                    </div>
                  )}
                  {p.city && (
                    <div>
                      <span className="font-semibold text-foreground">City:</span> {p.city}
                    </div>
                  )}
                  {p.availability && (
                    <div>
                      <span className="font-semibold text-foreground">Availability:</span>{" "}
                      {p.availability}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </article>
  );
}

function Meta({ icon: Icon, text }: { icon: typeof Star; text: string }) {
  return (
    <div className="flex items-start gap-1.5 min-w-0 max-w-full overflow-hidden">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lavender-deep" strokeWidth={2.2} />
      <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere] [word-break:break-word] text-xs text-muted-foreground sm:text-sm leading-snug">{text}</span>
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-1.5 text-xs text-muted-foreground sm:text-sm">
      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lavender-deep" strokeWidth={2.4} />
      <span>{text}</span>
    </li>
  );
}
