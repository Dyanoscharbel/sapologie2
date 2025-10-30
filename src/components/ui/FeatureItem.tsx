"use client";

import * as React from "react";
import clsx from "clsx";

type FeatureItemProps = React.PropsWithChildren<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}>;

export function FeatureItem({ icon, title, description, className, children }: FeatureItemProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 p-5",
        "shadow-sm hover:shadow-lg transition-shadow",
        className
      )}
    >
      {icon && <div className="mb-3 text-gray-700" aria-hidden>{icon}</div>}
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      {children}
    </div>
  );
}
