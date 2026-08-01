import { formatElapsedHhMmSs } from "@/lib/client/scheduleResult.utils";
import { AlgorithmRunMetrics } from "@/types";

interface PanelBlockProps {
  children: React.ReactNode;
  className?: string;
}

const RunMetricsPanel = Object.assign(
  function RunMetricsPanel({
    children,
    className = "",
  }: PanelBlockProps): React.ReactElement {
    return (
      <section className={`glass stagger-in p-4 md:p-6 ${className}`}>
        {children}
      </section>
    );
  },
  {
    Title: function Title({
      children,
      className = "",
    }: PanelBlockProps): React.ReactElement {
      return <h2 className={`mb-3 text-lg font-bold ${className}`}>{children}</h2>;
    },

    Grid: function Grid({
      children,
      className = "",
    }: PanelBlockProps): React.ReactElement {
      return (
        <div className={`grid grid-cols-2 gap-3 md:grid-cols-4 ${className}`}>
          {children}
        </div>
      );
    },

    Item: Object.assign(
      function Item({
        children,
        className = "",
      }: PanelBlockProps): React.ReactElement {
        return (
          <article className={`border-border rounded-xl border bg-white p-4 ${className}`}>
            {children}
          </article>
        );
      },
      {
        Label: function Label({
          children,
          className = "",
        }: PanelBlockProps): React.ReactElement {
          return (
            <p className={`text-muted-foreground text-xs font-medium tracking-wide ${className}`}>
              {children}
            </p>
          );
        },

        Value: function Value({
          children,
          className = "",
        }: PanelBlockProps): React.ReactElement {
          return (
            <p className={`mt-1 font-mono text-2xl font-bold ${className}`}>
              {children}
            </p>
          );
        },

        Note: function Note({
          children,
          className = "",
        }: PanelBlockProps): React.ReactElement {
          return (
            <p className={`text-muted-foreground mt-1 text-[11px] ${className}`}>
              {children}
            </p>
          );
        },
      },
    ),
  },
);

export { RunMetricsPanel };

export function renderRunMetrics(metrics: AlgorithmRunMetrics): React.ReactElement {
  return (
    <RunMetricsPanel>
      <RunMetricsPanel.Title>Thời gian chạy thuật toán</RunMetricsPanel.Title>
      <RunMetricsPanel.Grid>
        <RunMetricsPanel.Item>
          <RunMetricsPanel.Item.Label>Thời gian chạy</RunMetricsPanel.Item.Label>
          <RunMetricsPanel.Item.Value>
            {formatElapsedHhMmSs(metrics.elapsed_seconds)}
          </RunMetricsPanel.Item.Value>
          <RunMetricsPanel.Item.Note>Định dạng giờ : phút : giây</RunMetricsPanel.Item.Note>
        </RunMetricsPanel.Item>

        <RunMetricsPanel.Item>
          <RunMetricsPanel.Item.Label>Số thế hệ</RunMetricsPanel.Item.Label>
          <RunMetricsPanel.Item.Value>{metrics.n_generations}</RunMetricsPanel.Item.Value>
        </RunMetricsPanel.Item>

        <RunMetricsPanel.Item>
          <RunMetricsPanel.Item.Label>Cỡ quần thể</RunMetricsPanel.Item.Label>
          <RunMetricsPanel.Item.Value>{metrics.population_size}</RunMetricsPanel.Item.Value>
        </RunMetricsPanel.Item>

        <RunMetricsPanel.Item>
          <RunMetricsPanel.Item.Label>Tiền tuyến Pareto (hạng 1)</RunMetricsPanel.Item.Label>
          <RunMetricsPanel.Item.Value>{metrics.pareto_front_size}</RunMetricsPanel.Item.Value>
          <RunMetricsPanel.Item.Note>Số nghiệm không bị chi phối</RunMetricsPanel.Item.Note>
        </RunMetricsPanel.Item>
      </RunMetricsPanel.Grid>
    </RunMetricsPanel>
  );
}
