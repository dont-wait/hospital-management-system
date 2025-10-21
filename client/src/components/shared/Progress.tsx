import { forwardRef, ElementRef, ComponentPropsWithoutRef } from "react";
import { motion } from "motion/react";
import { Root, Indicator } from "@radix-ui/react-progress";
import { cn } from "@/lib/client";
import styles from "@/styles/progress.module.css";

const MotionIndicator = motion(Indicator);

const Progress = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ className, value = 0, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(styles["progress-section"], className)}
    {...props}
  >
    <MotionIndicator
      className={styles["progress-indicator"]}
      initial={{ x: `${-(100 - ((value! - 1) / 3) * 100)}%` }}
      animate={{ x: `${-(100 - (value! / 3) * 100)}%` }}
      transition={{
        duration: 1,
        ease: "linear",
      }}
    />
  </Root>
));
Progress.displayName = "Progress";

export { Progress };
