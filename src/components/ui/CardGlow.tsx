"use client";

import * as React from "react";
import clsx from "clsx";

interface CardGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export function CardGlow({ className, children, ...rest }: CardGlowProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40",
        "shadow-sm hover:shadow-xl transition-shadow",
        "hover:ring-1 hover:ring-purple-400/30",
        className
      )}
    >
      {children}
    </div>
  );
}
