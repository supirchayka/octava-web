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

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.load();

    const play = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      void video.play().catch(() => {
        // Autoplay can be blocked by the browser; the poster/background remains visible.
      });
    };

    play();
  }, [source]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover object-center"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster ?? undefined}
      aria-hidden="true"
    >
      <source src={source.src} type={source.mime ?? undefined} />
    </video>
  );
}
