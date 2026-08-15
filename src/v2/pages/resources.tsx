import { V2Link } from "@/v2/lib/router";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, BookOpen, Headphones, CirclePlay, Lightbulb, Clock, Image, Play, Sparkles, ChevronLeft, ChevronRight, Pause, X } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { Button } from "@/v2/components/ui/button";
import { BookSessionDialog, type BookServiceContext } from "@/v2/components/book-session-dialog";
import { cn } from "@/v2/lib/utils";

import calmMorningUrl from "@/v2/assets/audio/calm-morning.mp3";
import ambientDeepUrl from "@/v2/assets/audio/ambient-deep.mp3";
import forestAmbienceUrl from "@/v2/assets/audio/chrysalyn-morning-forest-ambience-with-birds-chirping-562428.mp3";
import indianMeditationUrl from "@/v2/assets/audio/kalsstockmedia-indian-music-track-3-251497.mp3";
import forestHarpUrl from "@/v2/assets/audio/konstantinpazuzustudio-forest-harp-harp-and-birds-525281.mp3";
import mascotIdeaImg from "@/v2/assets/images/mascot-idea.webp";

export default ResourcesPage;

const RESOURCE_TYPES = [
  {
    icon: BookOpen,
    title: "Articles & Insights",
    desc: "Expert-written ideas and practical perspectives designed to support everyday growth.",
    tint: "from-lavender/60 to-lavender/20",
  },
  {
    icon: Headphones,
    title: "Guided Audio",
    desc: "Guided audio experiences that help you pause, reflect and regain clarity.",
    tint: "from-aqua/60 to-aqua/20",
  },
  {
    icon: CirclePlay,
    title: "Perspective Studio",
    desc: "Curated videos introducing new ideas, frameworks and expert conversations.",
    tint: "from-pastel-blue/70 to-pastel-blue/20",
  },
  {
    icon: Lightbulb,
    title: "Quick Insights",
    desc: "Short facts, research findings and thoughtful ideas worth discovering.",
    tint: "from-peach/70 to-peach/20",
  },
];

const STUDIO = [
  {
    ytId: "WS2hxJWc2hk",
    ytUrl: "https://youtu.be/WS2hxJWc2hk",
    topic: "Stress",
    title: "Stress 101: Understanding the Basics and Mastering Stress Management",
    thumb: "https://i.ytimg.com/vi/WS2hxJWc2hk/hqdefault.jpg",
  },
  {
    ytId: "xDEaQ0gwvlI",
    ytUrl: "https://youtu.be/xDEaQ0gwvlI",
    topic: "Relaxation",
    title: "Ultimate Relaxation Guide: 8 Tips for Boosting Mental Health",
    thumb: "https://i.ytimg.com/vi/xDEaQ0gwvlI/hqdefault.jpg",
  },
  {
    ytId: "GGbevOpaWn4",
    ytUrl: "https://youtu.be/GGbevOpaWn4",
    topic: "Students",
    title: "Student Stress Solutions: Effective Strategies for Managing Academic Pressure",
    thumb: "https://i.ytimg.com/vi/GGbevOpaWn4/hqdefault.jpg",
  },
  {
    ytId: "UB1dZxtktaU",
    ytUrl: "https://youtu.be/UB1dZxtktaU",
    topic: "Confidence",
    title: "Elevate Your Confidence: Practical Ways to Boost Self-Esteem",
    thumb: "https://i.ytimg.com/vi/UB1dZxtktaU/hqdefault.jpg",
  },
  {
    ytId: "8MHyJLy9PS4",
    ytUrl: "https://youtu.be/8MHyJLy9PS4",
    topic: "Mindset",
    title: "Overthinking No More: 10 Practical Steps to Find Peace of Mind",
    thumb: "https://i.ytimg.com/vi/8MHyJLy9PS4/hqdefault.jpg",
  },
];

const FOCUS_SESSIONS = [
  {
    title: "Calm Morning",
    duration: "2:10 min",
    src: calmMorningUrl,
    desc: "A soft, peaceful acoustic start to wake up your mind.",
  },
  {
    title: "Ambient Deep",
    duration: "3:34 min",
    src: ambientDeepUrl,
    desc: "Deep synthesizer pads to guide your focus or relaxation.",
  },
  {
    title: "Morning Forest Ambience",
    duration: "0:30 min",
    src: forestAmbienceUrl,
    desc: "Nature sounds with soothing morning birds chirping.",
  },
  {
    title: "Indian Meditation Track",
    duration: "4:03 min",
    src: indianMeditationUrl,
    desc: "Calm, traditional Indian flute and sitar meditation.",
  },
  {
    title: "Forest Harp",
    duration: "3:23 min",
    src: forestHarpUrl,
    desc: "Gentle harp chords blended with ambient woodland birds.",
  },
];

import { ARTICLES } from "@/v2/data/articles";

const INSIGHTS = [
  {
    text: "People who regularly reflect on their experiences often build stronger long-term resilience.",
    source: "Journal of Positive Psychology",
    tint: "bg-gradient-lavender",
  },
  {
    text: "Writing your thoughts down can improve clarity and decision-making.",
    source: "Harvard Business Review",
    tint: "bg-gradient-aqua",
  },
  {
    text: "Learning one small idea every day compounds into meaningful long-term growth.",
    source: "HappiMynd Editorial",
    tint: "bg-gradient-peach",
  },
  {
    text: "Naming an emotion reduces its intensity and helps the brain regulate more calmly.",
    source: "UCLA Neuroscience Study",
    tint: "bg-gradient-mint",
  },
  {
    text: "A two-minute pause between meetings meaningfully improves focus and mood.",
    source: "Microsoft Human Factors Lab",
    tint: "bg-gradient-lavender",
  },
  {
    text: "Curiosity, more than motivation, predicts long-term learning and growth.",
    source: "HappiMynd Research",
    tint: "bg-gradient-aqua",
  },
];

function MobileArticleDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ARTICLES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ARTICLES.length) % ARTICLES.length);
  };

  const activeArticle = ARTICLES[currentIndex];

  return (
    <div className="w-full sm:hidden">
      {/* Navigation Dots & Control Buttons */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          {ARTICLES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                idx === currentIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30",
              )}
              aria-label={`Go to article ${idx + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow-soft border border-white/80 transition hover:bg-white hover:text-foreground active:scale-95 cursor-pointer"
            aria-label="Previous article card"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow-soft border border-white/80 transition hover:bg-white hover:text-foreground active:scale-95 cursor-pointer"
            aria-label="Next article card"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active Card Showcase (Zero Overlap) */}
      <article
        key={activeArticle.slug}
        className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft border border-white/90 transition-all duration-300 animate-in fade-in zoom-in-95 duration-200"
      >
        <V2Link
          to={`/articles/${activeArticle.slug}`}
          className="absolute inset-0 z-10"
          aria-label={activeArticle.title}
        />
        <div className="relative aspect-[16/8] w-full place-items-center overflow-hidden bg-gradient-mint flex items-center justify-center">
          {activeArticle.image ? (
            <img
              src={activeArticle.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[50%_38%]"
            />
          ) : (
            <Image className="h-7 w-7 text-primary/40" strokeWidth={1.5} />
          )}
          <span className="absolute bottom-2.5 left-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-primary">
            {activeArticle.category}
          </span>
          <span className="absolute bottom-2.5 right-3 inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-black/60 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" /> {activeArticle.time}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-base font-bold leading-snug tracking-tight text-foreground line-clamp-2">
            {activeArticle.title}
          </h3>
          <div className="mt-4 flex items-center justify-between border-t border-muted/20 pt-3">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
              Read Article
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {currentIndex + 1} of {ARTICLES.length}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}

function MobileExploreCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % RESOURCE_TYPES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setActiveIdx((prev) => (prev + 1) % RESOURCE_TYPES.length);
  };

  const prevSlide = () => {
    setActiveIdx((prev) => (prev - 1 + RESOURCE_TYPES.length) % RESOURCE_TYPES.length);
  };

  const r = RESOURCE_TYPES[activeIdx];
  const Icon = r.icon;
  const targetHash =
    r.title === "Articles & Insights"
      ? "articles"
      : r.title === "Guided Audio"
        ? "audio"
        : r.title === "Perspective Studio"
          ? "video"
          : undefined;

  const content = (
    <>
      <div
        className={cn(
          "absolute inset-x-0 -top-16 h-32 rounded-full bg-gradient-to-b opacity-80 blur-2xl",
          r.tint,
        )}
      />
      <div className="relative flex flex-col justify-between h-[160px]">
        <div>
          <div className="flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              0{activeIdx + 1} / 0{RESOURCE_TYPES.length}
            </span>
          </div>
          <h3 className="mt-3 text-base font-bold tracking-tight text-foreground">{r.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.desc}</p>
        </div>
        <div className="inline-flex items-center gap-1 text-xs font-bold text-primary pt-2 border-t border-muted/20">
          Explore section
        </div>
      </div>
    </>
  );

  return (
    <div className="sm:hidden relative overflow-hidden my-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-xl font-bold tracking-tight">Explore by Resource Type</h2>
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevSlide}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow-soft border border-white/80 transition hover:bg-white active:scale-95 cursor-pointer"
            aria-label="Previous resource"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow-soft border border-white/80 transition hover:bg-white active:scale-95 cursor-pointer"
            aria-label="Next resource"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {targetHash ? (
        <a
          key={r.title}
          href={`#${targetHash}`}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(targetHash);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="group relative overflow-hidden rounded-3xl bg-white p-5 text-left shadow-soft border border-white/90 transition-all duration-300 animate-in fade-in zoom-in-95 cursor-pointer block"
        >
          {content}
        </a>
      ) : (
        <button
          key={r.title}
          className="group relative overflow-hidden rounded-3xl bg-white p-5 text-left shadow-soft border border-white/90 transition-all duration-300 animate-in fade-in zoom-in-95 cursor-pointer block w-full"
        >
          {content}
        </button>
      )}
    </div>
  );
}

function ResourcesPage() {
  const [bookOpen, setBookOpen] = useState(false);
  const [bookService, setBookService] = useState<BookServiceContext | null>({
    key: "happitalk",
    name: "HappiTALK",
  });

  const [currentTrack, setCurrentTrack] = useState<(typeof FOCUS_SESSIONS)[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const studioScrollRef = useRef<HTMLDivElement>(null);
  const audioScrollRef = useRef<HTMLDivElement>(null);
  const insightsScrollRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right") => {
    if (ref.current) {
      ref.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (currentTrack) {
        audioRef.current.src = currentTrack.src;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error("Audio playback error:", err);
            setIsPlaying(false);
          });
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
        setProgress(0);
      }
    }
  }, [currentTrack]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error("Playback start error:", err);
          });
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 0;
      if (dur > 0) {
        setProgress((cur / dur) * 100);
      }

      setCurrentTime(formatTime(cur));
      setDuration(isNaN(dur) ? "0:00" : formatTime(dur));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const dur = audioRef.current.duration || 0;
      const newTime = (parseFloat(e.target.value) / 100) * dur;
      audioRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  return (
    <DashboardShell
      header={
        <TopHeaderBar
          title="Resources"
          emoji=""
          subtitle="Curated ideas, guided sessions and perspectives to support your journey."
        />
      }
    >
      {/* SECTION 1 — Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-hero p-8 shadow-card md:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-aqua/40 blur-3xl" />

        {/* Mascot — cropped at the hoodie, sitting on the section's bottom edge */}
        <img
          src={mascotIdeaImg}
          alt="HappiMynd mascot Happi pointing at a lightbulb"
          width={640}
          height={980}
          className="pointer-events-none absolute bottom-0 right-8 hidden h-auto w-[150px] max-h-[88%] object-contain object-bottom lg:block xl:right-14 xl:w-[175px]"
        />

        <div className="relative max-w-3xl lg:max-w-[62%]">
          {/* <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-primary shadow-soft backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            Continue your growth
          </div> */}
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Grow with Us
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Discover expert insights, practical ideas, guided audio experiences, curated videos, and
            research-backed perspectives that help you navigate life with greater awareness and
            clarity.
          </p>
        </div>
      </section>

      {/* SECTION 3 — Explore Resources */}
      <MobileExploreCarousel />

      <section className="hidden sm:block">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Explore by Resource Type</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RESOURCE_TYPES.map((r) => {
            const Icon = r.icon;
            const targetHash =
              r.title === "Articles & Insights"
                ? "articles"
                : r.title === "Guided Audio"
                  ? "audio"
                  : r.title === "Perspective Studio"
                    ? "video"
                    : undefined;
            const cardInner = (
              <>
                <div
                  className={cn(
                    "absolute inset-x-0 -top-16 h-32 rounded-full bg-gradient-to-b opacity-70 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
                    r.tint,
                  )}
                />
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="mt-5 text-base font-bold tracking-tight">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Explore
                  </div>
                </div>
              </>
            );
            const cardClass =
              "group relative overflow-hidden rounded-3xl bg-white/95 p-6 text-left shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow cursor-pointer";
            return targetHash ? (
              <a
                key={r.title}
                href={`#${targetHash}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(targetHash);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cardClass}
              >
                {cardInner}
              </a>
            ) : (
              <button key={r.title} className={cardClass}>
                {cardInner}
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 5 — Perspective Studio */}
      <section id="video" className="scroll-mt-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Perspective Studio</h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => scrollContainer(studioScrollRef, "left")}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow-soft border border-white/80 transition hover:bg-white hover:text-foreground active:scale-95 cursor-pointer"
              aria-label="Previous video"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollContainer(studioScrollRef, "right")}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow-soft border border-white/80 transition hover:bg-white hover:text-foreground active:scale-95 cursor-pointer"
              aria-label="Next video"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          ref={studioScrollRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {STUDIO.map((v) => (
            <a
              key={v.ytId}
              href={v.ytUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl bg-white/95 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow sm:w-[320px]"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-gradient-aqua">
                <img
                  src={v.thumb}
                  alt={v.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 group-hover:bg-black/30">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-primary shadow-glow transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-6 w-6 fill-current" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <span className="rounded-full bg-aqua/40 px-2.5 py-1 text-xs font-semibold text-primary">
                  {v.topic}
                </span>
                <h3 className="mt-3 text-base font-bold leading-snug tracking-tight line-clamp-2">
                  {v.title}
                </h3>
                <Button
                  size="sm"
                  className="mt-4 rounded-full bg-gradient-brand text-white shadow-soft hover:opacity-95"
                  asChild
                >
                  <span>
                    <Play className="mr-1 h-3.5 w-3.5 fill-current" /> Watch
                  </span>
                </Button>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* SECTION 6 — Guided Audio */}
      <section id="audio" className="scroll-mt-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Guided Audio</h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => scrollContainer(audioScrollRef, "left")}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow-soft border border-white/80 transition hover:bg-white hover:text-foreground active:scale-95 cursor-pointer"
              aria-label="Previous audio"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollContainer(audioScrollRef, "right")}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow-soft border border-white/80 transition hover:bg-white hover:text-foreground active:scale-95 cursor-pointer"
              aria-label="Next audio"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          ref={audioScrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {FOCUS_SESSIONS.map((s) => (
            <div
              key={s.title}
              className="group flex w-[260px] shrink-0 snap-start items-center gap-4 rounded-3xl bg-white/95 p-4 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow sm:w-auto"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-aqua text-primary">
                <Headphones className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold tracking-tight">{s.title}</h3>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {s.duration}
                </p>
              </div>
              <button
                onClick={() => {
                  if (currentTrack?.title === s.title) {
                    handlePlayPause();
                  } else {
                    setCurrentTrack(s);
                  }
                }}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-brand text-white shadow-glow transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                aria-label={`Play ${s.title}`}
              >
                {currentTrack?.title === s.title && isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — Articles & Insights */}
      <section id="articles" className="scroll-mt-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Latest Articles & Insights
            </h2>
          </div>
          <V2Link
            to="/articles"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View all
          </V2Link>
        </div>

        <MobileArticleDeck />

        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {ARTICLES.map((a) => (
            <article
              key={a.slug}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/95 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              <V2Link
                to={`/articles/${a.slug}`}
                className="absolute inset-0 z-10"
                aria-label={a.title}
              />
              <div className="relative grid aspect-[16/9] w-full place-items-center overflow-hidden bg-gradient-mint">
                {a.image ? (
                  <img
                    src={a.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-[50%_38%] transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <Image className="h-8 w-8 text-primary/40" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-lavender/50 px-2.5 py-1 font-semibold text-primary">
                    {a.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {a.time}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold leading-snug tracking-tight">{a.title}</h3>
                <div className="mt-4 flex-1" />
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read Article
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 8 — Quick Insights */}
      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Quick Insights</h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => scrollContainer(insightsScrollRef, "left")}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow-soft border border-white/80 transition hover:bg-white hover:text-foreground active:scale-95 cursor-pointer"
              aria-label="Previous insight"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollContainer(insightsScrollRef, "right")}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow-soft border border-white/80 transition hover:bg-white hover:text-foreground active:scale-95 cursor-pointer"
              aria-label="Next insight"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          ref={insightsScrollRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {INSIGHTS.map((i, idx) => (
            <div
              key={idx}
              className={cn(
                "flex w-[280px] shrink-0 snap-start flex-col justify-between rounded-3xl p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow sm:w-[320px]",
                i.tint,
              )}
            >
              <div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/90 text-primary shadow-soft">
                  <Lightbulb className="h-5 w-5" strokeWidth={2} />
                </div>
                <p className="mt-5 text-base font-semibold leading-snug text-foreground">
                  {i.text}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">- {i.source}</span>
                <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:gap-2 cursor-pointer">
                  Learn more
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9 — Discover More */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-brand p-6 text-white shadow-glow md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Discover More Ways to Grow
            </h2>
          </div>
          <div className="flex flex-nowrap items-center gap-2.5 overflow-x-auto pb-1 max-w-full whitespace-nowrap shrink-0">
            <Button
              asChild
              className="h-11 rounded-full bg-white px-5 text-xs sm:text-sm font-semibold text-primary shadow-soft hover:bg-white/90 cursor-pointer shrink-0"
            >
              <V2Link to="/services">Explore Services</V2Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-white/60 bg-white/10 px-5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 hover:text-white cursor-pointer shrink-0"
            >
              <a href="https://quizzard.happimynd.com/" target="_blank" rel="noopener noreferrer">
                Try Quizzard
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-white/60 bg-transparent px-5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 hover:text-white cursor-pointer shrink-0"
            >
              <V2Link to="/" className="inline-flex items-center gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </V2Link>
            </Button>
          </div>
        </div>
      </section>

      <BookSessionDialog open={bookOpen} onOpenChange={setBookOpen} service={bookService} />
      {/* HTML5 Audio element */}
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />

      {/* Floating Audio Player */}
      {currentTrack && (
        /* right-20 / md:right-28 keeps clear of the floating Contact Us button. */
        <div className="fixed bottom-24 right-20 left-4 z-50 rounded-3xl bg-white p-4 shadow-card border border-white/80 md:bottom-6 md:right-28 md:left-auto md:w-96 animate-in slide-in-from-bottom-8 duration-300">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <Headphones className="h-5 w-5 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-bold tracking-tight text-foreground">
                {currentTrack.title}
              </h4>
              <p className="truncate text-xs text-muted-foreground">HappiLIFE Guided Session</p>
            </div>
            <button
              onClick={() => setCurrentTrack(null)}
              className="grid h-7 w-7 place-items-center rounded-full bg-lavender/40 text-muted-foreground hover:bg-lavender hover:text-foreground cursor-pointer"
              aria-label="Close player"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-lavender [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-brand [&::-webkit-slider-thumb]:shadow-glow focus:outline-none"
            />
            <div className="mt-1 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              onClick={handlePlayPause}
              className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-white shadow-glow transition hover:scale-105 active:scale-95 cursor-pointer"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
