import { V2Link } from "@/v2/lib/router";
import { Clock, Image as ImageIcon } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { ARTICLES } from "@/v2/data/articles";

export default ArticlesIndex;
function ArticlesIndex() {
  return (
    <DashboardShell
      header={
        <TopHeaderBar
          title="Articles & Insights 📚"
          emoji=""
          subtitle="Expert perspectives to help you understand yourself and grow."
        />
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <header className="rounded-3xl bg-gradient-to-br from-lavender/60 via-white to-aqua/40 p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Growth Library
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Articles &amp; Insights
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Expert-written ideas and practical perspectives designed to support everyday growth -
            read at your own pace.
          </p>
        </header>

        {/* Horizontal scroll row */}
        <section>
          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ARTICLES.map((a) => (
              <article
                key={a.slug}
                className="group relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white/95 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow sm:w-[340px]"
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
                      alt={a.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover object-[50%_38%] transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-primary/40" strokeWidth={1.5} />
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
                  <h3 className="mt-3 text-base font-bold leading-snug tracking-tight">
                    {a.title}
                  </h3>
                  <div className="mt-4 flex-1" />
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Read Article
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
