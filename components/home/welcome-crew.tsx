"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaRegHandSpock } from "react-icons/fa6";
import styles from "./welcome-crew.module.css";

const crew = [
  {
    id: "levi",
    name: "Levi",
    japanese: "リヴァイ",
    role: "Your little guardian",
    note: "Small stitches. Serious attitude.",
    greeting:
      "You're here. Good. Make yourself at home. I'll keep the yarn in order.",
  },
  {
    id: "zoro",
    name: "Zoro",
    japanese: "ゾロ",
    role: "Your wandering companion",
    note: "A soft spot for adventure.",
    greeting:
      "Looking for the shop? Me too. I took a wrong turn… but I'm glad you're here.",
  },
] as const;

export default function WelcomeCrew() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const select = gsap.utils.selector(root);
        const entrance = gsap.timeline({
          defaults: { duration: 1.1, ease: "power3.out" },
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            once: true,
          },
        });
        entrance
          .from(select("[data-copy]"), { y: 25, opacity: 0 }, 0)
          .from(
            select("[data-levi]"),
            { x: -65, y: 45, rotation: -12, opacity: 0, ease: "back.out(1.3)" },
            0.15,
          )
          .from(
            select("[data-zoro]"),
            { x: 65, y: 45, rotation: 12, opacity: 0, ease: "back.out(1.3)" },
            0.3,
          )
          .from(
            select("[data-label]"),
            { y: 15, opacity: 0, stagger: 0.1 },
            0.5,
          )
          .from(
            select("[data-thread]"),
            { strokeDashoffset: 1, duration: 1.8, ease: "power2.inOut" },
            0.2,
          );
        gsap.fromTo(
          select("[data-lettering]"),
          { y: 16 },
          {
            y: -16,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      },
      root,
    );
    return () => media.revert();
  }, []);

  useEffect(() => {
    if (active === null) return;
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const select = gsap.utils.selector(root);
        gsap.fromTo(
          select(`[data-reaction="${active}"]`),
          { rotation: -5, y: 0 },
          {
            keyframes: [
              { rotation: 5, y: -14 },
              { rotation: -3, y: -5 },
              { rotation: 0, y: 0 },
            ],
            duration: 0.75,
            ease: "power2.out",
          },
        );
        gsap.from(select("[data-greeting]"), {
          y: 6,
          opacity: 0,
          duration: 0.3,
        });
      },
      root,
    );
    return () => media.revert();
  }, [active]);

  return (
    <section ref={root} className={styles.section} aria-labelledby="crew-title">
      <div className={styles.stage}>
        <svg
          className={styles.thread}
          viewBox="0 0 1100 550"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M-40 430C90 270 155 550 280 410S325 190 230 240 370 510 550 415 790 300 880 380 1130 430 1140 235"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 7"
          />
          <path
            data-thread
            pathLength="1"
            d="M-40 430C90 270 155 550 280 410S325 190 230 240 370 510 550 415 790 300 880 380 1130 430 1140 235"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="1"
            className={styles.drawnThread}
          />
        </svg>
        {crew.map((character, index) => (
          <div
            className={`${styles.character} ${styles[character.id]}`}
            key={character.id}
          >
            <span
              data-lettering
              className={styles.japanese}
              lang="ja"
              aria-hidden="true"
            >
              {character.japanese}
            </span>
            <span className={styles.orbit} aria-hidden="true" />
            <div
              {...(index === 0 ? { "data-levi": "" } : { "data-zoro": "" })}
              className={styles.entrance}
            >
              <button
                type="button"
                className={styles.portrait}
                onClick={() =>
                  setActive((current) => (current === index ? null : index))
                }
                aria-label={`Say hello to ${character.name}`}
                aria-pressed={active === index}
                aria-controls="crew-greeting"
              >
                <span data-reaction={index} className={styles.reaction}>
                  <Image
                    src={`/home/crew/${character.id}.webp`}
                    alt={`Handmade ${character.name} crochet doll`}
                    width={810}
                    height={1080}
                    sizes="(max-width: 600px) 42vw, (max-width: 900px) 32vw, 340px"
                    draggable={false}
                  />
                </span>
                <span className={styles.hello}>
                  {active === index ? (
                    "Hello, friend! ♡"
                  ) : (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      Say hello <FaRegHandSpock />
                    </span>
                  )}
                </span>
              </button>
            </div>
            <div data-label className={styles.nameplate}>
              <h3 className="loubag-font">
                {character.name} <span lang="ja">{character.japanese}</span>
              </h3>
              <p className="loubag-font">{character.role}</p>
            </div>
          </div>
        ))}
        <div data-copy className={`${styles.copy} loubag-font`}>
          <h2 id="crew-title">
            Welcome
            <br />
            <em>to our world.</em>
          </h2>
          <p className={styles.intro}>A little yarn. A little anime.</p>
          <div
            id="crew-greeting"
            className={styles.greeting}
            aria-live="polite"
            aria-atomic="true"
          >
            <div data-greeting key={active ?? "welcome"}>
              <span className={styles.speaker}>
                {active === null
                  ? "YOUR WELCOME COMMITTEE"
                  : `${crew[active].name.toUpperCase()} SAYS…`}
              </span>
              <p>
                {active === null
                  ? "Levi keeps things cozy. Zoro gets a little lost. Together, they saved you a spot."
                  : crew[active].greeting}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
