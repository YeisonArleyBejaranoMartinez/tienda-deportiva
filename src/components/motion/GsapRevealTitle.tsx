"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
}

export const GsapRevealTitle = ({ children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const el = ref.current;
      if (!el) return;

      const title = el.querySelector(".gsap-title");
      const line = el.querySelector(".gsap-speed-line");

      if (reduced) {
        gsap.set([title, line], { opacity: 1, x: 0, scaleX: 1 });
        return;
      }

      gsap.fromTo(
        title,
        { x: -80, opacity: 0, skewX: -8 },
        {
          x: 0,
          opacity: 1,
          skewX: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        line,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="relative mb-10">
      <div className="gsap-title">{children}</div>
      {/* Línea de velocidad naranja */}
      <div
        className="gsap-speed-line h-1 w-24 bg-[#C45C1A] rounded-full mt-2 origin-left"
        style={{ transformOrigin: "left center" }}
      />
    </div>
  );
};
