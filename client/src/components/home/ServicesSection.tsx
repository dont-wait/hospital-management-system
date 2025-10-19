import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components";
import { services } from "@/config";
import styles from "@/styles/home.module.css";

export default function ServicesSection() {
  return (
    <motion.section
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={styles["service-section"]}
    >
      <div className={styles["service-content"]}>
        <h2 className={styles["service-header"]}>Dịch vụ của chúng tôi</h2>

        <div className={styles["service-body"]}>
          {services.map((service) => (
            <Card key={service.vi} className={styles["service-card"]}>
              <CardHeader>
                <CardTitle>{service.vi}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Chăm sóc và điều trị chuyên khoa {service.vi.toLowerCase()}{" "}
                  với thiết bị hiện đại nhất.
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
