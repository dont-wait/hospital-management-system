interface ParetoBlockProps {
  children: React.ReactNode;
  className?: string;
}

interface ParetoNumericProps {
  value: number;
  label: string;
  className?: string;
}

interface ParetoCardRootProps extends ParetoBlockProps {
  featured?: boolean;
}

interface MetricRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const ParetoCard = Object.assign(
  function ParetoCard({
    children,
    className = "",
    featured = false,
  }: ParetoCardRootProps): React.ReactElement {
    return (
      <article
        className={`relative rounded-xl border p-4 text-left transition ${
          featured
            ? "border-indigo-600 bg-indigo-50 shadow-lg ring-2 ring-indigo-200"
            : "border-border bg-white"
        } ${className}`}
      >
        {featured ? (
          <span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Tốt nhất đang áp dụng
          </span>
        ) : null}
        {children}
      </article>
    );
  },
  {
    Header: Object.assign(
      function Header({ children, className = "" }: ParetoBlockProps): React.ReactElement {
        return (
          <div className={`mb-3 flex items-center justify-between ${className}`}>
            {children}
          </div>
        );
      },
      {
        Id: function Id({ children, className = "" }: ParetoBlockProps): React.ReactElement {
          return (
            <span
              className={`rounded-md bg-slate-100 px-2 py-0.5 font-mono text-sm font-semibold text-slate-700 ${className}`}
            >
              {children}
            </span>
          );
        },
      },
    ),

    MetricPanel: function MetricPanel({
      children,
      className = "",
    }: ParetoBlockProps): React.ReactElement {
      return <div className={`mt-2 space-y-1.5 ${className}`}>{children}</div>;
    },

    MetricRow: function MetricRow({ label, children, className = "" }: MetricRowProps): React.ReactElement {
      return (
        <div className={`flex items-center justify-between text-xs ${className}`}>
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono font-semibold tabular-nums">{children}</span>
        </div>
      );
    },

    Divider: function Divider({ className = "" }: { className?: string }): React.ReactElement {
      return <hr className={`border-border my-2.5 ${className}`} />;
    },

    Footer: Object.assign(
      function Footer({ children, className = "" }: ParetoBlockProps): React.ReactElement {
        return (
          <div className={`flex justify-between text-xs ${className}`}>
            {children}
          </div>
        );
      },
      {
        Jfi: function Jfi({ value, className = "" }: Omit<ParetoNumericProps, "label">): React.ReactElement {
          return (
            <span className={className}>
              <span className="text-muted-foreground">JFI </span>
              <span className="font-mono font-semibold text-emerald-700">
                {value.toFixed(4)}
              </span>
            </span>
          );
        },

        Gini: function Gini({ value, className = "" }: Omit<ParetoNumericProps, "label">): React.ReactElement {
          return (
            <span className={className}>
              <span className="text-muted-foreground">Gini </span>
              <span className="font-mono font-semibold">
                {value.toFixed(4)}
              </span>
            </span>
          );
        },
      },
    ),
  },
);

export { ParetoCard };
