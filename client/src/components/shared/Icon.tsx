"use client";

import {memo} from "react";
import dynamic from "next/dynamic";
import type Lucide from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { IconNames } from "@/types";

interface IconProps extends Lucide.LucideProps {
  name: IconNames;
}

function Icon({ name, ...props }: IconProps) {
  const LucideIcon = dynamic(
    () => import("lucide-react").then((mod) => mod[name]),
    {
      ssr: true,
      loading: () => (
        <Skeleton
          circle={true}
          containerClassName="flex items-center h-full justify-center aspect-square"
          width="100%"
          height="100%"
        />
      ),
    },
  );

  return <LucideIcon {...props} />;
}

export default memo(Icon);

export type { IconProps };
