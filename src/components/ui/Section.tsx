"use client";

import * as React from "react";
import clsx from "clsx";

type SectionProps = React.PropsWithChildren<{
  className?: string;
  containerClassName?: string;
}>;

export function Section({ className, containerClassName, children }: SectionProps) {
  return (
    <section className={clsx("py-12 px-4 sm:px-6 lg:px-8", className)}>
      <div className={clsx("max-w-7xl mx-auto", containerClassName)}>{children}</div>
    </section>
  );
}
