"use client";

import dynamic from "next/dynamic";
import type Lucide from "lucide-react";
import Skeleton from "react-loading-skeleton";

export type IconNames = keyof typeof Lucide.icons;
interface IconProps extends Lucide.LucideProps {
  name: IconNames;
}

export function Icon({ name, ...props }: IconProps) {
  const LucideIcon = dynamic(
    () => import("lucide-react").then((mod) => mod[name]),
    { ssr: false, loading: () => <Skeleton width="100%" height="100%" /> },
  );
  return <LucideIcon {...props} />;
}

export type { IconProps };
