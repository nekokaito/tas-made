"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./home.module.css";

const petals = Array.from({ length: 12 }, (_, index) => ({
  left: `${(index * 37 + 9) % 100}%`,
  size: 6 + (index % 4) * 2,
}));

export default function StorefrontHero() {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (context.conditions?.reduced) return;
        const desktop = context.conditions?.desktop;
        const select = gsap.utils.selector(root);
        const scroll = {
          trigger: scene.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        };

        // Separate wrappers prevent entrance, scroll and ambient transforms competing.
        gsap.from(select("[data-entrance]"), {
          opacity: 0,
          duration: 1.2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: scene.current,
            start: "top 95%",
            once: true,
          },
        });
        gsap.fromTo(
          select("[data-store]"),
          { scale: 1.015 },
          {
            scale: desktop ? 1.045 : 1.025,
            yPercent: -0.4,
            ease: "none",
            scrollTrigger: scroll,
          },
        );
        gsap.fromTo(
          select("[data-sky]"),
          { yPercent: -1 },
          {
            yPercent: 2,
            ease: "none",
            scrollTrigger: scroll,
          },
        );
        gsap.to(select("[data-foreground]"), {
          yPercent: desktop ? -1.5 : -0.6,
          scale: 1.025,
          ease: "none",
          scrollTrigger: scroll,
        });

        const ambient: gsap.core.Tween[] = [
          gsap.to(select("[data-sway]"), {
            xPercent: 0.2,
            yPercent: 0.2,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            paused: true,
          }),
        ];
        select("[data-petal]")
          .slice(0, desktop ? 12 : 5)
          .forEach((petal, index) => {
            const tween = gsap.fromTo(
              petal,
              { y: -25, x: -12, rotation: index * 31 },
              {
                y: () => (scene.current?.clientHeight ?? 500) + 30,
                x: 25 + index * 5,
                rotation: 190 + index * 23,
                duration: 15 + (index % 5) * 2,
                repeat: -1,
                ease: "none",
                paused: true,
              },
            );
            tween.progress((index * 0.173) % 1);
            ambient.push(tween);
          });
        let visible = false;
        const playback = () =>
          ambient.forEach((tween) => tween.paused(!visible || document.hidden));
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          playback();
        });
        if (scene.current) observer.observe(scene.current);
        document.addEventListener("visibilitychange", playback);
        const refresh = () =>
          ambient.slice(1).forEach((tween) => tween.invalidate());
        ScrollTrigger.addEventListener("refreshInit", refresh);
        return () => {
          observer.disconnect();
          document.removeEventListener("visibilitychange", playback);
          ScrollTrigger.removeEventListener("refreshInit", refresh);
        };
      },
      root,
    );
    return () => media.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="hero-title" className={styles.hero}>
      <h1 id="hero-title" className="sr-only">
        Tas Made — Handmade crochet
      </h1>
      <div
        ref={scene}
        className={styles.scene}
        role="img"
        aria-label="Tas Made crochet shop with pink cherry blossoms, yarn-filled windows and a sleeping cat"
      >
        <div className={styles.canvas}>
          <div data-sky className={styles.sky}>
            <Image
              src="/home/bloom/sky.webp"
              alt=""
              fill
              sizes="100vw"
              priority
            />
          </div>
          <div data-entrance className={styles.layers}>
            <div data-store className={styles.store}>
              <Image
                src="/home/bloom/storefront.webp"
                alt=""
                fill
                sizes="(max-width: 767px) 134vw, 100vw"
                priority
              />
            </div>
            <div data-foreground className={styles.foreground}>
              <div data-sway className={styles.sway}>
                <Image
                  src="/home/bloom/blossoms.webp"
                  alt=""
                  fill
                  sizes="(max-width: 767px) 134vw, 100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.particles} aria-hidden="true">
          {petals.map((petal, index) => (
            <span
              data-petal
              key={index}
              className={styles.petal}
              style={{
                left: petal.left,
                width: petal.size,
                height: petal.size * 0.65,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
