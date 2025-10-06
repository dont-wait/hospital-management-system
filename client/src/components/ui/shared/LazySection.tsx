import dynamic from "next/dynamic";
import { FC, ReactNode, useRef, useEffect, useState } from "react";

type ImportedComponent = FC<Record<string, never>>;
type ImportFunc = () => Promise<{ default: ImportedComponent }>;

interface LazySectionProps {
  importFunc: ImportFunc;
  skeleton: ReactNode;
  className?: string;
}

function LazySection({ importFunc, skeleton, className }: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const Section = dynamic(importFunc, {
    loading: () => <>{skeleton}</>,
  });

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={className}
      ref={ref}
      aria-busy={!visible}
      aria-live="polite"
    >
      {visible ? <Section /> : skeleton}
    </div>
  );
}

export default LazySection;
