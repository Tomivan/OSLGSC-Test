import React from "react";
import styles from "./DetailsConfirmationModal.module.css";

interface DetailsConfirmationModalProps {
  onClose: () => void;
}

const DetailsConfirmationModal: React.FC<DetailsConfirmationModalProps> = ({ onClose }) => {
  return (
    <main className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button 
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close modal"
        >
          <svg
            className={styles.closeIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>
            Kindly fill the required details in this section to proceed
          </h2>

          <div className={styles.buttonWrapper}>
            <button 
              onClick={onClose}
              className={styles.backButton}
            >
              Take me back
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetailsConfirmationModal;