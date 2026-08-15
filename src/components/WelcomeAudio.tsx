import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";

/* A calm note that greets visitors when they land.
   It plays for 10s, fades out on its own, and can be paused at any time. */
const AUDIO_SRC = "/audio/calm-morning.mp3";
const INTRO_DURATION = 10000;
const FADE_DURATION = 1200;
const VOLUME = 0.35;

const WelcomeAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimer = useRef<number | null>(null);
  const fadeTimer = useRef<number | null>(null);
  const remaining = useRef(INTRO_DURATION);
  const startedAt = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  const clearTimers = useCallback(() => {
    if (stopTimer.current) window.clearTimeout(stopTimer.current);
    if (fadeTimer.current) window.clearInterval(fadeTimer.current);
    stopTimer.current = null;
    fadeTimer.current = null;
  }, []);

  // Ease the volume down instead of cutting the track off mid-note
  const fadeOut = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const step = 50;
    const drop = audio.volume / (FADE_DURATION / step);

    fadeTimer.current = window.setInterval(() => {
      if (!audioRef.current) return;
      const next = audioRef.current.volume - drop;
      if (next <= 0.01) {
        clearTimers();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.volume = VOLUME;
        setPlaying(false);
        setIntroDone(true);
        remaining.current = 0;
      } else {
        audioRef.current.volume = next;
      }
    }, step);
  }, [clearTimers]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return Promise.reject();

    audio.volume = VOLUME;
    return audio.play().then(() => {
      setPlaying(true);
      // Only the intro run is time-boxed; a manual replay runs freely
      if (remaining.current > 0) {
        startedAt.current = Date.now();
        stopTimer.current = window.setTimeout(fadeOut, remaining.current);
      }
    });
  }, [fadeOut]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (remaining.current > 0 && startedAt.current) {
      remaining.current = Math.max(
        0,
        remaining.current - (Date.now() - startedAt.current)
      );
    }
    clearTimers();
    audio.pause();
    setPlaying(false);
  }, [clearTimers]);

  // Try to greet on load; browsers that block autoplay get the first gesture instead
  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.preload = "auto";
    audio.volume = VOLUME;
    audioRef.current = audio;

    let cancelled = false;

    const startOnGesture = () => {
      if (cancelled || remaining.current <= 0) return;
      play().catch(() => undefined);
      removeGestureListeners();
    };

    const removeGestureListeners = () => {
      window.removeEventListener("pointerdown", startOnGesture);
      window.removeEventListener("keydown", startOnGesture);
      window.removeEventListener("scroll", startOnGesture);
    };

    play().catch(() => {
      if (cancelled) return;
      window.addEventListener("pointerdown", startOnGesture, { once: true });
      window.addEventListener("keydown", startOnGesture, { once: true });
      window.addEventListener("scroll", startOnGesture, { once: true });
    });

    return () => {
      cancelled = true;
      removeGestureListeners();
      clearTimers();
      audio.pause();
      audioRef.current = null;
    };
  }, [play, clearTimers]);

  const toggle = () => {
    if (playing) {
      pause();
    } else {
      play().catch(() => undefined);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause welcome sound" : "Play welcome sound"}
      aria-pressed={playing}
      className="fixed bottom-5 left-5 z-[110] flex items-center gap-1.5 rounded-full border border-border bg-card/90 backdrop-blur px-2.5 py-1.5 shadow-card text-xs text-foreground hover:bg-card transition-colors"
    >
      {playing ? (
        <Pause className="h-3 w-3 text-primary" />
      ) : introDone ? (
        <Volume2 className="h-3 w-3 text-muted-foreground" />
      ) : (
        <Play className="h-3 w-3 text-primary" />
      )}
      <span className="hidden sm:inline">
        {playing ? "Pause sound" : introDone ? "Play sound" : "Sound"}
      </span>
    </button>
  );
};

export default WelcomeAudio;
