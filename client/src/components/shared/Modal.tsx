"use client";

import { motion, AnimatePresence } from "motion/react";
import { CircleX } from "@/lib/client";
import { ModalProps } from "@/types";
import styles from "@/styles/modal.module.css";

const maxWidthClasses = {
  sm: styles.maxWidthSm,
  md: styles.maxWidthMd,
  lg: styles.maxWidthLg,
  xl: styles.maxWidthXl,
  "2xl": styles.maxWidth2xl,
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
  showCloseButton = true,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={styles.backdrop}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={styles.modalContainer}
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className={`${styles.modalContent} ${maxWidthClasses[maxWidth]}`}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className={styles.header}>
                  {title && <h2 className={styles.title}>{title}</h2>}
                  {showCloseButton && (
                    <button onClick={onClose} className={styles.closeButton}>
                      <CircleX size={24} />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className={styles.body}>{children}</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
