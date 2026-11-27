"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const GsapStaggerGrid = ({ children, className }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const el = ref.current;
      if (!el) return;

      const items = gsap.utils.toArray<HTMLElement>(el.children);
      if (!items.length) return;

      if (reduced) {
        gsap.set(items, { opacity: 1, y: 0, scale: 1, rotation: 0 });
        return;
      }

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 90,
          scale: 0.88,
          rotation: -4,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.65,
          ease: "back.out(1.6)",
          stagger: {
            amount: 0.5,
            from: "start",
          },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
