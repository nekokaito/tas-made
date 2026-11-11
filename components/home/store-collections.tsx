"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "@/components/home/home.module.css";

const collections = [
  {
    name: "Bags",
    detail: "A little sunshine to carry everywhere.",
    image: "/home/collection/bag.png",
    alt: "Handmade sunflower crochet shoulder bag",
  },
  {
    name: "Plushies",
    detail: "Soft friends, made one stitch at a time.",
    image: "/home/collection/plushie.png",
    alt: "Handmade crochet bunny with a burgundy bow",
  },
  {
    name: "Clothing",
    detail: "Cozy pieces to keep close.",
    image: "/home/collection/scarf.png",
    alt: "Handmade burgundy crochet scarf",
  },
];

function CollectionDrawing({
  name,
  right,
  index,
}: {
  name: string;
  right: boolean;
  index: number;
}) {
  const path = right
    ? "M18 135C65 68 190 62 354 108L321 81L354 108L311 127"
    : "M382 135C335 68 210 62 46 108L79 81L46 108L89 127";

  return (
    <svg
      className={styles.collectionDrawing}
      viewBox="0 0 400 250"
      fill="none"
      role="img"
      aria-label={name}
    >
      <defs>
        <clipPath id={`collection-ink-${index}`}>
          <rect data-name-reveal x="70" y="137" width="330" height="85" />
        </clipPath>
      </defs>
      <path
        data-arrow-line
        d={path}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        data-collection-name
        x="70"
        y="205"
        className={`${styles.collectionName} loubag-font`}
        clipPath={`url(#collection-ink-${index})`}
      >
        {name}
      </text>
    </svg>
  );
}

function Pencil() {
  return (
    <svg viewBox="0 0 28 64" fill="none" aria-hidden="true">
      <g transform="translate(14 64) rotate(20)">
        <path
          d="M0 0L-7-13L7-13Z"
          fill="#D9AE8B"
          stroke="#9C5576"
          strokeWidth="1.5"
        />
        <path d="M0 0L-2.3-4.5L2.3-4.5Z" fill="#654257" />
        <path
          d="M-7-13V-55H7V-13Z"
          fill="#FFE5B5"
          stroke="#9C5576"
          strokeWidth="1.5"
        />
        <path d="M-3-50V-17M3-50V-17" stroke="#E9A9BA" strokeWidth="1.5" />
        <path
          d="M-7-55V-62H7V-55Z"
          fill="#F9C9DB"
          stroke="#9C5576"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

export default function StoreCollections() {
  const root = useRef<HTMLElement>(null);
  const journey = useRef<HTMLDivElement>(null);
  const pencil = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !journey.current || !pencil.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      {
        mobile: "(max-width: 767px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (!context.conditions?.motion) return;

        const section = root.current!;
        const journeyElement = journey.current!;
        const pencilElement = pencil.current!;
        const items = gsap.utils.toArray<HTMLElement>(
          "[data-collection-item]",
          section,
        );

        const penPosition = (
          element: SVGGraphicsElement,
          x: number,
          y: number,
        ) => {
          const svg = element.ownerSVGElement!;
          const svgBounds = svg.getBoundingClientRect();
          const viewBox = svg.viewBox.baseVal;
          const scale = Math.min(
            svgBounds.width / viewBox.width,
            svgBounds.height / viewBox.height,
          );
          const offsetX = (svgBounds.width - viewBox.width * scale) / 2;
          const offsetY = (svgBounds.height - viewBox.height * scale) / 2;
          const bounds = journeyElement.getBoundingClientRect();
          return {
            x: svgBounds.left + offsetX + x * scale - bounds.left - 14,
            y: svgBounds.top + offsetY + y * scale - bounds.top - 64,
          };
        };

        const drawing = gsap.timeline({
          scrollTrigger: {
            trigger: journeyElement,
            start: context.conditions.mobile ? "top 75%" : "top 80%",
            end: context.conditions.mobile ? "bottom 75%" : "bottom 20%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        gsap.set(pencilElement, { opacity: 0 });

        items.forEach((item, index) => {
          const image = item.querySelector<HTMLElement>(
            "[data-collection-image]",
          );
          const arrow = item.querySelector<SVGPathElement>("[data-arrow-line]");
          const name = item.querySelector<SVGTextElement>(
            "[data-collection-name]",
          );
          const reveal =
            item.querySelector<SVGRectElement>("[data-name-reveal]");

          if (image) {
            gsap.fromTo(
              image,
              { y: 32, rotation: index === 1 ? 3 : -3 },
              {
                y: -32,
                rotation: index === 1 ? -2 : 2,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              },
            );
          }

          if (arrow && name && reveal) {
            const length = arrow.getTotalLength();
            const arrowStart = arrow.getPointAtLength(0);
            const arrowProgress = { value: 0 };
            const nameProgress = { value: 0 };

            gsap.set(arrow, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
            gsap.set(reveal, { attr: { width: 0 } });

            drawing.to(pencilElement, {
              x: () => penPosition(arrow, arrowStart.x, arrowStart.y).x,
              y: () => penPosition(arrow, arrowStart.x, arrowStart.y).y,
              opacity: 1,
              duration: index === 0 ? 0.1 : 0.45,
              ease: "none",
            });

            drawing
              .to(arrowProgress, {
                value: 1,
                duration: 1.5,
                ease: "none",
                onUpdate: () => {
                  const distance = length * arrowProgress.value;
                  const point = arrow.getPointAtLength(distance);
                  gsap.set(arrow, { strokeDashoffset: length - distance });
                  gsap.set(pencilElement, penPosition(arrow, point.x, point.y));
                },
              })
              .to(pencilElement, {
                x: () => penPosition(name, 70, 205).x,
                y: () => penPosition(name, 70, 205).y,
                duration: 0.35,
                ease: "none",
              })
              .to(nameProgress, {
                value: 1,
                duration: 1.4,
                ease: "none",
                onUpdate: () => {
                  const width =
                    Math.min(name.getComputedTextLength() + 12, 330) *
                    nameProgress.value;
                  reveal.setAttribute("width", String(width));
                  gsap.set(pencilElement, penPosition(name, 70 + width, 205));
                },
              })
              .set(reveal, { attr: { width: 330 } });
          }
        });

        drawing.to(pencilElement, { opacity: 0, duration: 0.12 });
      },
    );

    return () => media.revert();
  }, []);

  return (
    <section
      id="collections"
      ref={root}
      className={styles.collectionShowcase}
      aria-labelledby="collections-title"
    >
      <div className={styles.collectionIntro}>
        <h2 id="collections-title" className="loubag-font">
          A little of everything.
        </h2>
      </div>

      <div ref={journey} className={styles.collectionJourney}>
        <div ref={pencil} className={styles.journeyPencil} aria-hidden="true">
          <Pencil />
        </div>
        {collections.map(({ name, detail, image, alt }, index) => (
          <article
            className={`${styles.collectionMoment} ${index === 1 ? styles.collectionMomentReverse : ""}`}
            data-collection-item
            key={name}
            aria-label={`${name} collection`}
          >
            <div className={styles.collectionProduct} data-collection-image>
              <Image
                src={image}
                alt={alt}
                width={520}
                height={620}
                sizes="(max-width: 767px) 56vw, 34vw"
              />
            </div>
            <div className={styles.collectionAnnotation} data-collection-label>
              <CollectionDrawing
                name={name}
                right={index === 1}
                index={index}
              />
              <p>{detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
