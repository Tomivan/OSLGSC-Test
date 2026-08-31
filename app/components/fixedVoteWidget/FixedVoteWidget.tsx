"use client";

import React, { useState } from "react";
import { useVote } from "../../context/VoteContext";
import VoteConfirmationModal from "../voteConfirmation/VoteConfirmationModal";
import NotVotedModal from "../notVotedModal/NotVotedModal";
import { useRouter } from "next/navigation";
import styles from "./FixedVoteWidget.module.css";

const FixedVoteWidget = () => {
  const { totalVotes } = useVote();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotVotedOpen, setIsNotVotedOpen] = useState(false);
  const router = useRouter();

  const date = new Date().getFullYear();

  const handleVoteNow = () => {
    if (totalVotes === 0) {
      setIsNotVotedOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };
  const closeModal = () => setIsModalOpen(false);
  const closeNotVotedModal = () => setIsNotVotedOpen(false);

  const proceedToPayment = () => {
    router.push(`/voter-details?votes=${totalVotes}`);
    closeModal();
  };

  return (
    <>
      <div className={styles.widgetContainer}>
        <div className={styles.widgetInner}>
          <div className={styles.widgetContent}>
            <div className={styles.voteDisplay}>
              <span className={styles.voteLabel}>
                YOUR VOTE:
              </span>
              <span className={styles.voteCount}>
                {totalVotes}
              </span>
            </div>

            <button
              onClick={handleVoteNow}
              className={styles.voteButton}
            >
              VOTE NOW
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          Teepremium Agency © {date}
        </div>
      </div>
      {isModalOpen && (
        <VoteConfirmationModal
          onClose={closeModal}
          onConfirm={proceedToPayment}
        />
      )}
      {isNotVotedOpen && (
        <NotVotedModal
          onClose={closeNotVotedModal}
        />
      )}
    </>
  );
};

export default FixedVoteWidget;