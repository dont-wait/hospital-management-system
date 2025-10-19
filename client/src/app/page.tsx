"use client";

import Skeleton from "react-loading-skeleton";
import LazySection from "@/components/shared/LazySection";
import homeStyles from "@/styles/home.module.css";
import cardStyles from "@/styles/card.module.css";

function HomePage() {
  return (
    <div>
      <LazySection
        importFunc={() => import("@/components/home/Banner")}
        skeleton={
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
        }
      />

      <LazySection
        importFunc={() => import("@/components/home/FeaturesSection")}
        skeleton={
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
        }
      />

      <LazySection
        importFunc={() => import("@/components/home/ServicesSection")}
        skeleton={
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
        }
      />

      <LazySection
        importFunc={() => import("@/components/home/CTASection")}
        skeleton={
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
        }
      />
    </div>
  );
}

export default HomePage;
