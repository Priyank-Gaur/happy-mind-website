import { useEffect, useState } from "react";
import happi from "@/assets/happi-mascot.png";

/* Intro timeline (ms from load):
   0.3s  Happi walks in
   1.5s  his greeting appears
   5.0s  the splash fades and the site opens underneath  */
const MASCOT_IN = 300;
const BUBBLE_IN = 1500;
const EXIT_AT = 5000;
const FADE_DURATION = 600;

const MascotIntro = () => {
  const [mounted, setMounted] = useState(true);
  const [mascotIn, setMascotIn] = useState(false);
  const [bubbleIn, setBubbleIn] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setMascotIn(true), MASCOT_IN),
      setTimeout(() => setBubbleIn(true), BUBBLE_IN),
      setTimeout(() => setLeaving(true), EXIT_AT),
      setTimeout(() => setMounted(false), EXIT_AT + FADE_DURATION),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Hold the page still while the splash is up
  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mounted]);

  const skip = () => {
    setLeaving(true);
    setTimeout(() => setMounted(false), FADE_DURATION);
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center surface-hero px-6 transition-opacity duration-700 ease-out ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div
        className={`flex flex-col items-center transition-all duration-700 ease-out ${
          mascotIn
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Greeting */}
        <div
          className={`relative mb-6 max-w-[300px] sm:max-w-[380px] rounded-2xl bg-card border border-border shadow-card px-6 py-4 text-center transition-all duration-500 ease-out ${
            bubbleIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <p className="text-base sm:text-lg text-foreground leading-relaxed">
            Hi, I'm <span className="font-semibold text-primary">Happi</span>,
            your HappiMynd companion. Welcome to our website!
          </p>

          {/* tail, pointing down at Happi */}
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 h-3 w-3 rotate-45 bg-card border-r border-b border-border" />
        </div>

        <img
          src={happi}
          alt="Happi, the HappiMynd companion"
          className="h-72 sm:h-96 lg:h-[26rem] w-auto select-none pointer-events-none"
        />
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute bottom-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Skip intro
      </button>
    </div>
  );
};

export default MascotIntro;
