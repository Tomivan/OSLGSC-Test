"use client";

import React from "react";
import styles from "./VoteConfirmationModal.module.css";

type VoteConfirmationModalProps = {
  onClose: () => void;
  onConfirm: () => void;
};

const VoteConfirmationModal = ({
  onClose,
  onConfirm,
}: VoteConfirmationModalProps) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <p className={styles.modalText}>
          Are you sure you have voted <br /> for all your nominees?
        </p>

        <div className={styles.buttonContainer}>
          <button
            onClick={onConfirm}
            className={styles.confirmButton}
          >
            YES
          </button>
          <button
            onClick={onClose}
            className={styles.cancelButton}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteConfirmationModal;