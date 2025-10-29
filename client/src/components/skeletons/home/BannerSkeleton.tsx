import Skeleton from "react-loading-skeleton";
import homeStyles from "@/styles/home.module.css";

export function BannerSkeleton() {
  return (
    <section className={homeStyles["banner-card-skeleton"]}>
      <div className={homeStyles["banner-content"]}>
        <h1 className={homeStyles["banner-header-skeleton"]}>
          <Skeleton height="100%" width="100%" />
        </h1>

        <div className={homeStyles["banner-description-skeleton"]}>
          <Skeleton count={3} width="100%" height="100%" />
        </div>

        <div className={homeStyles["banner-buttons"]}>
          <Skeleton height={44} width={160} className="rounded" />
          <Skeleton height={44} width={160} className="rounded" />
        </div>
      </div>
    </section>
  );
}
