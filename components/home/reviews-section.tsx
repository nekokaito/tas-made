"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import styles from "./reviews-section.module.css";

const reviews = [
  "Customer loved the pouch and scarves",
  "Customer wearing a handmade scarf and sharing thanks",
  "Customer describes the scarf as soft and cozy",
  "Red scarf photos with a happy customer message",
  "Customer thanks Tas Made for the order and gift",
  "Customer loves the strawberry crochet piece",
  "Customer shares appreciation in Bengali",
  "Customer confirms delivery and says they are happy",
  "Parcel photos with thanks for the handmade work",
  "Flower scarf photo and customer thanks",
  "Red crochet piece with a positive customer message",
  "Customer thanks Tas Made for an amazing muffler",
  "Customer praises the quality of a handmade gift",
].map((alt, index) => ({
  src: `/reviews/review-${String(index + 1).padStart(2, "0")}.webp`,
  alt,
}));
const count = reviews.length;
function distance(index: number, active: number) {
  return (
    ((index - active + count + Math.floor(count / 2)) % count) -
    Math.floor(count / 2)
  );
}

export default function ReviewsSection() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const move = (step: number) =>
    setActive((index) => (index + step + count) % count);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const tweens = cards.current.flatMap((card, index) => {
      if (!card) return [];
      const offset = distance(index, active);
      const side = Math.sign(offset);
      gsap.set(card, {
        zIndex: offset === 0 ? 3 : Math.abs(offset) === 1 ? 2 : 0,
      });
      return [
        gsap.to(card, {
          xPercent: side * 30,
          y: offset === 0 ? 0 : 25,
          rotation: side * 12,
          scale: offset === 0 ? 1 : 0.94,
          opacity: Math.abs(offset) <= 1 ? 1 : 0,
          duration: reduced ? 0 : 0.65,
          ease: "power3.out",
          overwrite: true,
        }),
      ];
    });
    return () => tweens.forEach((tween) => tween.kill());
  }, [active]);

  return (
    <section
      ref={root}
      className={styles.section}
      aria-labelledby="reviews-title"
    >
      <div className={styles.heading}>
        <h2 className="loubag-font" id="reviews-title">
          Love, in their words.
        </h2>
      </div>
      <div
        className={styles.carousel}
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer review screenshots"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        <div
          className={styles.stack}
          onPointerDown={(event) => {
            pointer.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => {
            if (!pointer.current) return;
            const dx = event.clientX - pointer.current.x;
            const dy = event.clientY - pointer.current.y;
            pointer.current = null;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
              move(dx < 0 ? 1 : -1);
            }
          }}
          onPointerCancel={() => {
            pointer.current = null;
          }}
        >
          {reviews.map((review, index) => {
            const offset = distance(index, active);
            return (
              <div
                key={review.src}
                ref={(element) => {
                  cards.current[index] = element;
                }}
                className={styles.card}
                data-cursor="drag"
                data-active={offset === 0}
                aria-hidden={offset !== 0}
                role="group"
                aria-roledescription="slide"
                aria-label={`Review ${index + 1} of ${count}`}
                style={{ pointerEvents: offset === 0 ? "auto" : "none" }}
              >
                {Math.abs(offset) <= 2 && (
                  <Image
                    src={review.src}
                    alt={review.alt}
                    fill
                    sizes="(max-width: 767px) 66vw, 320px"
                    className={styles.image}
                    draggable={false}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.controls}>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous review"
          >
            <ArrowLeft size={19} />
          </button>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next review"
          >
            <ArrowRight size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}
