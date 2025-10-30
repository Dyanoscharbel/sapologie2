"use client";

import * as React from "react";

type RevealProps = React.PropsWithChildren<{
  className?: string;
  /** Delay in ms for staggered items */
  delay?: number;
}>;

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delay);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={
        visible
          ? className
          : `${className ?? ""} opacity-0 translate-y-4 transition-all duration-700 ease-out will-change-transform`
      }
      style={visible ? undefined : {}}
    >
      {children}
    </div>
  );
}
