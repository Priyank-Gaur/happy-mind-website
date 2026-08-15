import relImg from "@/v2/assets/articles/relationships.jpeg";
import mentalImg from "@/v2/assets/articles/mental vibrancy.jpeg";
import lifeImg from "@/v2/assets/articles/life transistions.jpeg";
import selfImg from "@/v2/assets/articles/selfawareness.jpeg";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] };

export type Article = {
  slug: string;
  category: string;
  time: string;
  title: string;
  excerpt: string;
  image?: string;
  seoTitle: string;
  seoDescription: string;
  body: ArticleBlock[];
};

export const ARTICLES: Article[] = [
  {
    slug: "relationship-pattern-you-keep-repeating",
    category: "Relationships",
    time: "3 min read",
    title:
      "The Relationship Pattern You Keep Repeating Isn't About Love. It's About What You Never Healed.",
    excerpt:
      "Discover why relationship patterns repeat and how emotional resilience - not willpower - is what actually breaks the cycle.",
    image: relImg,
    seoTitle:
      "Why You Keep Repeating the Same Relationship Pattern (It's Not About Love)",
    seoDescription:
      "Discover why relationship patterns repeat and how emotional resilience - not willpower - is what actually breaks the cycle.",
    body: [
      {
        type: "p",
        text: "You've told yourself this one is different. Better communication. Better timing. Better version of you. And yet, three months in, it's the same ache in a new person's voice - the same silence you learned to read as a child, the same anxiety you mistake for chemistry.",
      },
      {
        type: "p",
        text: "Here's the part nobody says out loud: you're not choosing the wrong people. You're choosing the familiar nervous system state. If chaos, distance, or emotional unavailability was home growing up, calm can actually feel suspicious. Your body isn't broken - it's loyal to an old blueprint.",
      },
      {
        type: "p",
        text: "Breaking this isn't about trying harder in the next relationship. It's about noticing the pattern before it becomes the plot. That's what emotional resilience really is - not toughing it out, but staying grounded enough to see your own triggers clearly, in real time, without spiraling or shutting down.",
      },
      {
        type: "quote",
        text: "What does this relationship require me to ignore about myself to keep it going?",
      },
      {
        type: "p",
        text: "That single question does more work than a hundred conversations about \"communication styles.\"",
      },
      {
        type: "p",
        text: "This kind of clarity rarely arrives through willpower alone. It comes from consistent, guided self-awareness - small, honest check-ins with yourself that build up your capacity to respond instead of react. Some people find this through journaling. Others through therapy. Many are discovering it through guided digital tools that make self-reflection feel less intimidating and more like a daily habit - spaces like HappiMynd, built around exactly this kind of quiet, judgment-free clarity.",
      },
      {
        type: "p",
        text: "You don't need to overhaul your personality to have healthier relationships. You need to understand the pattern well enough that it stops running the show. That's not a love problem. That's a growth one - and it's entirely learnable.",
      },
    ],
  },
  {
    slug: "your-nervous-system-not-motivation",
    category: "Mental Vibrancy",
    time: "3 min read",
    title:
      "You Don't Need More Motivation. You Need Your Nervous System Back.",
    excerpt:
      "Feeling stuck isn't a motivation issue. Learn why mental vibrancy - not another productivity hack - is what actually restores your drive.",
    image: mentalImg,
    seoTitle:
      "Why Motivation Isn't the Problem - Rebuilding Mental Vibrancy Is",
    seoDescription:
      "Feeling stuck isn't a motivation issue. Learn why mental vibrancy - not another productivity hack - is what actually restores your drive.",
    body: [
      {
        type: "p",
        text: "Another morning, another mental pep talk that doesn't land. You've read the productivity books. You've tried the 5am routine. You know exactly what you should be doing - and you still can't make yourself do it. So you conclude you're lazy, undisciplined, falling behind.",
      },
      {
        type: "p",
        text: "You're not. You're depleted.",
      },
      {
        type: "p",
        text: "Motivation isn't a personality trait you either have or don't - it's a byproduct of a nervous system that has enough bandwidth left to want things. When you've spent months running on stress hormones, forcing focus, and calling exhaustion \"just being busy,\" motivation is one of the first things to quietly leave the building. No app, deadline, or vision board brings it back. Rest, regulation, and honest recalibration do.",
      },
      {
        type: "p",
        text: "This is where the idea of mental vibrancy matters more than the idea of productivity. Vibrancy isn't hustle - it's having enough emotional and mental energy that effort doesn't feel like combat. It's the difference between forcing yourself through a to-do list and actually having something left to give at the end of the day.",
      },
      {
        type: "quote",
        text: "You're not behind. You're not broken. Your system is asking for restoration, not another strategy.",
      },
      {
        type: "p",
        text: "Getting there doesn't require quitting your job or booking a silent retreat. It starts smaller: noticing when you're operating from depletion versus capacity, building small recovery rituals into ordinary days, and giving your mind structured space to process instead of constantly performing. That's the kind of self-work that platforms built for everyday emotional wellbeing - HappiMynd among them - are quietly designed to support, without turning it into another chore on your list.",
      },
      {
        type: "p",
        text: "Give it that first, and the motivation you've been chasing tends to show up on its own.",
      },
    ],
  },
  {
    slug: "adulthood-losing-yourself-in-installments",
    category: "Life Transitions",
    time: "3 min read",
    title:
      "Nobody Tells You Adulthood Feels Like Losing Yourself in Installments",
    excerpt:
      "The quarter-life identity shift isn't a breakdown - it's conscious growth in disguise. Here's how to build emotional resilience through it.",
    image: lifeImg,
    seoTitle:
      "The Quiet Identity Crisis of Your Late 20s and 30s (And How to Navigate It)",
    seoDescription:
      "The quarter-life identity shift isn't a breakdown - it's conscious growth in disguise. Here's how to build emotional resilience through it.",
    body: [
      {
        type: "p",
        text: "Somewhere between your first \"real\" job and the version of adulthood you imagined, something quietly went missing. Not dramatically - no single event you can point to. Just a slow erosion: fewer hobbies, less spontaneity, a calendar full of obligations and a self that feels increasingly hard to locate.",
      },
      {
        type: "p",
        text: "You're not going through a crisis. You're going through a transition nobody prepared you for - the gap between who you were raised to become and who you're actually turning out to be.",
      },
      {
        type: "p",
        text: "This phase gets dismissed as overthinking, ingratitude, or \"just adulting.\" It's none of those. It's the natural friction of growth - your values updating faster than your life circumstances, your sense of self renegotiating its terms. Pretending it isn't happening doesn't make it pass faster. It just gets buried, and buried things resurface louder later.",
      },
      {
        type: "p",
        text: "What actually helps is treating this as information, not failure. Emotional resilience here doesn't mean pushing through and pretending you're fine - it means having the self-awareness to sit with the discomfort long enough to understand what it's pointing to.",
      },
      {
        type: "quote",
        text: "What do you actually want versus what you inherited as \"the plan\"?",
      },
      {
        type: "p",
        text: "Which relationships, habits, and commitments still fit the person you're becoming? These aren't questions you answer in one weekend of journaling. They're questions worth having consistent support around - whether that's a therapist, a trusted mentor, or structured, guided tools designed for exactly this kind of self-inquiry, the way HappiMynd's individual programs are built to meet people wherever they are in this process.",
      },
      {
        type: "p",
        text: "Losing an old version of yourself isn't collapse. It's the quiet, uncomfortable, entirely normal cost of actually growing up. You're not behind schedule. You're right on time.",
      },
    ],
  },
  {
    slug: "anxiety-is-an-unmet-need",
    category: "Self Awareness",
    time: "3 min read",
    title:
      "Your Anxiety Isn't a Personality Trait. It's an Unmet Need Wearing a Disguise.",
    excerpt:
      "Anxiety often isn't identity - it's an unmet need in disguise. Here's how emotional resilience and self-awareness help you tell the difference.",
    image: selfImg,
    seoTitle:
      "Why \"I'm Just an Anxious Person\" Might Be the Wrong Story You're Telling Yourself",
    seoDescription:
      "Anxiety often isn't identity - it's an unmet need in disguise. Here's how emotional resilience and self-awareness help you tell the difference.",
    body: [
      {
        type: "p",
        text: "At some point, \"I'm an overthinker\" became your identity instead of a symptom worth examining. It's easier that way - a personality trait doesn't ask anything of you. A pattern, on the other hand, has a root. And roots can be traced.",
      },
      {
        type: "p",
        text: "Most chronic overthinking and low-grade anxiety aren't random. They're often your mind's overcorrection for a need that went unmet somewhere - for control, for safety, for certainty, for being seen. The racing thoughts at 1am aren't malfunction; they're your brain trying, clumsily, to protect you from something it once got burned by.",
      },
      {
        type: "p",
        text: "Labeling it as \"just who I am\" feels protective, but it quietly closes the door on change. You stop asking what is this anxiety actually trying to tell me and start just managing the noise - more caffeine avoidance, more breathing apps, more coping mechanisms stacked on top of an unexamined cause.",
      },
      {
        type: "quote",
        text: "If this anxious feeling could talk, what would it be asking for?",
      },
      {
        type: "p",
        text: "Often it's rest. Sometimes it's a boundary you haven't set. Occasionally it's grief you never fully let yourself feel. The anxiety is rarely the problem - it's the messenger.",
      },
      {
        type: "p",
        text: "This is precisely where emotional resilience is built - not by eliminating anxious feelings, but by developing enough self-awareness to decode them instead of drowning in them. It's slow, unglamorous work, and it's far more sustainable with some structure around it: guided reflection, consistent check-ins, tools that help you notice the pattern before it notices you. This is the quiet, steady kind of support HappiMynd's approach to individual growth is built around.",
      },
      {
        type: "p",
        text: "You're not \"just anxious.\" You're a person with unmet needs who hasn't been asked the right questions yet. Start asking them.",
      },
    ],
  },
];

export const getArticle = (slug: string) =>
  ARTICLES.find((a) => a.slug === slug);
