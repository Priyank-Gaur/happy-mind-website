import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Clock, Image, Share2 } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { Button } from "@/v2/components/ui/button";
import { ARTICLES, getArticle, type Article, type ArticleBlock } from "@/v2/data/articles";
import { V2Link } from "@/v2/lib/router";

function NotFoundArticle() {
  return (
    <DashboardShell header={<TopHeaderBar title="Article" emoji="" subtitle="" />}>
      <section className="rounded-3xl bg-white/95 p-10 text-center shadow-soft border border-white/80">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The article you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-6 rounded-full bg-gradient-brand text-white shadow-glow">
          <V2Link to="/resources" className="inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to Resources
          </V2Link>
        </Button>
      </section>
    </DashboardShell>
  );
}

function renderBlock(block: ArticleBlock, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} className="mt-10 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} className="mt-8 text-xl font-bold tracking-tight text-foreground">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p key={i} className="mt-5 text-[17px] leading-[1.85] text-foreground/85">
          {block.text}
        </p>
      );
    case "quote":
      return (
        <blockquote
          key={i}
          className="mt-8 rounded-2xl border-l-4 border-primary bg-gradient-lavender/60 px-6 py-5 text-lg font-medium italic leading-relaxed text-primary"
        >
          {block.text}
        </blockquote>
      );
    case "ul":
      return (
        <ul key={i} className="mt-5 space-y-3 pl-1">
          {block.items.map((it, idx) => (
            <li
              key={idx}
              className="relative pl-6 text-[17px] leading-[1.75] text-foreground/85 before:absolute before:left-0 before:top-[0.7rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary"
            >
              {it}
            </li>
          ))}
        </ul>
      );
  }
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = slug ? getArticle(slug) : undefined;

  useEffect(() => {
    if (article) document.title = article.seoTitle;
  }, [article]);

  if (!article) return <NotFoundArticle />;

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <DashboardShell
      header={
        <TopHeaderBar
          title="Articles & Insights"
          emoji=""
          subtitle="A quiet space to read, reflect and return to yourself."
        />
      }
    >
      {/* Back */}
      <div>
        <Button
          asChild
          variant="ghost"
          className="rounded-full text-sm font-semibold text-primary hover:bg-white/60 hover:text-primary"
        >
          <V2Link to="/resources" className="inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to Resources
          </V2Link>
        </Button>
      </div>

      {/* Hero image */}
      <div className="mx-auto relative aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-[2rem] bg-gradient-lavender shadow-card">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <Image className="h-10 w-10 text-primary/40" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Header */}
      <header className="mx-auto max-w-3xl text-center">
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="rounded-full bg-lavender/60 px-3 py-1 font-semibold text-primary">
            {article.category}
          </span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> {article.time}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-[2.6rem] md:leading-[1.15]">
          {article.title}
        </h1>

        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: article.title, url: window.location.href }).catch(() => {});
              } else if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="rounded-full border-primary/20 bg-white/70 text-primary hover:bg-white cursor-pointer"
          >
            <Share2 className="mr-1 h-4 w-4" /> Share
          </Button>
        </div>
      </header>

      {/* Body */}
      <article className="mx-auto max-w-3xl rounded-[2rem] bg-white/95 p-8 shadow-soft border border-white/80 sm:p-12">
        {article.body.map((b: ArticleBlock, i: number) => renderBlock(b, i))}
      </article>

      {/* Recommended */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Recommended</h2>
          <p className="mt-1 text-sm text-muted-foreground">Articles you might find insightful.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a: Article) => (
            <article
              key={a.slug}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white/95 shadow-soft border border-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              <V2Link
                to={`/articles/${a.slug}`}
                className="absolute inset-0 z-10"
                aria-label={a.title}
              />
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-mint">
                {a.image ? (
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-[50%_38%] transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <Image className="h-8 w-8 text-primary/40" strokeWidth={1.5} />
                  </div>
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
    </DashboardShell>
  );
}
