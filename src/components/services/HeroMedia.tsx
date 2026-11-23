"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { hero } from "@/app/services/content";

/**
 * Background media for the hero: a muted, looping video set behind the right
 * side of the hero, like the Platform hero's backdrop. The hero adds the dark
 * wash and glow on top.
 *
 * One clip is picked at random on each page load (review round 3). The pick
 * happens after mount so the server and client render the same markup; until
 * then the backdrop is plain dark page.
 *
 * Phones get a 640x360 copy (the video sits under a dark wash there); wider
 * screens get the 1280x720 file. The poster is the clip's first frame. The
 * clips are gitignored until the owner decides where to host them, so on a
 * deployed build without them the component shows the fallback photo. Under
 * reduced motion the video stays paused on its first frame.
 */
export function HeroMedia() {
  const { videos, fallbackImage, fallbackFocus, interim } = hero.media;
  const ref = useRef<HTMLVideoElement | null>(null);
  const [pick, setPick] = useState<number | null>(null);
  const [failed, setFailed] = useState(videos.length === 0);

  useEffect(() => {
    if (videos.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPick(Math.floor(Math.random() * videos.length));
  }, [videos.length]);

  useEffect(() => {
    const v = ref.current;
    if (pick == null || !v) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) v.pause();
      else v.play().catch(() => {});
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [pick]);

  const video = pick == null ? null : videos[pick];

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
