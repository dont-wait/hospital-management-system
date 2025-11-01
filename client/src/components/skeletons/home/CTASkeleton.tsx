import Skeleton from "react-loading-skeleton";
import homeStyles from "@/styles/home.module.css";

export function CTASkeleton() {
  return (
    <section className={homeStyles["banner-card-skeleton"]}>
      <div className={homeStyles["banner-content"]}>
        <h2 className={homeStyles["banner-header"]}>
          <Skeleton height="100%" width="100%" />
        </h2>

        <p className={homeStyles["banner-description"]}>
          <Skeleton height="100%" width="100%" count={2} />
        </p>

        <div className={homeStyles["banner-buttons"]}>
          <Skeleton height={48} width={160} className="rounded" />
        </div>
      </div>
    </section>
  );
}
