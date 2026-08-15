import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Music, VolumeX } from "lucide-react";
import calmMorningUrl from "@/v2/assets/audio/calm-morning.mp3";
import { cn } from "@/v2/lib/utils";

const TOTAL_PLAY_TIME_MS = 30000;
const FADE_START_MS = 25000;

export function GlobalBackgroundAudio() {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalPlayedMsRef = useRef<number>(0);
  const isFinished30sRef = useRef<boolean>(false);
  const isFadingRef = useRef<boolean>(false);
  const isUserMutedRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const clearTimers = () => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const startFadeOut = () => {
    if (isFadingRef.current || !audioRef.current) return;
    isFadingRef.current = true;
    const audio = audioRef.current;
    const startVolume = audio.volume;
    const steps = 25;
    const stepTime = 200; // 200ms * 25 = 5000ms
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (audioRef.current) {
        const newVolume = Math.max(0, startVolume * (1 - currentStep / steps));
        audioRef.current.volume = newVolume;
      }
      if (currentStep >= steps) {
        clearTimers();
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
        isFinished30sRef.current = true;
        isFadingRef.current = false;
      }
    }, stepTime);
  };

  // Pause playback preserving exact audio position (no resetting to 0)
  const pausePlayback = () => {
    clearTimers();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const startPlaybackTracking = () => {
    clearTimers();
    if (isFinished30sRef.current) return;

    tickIntervalRef.current = setInterval(() => {
      totalPlayedMsRef.current += 200;

      if (totalPlayedMsRef.current >= FADE_START_MS && !isFadingRef.current) {
        startFadeOut();
      }

      if (totalPlayedMsRef.current >= TOTAL_PLAY_TIME_MS) {
        clearTimers();
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
        isFinished30sRef.current = true;
      }
    }, 200);
  };

  const attemptPlay = () => {
    if (!audioRef.current || isFinished30sRef.current) return;

    // Do not play background audio if user has explicitly muted
    if (isUserMutedRef.current) return;

    // Do not play background audio if user is currently reading an article or taking assessment
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith("/v2/articles") || path.startsWith("/v2/assessment") || path.startsWith("/articles") || path.startsWith("/assessment")) {
      return;
    }

    const audio = audioRef.current;
    if (!isFadingRef.current) {
      audio.volume = 0.35;
    }

    audio.muted = false;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
          startPlaybackTracking();
        })
        .catch(() => {
          // Autoplay on load without interaction was restricted by browser
          setIsPlaying(false);
          setIsMuted(false);
        });
    }
  };

  // Route-based auto-pause & resume:
  // Pauses audio when reading articles or taking assessment; resumes from paused spot when leaving if under 30s!
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const isReadingArticle = path.startsWith("/v2/articles") || path.startsWith("/articles");
    const isTakingAssessment = path.startsWith("/v2/assessment") || path.startsWith("/assessment");

    if (isReadingArticle || isTakingAssessment) {
      pausePlayback();
    } else if (!isFinished30sRef.current && totalPlayedMsRef.current < TOTAL_PLAY_TIME_MS && !isUserMutedRef.current) {
      attemptPlay();
    }
  }, [location.pathname]);

  useEffect(() => {
    // Disable background audio on mobile devices (< 768px)
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return;
    }

    const audio = new Audio(calmMorningUrl);
    audio.loop = true;
    audio.volume = 0.35;
    audio.muted = false;
    audioRef.current = audio;

    // 1. Attempt playback immediately on load if not on article/assessment
    attemptPlay();

    // 2. Unmute & play audio on valid user activation gesture (click, tap, keypress)
    const handleUserGesture = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith("/v2/articles") || path.startsWith("/v2/assessment") || path.startsWith("/articles") || path.startsWith("/assessment")) return;

      // Do not auto-play or unmute if the user has explicitly muted
      if (isUserMutedRef.current) return;

      if (audioRef.current && !isFinished30sRef.current) {
        const a = audioRef.current;
        if (a.paused) {
          a.volume = 0.35;
          a.muted = false;
          const p = a.play();
          if (p !== undefined) {
            p.then(() => {
              setIsPlaying(true);
              setIsMuted(false);
              startPlaybackTracking();
            }).catch(() => {});
          }
        }
      }
    };

    // 3. Pause background audio if ANY other video/audio element plays (e.g. listening to provided music tracks)
    const handleOtherMediaPlay = (e: Event) => {
      if (e.target !== audioRef.current) {
        pausePlayback();
      }
    };

    // 4. Pause background audio when user engages with specific media content
    const handleUserActivity = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest("a, button, [role='button']");
      if (clickable && !clickable.closest(".bg-audio-control")) {
        const ariaLabel = (clickable.getAttribute("aria-label") || "").toLowerCase();
        const textContent = (clickable.textContent || "").toLowerCase();
        const href = (clickable.getAttribute("href") || "").toLowerCase();

        if (
          href.includes("/assessment") ||
          href.includes("/articles") ||
          ariaLabel.includes("play") ||
          ariaLabel.includes("audio") ||
          ariaLabel.includes("video") ||
          ariaLabel.includes("listen") ||
          textContent.includes("start assessment") ||
          textContent.includes("listen") ||
          textContent.includes("watch") ||
          textContent.includes("read")
        ) {
          pausePlayback();
        }
      }
    };

    // Valid User Activation Gestures per web audio spec (pointerdown, touchstart, click, keydown)
    const gestureEvents = ["pointerdown", "touchstart", "click", "keydown"];

    gestureEvents.forEach((evt) =>
      window.addEventListener(evt, handleUserGesture, { capture: true, passive: true })
    );
    window.addEventListener("play", handleOtherMediaPlay, true);
    window.addEventListener("click", handleUserActivity, true);

    return () => {
      gestureEvents.forEach((evt) =>
        window.removeEventListener(evt, handleUserGesture, { capture: true })
      );
      window.removeEventListener("play", handleOtherMediaPlay, true);
      window.removeEventListener("click", handleUserActivity, true);
      clearTimers();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleToggleMuteOrPlay = () => {
    if (!audioRef.current) return;
    if (!isPlaying) {
      if (isFinished30sRef.current) {
        // Reset 30s budget if user manually re-starts after finishing
        totalPlayedMsRef.current = 0;
        isFinished30sRef.current = false;
        isFadingRef.current = false;
        audioRef.current.currentTime = 0;
      }
      audioRef.current.volume = 0.35;
      audioRef.current.muted = false;
      setIsMuted(false);
      isUserMutedRef.current = false;
      attemptPlay();
    } else {
      const nextMuted = !isMuted;
      audioRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      isUserMutedRef.current = nextMuted;
    }
  };

  return (
    <div className="bg-audio-control hidden md:block fixed z-50 md:bottom-28 md:right-6">
      <button
        onClick={handleToggleMuteOrPlay}
        className="grid h-14 w-14 place-items-center rounded-full bg-white shadow-soft border border-white/80 transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95 cursor-pointer md:h-16 md:w-16"
        aria-label={isMuted ? "Unmute background audio" : "Mute background audio"}
        title={isMuted ? "Unmute background audio" : "Mute background audio"}
      >
        {isMuted ? (
          <VolumeX className="h-6 w-6 text-muted-foreground" />
        ) : (
          <Music className={cn("h-6 w-6 text-lavender-deep", isPlaying && "animate-pulse")} />
        )}
      </button>
    </div>
  );
}
