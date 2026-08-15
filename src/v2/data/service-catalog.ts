// Catalog for the reusable Service Purchase page.

export type Plan = {
  id: string;
  name: string;
  label: string;
  price: number;
  duration: string;
  validity: string;
  access: string;
  support: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
};

export type Bundle = {
  id: string;
  title: string;
  desc: string;
  price: number;
  savings: string;
};

export type ServiceCatalog = {
  slug: string;
  name: string;
  tagline: string;
  hero: {
    badge: string;
    heading: string;
    paragraph: string;
  };
  about: {
    positioning: string;
    benefits: string[];
  };
  plans: Plan[];
  bundles: Bundle[];
};

const DEFAULT_PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    label: "Perfect for getting started.",
    price: 199,
    duration: "6 Months",
    validity: "30 days",
    access: "Self-paced",
    support: "Email support",
    features: [
      "Core guided experience",
      "Access to essential resources",
      "1 reflection activity / week",
      "Progress snapshots",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    label: "For consistent conscious growth.",
    price: 699,
    duration: "12 Months",
    validity: "90 days",
    access: "Self-paced + guided",
    support: "Priority support",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Everything in Starter",
      "Personalized growth pathway",
      "Weekly reflection prompts",
      "Progress tracking dashboard",
      "1 expert-guided check-in",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    label: "The complete growth experience.",
    price: 1999,
    duration: "12 Months",
    validity: "180 days",
    access: "Full access",
    support: "Dedicated support",
    features: [
      "Everything in Growth",
      "Unlimited practice library",
      "3 expert-guided sessions",
      "Advanced insight reports",
      "Priority scheduling",
    ],
  },
];

const DEFAULT_BUNDLES: Bundle[] = [
  {
    id: "b1",
    title: "Awareness + Everyday Growth",
    desc: "HappiLIFE + HappiSELF",
    price: 3799,
    savings: "Save 15%",
  },
  {
    id: "b2",
    title: "Awareness + Guided Support",
    desc: "HappiLIFE + SOLV",
    price: 5299,
    savings: "Save 18%",
  },
  {
    id: "b3",
    title: "Balanced Growth Trio",
    desc: "HappiSELF + HappiLEARN + HappiBUDDY",
    price: 6499,
    savings: "Save 22%",
  },
  {
    id: "b4",
    title: "Complete HappiMynd Experience",
    desc: "All six services combined",
    price: 12999,
    savings: "Save 30%",
  },
];

function build(
  slug: string,
  name: string,
  tagline: string,
  paragraph: string,
): ServiceCatalog {
  return {
    slug,
    name,
    tagline,
    hero: {
      badge: "✨ HappiMynd Services",
      heading: "Choose the plan that supports your growth journey.",
      paragraph,
    },
    about: {
      positioning: tagline,
      benefits: [
        "Guided Experience",
        "Expert-designed Framework",
        "Self-paced Access",
        "Practical Exercises",
        "Progress Tracking",
        "Reflection Activities",
        "Personalized Journey",
        "Confidential Experience",
      ],
    },
    plans: DEFAULT_PLANS,
    bundles: DEFAULT_BUNDLES,
  };
}

export const SERVICE_CATALOG: Record<string, ServiceCatalog> = {
  happilife: build(
    "happilife",
    "HappiLIFE",
    "Self-reflection & personalized insights.",
    "Discover a service designed to help you build awareness, gain perspective and grow through every stage of life. Select the experience that best fits your needs.",
  ),
  happiself: build(
    "happiself",
    "HappiSELF",
    "Daily practices for inner strength.",
    "Discover services designed to help you build awareness, gain perspective and grow through every stage of life. Select the experience that best fits your needs.",
  ),
  happibuddy: build(
    "happibuddy",
    "HappiBUDDY",
    "A companion for everyday reflection.",
    "Discover services designed to help you build awareness, gain perspective and grow through every stage of life. Select the experience that best fits your needs.",
  ),
  happilearn: build(
    "happilearn",
    "HappiLEARN",
    "Expert-curated learning for life.",
    "Discover services designed to help you build awareness, gain perspective and grow through every stage of life. Select the experience that best fits your needs.",
  ),
  happitalk: build(
    "happitalk",
    "HappiTALK",
    "Therapeutic conversations with experts.",
    "Discover services designed to help you build awareness, gain perspective and grow through every stage of life. Select the experience that best fits your needs.",
  ),
  solv: build(
    "solv",
    "SOLV",
    "1:1 sessions to feel sorted.",
    "Discover services designed to help you build awareness, gain perspective and grow through every stage of life. Select the experience that best fits your needs.",
  ),
};

export function getCatalog(slug: string): ServiceCatalog {
  return SERVICE_CATALOG[slug.toLowerCase()] ?? SERVICE_CATALOG.happilife;
}
