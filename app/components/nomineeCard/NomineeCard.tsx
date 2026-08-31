"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import minus from "../../assets/minus.png";
import plus from "../../assets/plus.png";
import styles from "./NomineeCard.module.css";

interface NomineeCardProps {
  nominee: {
    id: string;
    name: string;
    image: string;
    voteCount: number;
    liveIncrement?: number;
  };
  voteQuantity: number;
  onVoteChange: (nomineeId: string, quantity: number) => void;
  isSelected: boolean;
  categoryId: string;
}

export const NomineeCard: React.FC<NomineeCardProps> = ({
  nominee,
  voteQuantity,
  onVoteChange,
  isSelected,
  categoryId,
}) => {
  const handleIncrement = () => {
    onVoteChange(nominee.id, voteQuantity + 1);
  };
  
  const handleDecrement = () => {
    if (voteQuantity > 0) {
      onVoteChange(nominee.id, voteQuantity - 1);
    }
  };

  return (
    <div className={`${styles.card} ${isSelected ? styles.cardSelected : styles.cardUnselected}`}>
      <div className={styles.header}>
        <Link 
          href={`/nominee/${nominee.id}?category=${categoryId}`}
          className={styles.copyLink}
        >
          Copy link
        </Link>
        <div className={styles.voteBadge}>
          <span>{nominee.voteCount}</span>
        </div>
      </div>
      
      <div className={styles.imageWrapper}>
        <Image
          src={"/image.png"}
          alt={nominee.name}
          fill
          className={styles.image}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/image.png";
          }}
        />
      </div>
      
      <div className={styles.nameContainer}>
        <span className={styles.nameLabel}>Name: </span>
        <span className={styles.nameText}>
          {nominee.name}
        </span>
      </div>
      
      <div className={styles.controls}>
        <button
          onClick={handleDecrement}
          disabled={voteQuantity === 0}
          className={`${styles.controlButton} ${voteQuantity === 0 ? styles.controlButtonDisabled : ''}`}
          aria-label="Decrease votes"
        >
          <Image src={minus} alt="Decrease votes" width={12} height={12} />
        </button>
        
        <div className={styles.voteQuantity}>
          <span className={styles.voteQuantityText}>
            {voteQuantity}
          </span>
        </div>
        
        <button
          onClick={handleIncrement}
          className={styles.controlButton}
          aria-label="Increase votes"
        >
          <Image src={plus} alt="Increase votes" width={12} height={12} />
        </button>
      </div>
      
      {isSelected && (
        <div className={styles.selectedBadge}>
          <svg className={styles.selectedIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};