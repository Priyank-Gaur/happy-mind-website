import { V2Link } from "@/v2/lib/router";
import { ArrowLeft, Gamepad2, Clock, Sparkles, BookOpen, CircleHelp, LayoutDashboard } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { Button } from "@/v2/components/ui/button";
import gamesHeroImg from "@/v2/assets/games-mascot.png";

export default GamesPage;

const pageOptions = [
  {
    title: "Dashboard",
    desc: "Main Hub",
    to: "/",
    icon: LayoutDashboard,
    bg: "bg-gradient-lavender",
  },
  {
    title: "Services",
    desc: "Our Offerings",
    to: "/services",
    icon: Sparkles,
    bg: "bg-gradient-peach",
  },
  {
    title: "Resources",
    desc: "Articles & Audio",
    to: "/resources",
    icon: BookOpen,
    bg: "bg-gradient-mint",
  },
];

function GamesPage() {
  return (
    <DashboardShell
      header={
        <TopHeaderBar
          title="Games & Activities"
          emoji=""
          subtitle="Playful experiences designed to help you recharge and refocus."
        />
      }
    >
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-hero p-8 shadow-card md:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-lavender/40 blur-3xl" />

        {/* Mascot sitting cleanly on bottom-right edge */}
        <img
          src={gamesHeroImg}
          alt="HappiMynd Mindful Games Mascot"
          className="pointer-events-none absolute bottom-0 right-6 hidden h-auto w-[170px] max-h-[92%] object-contain object-bottom md:block xl:right-12 xl:w-[210px]"
        />

        <div className="relative flex flex-col items-start gap-4 text-left md:max-w-[65%]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-lavender-deep">
            <Sparkles className="h-3.5 w-3.5" /> Coming Soon
          </span>

          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-brand shadow-glow">
            <Gamepad2 className="h-8 w-8 text-white" strokeWidth={2} />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Mindful Games Are on the Way
            </h2>
            <p className="text-base text-foreground/70 sm:text-lg">
              We're building a collection of playful, calming activities that help you relax, reset,
              and return to your day with a clearer mind.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-foreground/80 shadow-soft">
              <Clock className="h-4 w-4 text-lavender-deep" />
              Expected launch: Soon
            </div>

            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-brand px-7 shadow-glow transition hover:opacity-95"
            >
              <V2Link to="/" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </V2Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Liquid Puzzle Sort",
            desc: "A relaxing color sorting puzzle to calm your mind and organize your thoughts.",
          },
          {
            title: "Memory Card Flip",
            desc: "Match pairs of calming cards to boost memory and focus without pressure.",
          },
          {
            title: "One Line Connect",
            desc: "Connect all dots in a single continuous line to sharpen concentration and unwind.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-3xl bg-white/95 p-6 shadow-soft border border-white/80 transition hover:-translate-y-1 hover:shadow-card"
          >
            <div className="text-sm font-semibold text-foreground">{item.title}</div>
            <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-lavender-deep">
              <Clock className="h-3.5 w-3.5" /> Coming Soon
            </div>
          </div>
        ))}
      </section>

      {/* Navigation Options Bar */}
      <section className="mt-4 rounded-[2rem] bg-white/95 p-6 shadow-soft border border-white/80 md:p-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Explore Other Sections</h3>
          </div>
          <V2Link
            to="/support"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-lavender-deep hover:underline"
          >
            <CircleHelp className="h-3.5 w-3.5" /> Need Support?
          </V2Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {pageOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <V2Link
                key={opt.title}
                to={opt.to}
                className="group flex flex-col items-center justify-center rounded-2xl bg-white/80 p-4 text-center border border-lavender/30 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-card"
              >
                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl ${opt.bg} shadow-soft transition-transform group-hover:scale-105`}
                >
                  <Icon className="h-5 w-5 text-foreground/80" strokeWidth={2} />
                </div>
                <div className="mt-3 text-sm sm:text-base font-bold text-foreground">
                  {opt.title}
                </div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">
                  {opt.desc}
                </div>
              </V2Link>
            );
          })}
        </div>
      </section>
    </DashboardShell>
  );
}
