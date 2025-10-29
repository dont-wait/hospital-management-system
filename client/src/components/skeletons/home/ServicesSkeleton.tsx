import Skeleton from "react-loading-skeleton";
import homeStyles from "@/styles/home.module.css";
import cardStyles from "@/styles/card.module.css";

export function ServicesSkeleton() {
  return (
    <section className={homeStyles["service-section"]}>
      <div className={homeStyles["service-content"]}>
        <h2 className={homeStyles["service-header"]}>
          <Skeleton height="100%" width="100%" />
        </h2>

        <div className={homeStyles["service-body"]}>
          {[...Array(9)].map((_, index) => (
            <div key={`card-${index}`} className={cardStyles["card"]}>
              <div className={cardStyles["card-header"]}>
                <div className={cardStyles["card-title"]}>
                  <Skeleton height="100%" width="50%" />
                </div>
              </div>
              <div className={cardStyles["card-content"]}>
                <div className={cardStyles["card-desc"]}>
                  <Skeleton height="100%" width="100%" count={2} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
