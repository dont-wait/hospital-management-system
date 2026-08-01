interface ErrorBannerProps {
  error: string;
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  return (
    <section className="glass border-l-4 border-amber-600 p-4 text-sm text-amber-900">
      {error}
    </section>
  );
}
