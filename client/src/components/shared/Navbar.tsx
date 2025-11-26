import Link from "next/link";
import { NavbarUtils } from "./NavbarUtils";
import { Heart } from "@/lib/client";
import styles from "@/styles/navbar.module.css";

export function Navbar() {
  return (
    <nav className={styles["nav-section"]}>
      <div className={styles["nav-wrap"]}>
        <div className={styles["nav-content"]}>
          <section className={styles["nav-logo"]}>
            <Link href="/" className={styles["nav-link"]}>
              <Heart className={styles["nav-link-icon"]} />
              <span className={styles["nav-link-title"]}>MediCare</span>
            </Link>
          </section>

          <section className={styles["nav-options"]}>
            <NavbarUtils />
          </section>
        </div>
      </div>
    </nav>
  );
}
