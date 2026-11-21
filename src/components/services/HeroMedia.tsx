"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { hero } from "@/app/services/content";

/**
 * Background media for the hero (review round 2): a muted, looping video set
 * behind the right side of the hero, like the Platform hero's backdrop. The
 * hero adds the dark wash and glow on top.
 *
 * The trial clip is gitignored, so on any deployed build the file is missing;
 * the component then shows the fallback photo. Under reduced motion the video
 * stays paused on its first frame.
 */
export function HeroMedia() {
  const { video, fallbackImage, focus, interim } = hero.media;
  const ref = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(!video);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // The load may have failed before hydration attached onError.
    if (v.error || v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) v.pause();
      else v.play().catch(() => {});
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="absolute inset-0 lg:left-auto lg:w-[68%]">
      {failed || !video ? (
        <Image
          src={fallbackImage}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 68vw, 100vw"
          className="object-cover"
          style={{ objectPosition: focus }}
        />
      ) : (
        <video
          ref={ref}
          src={video}
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
          style={{ objectPosition: focus }}
        />
      )}
      {interim ? (
        <span className="font-mono-display absolute bottom-4 right-4 rounded-full bg-[rgba(10,10,10,0.7)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.8)]">
          {failed || !video ? "Interim image" : "Interim video: unlicensed comp"}
        </span>
      ) : null}
    </div>
  );
}
