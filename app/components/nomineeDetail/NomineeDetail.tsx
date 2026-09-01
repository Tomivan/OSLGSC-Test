"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useVote, useSocket } from "../../context/VoteContext";
import FixedVoteWidget from "../fixedVoteWidget/FixedVoteWidget";
import minus from "../../assets/minus.png";
import plus from "../../assets/plus.png";
import styles from "./NomineeDetailPage.module.css";

interface NomineeDetailProps {
  nominee: {
    id: string;
    name: string;
    image: string;
    voteCount: number;
    category: string;
    categoryId: string;
    bio?: string;
  };
}

export const NomineeDetailPage: React.FC<NomineeDetailProps> = ({ nominee }) => {
  const router = useRouter();
  const { 
    handleVoteChange, 
    getVoteQuantity,
    liveVotes,
    isSyncing 
  } = useVote();
  
  const { isConnected } = useSocket();
  
  const [voteInput, setVoteInput] = useState<string>("");
  const [showLiveIndicator, setShowLiveIndicator] = useState(false);
  
  const currentVotes = getVoteQuantity(nominee.categoryId, nominee.id);
  const liveIncrement = liveVotes[nominee.id] || 0;
  const totalLiveVotes = (nominee.voteCount || 0) + liveIncrement;

  useEffect(() => {
    setVoteInput(currentVotes.toString());
  }, [currentVotes]);

  useEffect(() => {
    if (liveIncrement > 0) {
      setShowLiveIndicator(true);
      const timer = setTimeout(() => setShowLiveIndicator(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [liveIncrement]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setVoteInput(value);
    }
  };

  const handleApplyVotes = () => {
    const quantity = parseInt(voteInput) || 0;
    handleVoteChange(nominee.categoryId, nominee.id, quantity);
  };

  const handleIncrement = () => {
    const newValue = currentVotes + 1;
    setVoteInput(newValue.toString());
    handleVoteChange(nominee.categoryId, nominee.id, newValue);
  };

  const handleDecrement = () => {
    if (currentVotes > 0) {
      const newValue = currentVotes - 1;
      setVoteInput(newValue.toString());
      handleVoteChange(nominee.categoryId, nominee.id, newValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApplyVotes();
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBar}>
        <div className={styles.headerContent}>
          <button
            onClick={() => router.back()}
            className={styles.backButton}
            aria-label="Go back"
          >
            <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className={styles.backText}>Back</span>
          </button>
          
          <div className={styles.statusContainer}>
            {isConnected ? (
              <div className={styles.statusLive}>
                <span className={styles.statusDotLive}></span>
                <span className={styles.statusTextLive}>Live</span>
              </div>
            ) : (
              <div className={styles.statusReconnecting}>
                <span className={styles.statusDotReconnecting}></span>
                <span className={styles.statusTextReconnecting}>Reconnecting...</span>
              </div>
            )}
            
            {isSyncing && (
              <div className={styles.statusSyncing}>
                <span className={styles.statusDotSyncing}></span>
                <span className={styles.statusTextSyncing}>Syncing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.card}>
          <div className={styles.cardGrid}>
            <div className={styles.imageContainer}>
              <Image
                src={"/image.png"}
                alt={nominee.name}
                fill
                className={styles.image}
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/image.png";
                }}
              />
              
              <div className={styles.voteBadge}>
                <span>{totalLiveVotes.toLocaleString()} votes</span>
                {liveIncrement > 0 && (
                  <span className={styles.liveIncrementBadge}>+{liveIncrement}</span>
                )}
              </div>
              
              {liveIncrement > 0 && (
                <div className={styles.liveVotingBadge}>
                  <span className={styles.liveVotingDot}></span>
                  LIVE VOTING
                </div>
              )}
            </div>

            <div className={styles.detailsContainer}>
              <div>
                <h2 className={styles.nomineeName}>{nominee.name}</h2>
                <p className={styles.categoryText}>
                  Category: <span className={styles.categoryName}>{nominee.category}</span>
                </p>
                
                {nominee.bio && (
                  <div className={styles.bioContainer}>
                    <h3 className={styles.bioTitle}>About</h3>
                    <p className={styles.bioText}>{nominee.bio}</p>
                  </div>
                )}
              </div>

              <div>
                {showLiveIndicator && (
                  <div className={styles.liveIndicator}>
                    <p className={styles.liveIndicatorText}>
                      <span className={styles.liveIndicatorDot}></span>
                      {liveIncrement} new vote{liveIncrement !== 1 ? 's' : ''} from other users!
                    </p>
                  </div>
                )}

                <div className={styles.voteSection}>
                  <div>
                    <label htmlFor="voteInput" className={styles.inputLabel}>
                      Your votes for {nominee.name}
                    </label>
                    <div className={styles.inputGroup}>
                      <input
                        id="voteInput"
                        type="text"
                        inputMode="numeric"
                        value={voteInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="0"
                        className={styles.voteInput}
                      />
                      <button
                        onClick={handleApplyVotes}
                        className={`${styles.applyButton} ${isSyncing ? styles.applyButtonDisabled : ''}`}
                        disabled={isSyncing}
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className={styles.controlsContainer}>
                    <button
                      onClick={handleDecrement}
                      disabled={currentVotes === 0 || isSyncing}
                      className={`${styles.controlButton} ${(currentVotes === 0 || isSyncing) ? styles.controlButtonDisabled : ''}`}
                      aria-label="Decrease votes"
                    >
                      <Image src={minus} alt="Decrease votes" width={14} height={14} />
                    </button>
                    
                    <div className={styles.voteDisplay}>
                      <span className={styles.voteCountDisplay}>
                        {currentVotes}
                      </span>
                      {liveIncrement > 0 && (
                        <span className={styles.liveIncrementDisplay}>
                          +{liveIncrement}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={handleIncrement}
                      disabled={isSyncing}
                      className={`${styles.controlButton} ${isSyncing ? styles.controlButtonDisabled : ''}`}
                      aria-label="Increase votes"
                    >
                      <Image src={plus} alt="Increase votes" width={14} height={14} />
                    </button>
                  </div>

                  {currentVotes > 0 && (
                    <div className={styles.confirmationBox}>
                      <p className={styles.confirmationText}>
                        You&apos;re contributing {currentVotes} vote{currentVotes !== 1 ? 's' : ''} to {nominee.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FixedVoteWidget />
    </div>
  );
};