import { useLocation } from "react-router-dom";
import { V2Link, useV2Navigate, v2Url } from "@/v2/lib/router";
import { useState, type ReactNode } from "react";
import { auth, useAuth } from "@/v2/lib/auth";
import { LayoutDashboard, ClipboardCheck, BookOpen, Sparkles, Gamepad2, CreditCard, Puzzle, Activity, LifeBuoy, Settings, LogOut, Search, Calendar, Menu, Smartphone } from "lucide-react";
import { BookSessionDialog } from "@/v2/components/book-session-dialog";
import { Input } from "@/v2/components/ui/input";
import { Footer } from "./footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/v2/components/ui/avatar";
import { CartHeaderButton, CartAbandonmentDrawer } from "@/v2/components/cart-ui";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/v2/components/ui/dropdown-menu";

import { useAssessmentPhase } from "@/v2/lib/assessment/use-assessment-phase";
import { getAvatarUrl } from "@/v2/lib/avatars";
import logoImg from "@/v2/assets/happimynd-logo.png";

type NavItem = {
  icon: typeof LayoutDashboard;
  label: string;
  key: string;
  to?: string;
};

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard", to: "/" },
  { icon: ClipboardCheck, label: "Self Check In", key: "assessment", to: "/assessment" },
  { icon: Puzzle, label: "Quizzard", key: "quizzard", to: "/quizzard" },
  { icon: BookOpen, label: "Resources", key: "resources", to: "/resources" },
  { icon: Sparkles, label: "Services", key: "services", to: "/services" },
  { icon: Gamepad2, label: "Games", key: "games", to: "/games" },
];

/** Status shown in the header pill. */
export type HeaderStatus = "active" | "pending" | "not_given";

const statusStyles: Record<
  HeaderStatus,
  { label: string; shortLabel: string; pill: string; dot: string }
> = {
  active: {
    label: "Active",
    shortLabel: "Active",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:shadow-md",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    shortLabel: "Pending",
    pill: "bg-amber-50 text-amber-800 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)] ring-2 ring-amber-400/50 animate-pulse hover:bg-amber-100",
    dot: "bg-amber-500 animate-ping",
  },
  not_given: {
    label: "Not Started",
    shortLabel: "Not Started",
    pill: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:shadow-md",
    dot: "bg-rose-500",
  },
};

export function StatusPill({
  status,
  onClick,
  className = "",
}: {
  status: HeaderStatus;
  onClick?: () => void;
  className?: string;
}) {
  const s = statusStyles[status];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Assessment Status: ${s.label}`}
      title={`Assessment Status: ${s.label} — click to view assessment`}
      className={`inline-flex h-8 sm:h-9 md:h-10 items-center gap-1.5 rounded-full border px-2.5 sm:px-3 md:px-4 text-[10px] md:text-xs font-semibold shadow-soft transition-all duration-200 cursor-pointer shrink-0 ${s.pill} ${className}`}
    >
      <span className={`h-2 w-2 shrink-0 animate-pulse rounded-full ${s.dot}`} />
      <span className="hidden xs:inline sm:inline">{s.label}</span>
      <span className="xs:hidden sm:hidden">{s.shortLabel}</span>
    </button>
  );
}

function StickyHeaderContainer({ children }: { children: ReactNode }) {
  return (
    <div
      className="sticky top-0 z-50 w-full bg-white border-b border-border/40 shadow-md py-3 transition-all opacity-100"
      style={{ backgroundColor: "#ffffff", opacity: 1 }}
    >
      {children}
    </div>
  );
}

export function DashboardShell({ header, children }: { header?: ReactNode; children: ReactNode }) {
  const pathname = useLocation().pathname;
  const navigate = useV2Navigate();
  const { user } = useAuth();

  // Persist sidebar expanded state across navigations via localStorage
  const [expanded, setExpandedState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-expanded") === "true";
    }
    return false;
  });

  const setExpanded = (val: boolean) => {
    setExpandedState(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-expanded", String(val));
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate({ to: "/login", search: { redirect: undefined } });
  };

  const isActive = (item: NavItem) => {
    if (item.to) return pathname === v2Url(item.to);
    return false;
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-lavender/40 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-aqua/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-pastel-blue/30 blur-3xl" />
      </div>

      {/* Fixed Full-Width Header Bar - 100% Opaque Solid White */}
      <header
        className="fixed top-0 inset-x-0 z-50 w-full bg-white border-b border-border/40 shadow-sm py-3 md:py-4 opacity-100"
        style={{ backgroundColor: "#ffffff", opacity: 1 }}
      >
        <div className="mx-auto max-w-[1600px] px-3 sm:px-4 md:px-6">
          {header ?? <TopHeaderBar />}
        </div>
      </header>

      {/* Content layout: Fixed Sidebar + Main */}
      <div className="relative mx-auto flex flex-1 w-full max-w-[1600px] pt-20 sm:pt-24 md:pt-28 px-3 sm:px-4 md:px-6 pb-4 md:pb-6">
        {/* Fixed Desktop Sidebar */}
        <aside
          className={`fixed top-28 z-20 hidden h-[calc(100vh-8.5rem)] max-h-[calc(100vh-8.5rem)] flex-col rounded-3xl bg-white py-5 shadow-soft border border-border/40 transition-[width] duration-300 ease-out md:flex ${
            expanded ? "w-64 items-stretch px-4" : "w-20 items-center px-2"
          }`}
        >
          {/* Expand/Collapse Toggle */}
          <div className="flex items-center justify-center w-full px-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="grid h-10 w-10 place-items-center rounded-2xl text-muted-foreground transition hover:bg-lavender/20 hover:text-foreground cursor-pointer"
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <nav className={`mt-6 flex flex-1 flex-col gap-1.5 ${expanded ? "w-full" : ""}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              const cls = `group relative flex items-center gap-3 rounded-2xl text-sm font-medium transition-all ${
                expanded ? "px-4 py-3" : "justify-center px-3 py-3"
              } ${
                active
                  ? "bg-gradient-brand text-white shadow-glow"
                  : "text-muted-foreground hover:bg-lavender/20 hover:text-foreground"
              }`;
              if (item.to) {
                return (
                  <V2Link key={item.key} to={item.to} className={cls} aria-label={item.label}>
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                    {expanded && <span className="whitespace-nowrap">{item.label}</span>}
                  </V2Link>
                );
              }
              return (
                <button key={item.key} className={cls} aria-label={item.label}>
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                  {expanded && <span className="whitespace-nowrap">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {user ? (
            <button
              onClick={handleLogout}
              className={`mt-4 flex items-center gap-3 rounded-2xl text-sm font-medium text-muted-foreground transition-colors hover:bg-lavender/20 hover:text-foreground ${
                expanded ? "w-full px-4 py-3" : "justify-center px-3 py-3"
              }`}
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5 shrink-0" strokeWidth={2} />
              {expanded && <span>Logout</span>}
            </button>
          ) : (
            <V2Link
              to="/login"
              search={{ redirect: pathname }}
              className={`mt-4 flex items-center gap-3 rounded-2xl text-sm font-medium text-lavender-deep transition-colors hover:bg-lavender/20 ${
                expanded ? "w-full px-4 py-3" : "justify-center px-3 py-3"
              }`}
              aria-label="Log In"
            >
              <LogOut className="h-5 w-5 shrink-0 rotate-180" strokeWidth={2} />
              {expanded && <span>Log In</span>}
            </V2Link>
          )}
        </aside>

        {/* Main */}
        <main
          className={`min-w-0 flex-1 flex flex-col justify-between transition-[margin-left] duration-300 ease-out min-h-[calc(100vh-7rem)] pb-16 md:pb-2 ${
            expanded ? "md:ml-72" : "md:ml-24"
          }`}
        >
          <div className="space-y-8">{children}</div>
          <Footer />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav pathname={pathname} />
      {/* <CartAbandonmentDrawer /> */}
    </div>
  );
}

export function TopHeaderBar({
  title,
  subtitle,
  emoji,
  status: explicitStatus,
  onStatusClick,
}: {
  title?: string;
  subtitle?: ReactNode;
  emoji?: string;
  /** Drives the coloured status pill in the header. */
  status?: HeaderStatus;
  onStatusClick?: () => void;
}) {
  const [bookOpen, setBookOpen] = useState(false);
  const navigate = useV2Navigate();
  const { user } = useAuth();
  const { phase } = useAssessmentPhase();

  // Compute status automatically from HappiLIFE assessment phase unless overridden
  let currentStatus: HeaderStatus = explicitStatus ?? "active";
  if (!explicitStatus) {
    if (phase === "in-progress") {
      currentStatus = "pending";
    } else if (phase === "not-started") {
      currentStatus = "not_given";
    } else if (phase === "completed") {
      currentStatus = "active";
    }
  }

  const handleStatusClick = () => {
    if (onStatusClick) {
      onStatusClick();
    } else {
      navigate({ to: "/assessment" });
    }
  };

  const initials = user
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "KR";

  const userAvatar =
    user?.avatar ||
    (typeof window !== "undefined" && user?.email
      ? localStorage.getItem(`happimynd_avatar_${user.email.trim().toLowerCase().replace(/[^a-z0-9]/g, "_")}`)
      : null);
  const avatarSrc = userAvatar ? getAvatarUrl(userAvatar) : undefined;

  const handleLogout = () => {
    auth.signOut();
    navigate({ to: "/login", search: { redirect: undefined } });
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        {/* Fixed HappiMynd Logo at top left of full-width nav bar */}
        <V2Link
          to="/"
          className="shrink-0 flex items-center focus:outline-none select-none overflow-visible"
        >
          <img
            src={logoImg}
            alt="HappiMynd Logo"
            className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto max-h-20 object-contain -my-1.5 sm:-my-3 origin-left shrink-0"
          />
        </V2Link>

        <div className="min-w-0 border-l border-border/40 pl-2 sm:pl-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {title ? (
              <h1 className="text-sm sm:text-xl md:text-2xl font-bold tracking-tight text-foreground leading-tight truncate max-w-[130px] xs:max-w-[190px] sm:max-w-none sm:whitespace-normal sm:break-words">
                {title}
              </h1>
            ) : (
              <h1 className="text-sm sm:text-xl md:text-2xl font-bold tracking-tight text-foreground leading-tight truncate max-w-[130px] xs:max-w-[190px] sm:max-w-none sm:whitespace-normal sm:break-words">
                Welcome back, {user ? user.name : "Kritx"}{" "}
                <span className="hidden sm:inline text-xl">👋</span>
              </h1>
            )}
          </div>
          {subtitle !== undefined ? (
            typeof subtitle === "string" ? (
              <p className="hidden sm:block text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-tight sm:whitespace-normal sm:break-words mt-0.5">
                {subtitle}
              </p>
            ) : (
              <div className="hidden sm:block text-[10px] sm:text-xs md:text-sm">{subtitle}</div>
            )
          ) : (
            <p className="hidden sm:block text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-tight sm:whitespace-normal sm:break-words mt-0.5">
              Small steps toward conscious growth matter. Take a moment to check in with yourself
              today.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <div className="relative hidden xl:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search resources, games..."
            className="h-10 w-48 rounded-full border-0 bg-white pl-9 shadow-soft text-xs placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-lavender-deep/30 lg:w-60"
          />
        </div>
        <StatusPill status={currentStatus} onClick={handleStatusClick} />
        <a
          href="https://play.google.com/store/apps/details?id=com.happimynd"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 sm:h-9 md:h-10 items-center gap-1.5 rounded-full bg-gradient-brand text-white shadow-glow px-2.5 sm:px-3 md:px-4 text-xs font-semibold hover:opacity-95 transition-all duration-200 cursor-pointer shrink-0"
          aria-label="Download App"
          title="Download App"
        >
          <Smartphone className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Download App</span>
          <span className="sm:hidden"><span className="hidden xs:inline">App</span></span>
        </a>
        <button
          onClick={() => setBookOpen(true)}
          className="inline-flex h-8 sm:h-9 md:h-10 items-center gap-1.5 rounded-full bg-gradient-brand text-white border border-white/25 px-2.5 sm:px-3 md:px-4 text-xs font-semibold shadow-soft hover:shadow-[0_0_14px_rgba(168,85,247,0.5)] hover:border-white/60 hover:scale-[1.02] transition-all duration-200 cursor-pointer shrink-0"
          aria-label="Book a Session"
          title="Book a Session"
        >
          <Calendar className="h-4 w-4 shrink-0" strokeWidth={2} />
          <span className="hidden sm:inline">Book a Session</span>
          <span className="sm:hidden"><span className="hidden xs:inline">Book</span></span>
        </button>
        {/* <CartHeaderButton /> */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-deep/40 cursor-pointer">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 shadow-soft ring-2 ring-white">
                  {avatarSrc && <AvatarImage src={avatarSrc} alt={user.name} className="object-cover" />}
                  <AvatarFallback className="bg-gradient-brand font-semibold text-[10px] md:text-xs text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 mt-2 rounded-2xl bg-white border border-border/40 p-2 shadow-card select-none"
            >
              <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                My Workspace
              </DropdownMenuLabel>

              <DropdownMenuItem
                asChild
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-lavender/30 cursor-pointer flex items-center gap-2"
              >
                <V2Link to="/subscription">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  My Subscriptions
                </V2Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-lavender/30 cursor-pointer flex items-center gap-2"
              >
                <V2Link to="/support">
                  <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                  Support Center
                </V2Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-lavender/30 cursor-pointer flex items-center gap-2"
              >
                <V2Link to="/profile">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Profile Settings
                </V2Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1.5 border-border/30" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-all hover:bg-rose-50 cursor-pointer flex items-center gap-2"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <V2Link
              to="/login"
              search={{ redirect: typeof window !== "undefined" ? window.location.pathname : undefined }}
              className="inline-flex h-8 sm:h-9 items-center justify-center rounded-full border border-lavender-deep/40 px-3.5 py-1 text-xs font-semibold text-lavender-deep hover:bg-lavender/10 transition-colors"
            >
              Log In
            </V2Link>
            <V2Link
              to="/signup"
              search={{ redirect: typeof window !== "undefined" ? window.location.pathname : undefined }}
              className="inline-flex h-8 sm:h-9 items-center justify-center rounded-full bg-gradient-brand px-3.5 py-1 text-xs font-semibold text-white shadow-glow hover:opacity-95 transition-opacity"
            >
              Sign Up
            </V2Link>
          </div>
        )}

        <BookSessionDialog
          open={bookOpen}
          onOpenChange={setBookOpen}
          service={{ key: "solv", name: "SOLV" }}
        />
      </div>
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const items = navItems;
  return (
    <nav
      className="fixed inset-x-4 bottom-4 z-50 flex items-center justify-around rounded-3xl bg-white p-2 shadow-card md:hidden opacity-100"
      style={{ backgroundColor: "#ffffff", opacity: 1 }}
    >
      {items.map((it) => {
        const Icon = it.icon;
        const active = it.to ? pathname === v2Url(it.to) : false;
        const cls = `grid h-12 w-12 place-items-center rounded-2xl transition ${
          active ? "bg-gradient-brand text-white shadow-glow" : "text-muted-foreground"
        }`;
        if (it.to) {
          return (
            <V2Link key={it.key} to={it.to} className={cls} aria-label={it.label}>
              <Icon className="h-5 w-5" strokeWidth={2} />
            </V2Link>
          );
        }
        return (
          <button key={it.key} className={cls} aria-label={it.label}>
            <Icon className="h-5 w-5" strokeWidth={2} />
          </button>
        );
      })}
    </nav>
  );
}
