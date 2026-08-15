import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Shield, LoaderCircle, Pencil, X, UserCheck, Check, Lock } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { Button } from "@/v2/components/ui/button";
import { Input } from "@/v2/components/ui/input";
import { Label } from "@/v2/components/ui/label";
import { Progress } from "@/v2/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/v2/components/ui/select";
import { cn } from "@/v2/lib/utils";
import { fetchProfile, editProfile, type EditProfilePayload } from "@/v2/lib/auth-api";
import { auth } from "@/v2/lib/auth";
import { getAvatarUrl } from "@/v2/lib/avatars";

export default ProfilePage;
const FEMALE_AVATARS = [1, 2, 3, 4, 5].map((n) => ({
  id: `female-${n}`,
  url: getAvatarUrl(`female-${n}`) as string,
}));
const MALE_AVATARS = [1, 2, 3, 4, 5].map((n) => ({
  id: `male-${n}`,
  url: getAvatarUrl(`male-${n}`) as string,
}));

import { useProtectedRoute } from "@/v2/lib/auth-guard";

function getAvatarStorageKey(emailOrName?: string): string {
  const currentId = emailOrName || auth.get()?.email || auth.get()?.name || "user";
  const safeId = currentId.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
  return `happimynd_avatar_${safeId}`;
}

function normalizeAvatarId(raw: unknown, gender?: string): string {
  if (!raw) {
    const g = gender === "male" ? "male" : "female";
    return `${g}-1`;
  }
  const str = String(raw).trim().toLowerCase();

  // If already formatted like "female-2" or "male-3"
  if (/^(female|male)-\d+$/.test(str)) {
    return str;
  }

  // Detect gender prefix from raw string e.g. "male1.svg" -> male, "female2.svg" -> female
  let detectedGender = gender === "male" ? "male" : "female";
  if (str.includes("female")) {
    detectedGender = "female";
  } else if (str.includes("male")) {
    detectedGender = "male";
  }

  // Extract avatar number (1 to 5)
  const match = str.match(/\d+/);
  if (match) {
    const num = Math.max(1, Math.min(5, parseInt(match[0], 10)));
    return `${detectedGender}-${num}`;
  }

  return `${detectedGender}-1`;
}

function ProfilePage() {
  useProtectedRoute("Please log in to access your profile settings.");

  // ── Loading/error state ───────────────────────────────────────────────────
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── API-backed form fields (populated from GET /api/v1/get-profile) ───────
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phone, setPhone] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [avatar, setAvatar] = useState("female-1");
  const [rawProfileData, setRawProfileData] = useState<Record<string, any> | null>(null);

  // Edit mode & dirty tracking
  const [isEditing, setIsEditing] = useState(false);
  const [originalDisplayName, setOriginalDisplayName] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalAge, setOriginalAge] = useState("");
  const [originalGender, setOriginalGender] = useState<string | undefined>(undefined);
  const [originalAvatar, setOriginalAvatar] = useState("female-1");

  const isDirty = useMemo(() => {
    return (
      displayName !== originalDisplayName ||
      username !== originalUsername ||
      email !== originalEmail ||
      phone !== originalPhone ||
      age !== originalAge ||
      gender !== originalGender ||
      avatar !== originalAvatar
    );
  }, [
    displayName, originalDisplayName,
    username, originalUsername,
    email, originalEmail,
    phone, originalPhone,
    age, originalAge,
    gender, originalGender,
    avatar, originalAvatar,
  ]);

  // ── Fetch real profile from API on mount ──────────────────────────────────
  useEffect(() => {
    const token = auth.get()?.token;

    if (!token) {
      setProfileLoading(false);
      setProfileError("You are not logged in.");
      return;
    }

    fetchProfile(token)
      .then((json) => {
        const d: Record<string, any> = (json as any)?.data ?? json;
        setRawProfileData(d);
        const loadedName = d?.nickname ?? d?.name ?? "";
        const loadedUsername = d?.username ?? "";
        const loadedEmail = d?.email ?? "";
        const loadedPhone = d?.mobile ?? d?.phone ?? "";
        const loadedAge = d?.age != null ? String(d.age) : "";
        const loadedGender = d?.gender ?? undefined;

        const userStorageKey = getAvatarStorageKey(loadedEmail || loadedName);
        const localSavedAvatar =
          typeof window !== "undefined"
            ? localStorage.getItem(userStorageKey)
            : null;

        const apiAvatarRaw = d?.avatar ?? d?.avatar_id ?? d?.profile_picture;
        const validApiAvatar =
          apiAvatarRaw != null &&
          apiAvatarRaw !== "" &&
          apiAvatarRaw !== 0 &&
          apiAvatarRaw !== "0"
            ? apiAvatarRaw
            : null;

        // Prefer the user's explicit local choice if saved, otherwise fallback to API avatar
        const rawAvatar = localSavedAvatar ?? validApiAvatar ?? auth.get()?.avatar ?? "female-1";
        const loadedAvatar = normalizeAvatarId(rawAvatar, loadedGender);

        setDisplayName(loadedName);
        setOriginalDisplayName(loadedName);
        setUsername(loadedUsername);
        setOriginalUsername(loadedUsername);
        setEmail(loadedEmail);
        setOriginalEmail(loadedEmail);
        setPhone(loadedPhone);
        setOriginalPhone(loadedPhone);
        setAge(loadedAge);
        setOriginalAge(loadedAge);
        setGender(loadedGender);
        setOriginalGender(loadedGender);
        setAvatar(loadedAvatar);
        setOriginalAvatar(loadedAvatar);
        setEmailVerified(!!d?.email);
        setProfileLoading(false);

        if (typeof window !== "undefined" && !localSavedAvatar) {
          localStorage.setItem(userStorageKey, loadedAvatar);
        }

        const currentAuth = auth.get();
        if (currentAuth) {
          auth.signIn({
            ...currentAuth,
            name: loadedName || currentAuth.name,
            avatar: loadedAvatar,
          });
        }
      })
      .catch((err) => {
        console.error("[PROFILE] fetch error:", err);
        setProfileError("Failed to load profile. Please refresh.");
        setProfileLoading(false);
      });
  }, []);

  const completion = useMemo(() => {
    const checks = [!!displayName, !!username, !!email, !!phone, !!age, !!gender];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [displayName, username, email, phone, age, gender]);

  const avatarList = gender === "male" ? MALE_AVATARS : FEMALE_AVATARS;
  const selectedAvatar = avatarList.find((a) => a.id === avatar) ?? avatarList[0];

  const onGenderChange = (next: string) => {
    setGender(next);
    const list = next === "male" ? MALE_AVATARS : FEMALE_AVATARS;
    if (!list.some((a) => a.id === avatar)) setAvatar(list[0].id);
  };

  const onSave = async () => {
    const token = auth.get()?.token;
    if (!token) {
      toast.error("You are not logged in.");
      return;
    }
    setSaving(true);
    try {
      const phoneChanged = phone.trim() !== originalPhone.trim();
      const avatarMatch = avatar.match(/\d+/);
      const numericAvatarId = avatarMatch ? parseInt(avatarMatch[0], 10) : 1;
      const avatarFileName = avatar.replace("-", "") + ".svg";

      // Clean payload with email, username, nickname, age, gender, avatar, and mobile
      const payload: EditProfilePayload & Record<string, any> = {
        nickname: displayName.trim(),
        username: username.trim(),
        email: email.trim(),
        age: age ? Number(age) : 0,
        gender: gender ?? "",
        avatar: avatar,
        avatar_id: numericAvatarId,
        user_avatar: avatarFileName,
        avatar_name: avatarFileName,
        ...(rawProfileData?.user_profile_id ? { user_profile_id: Number(rawProfileData.user_profile_id) } : {}),
        ...(phoneChanged ? { mobile: phone.trim() } : {}),
      };

      console.log("🌐 [Website API] POST /api/v1/edit-profile Payload:", payload);

      const res = await editProfile(token, payload);
      if (res.status === "success" || (res as any)?.message?.toLowerCase().includes("success")) {
        toast.success("Profile updated successfully.", { duration: 3500 });
        setOriginalDisplayName(displayName);
        setOriginalUsername(username);
        setOriginalEmail(email);
        setOriginalPhone(phone);
        setOriginalAge(age);
        setOriginalGender(gender);
        setOriginalAvatar(avatar);
        setIsEditing(false);
        if (typeof window !== "undefined") {
          localStorage.setItem(getAvatarStorageKey(email || displayName), avatar);
        }
        const currentAuth = auth.get();
        if (currentAuth) {
          auth.signIn({
            ...currentAuth,
            name: displayName.trim() || currentAuth.name,
            email: email.trim() || currentAuth.email,
            avatar: avatar,
          });
        }
      } else {
        toast.error(res.message ?? "Failed to update profile.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const onDiscard = () => {
    setDisplayName(originalDisplayName);
    setUsername(originalUsername);
    setEmail(originalEmail);
    setPhone(originalPhone);
    setAge(originalAge);
    setGender(originalGender);
    setAvatar(originalAvatar);
    setIsEditing(false);
    toast("Changes discarded.", { duration: 2500 });
  };

  return (
    <DashboardShell
      header={
        <TopHeaderBar
          title="Your Profile"
          emoji=""
          subtitle="Manage your account profile details."
        />
      }
    >
      {/* Loading state */}
      {profileLoading && (
        <div className="flex min-h-64 items-center justify-center gap-3 text-muted-foreground">
          <LoaderCircle className="h-5 w-5 animate-spin text-lavender-deep" />
          <span className="text-sm font-medium">Loading your profile…</span>
        </div>
      )}

      {/* Error state */}
      {!profileLoading && profileError && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
          {profileError}
        </div>
      )}

      {/* Profile form — shown only once data is loaded */}
      {!profileLoading && !profileError && (
        <>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
            {/* LEFT COLUMN: API Profile Fields */}
            <div className="space-y-6">
              {/* Account Profile Details */}
              <Card>
                <CardHeader
                  title="Account Profile Information"
                  subtitle="Your account details synced with GET /api/v1/get-profile."
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing((v) => !v)}
                      className="rounded-full border-lavender-deep/30 bg-lavender/10 text-xs font-semibold text-lavender-deep hover:bg-lavender-deep hover:text-white transition cursor-pointer flex items-center gap-1.5"
                    >
                      {isEditing ? (
                        <><X className="h-3.5 w-3.5" /> Cancel Edit</>
                      ) : (
                        <><Pencil className="h-3.5 w-3.5" /> Edit Profile</>
                      )}
                    </Button>
                  }
                />
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="Nickname / Display Name">
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!isEditing}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Username">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={!isEditing}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Email Address">
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Phone Number">
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!!originalPhone.trim() || !isEditing}
                      className={cn(inputClass, !!originalPhone.trim() && "bg-slate-50 opacity-75 cursor-not-allowed")}
                    />
                  </Field>
                  <Field label="Age">
                    <Input
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      disabled={!isEditing}
                      inputMode="numeric"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Gender">
                    <Select value={gender} onValueChange={onGenderChange} disabled={!isEditing}>
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="nonbinary">Non-binary</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="na">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </Card>

              {/* Privacy & Security */}
              <Card>
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-lavender shadow-soft">
                    <Shield className="h-5 w-5 text-lavender-deep" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold tracking-tight sm:text-lg">
                      Privacy & Data Security
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">
                      Your profile information is securely stored and only accessible to authorized services within HappiMynd.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN: Avatar & Profile Status */}
            <div className="space-y-6">
              {/* Avatar Selector */}
              <Card>
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-brand opacity-70 blur-md" />
                    <div className="relative h-24 w-24 overflow-hidden rounded-full shadow-glow ring-4 ring-white">
                      <img
                        src={selectedAvatar.url}
                        alt="Selected avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-400 ring-2 ring-white">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold tracking-tight">
                    Choose your avatar
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Select an avatar to personalize your profile picture.
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2">
                  {avatarList.map((a) => {
                    const active = a.id === avatar;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        disabled={!isEditing}
                        onClick={() => setAvatar(a.id)}
                        className={cn(
                          "relative shrink-0 overflow-hidden rounded-full transition cursor-pointer",
                          active
                            ? "ring-2 ring-lavender-deep ring-offset-2 ring-offset-white"
                            : "opacity-80 hover:opacity-100",
                          !isEditing && "cursor-not-allowed opacity-60"
                        )}
                        aria-label={`Select avatar ${a.id}`}
                      >
                        <img
                          src={a.url}
                          alt=""
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Completion Progress */}
              <Card>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight">
                    Profile Completion
                  </h3>
                  <span className="text-sm font-bold text-lavender-deep">
                    {completion}%
                  </span>
                </div>
                <Progress
                  value={completion}
                  className="mt-4 h-3 overflow-hidden rounded-full bg-white/60 [&>div]:bg-gradient-brand"
                />
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Keep your account profile up to date for personalized services.
                </p>
              </Card>
            </div>
          </div>

          {/* Action bar — shown ONLY when editing or changes are dirty */}
          {(isEditing || isDirty) && (
            <div className="sticky bottom-24 z-30 md:bottom-6">
              <div className="mx-auto flex items-center justify-end gap-2.5 rounded-3xl bg-white/95 p-3 pl-4 pr-20 md:pr-28 shadow-card border border-white/80">
                <Button
                  variant="ghost"
                  onClick={onDiscard}
                  className="h-11 rounded-full bg-white/90 px-5 text-sm font-semibold text-foreground hover:bg-white cursor-pointer"
                >
                  Discard Changes
                </Button>
                <Button
                  onClick={onSave}
                  disabled={saving}
                  className="h-11 rounded-full bg-gradient-brand px-6 text-sm font-semibold text-white shadow-glow hover:opacity-95 cursor-pointer"
                >
                  {saving ? (
                    <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving…</>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardShell>
  );
}

/* ---------- helpers ---------- */

const inputClass =
  "h-11 w-full rounded-2xl border-0 bg-white/95 px-4 shadow-soft border border-white/80 focus-visible:ring-2 focus-visible:ring-lavender-deep/30";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white/95 p-6 shadow-soft border border-white/80 sm:p-7">
      {children}
    </section>
  );
}

function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function Field({
  label,
  children,
  className,
  trailing,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </Label>
        {trailing}
      </div>
      {children}
    </div>
  );
}
