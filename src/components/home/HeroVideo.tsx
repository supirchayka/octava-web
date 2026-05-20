"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type HeroVideoSource = {
  src: string;
  mime?: string;
};

type HeroVideoProps = {
  desktop: HeroVideoSource;
  mobile: HeroVideoSource;
  poster?: string | null;
};

export function HeroVideo({ desktop, mobile, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [useDesktop, setUseDesktop] = useState(false);
  const source = useMemo(
    () => (useDesktop ? desktop : mobile),
    [desktop, mobile, useDesktop],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateSource = () => setUseDesktop(mediaQuery.matches);

    updateSource();
    mediaQuery.addEventListener("change", updateSource);

    return () => mediaQuery.removeEventListener("change", updateSource);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();

    const play = () => {
      void video.play().catch(() => {
        // Autoplay can be blocked by the browser; the poster/background remains visible.
      });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(play, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(play, 300);
    return () => globalThis.clearTimeout(timeoutId);
  }, [source]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover object-center"
      muted
      loop
      playsInline
      preload="none"
      poster={poster ?? undefined}
      aria-hidden="true"
    >
      <source src={source.src} type={source.mime ?? undefined} />
    </video>
  );
}
