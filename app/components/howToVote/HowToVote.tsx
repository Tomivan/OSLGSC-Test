import React from "react";
import styles from "./HowToVote.module.css";

const HowToVote = () => {
  return (
    <main className={styles.mainContainer}>
      <section className={styles.sectionContainer}>
        <div className={styles.contentWrapper}>
          <h1 className={styles.mainTitle}>
            How to vote
          </h1>
          <p className={styles.subtitle}>
            The steps below provide information on how to cast a
            valid vote for your favourite nominee(s)
          </p>
          
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <h2 className={styles.stepNumber}>
                Step 1
              </h2>
              <h1 className={styles.stepTitle}>
                SELECT YOUR CATEGORY
              </h1>
              <p className={styles.stepDescription}>
                Click on the category tab in which your
                nominee(s) are selected for, this will open up
                all the nominees in the category.
              </p>
            </div>

            <div className={styles.stepCard}>
              <h2 className={styles.stepNumber}>
                Step 2
              </h2>
              <h1 className={styles.stepTitle}>
                VOTE FOR YOUR NOMINEE
              </h1>
              <p className={styles.stepDescription}>
                Use the sign + to increase your vote count and
                sign - to reduce your vote count (You can vote
                for multiple nominees.)
              </p>
            </div>

            <div className={styles.stepCard}>
              <h2 className={styles.stepNumber}>
                Step 3
              </h2>
              <h1 className={styles.stepTitle}>
                SUBMIT YOUR VOTE
              </h1>
              <p className={styles.stepDescription}>
                Click on submit button, then follow the prompt
                to cast your votes.
                <br />
                <span className={styles.noteText}>
                  <i>
                    Note: Your vote only counts when your
                    payment is confirmed
                  </i>
                </span>
              </p>
            </div>

            <div className={styles.stepCard}>
              <h2 className={styles.stepNumber}>
                Step 4
              </h2>
              <h1 className={styles.stepTitle}>
                RETURN TO THE PAGE
              </h1>
              <p className={styles.stepDescription}>
                Once you have made payment kindly go back to the page and confirm your payment.
                <br />
                <span className={styles.noteText}>
                  <i>
                    Note: Once you see the Thank you page, your vote is added.
                  </i>
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HowToVote;