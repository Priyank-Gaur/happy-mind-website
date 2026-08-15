import { V2Link, useV2Navigate, useSearch } from "@/v2/lib/router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, LoaderCircle, Phone, Sparkles, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/v2/components/ui/button";
import { Input } from "@/v2/components/ui/input";
import { auth, useAuth } from "@/v2/lib/auth";
import { toast } from "sonner";
import {
  sendLoginOtp,
  verifyLoginOtp,
  signUp,
  login,
  getProfile,
  PROFILE_TYPES,
} from "@/v2/lib/auth-api";
import {
  fetchOrganizerList,
  fetchUserProfileList,
  type OrganizerItem,
  type UserProfileItem,
} from "@/v2/lib/website-api";
import { PhoneField, OtpBoxes, ResendTimer } from "@/v2/components/phone-otp-input";
import logoImg from "@/v2/assets/happimynd-logo.png";
import mascotImg from "@/v2/assets/images/mascot.webp";

// ---------------------------------------------------------------------------
// Route — typed search params for the OTP → register redirect from /login
// ---------------------------------------------------------------------------

export type SignupSearch = {
  mobile?: string;
  country_code?: string;
  mobile_verified_token?: string;
  redirect?: string;
};

export default SignupPage;
/** The three ways a person can get started. */
type Category = "organization" | "individual" | "school";

/**
 * Steps in the sign-up flow.
 * phone-verify is inserted before create-profile for the individual path.
 */
type Step = "get-started" | "welcome" | "phone-verify" | "otp-verify" | "create-profile";

/** Demo sponsor list used by the "Select Name of Sponsor" dropdown. */
const SPONSORS = [
  "Acme Corporation",
  "BrightFuture Foundation",
  "Green Valley School",
  "Nova University",
  "Wellness First Pvt. Ltd.",
];

function SignupPage() {
  const navigate = useV2Navigate();
  const { authed, hydrated } = useAuth();
  const searchParams = useSearch();
  const redirectTarget =
    searchParams.redirect && searchParams.redirect.startsWith("/") ? searchParams.redirect : "/";

  const [step, setStep] = useState<Step>("get-started");
  const [category, setCategory] = useState<Category | null>(null);

  // Phone-verify state (for individual path)
  const [phoneMobile, setPhoneMobile] = useState("");
  const [mobileVerifiedToken, setMobileVerifiedToken] = useState("");
  const [verifiedMobile, setVerifiedMobile] = useState("");
  const [otpSending, setOtpSending] = useState(false);

  // Welcome / sponsor step
  const [sponsor, setSponsor] = useState("");
  const [happiCode, setHappiCode] = useState("");

  // Create profile step
  const [nickName, setNickName] = useState("");
  const [profileTypeId, setProfileTypeId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notRobot, setNotRobot] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Live API dropdown states
  const [organizerList, setOrganizerList] = useState<OrganizerItem[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfileItem[]>([]);

  useEffect(() => {
    fetchOrganizerList().then(setOrganizerList).catch(() => {});
    fetchUserProfileList().then(setUserProfiles).catch(() => {});
  }, []);

  // Already signed in? Skip sign-up.
  useEffect(() => {
    if (hydrated && authed) navigate({ to: redirectTarget as any, replace: true });
  }, [hydrated, authed, navigate, redirectTarget]);

  // If redirected from /login (status === "register"), skip phone-verify
  useEffect(() => {
    if (
      searchParams.mobile &&
      searchParams.country_code &&
      searchParams.mobile_verified_token
    ) {
      setVerifiedMobile(searchParams.mobile);
      setMobileVerifiedToken(searchParams.mobile_verified_token);
      setCategory("individual");
      setStep("create-profile");
    }
  }, [searchParams.mobile, searchParams.country_code, searchParams.mobile_verified_token]);

  /** Route each category to the right next step. */
  const handleCategory = (c: Category) => {
    setCategory(c);
    if (c === "individual") {
      setStep("phone-verify");
    } else {
      setStep("welcome");
    }
  };

  const handleWelcomeContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsor) { toast.error("Please select the name of your sponsor."); return; }
    if (!happiCode.trim()) { toast.error("Please enter your HappiMynd Code."); return; }
    setStep("create-profile");
  };

  const handleBack = () => {
    if (step === "otp-verify") { setStep("phone-verify"); return; }
    if (step === "phone-verify") { setStep("get-started"); return; }
    if (step === "create-profile") {
      if (category === "individual") setStep("phone-verify");
      else setStep("welcome");
      return;
    }
    if (step === "welcome") { setStep("get-started"); return; }
  };

  // ── Phone step: send OTP ─────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (phoneMobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpSending(true);
    try {
      const res = await sendLoginOtp({ type: "mobile", mobile: phoneMobile, country_code: "91" });
      if (res.status === "error") {
        toast.error(res.message ?? "Failed to send OTP.");
        return;
      }
      toast.success("OTP sent to your mobile!");
      setStep("otp-verify");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  // ── OTP step: verify ─────────────────────────────────────────────────────
  const handleVerifyOtp = async (otp: string) => {
    if (otp.length !== 6) { toast.error("Please enter the full 6-digit OTP."); return false; }
    try {
      const res = await verifyLoginOtp({ mobile: phoneMobile, country_code: "91", otp });
      if (res.status === "success" && "access_token" in res) {
        const token = res.access_token;
        let name = `+91 ${phoneMobile}`;
        let email = `+91${phoneMobile}@otp.happimynd.app`;
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
          // Fallback to mobile if profile fetch fails
        }
        auth.signIn({
          name,
          email,
          token,
        });
        toast.success(`Welcome back, ${name}!`);
        navigate({ to: "/" });
        return true;
      } else if (res.status === "register" && "mobile_verified_token" in res) {
        setVerifiedMobile(phoneMobile);
        setMobileVerifiedToken(res.mobile_verified_token);
        setStep("create-profile");
        return true;
      } else {
        toast.error((res as { message?: string }).message ?? "Invalid OTP. Please try again.");
        return false;
      }
    } catch {
      toast.error("Network error. Please try again.");
      return false;
    }
  };

  // ── Create profile: submit ────────────────────────────────────────────────
  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickName.trim()) { toast.error("Please choose a nick name."); return; }
    if (!profileTypeId) { toast.error("Please select a profile type."); return; }
    if (!age || Number(age) <= 0) { toast.error("Please enter a valid age."); return; }
    if (!gender) { toast.error("Please select a gender."); return; }
    if (!username.trim()) { toast.error("Please choose a username."); return; }
    if (!password.trim()) { toast.error("Please enter a password."); return; }
    if (password !== confirmPassword) { toast.error("Passwords don't match."); return; }
    if (!notRobot) { toast.error("Please confirm you're not a robot."); return; }

    setSubmitting(true);
    try {
      const res = await signUp({
        nickname: nickName.trim(),
        user_profile_id: Number(profileTypeId),
        age: Number(age),
        gender,
        username: username.trim(),
        password,
        confirm_password: confirmPassword,
        signup_type: category === "organization" || category === "school" ? "organisation" : "individual",
        country_code: searchParams.country_code ?? "91",
        mobile: verifiedMobile || phoneMobile || searchParams.mobile || "",
        language: 1,
        device_token: "",
        mobile_verified_token: mobileVerifiedToken || searchParams.mobile_verified_token || "",
        ...(happiCode ? { happimyndCode: happiCode } : {}),
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
          navigate({ to: "/" });
        } else {
          toast.success("Account created successfully! Please log in.");
          navigate({ to: "/login" });
        }
      } else {
        toast.error(res.message ?? "Failed to create account. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen overflow-hidden bg-background flex flex-col justify-center">
      {/* Ambient background blobs matching login page */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-lavender/40 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-aqua/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-pastel-blue/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen lg:min-h-0 lg:h-full lg:max-h-screen w-full max-w-[1500px] items-center gap-4 lg:gap-6 xl:gap-8 p-3 sm:p-4 lg:p-5 xl:p-6 grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Brand hero panel matching login page */}
        <section className="relative hidden overflow-hidden rounded-[2rem] xl:rounded-[2.5rem] bg-gradient-hero p-6 lg:p-7 xl:p-10 shadow-card lg:flex lg:h-full lg:max-h-full lg:flex-col lg:justify-between">
          <div className="absolute -top-10 right-10 h-32 w-32 rounded-full bg-white/40 blur-2xl" />
          <div className="absolute bottom-10 left-1/2 h-48 w-48 rounded-full bg-lavender/50 blur-3xl" />

          <div className="relative flex flex-col">
            <img
              src={logoImg}
              alt="HappiMynd Logo"
              className="h-12 w-auto object-contain lg:h-14 xl:h-18 self-start"
            />
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
                    <span className="text-xs lg:text-sm font-medium text-foreground/80">
                      {f.text}
                    </span>
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

        {/* Signup form panel */}
        <section className="flex h-full max-h-full items-center justify-center px-2 py-4 sm:px-6 overflow-hidden">
          <div className="w-full max-w-md my-auto flex flex-col justify-center max-h-full">
            {/* Mobile logo */}
            <div className="mb-4 flex justify-center lg:hidden">
              <img
                src={logoImg}
                alt="HappiMynd Logo"
                className="h-12 w-auto object-contain"
              />
            </div>

            <div className="rounded-[2rem] bg-white p-5 sm:p-6 xl:p-8 shadow-card flex flex-col max-h-full overflow-y-auto lg:overflow-visible">
              {step === "get-started" && <GetStartedStep onSelect={handleCategory} />}

              {step === "phone-verify" && (
                <PhoneVerifyStep
                  mobile={phoneMobile}
                  onMobileChange={setPhoneMobile}
                  onSend={handleSendOtp}
                  sending={otpSending}
                  onBack={handleBack}
                />
              )}

              {step === "otp-verify" && (
                <OtpVerifyStep
                  mobile={phoneMobile}
                  onVerify={handleVerifyOtp}
                  onBack={handleBack}
                  onResend={async () => {
                    const res = await sendLoginOtp({ type: "mobile", mobile: phoneMobile, country_code: "91" });
                    if (res.status !== "error") toast.success("New OTP sent!");
                    else toast.error(res.message ?? "Failed to resend OTP.");
                  }}
                />
              )}

              {step === "welcome" && (
                <WelcomeStep
                  sponsor={sponsor}
                  setSponsor={setSponsor}
                  happiCode={happiCode}
                  setHappiCode={setHappiCode}
                  organizers={organizerList}
                  onBack={handleBack}
                  onContinue={handleWelcomeContinue}
                />
              )}

              {step === "create-profile" && (
                <CreateProfileStep
                  nickName={nickName}
                  setNickName={setNickName}
                  profileTypeId={profileTypeId}
                  setProfileTypeId={setProfileTypeId}
                  age={age}
                  setAge={setAge}
                  gender={gender}
                  setGender={setGender}
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  notRobot={notRobot}
                  setNotRobot={setNotRobot}
                  submitting={submitting}
                  apiProfiles={userProfiles}
                  onBack={handleBack}
                  onSubmit={handleCreateProfile}
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

/* ----------------------------------------------------------- Get Started */

function GetStartedStep({ onSelect }: { onSelect: (cat: Category) => void }) {
  const search = useSearch();
  const options: { value: Category; label: string; desc: string }[] = [
    { value: "organization", label: "I am an Organization", desc: "Corporate wellness access" },
    { value: "individual", label: "Individual", desc: "Personal growth & self-reflection" },
    { value: "school", label: "I am a School / Institution", desc: "Student & educator support" },
  ];

  return (
    <>
      <span className="inline-flex items-center gap-2 rounded-full bg-lavender/40 px-3 py-1 text-xs font-semibold text-lavender-deep">
        <Sparkles className="h-3.5 w-3.5" /> Get Started
      </span>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Create Your Account
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose how you would like to sign up with HappiMynd.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onSelect(o.value)}
            className="flex items-center justify-between rounded-2xl border border-lavender/60 bg-white px-5 py-4 text-left text-sm font-semibold text-foreground shadow-soft transition hover:border-lavender-deep/50 hover:bg-lavender/20 cursor-pointer"
          >
            <div>
              <div className="text-sm">{o.label}</div>
              <div className="text-xs text-muted-foreground font-normal">{o.desc}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-lavender-deep" />
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <V2Link to="/login" search={{ redirect: search.redirect }} className="font-semibold text-lavender-deep hover:underline">
          Log in
        </V2Link>
      </p>
    </>
  );
}

/* --------------------------------------------------- Phone Verify Step */

function PhoneVerifyStep({
  mobile,
  onMobileChange,
  onSend,
  sending,
  onBack,
}: {
  mobile: string;
  onMobileChange: (v: string) => void;
  onSend: () => void;
  sending: boolean;
  onBack: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-lavender/50 px-3.5 py-1 text-[11px] font-bold text-lavender-deep hover:bg-lavender-deep hover:text-white transition shadow-soft cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        Enter your mobile
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        We'll send a one-time password to verify your phone number.
      </p>

      <div className="mt-5 space-y-4">
        <PhoneField mobile={mobile} onChange={onMobileChange} disabled={sending} />
        <Button
          id="signup-send-otp-btn"
          type="button"
          disabled={sending || mobile.length !== 10}
          onClick={onSend}
          className="h-11 w-full rounded-2xl bg-gradient-brand text-xs font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50"
        >
          {sending ? (
            <><LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin" /> Sending OTP…</>
          ) : (
            "Send OTP"
          )}
        </Button>
      </div>
    </div>
  );
}

/* --------------------------------------------------- OTP Verify Step */

function OtpVerifyStep({
  mobile,
  onVerify,
  onBack,
  onResend,
}: {
  mobile: string;
  onVerify: (otp: string) => Promise<boolean>;
  onBack: () => void;
  onResend: () => Promise<void>;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    await onVerify(otp);
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    await onResend();
    setResending(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-lavender/50 px-3.5 py-1 text-[11px] font-bold text-lavender-deep hover:bg-lavender-deep hover:text-white transition shadow-soft cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        Check your phone
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Enter the 6-digit code sent to{" "}
        <span className="font-semibold text-foreground">+91 {mobile}</span>
      </p>

      <div className="mt-5 space-y-4">
        <OtpBoxes value={otp} onChange={setOtp} disabled={loading} />
        <Button
          id="signup-verify-otp-btn"
          type="button"
          disabled={loading || otp.length !== 6}
          onClick={handleVerify}
          className="h-11 w-full rounded-2xl bg-gradient-brand text-xs font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50"
        >
          {loading ? (
            <><LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin" /> Verifying…</>
          ) : (
            "Verify & Continue"
          )}
        </Button>
        <ResendTimer onResend={handleResend} resending={resending} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------- Welcome / Code */

function WelcomeStep({
  sponsor,
  setSponsor,
  happiCode,
  setHappiCode,
  organizers,
  onBack,
  onContinue,
}: {
  sponsor: string;
  setSponsor: (v: string) => void;
  happiCode: string;
  setHappiCode: (v: string) => void;
  organizers: OrganizerItem[];
  onBack: () => void;
  onContinue: (e: React.FormEvent) => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-lavender/50 px-3.5 py-1 text-[11px] font-bold text-lavender-deep hover:bg-lavender-deep hover:text-white transition shadow-soft cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        Sponsor Verification
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Select your sponsor and enter your unique code.
      </p>

      <form onSubmit={onContinue} className="mt-4 space-y-3.5">
        <div>
          <label htmlFor="sponsor" className="mb-1 block text-xs font-semibold text-foreground/80">
            Select Name of Sponsor
          </label>
          <div className="relative">
            <select
              id="sponsor"
              value={sponsor}
              onChange={(e) => setSponsor(e.target.value)}
              className="h-10.5 w-full appearance-none rounded-2xl border-0 bg-white/90 px-3.5 pr-10 text-xs text-foreground shadow-soft focus:outline-none focus:ring-2 focus:ring-lavender-deep/30"
            >
              <option value="" disabled>Select a sponsor organization</option>
              {organizers && organizers.length > 0 ? (
                organizers.map((o) => (
                  <option key={o.id} value={o.name}>
                    {o.name}
                  </option>
                ))
              ) : (
                SPONSORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div>
          <label htmlFor="happicode" className="mb-1 block text-xs font-semibold text-foreground/80">
            HappiMynd Code
          </label>
          <Input
            id="happicode"
            value={happiCode}
            onChange={(e) => setHappiCode(e.target.value)}
            placeholder="HappiMynd Code"
            className="h-10.5 rounded-2xl border-0 bg-white/90 px-3.5 text-xs shadow-soft placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-lavender-deep/30"
          />
        </div>

        <Button
          type="submit"
          className="mt-2 h-11 w-full rounded-2xl bg-gradient-brand text-xs font-semibold text-white shadow-glow transition hover:opacity-95"
        >
          Continue
        </Button>
      </form>
    </>
  );
}

/* ------------------------------------------------------- Create Profile */

function CreateProfileStep(props: {
  nickName: string;
  setNickName: (v: string) => void;
  profileTypeId: string;
  setProfileTypeId: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  notRobot: boolean;
  setNotRobot: (v: boolean) => void;
  submitting: boolean;
  apiProfiles?: UserProfileItem[];
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const {
    nickName, setNickName,
    profileTypeId, setProfileTypeId,
    age, setAge,
    gender, setGender,
    username, setUsername,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    notRobot, setNotRobot,
    submitting, apiProfiles, onBack, onSubmit,
  } = props;

  const fieldClass =
    "h-10.5 rounded-2xl border-0 bg-white/90 px-3.5 text-xs shadow-soft placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-lavender-deep/30";
  const selectClass =
    "h-10.5 w-full appearance-none rounded-2xl border-0 bg-white/90 px-3.5 pr-10 text-xs text-foreground shadow-soft focus:outline-none focus:ring-2 focus:ring-lavender-deep/30";

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-lavender/50 px-3.5 py-1 text-[11px] font-bold text-lavender-deep hover:bg-lavender-deep hover:text-white transition shadow-soft cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        Profile Details
      </h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Complete your details to set up your personal space.
      </p>

      <form onSubmit={onSubmit} className="mt-3 space-y-2 lg:space-y-2.5 max-h-[52vh] lg:max-h-[58vh] overflow-y-auto pr-1">
        <div>
          <label htmlFor="nickname" className="mb-1 block text-xs font-semibold text-foreground/80">
            Nickname *
          </label>
          <Input
            id="nickname"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            placeholder="Choose a Nick Name"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="profiletype" className="mb-1 block text-xs font-semibold text-foreground/80">
            Profile Type *
          </label>
          <div className="relative">
            <select
              id="profiletype"
              value={profileTypeId}
              onChange={(e) => setProfileTypeId(e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>Select profile type</option>
              {apiProfiles && apiProfiles.length > 0 ? (
                apiProfiles.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name}
                  </option>
                ))
              ) : (
                PROFILE_TYPES.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.label}
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="age" className="mb-1 block text-xs font-semibold text-foreground/80">
              Age
            </label>
            <Input
              id="age"
              type="number"
              min={1}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="gender" className="mb-1 block text-xs font-semibold text-foreground/80">
              Gender
            </label>
            <div className="relative">
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={selectClass}
              >
                <option value="" disabled>Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="username" className="mb-1 block text-xs font-semibold text-foreground/80">
            Username *
          </label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-semibold text-foreground/80">
            Password *
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="new-password"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-1 block text-xs font-semibold text-foreground/80">
            Confirm Password *
          </label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            autoComplete="new-password"
            className={fieldClass}
          />
        </div>

        {/* reCAPTCHA-style confirmation */}
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/90 px-3.5 py-2 shadow-soft h-10.5">
          <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-foreground font-medium">
            <input
              type="checkbox"
              checked={notRobot}
              onChange={(e) => setNotRobot(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-[oklch(0.58_0.22_293)]"
            />
            I'm not a robot
          </label>
          <div className="flex flex-col items-center text-[9px] leading-tight text-muted-foreground">
            <ReCaptchaGlyph />
            <span className="mt-0.5">reCAPTCHA</span>
          </div>
        </div>

        <Button
          id="create-profile-btn"
          type="submit"
          disabled={submitting}
          className="mt-1 h-10.5 lg:h-11 w-full rounded-2xl bg-gradient-brand text-xs font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? (
            <>
              <LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin" /> Creating profile…
            </>
          ) : (
            "Start HappiLIFE Awareness"
          )}
        </Button>
      </form>
    </>
  );
}

/* ---------------------------------------------------------------- Bits */

function ReCaptchaGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#1c9b57" d="M12 2a10 10 0 019.54 7h-2.13A8 8 0 0012 4V2z" />
      <path fill="#4285f4" d="M21.54 9A10 10 0 0112 22v-2a8 8 0 007.41-11h2.13z" />
      <path fill="#c62828" d="M12 22A10 10 0 012.46 9h2.13A8 8 0 0012 20v2z" />
      <path fill="none" stroke="#1c9b57" strokeWidth="2" d="M8 12l3 3 5-6" />
    </svg>
  );
}
