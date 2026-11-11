"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./home.module.css";

const lines = [
  "Made with love.",
  "A little yarn.",
  "Your cozy little corner.",
  "Made slowly.",
  "Loved forever."
];

export default function StorefrontStory() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add({
      desktop: "(min-width: 901px)",
      motion: "(prefers-reduced-motion: no-preference)",
    }, (context) => {
      if (!context.conditions?.motion) return;

      const section = root.current?.parentElement;
      const words = root.current?.querySelectorAll<HTMLElement>("[data-story-line]");
      if (!section || !words?.length) return;

      const pinned = context.conditions.desktop ? section : root.current;
      if (!pinned) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: pinned,
          pin: pinned,
            start: context.conditions.desktop ? "top top" : "top 20%",
          end: () => `+=${Math.max(window.innerHeight * 1.25, words.length * 160)}`,
          scrub: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.set(words, { color: "#bd7698" });
      words.forEach((word) => {
        timeline.to(word, { color: "#843a60", duration: 1, ease: "none" });
      });
    });

    return () => media.revert();
  }, []);

  return (
    <div ref={root} className={styles.storefrontStory}>
      <p className={`${styles.storyText} loubag-font`}>
        {lines.map((line) => (
          <span className={styles.storyLine} data-story-line key={line}>
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}
