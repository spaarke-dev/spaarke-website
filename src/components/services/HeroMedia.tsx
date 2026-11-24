"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { hero } from "@/app/services/content";

/**
 * Background media for the hero: a muted, looping video set behind the right
 * side of the hero, like the Platform hero's backdrop. The hero adds the dark
 * wash and glow on top.
 *
 * One clip is picked at random on each page load (review round 3). The page
 * picks it on the server and passes `clip`, so the video and poster are in the
 * first HTML and start downloading before the scripts load (2026-11-23; the
 * pick used to happen after mount, which held the download back until the
 * scripts arrived). Playback starts once the page is interactive.
 *
 * Phones get a 640x360 copy (the video sits under a dark wash there); wider
 * screens get the 1280x720 file. The poster is the clip's first frame. The
 * clips come from Azure blob storage (HERO_MEDIA in content.ts); if none can
 * load, the component shows the fallback photo. Under reduced motion the
 * video stays paused on its first frame.
 */
export function HeroMedia({ clip }: { clip: number | null }) {
  const { videos, fallbackImage, fallbackFocus, interim } = hero.media;
  const ref = useRef<HTMLVideoElement | null>(null);
  const video = clip == null ? null : (videos[clip] ?? null);
  const [failed, setFailed] = useState(video == null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // A source can fail before the page is interactive, when no onError
    // handler is attached yet: NETWORK_NO_SOURCE means none could play.
    if (v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
      return;
    }
    // Server-rendered markup may lack the muted attribute; autoplay needs it.
    v.muted = true;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) v.pause();
      else v.play().catch(() => {});
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [video]);

  return (
    <div className="absolute inset-0 lg:left-auto lg:w-[68%]">
      {failed ? (
        <Image
          src={fallbackImage}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 68vw, 100vw"
          className="object-cover"
          style={{ objectPosition: fallbackFocus }}
        />
      ) : video ? (
        <video
          key={video.src}
          ref={ref}
          poster={video.poster}
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          style={{ objectPosition: video.focus }}
        >
          <source src={video.small} type="video/mp4" media="(max-width: 767px)" />
          {/* The last source's error means no source could play. */}
          <source src={video.src} type="video/mp4" onError={() => setFailed(true)} />
        </video>
      ) : null}
      {interim && failed ? (
        <span className="font-mono-display absolute bottom-4 right-4 rounded-full bg-[rgba(10,10,10,0.7)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.8)]">
          Interim image
        </span>
      ) : null}
    </div>
  );
}
