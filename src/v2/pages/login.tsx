import { V2Link, useV2Navigate, useSearch } from "@/v2/lib/router";
import { useEffect, useState } from "react";
import { Mail, User, Lock, Eye, EyeOff, Sparkles, Heart, ShieldCheck, LoaderCircle, Phone, ArrowLeft, KeyRound, ChevronDown, UserPlus } from "lucide-react";
import { Button } from "@/v2/components/ui/button";
import { Input } from "@/v2/components/ui/input";
import { auth, useAuth } from "@/v2/lib/auth";
import { toast } from "sonner";
import {
  sendLoginOtp,
  verifyLoginOtp,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile,
  signUp,
  login,
  PROFILE_TYPES,
} from "@/v2/lib/auth-api";
import { PhoneField, OtpBoxes, ResendTimer } from "@/v2/components/phone-otp-input";
import { cn } from "@/v2/lib/utils";
import logoImg from "@/v2/assets/happimynd-logo.png";
import mascotImg from "@/v2/assets/images/mascot.webp";

type LoginSearch = {
  redirect?: string;
};

export default LoginPage;
// ---------------------------------------------------------------------------
// State machine for the right-hand card
// ---------------------------------------------------------------------------
type LoginTab = "password" | "otp";

type OtpStep =
  | "otp-phone"    // enter mobile number
  | "otp-verify";  // enter the 6-digit code

type ForgotStep =
  | "forgot-send"  // enter mobile / email
  | "forgot-otp"   // enter the code sent
  | "forgot-reset" // enter new password
  | "forgot-done"; // success

type CardState =
  | { mode: "tab"; tab: LoginTab }
  | { mode: "otp"; step: OtpStep; mobile: string }
  | { mode: "register"; mobile: string; countryCode: string; mobileVerifiedToken: string }
  | { mode: "forgot"; step: ForgotStep; contact: string; contactType: "mobile" | "email" };

function LoginPage() {
  const navigate = useV2Navigate();
  const { authed, hydrated } = useAuth();
  const searchParams = useSearch();
  const redirectTarget =
    searchParams.redirect && searchParams.redirect.startsWith("/") ? searchParams.redirect : "/";

  const [card, setCard] = useState<CardState>({ mode: "tab", tab: "password" });

  useEffect(() => {
    if (hydrated && authed) navigate({ to: redirectTarget as any, replace: true });
  }, [hydrated, authed, navigate, redirectTarget]);

  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen overflow-hidden bg-background flex flex-col justify-center">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-lavender/40 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-aqua/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-pastel-blue/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen lg:min-h-0 lg:h-full lg:max-h-screen w-full max-w-[1500px] items-center gap-4 lg:gap-6 xl:gap-8 p-3 sm:p-4 lg:p-5 xl:p-6 grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* ── Brand panel ── */}
        <section className="relative hidden overflow-hidden rounded-[2rem] xl:rounded-[2.5rem] bg-gradient-hero p-6 lg:p-7 xl:p-10 shadow-card lg:flex lg:h-full lg:max-h-full lg:flex-col lg:justify-between">
          <div className="absolute -top-10 right-10 h-32 w-32 rounded-full bg-white/40 blur-2xl" />
          <div className="absolute bottom-10 left-1/2 h-48 w-48 rounded-full bg-lavender/50 blur-3xl" />

          <div className="relative flex flex-col">
            <img src={logoImg} alt="HappiMynd Logo" className="h-12 w-auto object-contain lg:h-14 xl:h-18 self-start" />
            <h1 className="mt-4 lg:mt-6 xl:mt-8 max-w-md text-2xl lg:text-3xl xl:text-[2.6rem] font-bold leading-tight tracking-tight text-foreground">
              Welcome to your Guided Space for Conscious Growth.
            </h1>
            <ul className="mt-4 lg:mt-5 xl:mt-6 space-y-2 lg:space-y-3">
              {[
                { icon: Sparkles, text: "Personalized growth insights" },
                { icon: Heart, text: "Learning resources & interactive experiences" },
                { icon: ShieldCheck, text: "Private, confidential, and secure" },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <li key={f.text} className="flex items-center gap-2.5 lg:gap-3">
                    <span className="grid h-8 w-8 lg:h-9 lg:w-9 shrink-0 place-items-center rounded-xl bg-white/80 text-lavender-deep shadow-soft">
                      <Icon className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                    <span className="text-xs lg:text-sm font-medium text-foreground/80">{f.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative mt-4 lg:mt-6 flex shrink-0 items-end gap-3 lg:gap-4">
            <img
              src={mascotImg}
              alt="HappiMynd mascot HAPPI waving hello"
              width={220}
              height={220}
              className="h-auto w-[100px] lg:w-[125px] xl:w-[155px] drop-shadow-lg"
            />
            <div className="mb-2 lg:mb-4 max-w-[220px] xl:max-w-[240px] rounded-2xl bg-white px-3.5 py-2.5 lg:px-5 lg:py-3 shadow-soft">
              <p className="text-xs lg:text-sm font-semibold leading-snug text-foreground">
                Hi, I'm HAPPI... Ready when you are !!
              </p>
            </div>
          </div>
        </section>

        {/* ── Form panel ── */}
        <section className="flex h-full max-h-full items-center justify-center px-2 py-4 sm:px-6 overflow-hidden">
          <div className="w-full max-w-md my-auto flex flex-col justify-center max-h-full">
            {/* Mobile logo */}
            <div className="mb-4 flex justify-center lg:hidden">
              <img src={logoImg} alt="HappiMynd Logo" className="h-12 w-auto object-contain" />
            </div>

            <div className="rounded-[2rem] bg-white p-5 sm:p-6 xl:p-8 shadow-card flex flex-col max-h-full overflow-y-auto lg:overflow-visible">
              {/* ── Tab mode ── */}
              {card.mode === "tab" && (
                <TabMode
                  tab={card.tab}
                  onTabChange={(t) => setCard({ mode: "tab", tab: t })}
                  onStartOtp={() => setCard({ mode: "otp", step: "otp-phone", mobile: "" })}
                  onForgotPassword={() =>
                    setCard({ mode: "forgot", step: "forgot-send", contact: "", contactType: "mobile" })
                  }
                />
              )}

              {/* ── OTP flow ── */}
              {card.mode === "otp" && (
                <OtpFlow
                  step={card.step}
                  mobile={card.mobile}
                  onBack={() => setCard({ mode: "tab", tab: "otp" })}
                  onMobileSubmit={(mobile) => setCard({ mode: "otp", step: "otp-verify", mobile })}
                  onOtpResend={() => setCard({ mode: "otp", step: "otp-verify", mobile: card.mobile })}
                  onSuccess={() => navigate({ to: "/" })}
                  onRegister={(mobile, countryCode, token) =>
                    setCard({ mode: "register", mobile, countryCode, mobileVerifiedToken: token })
                  }
                />
              )}

              {/* ── Inline registration form ── */}
              {card.mode === "register" && (
                <InlineRegisterForm
                  mobile={card.mobile}
                  countryCode={card.countryCode}
                  mobileVerifiedToken={card.mobileVerifiedToken}
                  onBack={() => setCard({ mode: "otp", step: "otp-verify", mobile: card.mobile })}
                  onSuccess={() => navigate({ to: "/" })}
                />
              )}

              {/* ── Forgot-password flow ── */}
              {card.mode === "forgot" && (
                <ForgotFlow
                  step={card.step}
                  contact={card.contact}
                  contactType={card.contactType}
                  onBack={() => setCard({ mode: "tab", tab: "password" })}
                  onContactSubmit={(contact, type) =>
                    setCard({ mode: "forgot", step: "forgot-otp", contact, contactType: type })
                  }
                  onOtpVerified={(contact, type) =>
                    setCard({ mode: "forgot", step: "forgot-reset", contact, contactType: type })
                  }
                  onResetDone={() => {
                    setCard({ mode: "tab", tab: "password" });
                    toast.success("Password reset! Please log in with your new password.");
                  }}
                  onResend={(contact, type) =>
                    setCard({ mode: "forgot", step: "forgot-otp", contact, contactType: type })
                  }
                />
              )}
            </div>

            <p className="mt-2.5 lg:mt-4 text-center text-[11px] sm:text-xs text-muted-foreground/80">
              By continuing you agree to our{" "}
              <span className="font-medium text-foreground/60">Terms</span> and{" "}
              <span className="font-medium text-foreground/60">Privacy Policy</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TabMode — the two-tab switcher + password form
// ---------------------------------------------------------------------------

function TabMode({
  tab,
  onTabChange,
  onStartOtp,
  onForgotPassword,
}: {
  tab: LoginTab;
  onTabChange: (t: LoginTab) => void;
  onStartOtp: () => void;
  onForgotPassword: () => void;
}) {
  const search = useSearch();
  return (
    <>
      <span className="inline-flex items-center gap-2 rounded-full bg-lavender/40 px-3 py-1 text-xs font-semibold text-lavender-deep self-center">
        <Sparkles className="h-3.5 w-3.5" /> Welcome
      </span>
      <h2 className="mt-2.5 lg:mt-3 text-center text-xl sm:text-2xl xl:text-3xl font-bold tracking-tight text-foreground">
        Log in to HappiMynd
      </h2>
      <p className="mt-1 lg:mt-2 text-center text-xs sm:text-sm text-muted-foreground">
        New to HappiMynd?{" "}
        <V2Link to="/signup" search={{ redirect: search.redirect }} className="font-semibold text-lavender-deep hover:underline">
          Create an account
        </V2Link>
      </p>

      {/* Tab switcher */}
      <div className="mt-3.5 lg:mt-4 xl:mt-5 flex rounded-2xl bg-lavender/20 p-1">
        <button
          id="tab-password"
          type="button"
          onClick={() => onTabChange("password")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all cursor-pointer",
            tab === "password"
              ? "bg-white text-lavender-deep shadow-soft"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Lock className="h-3.5 w-3.5" /> Password
        </button>
        <button
          id="tab-otp"
          type="button"
          onClick={() => onTabChange("otp")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all cursor-pointer",
            tab === "otp"
              ? "bg-white text-lavender-deep shadow-soft"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Phone className="h-3.5 w-3.5" /> Mobile OTP
        </button>
      </div>

      {tab === "password" && (
        <PasswordForm onForgotPassword={onForgotPassword} />
      )}

      {tab === "otp" && (
        <div className="mt-4 lg:mt-5 space-y-3 lg:space-y-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter your registered mobile number to receive a one-time password.
          </p>
          <Button
            id="start-otp-btn"
            type="button"
            onClick={onStartOtp}
            className="h-10.5 lg:h-11 xl:h-12 w-full rounded-2xl bg-gradient-brand text-xs sm:text-sm font-semibold text-white shadow-glow transition hover:opacity-95 cursor-pointer"
          >
            <Phone className="mr-2 h-4 w-4" /> Continue with Mobile OTP
          </Button>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// PasswordForm — username + password
// ---------------------------------------------------------------------------

function PasswordForm({ onForgotPassword }: { onForgotPassword: () => void }) {
  const navigate = useV2Navigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter your username and password.");
      return;
    }
    setSubmitting(true);
    const cleanUsername = username.trim();
    try {
      const res = await login({ username: cleanUsername, password });
      if ("access_token" in res && res.access_token) {
        const token = res.access_token;
        const userObj = (res as any).user;
        let name = userObj?.nickname ?? userObj?.name ?? cleanUsername;
        let email = userObj?.email ?? (cleanUsername.includes("@") ? cleanUsername : `${cleanUsername}@happimynd.app`);

        if (!userObj) {
          try {
            const profile = await getProfile(token);
            const profileName = profile.data?.nickname ?? profile.data?.name ?? profile.nickname ?? profile.name;
            if (profileName) name = String(profileName);
            const profileEmail = profile.data?.email ?? profile.email;
            if (profileEmail) email = String(profileEmail);
          } catch {
            // Profile fetch failed — fall back to username as display name
          }
        }

        auth.signIn({ name, email, token });
        toast.success(`Welcome back, ${name}!`);
        navigate({ to: "/" });
      } else {
        toast.error((res as any).message ?? "Invalid username or password.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3.5 lg:mt-4 xl:mt-5 space-y-2.5 lg:space-y-3.5">
      <div>
        <label htmlFor="username" className="mb-1 block text-xs lg:text-sm font-semibold text-foreground/80">
          Username
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-10.5 lg:h-11 xl:h-12 rounded-2xl border-0 bg-white/90 pl-11 text-xs sm:text-sm shadow-soft placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-lavender-deep/30"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-xs lg:text-sm font-semibold text-foreground/80">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10.5 lg:h-11 xl:h-12 rounded-2xl border-0 bg-white/90 pl-11 pr-11 text-xs sm:text-sm shadow-soft placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-lavender-deep/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl text-muted-foreground transition hover:bg-lavender/20 hover:text-foreground cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-0.5">
        <label className="flex cursor-pointer select-none items-center gap-2 text-xs sm:text-sm text-foreground/70">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded border-border accent-[oklch(0.58_0.22_293)]"
          />
          Remember me
        </label>
        <button
          type="button"
          id="forgot-password-btn"
          onClick={onForgotPassword}
          className="text-xs sm:text-sm font-semibold text-lavender-deep hover:underline cursor-pointer"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        id="password-login-btn"
        className="mt-1 lg:mt-2 h-10.5 lg:h-11 xl:h-12 w-full rounded-2xl bg-gradient-brand text-xs sm:text-sm font-semibold text-white shadow-glow transition hover:opacity-95 cursor-pointer"
      >
        {submitting ? (
          <><LoaderCircle className="h-4 w-4 animate-spin" /> Signing in…</>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// OtpFlow — phone entry + OTP verification
// ---------------------------------------------------------------------------

function OtpFlow({
  step,
  mobile,
  onBack,
  onMobileSubmit,
  onOtpResend,
  onSuccess,
  onRegister,
}: {
  step: OtpStep;
  mobile: string;
  onBack: () => void;
  onMobileSubmit: (mobile: string) => void;
  onOtpResend: () => void;
  onSuccess: () => void;
  onRegister: (mobile: string, countryCode: string, token: string) => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        id="otp-back-btn"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <span className="inline-flex items-center gap-2 rounded-full bg-lavender/40 px-3 py-1 text-xs font-semibold text-lavender-deep">
        <Phone className="h-3.5 w-3.5" /> Mobile OTP Login
      </span>

      {step === "otp-phone" && (
        <PhoneStep onSubmit={onMobileSubmit} />
      )}

      {step === "otp-verify" && (
        <VerifyStep
          mobile={mobile}
          countryCode="91"
          onResend={onOtpResend}
          onSuccess={onSuccess}
          onRegister={onRegister}
        />
      )}
    </>
  );
}

function PhoneStep({ onSubmit }: { onSubmit: (mobile: string) => void }) {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await sendLoginOtp({ type: "mobile", mobile, country_code: "91" });
      if (res.status === "error") {
        toast.error(res.message ?? "Failed to send OTP.");
        return;
      }
      toast.success("OTP sent to your mobile!");
      onSubmit(mobile);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Enter your mobile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll send a one-time password to verify your identity.
        </p>
      </div>
      <PhoneField mobile={mobile} onChange={setMobile} disabled={loading} />
      <Button
        id="send-otp-btn"
        type="button"
        disabled={loading || mobile.length !== 10}
        onClick={handleSend}
        className="h-12 w-full rounded-2xl bg-gradient-brand text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50"
      >
        {loading ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Send OTP"}
      </Button>
    </div>
  );
}

function VerifyStep({
  mobile,
  countryCode,
  onResend,
  onSuccess,
  onRegister,
}: {
  mobile: string;
  countryCode: string;
  onResend: () => void;
  onSuccess: () => void;
  onRegister: (mobile: string, countryCode: string, token: string) => void;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the full 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyLoginOtp({ mobile, country_code: countryCode, otp });

      if (res.status === "success" && "access_token" in res) {
        // Existing user — fetch profile for their name, then sign in
        const token = res.access_token;
        let name = `+91 ${mobile}`;
        let email = profile_email(mobile);
        try {
          const profile = await getProfile(token);
          const profileName =
            profile.data?.nickname ??
            profile.data?.name ??
            profile.nickname ??
            profile.name;
          if (profileName) name = String(profileName);
          const profileEmail = profile.data?.email ?? profile.email;
          if (profileEmail) email = String(profileEmail);
        } catch {
          // Profile fetch failed — use mobile as display name
        }
        auth.signIn({ name, email, token });
        toast.success(`Welcome back!`);
        onSuccess();
      } else if (res.status === "register" && "mobile_verified_token" in res) {
        // New user — redirect to registration
        toast.info("Looks like you're new here! Complete your profile to continue.");
        onRegister(mobile, countryCode, res.mobile_verified_token);
      } else {
        toast.error((res as { message?: string }).message ?? "Invalid OTP. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await sendLoginOtp({ type: "mobile", mobile, country_code: countryCode });
      if (res.status === "error") {
        toast.error(res.message ?? "Failed to resend OTP.");
      } else {
        toast.success("New OTP sent!");
        onResend(); // remount ResendTimer with fresh countdown
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Verify OTP</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-foreground">+91 {mobile}</span>
        </p>
      </div>

      <OtpBoxes value={otp} onChange={setOtp} disabled={loading} />

      <Button
        id="verify-otp-btn"
        type="button"
        disabled={loading || otp.length !== 6}
        onClick={handleVerify}
        className="h-12 w-full rounded-2xl bg-gradient-brand text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50"
      >
        {loading ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Verifying…</> : "Verify & Login"}
      </Button>

      <ResendTimer onResend={handleResend} resending={resending} />
    </div>
  );
}

// Small helper to avoid storing undefined email for OTP users
function profile_email(mobile: string) {
  return `+91${mobile}@otp.happimynd.app`;
}

// ---------------------------------------------------------------------------
// ForgotFlow — 3-step password reset
// ---------------------------------------------------------------------------

function ForgotFlow({
  step,
  contact,
  contactType,
  onBack,
  onContactSubmit,
  onOtpVerified,
  onResetDone,
  onResend,
}: {
  step: ForgotStep;
  contact: string;
  contactType: "mobile" | "email";
  onBack: () => void;
  onContactSubmit: (contact: string, type: "mobile" | "email") => void;
  onOtpVerified: (contact: string, type: "mobile" | "email") => void;
  onResetDone: () => void;
  onResend: (contact: string, type: "mobile" | "email") => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        id="forgot-back-btn"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to login
      </button>

      <span className="inline-flex items-center gap-2 rounded-full bg-lavender/40 px-3 py-1 text-xs font-semibold text-lavender-deep">
        <KeyRound className="h-3.5 w-3.5" /> Reset Password
      </span>

      {step === "forgot-send" && (
        <ForgotSend onSubmit={onContactSubmit} />
      )}
      {step === "forgot-otp" && (
        <ForgotOtp
          contact={contact}
          contactType={contactType}
          onVerified={() => onOtpVerified(contact, contactType)}
          onResend={() => onResend(contact, contactType)}
        />
      )}
      {step === "forgot-reset" && (
        <ForgotReset contact={contact} contactType={contactType} onDone={onResetDone} />
      )}
    </>
  );
}

function ForgotSend({
  onSubmit,
}: {
  onSubmit: (contact: string, type: "mobile" | "email") => void;
}) {
  const [contactType, setContactType] = useState<"mobile" | "email">("mobile");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!contact.trim()) {
      toast.error("Please enter your mobile number or email.");
      return;
    }
    setLoading(true);
    try {
      const payload =
        contactType === "mobile"
          ? { type: "mobile" as const, email: "", mobile: contact }
          : { type: "email" as const, email: contact, mobile: "" };
      const res = await forgotPassword(payload);
      if (res.status === "error") {
        toast.error(res.message ?? "Failed to send verification code.");
        return;
      }
      toast.success("Verification code sent!");
      onSubmit(contact, contactType);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Forgot password?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your registered mobile or email to receive a reset code.
        </p>
      </div>

      {/* Mobile / Email toggle */}
      <div className="flex rounded-2xl bg-lavender/20 p-1">
        {(["mobile", "email"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setContactType(t); setContact(""); }}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold capitalize transition-all",
              contactType === t
                ? "bg-white text-lavender-deep shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "mobile" ? <Phone className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
            {t}
          </button>
        ))}
      </div>

      {contactType === "mobile" ? (
        <PhoneField mobile={contact} onChange={setContact} disabled={loading} />
      ) : (
        <div>
          <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-semibold text-foreground/80">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="forgot-email"
              type="email"
              placeholder="you@company.com"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              disabled={loading}
              className="h-12 rounded-2xl border-0 bg-white/90 pl-11 shadow-soft placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-lavender-deep/30"
            />
          </div>
        </div>
      )}

      <Button
        id="forgot-send-btn"
        type="button"
        disabled={loading || !contact.trim()}
        onClick={handleSend}
        className="h-12 w-full rounded-2xl bg-gradient-brand text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50"
      >
        {loading ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Send Verification Code"}
      </Button>
    </div>
  );
}

function ForgotOtp({
  contact,
  contactType,
  onVerified,
  onResend,
}: {
  contact: string;
  contactType: "mobile" | "email";
  onVerified: () => void;
  onResend: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const payload =
        contactType === "mobile"
          ? { email: "", mobile: contact, otp }
          : { email: contact, mobile: "", otp };
      const res = await verifyOtp(payload);
      if (res.status === "success") {
        onVerified();
      } else {
        toast.error(res.message ?? "Incorrect code. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const payload =
        contactType === "mobile"
          ? { type: "mobile" as const, email: "", mobile: contact }
          : { type: "email" as const, email: contact, mobile: "" };
      const res = await forgotPassword(payload);
      if (res.status !== "success") {
        toast.error(res.message ?? "Failed to resend code.");
      } else {
        toast.success("New code sent!");
        onResend();
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Enter verification code</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Code sent to{" "}
          <span className="font-semibold text-foreground">
            {contactType === "mobile" ? `+91 ${contact}` : contact}
          </span>
        </p>
      </div>

      <OtpBoxes value={otp} onChange={setOtp} disabled={loading} />

      <Button
        id="forgot-verify-btn"
        type="button"
        disabled={loading || otp.length !== 6}
        onClick={handleVerify}
        className="h-12 w-full rounded-2xl bg-gradient-brand text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50"
      >
        {loading ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Verifying…</> : "Verify Code"}
      </Button>

      <ResendTimer onResend={handleResend} resending={resending} />
    </div>
  );
}

function ForgotReset({
  contact,
  contactType,
  onDone,
}: {
  contact: string;
  contactType: "mobile" | "email";
  onDone: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) { toast.error("Please enter a new password."); return; }
    if (password !== confirm) { toast.error("Passwords don't match."); return; }
    setLoading(true);
    try {
      const payload =
        contactType === "mobile"
          ? { password, confirm_password: confirm, email: "", mobile: contact }
          : { password, confirm_password: confirm, email: contact, mobile: "" };
      const res = await resetPassword(payload);
      if (res.status === "success") {
        onDone();
      } else {
        toast.error(res.message ?? "Failed to reset password. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Set new password</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="mb-1.5 block text-sm font-semibold text-foreground/80">
            New Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="new-password"
              type={showPwd ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="h-12 rounded-2xl border-0 bg-white/90 pl-11 pr-11 shadow-soft focus-visible:ring-2 focus-visible:ring-lavender-deep/30"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl text-muted-foreground transition hover:bg-lavender/20"
              aria-label={showPwd ? "Hide" : "Show"}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-semibold text-foreground/80">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirm-password"
              type={showPwd ? "text" : "password"}
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="h-12 rounded-2xl border-0 bg-white/90 pl-11 shadow-soft focus-visible:ring-2 focus-visible:ring-lavender-deep/30"
            />
          </div>
        </div>

        <Button
          id="reset-password-btn"
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-2xl bg-gradient-brand text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50"
        >
          {loading ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InlineRegisterForm — complete profile after phone OTP verification inline
// ---------------------------------------------------------------------------

function InlineRegisterForm({
  mobile,
  countryCode,
  mobileVerifiedToken,
  onBack,
  onSuccess,
}: {
  mobile: string;
  countryCode: string;
  mobileVerifiedToken: string;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [nickName, setNickName] = useState("");
  const [profileTypeId, setProfileTypeId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickName.trim()) { toast.error("Please enter your nickname."); return; }
    if (!profileTypeId) { toast.error("Please select a profile type."); return; }
    if (!age || Number(age) <= 0) { toast.error("Please enter a valid age."); return; }
    if (!gender) { toast.error("Please select your gender."); return; }
    if (!username.trim()) { toast.error("Please choose a username."); return; }
    if (!password.trim()) { toast.error("Please enter a password."); return; }
    if (password !== confirmPassword) { toast.error("Passwords don't match."); return; }

    setSubmitting(true);
    try {
      const res = await signUp({
        nickname: nickName.trim(),
        user_profile_id: Number(profileTypeId),
        age: Number(age),
        gender: gender,
        username: username.trim(),
        password: password,
        confirm_password: confirmPassword,
        signup_type: "individual",
        country_code: countryCode,
        mobile: mobile,
        language: 1,
        device_token: "",
        mobile_verified_token: mobileVerifiedToken,
      });

      const token =
        res.access_token ||
        (res as any).token ||
        (res as any).data?.access_token ||
        (res as any).data?.token;

      const isSuccess =
        res.status === "success" ||
        (res as any).status === 200 ||
        (res as any).status === true ||
        (res as any).success === true ||
        (res as any).code === 200 ||
        !!token;

      if (isSuccess) {
        let authToken = token;
        if (!authToken && username.trim() && password) {
          try {
            const loginRes = await login({ username: username.trim(), password });
            if ("access_token" in loginRes && loginRes.access_token) {
              authToken = loginRes.access_token;
            }
          } catch {
            // Ignore login error
          }
        }

        if (authToken) {
          auth.signIn({
            name: nickName.trim(),
            email: `${username.trim()}@happimynd.app`,
            token: authToken,
          });
          toast.success(`Welcome to HappiMynd, ${nickName.trim()}!`);
          onSuccess();
        } else {
          toast.success("Account created successfully! Please log in.");
          onSuccess();
        }
      } else {
        toast.error(res.message ?? "Failed to create account. Please check your details.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "h-11 rounded-2xl border-0 bg-white/90 px-4 text-sm shadow-soft placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-lavender-deep/30";
  const selectClass =
    "h-11 w-full appearance-none rounded-2xl border-0 bg-white/90 px-4 pr-11 text-sm text-foreground shadow-soft focus:outline-none focus:ring-2 focus:ring-lavender-deep/30";

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        id="register-back-btn"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <span className="inline-flex items-center gap-2 rounded-full bg-lavender/40 px-3 py-1 text-xs font-semibold text-lavender-deep">
        <UserPlus className="h-3.5 w-3.5" /> Complete Registration
      </span>

      <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground">
        Create Your Profile
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Phone <span className="font-semibold text-foreground">+91 {mobile}</span> verified! Fill in details below to get started.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        <div>
          <label htmlFor="reg-nickname" className="mb-1 block text-xs font-semibold text-foreground/80">
            Nickname *
          </label>
          <Input
            id="reg-nickname"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            placeholder="Nickname"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="reg-profiletype" className="mb-1 block text-xs font-semibold text-foreground/80">
            Profile Type *
          </label>
          <div className="relative">
            <select
              id="reg-profiletype"
              value={profileTypeId}
              onChange={(e) => setProfileTypeId(e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>Select profile type</option>
              {PROFILE_TYPES.map((p: { id: number; label: string }) => (
                <option key={p.id} value={String(p.id)}>{p.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="reg-age" className="mb-1 block text-xs font-semibold text-foreground/80">
              Age *
            </label>
            <Input
              id="reg-age"
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="reg-gender" className="mb-1 block text-xs font-semibold text-foreground/80">
              Gender *
            </label>
            <div className="relative">
              <select
                id="reg-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={selectClass}
              >
                <option value="" disabled>Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="reg-username" className="mb-1 block text-xs font-semibold text-foreground/80">
            Username *
          </label>
          <Input
            id="reg-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose username"
            autoComplete="username"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="reg-password" className="mb-1 block text-xs font-semibold text-foreground/80">
            Password *
          </label>
          <Input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="new-password"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="reg-confirm-password" className="mb-1 block text-xs font-semibold text-foreground/80">
            Confirm Password *
          </label>
          <Input
            id="reg-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            autoComplete="new-password"
            className={fieldClass}
          />
        </div>

        <Button
          id="reg-submit-btn"
          type="submit"
          disabled={submitting}
          className="mt-2 h-11 w-full rounded-2xl bg-gradient-brand text-xs font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50"
        >
          {submitting ? (
            <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Creating Profile…</>
          ) : (
            "Complete Registration & Continue"
          )}
        </Button>
      </form>
    </div>
  );
}

