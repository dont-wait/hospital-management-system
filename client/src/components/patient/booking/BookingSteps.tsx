import { Icon } from "@/components";
import { bookingSteps } from "@/config";
import styles from "@/styles/booking.module.css";

interface BookingStepsProps {
  currentStep: number;
}

export function BookingSteps({ currentStep }: BookingStepsProps) {
  return (
    <div className={styles["booking-steps-box"]}>
      <div className={styles["booking-steps-content"]}>
        {bookingSteps.map((step, index) => (
          <div key={step.id} className={styles["booking-step"]}>
            <div className={styles["booking-step-content"]}>
              <div
                className={`${styles["booking-round"]} ${
                  styles[
                    index < currentStep
                      ? "done"
                      : index === currentStep
                        ? "active"
                        : "disable"
                  ]
                }`}
              >
                {index < currentStep ? (
                  <Icon name="Check" className={styles["booking-icon"]} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              <p
                className={`${styles["booking-title"]} ${
                  styles[index === currentStep ? "text-active" : "text-disable"]
                }`}
              >
                {step.label}
              </p>
            </div>

            {index < bookingSteps.length - 1 && (
              <div
                className={`${styles["booking-line"]} ${
                  styles[index < currentStep ? "line-active" : "line-disable"]
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
