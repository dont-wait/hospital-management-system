import Skeleton from "react-loading-skeleton";
import homeStyles from "@/styles/home.module.css";
import cardStyles from "@/styles/card.module.css";

export function FeaturesSkeleton() {
  return (
    <section className={homeStyles["feature-section"]}>
      <div className={homeStyles["feature-content"]}>
        <div className={homeStyles["feature-section-skeleton"]}>
          <Skeleton height="100%" width="100%" />
        </div>

        <div className={homeStyles["feature-body"]}>
          {[...Array(4)].map((_, index) => (
            <div
              key={`card-${index}`}
              className={`${homeStyles["feature-title"]} ${cardStyles["card"]}`}
            >
              <div className={cardStyles["card-header"]}>
                <Skeleton
                  height="3rem"
                  width="3rem"
                  className={homeStyles["feature-icon"]}
                />

                <Skeleton height="100%" width="70%" />
              </div>

              <div className={cardStyles["card-content"]}>
                <div className={cardStyles["card-desc"]}>
                  <Skeleton height="100%" width="100%" count={3} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
