import React from "react";
import styles from "./NotVotedModal.module.css";

type NotVotedProps = {
  onClose: () => void;
};

const NotVotedModal: React.FC<NotVotedProps> = ({ onClose }) => {
  return (
    <main className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton}>
          <svg
            className={styles.closeIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            onClick={onClose}
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
            You haven&apos;t voted for anyone. Kindly vote for your
            nominee(s) to proceed
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

export default NotVotedModal;