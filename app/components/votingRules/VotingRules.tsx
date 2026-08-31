import Image from "next/image";
import React from "react";
import rule1 from "../../assets/rule1.svg";
import rule2 from "../../assets/rule2.svg";
import rule3 from "../../assets/rule3.svg";
import rule4 from "../../assets/rule4.svg";
import rule5 from "../../assets/rule5.svg";
import styles from "./VotingRules.module.css";

const VotingRules = () => {
  return (
    <main className={styles.mainContainer}>
      <section className={styles.sectionContainer}>
        <div className={styles.contentWrapper}>
          <h1 className={styles.mainTitle}>
            Voting Rules
          </h1>
          <h3 className={styles.subtitle}>
            Please all contestant and voters must read through these
            rules to avoid disqualification
          </h3>
          <div className={styles.rulesGrid}>
            <div className={styles.ruleItem}>
              <h1 className={styles.ruleTitle}>
                Rule 1
              </h1>
              <p className={styles.ruleDescription}>
                Registration is free for all and simple
              </p>
              <Image
                src={rule1}
                alt="Rule 1"
                className={styles.ruleImage}
              />
            </div>
            <div className={`${styles.ruleItem} ${styles.ruleItemMiddle}`}>
              <h1 className={styles.ruleTitle}>
                Rule 2
              </h1>
              <p className={styles.ruleDescription}>
                Each vote cost N100 i.e. 1 vote = 100
              </p>
              <Image
                src={rule2}
                alt="Rule 2"
                className={styles.ruleImage}
              />
            </div>
            <div className={styles.ruleItem}>
              <h1 className={styles.ruleTitle}>
                Rule 3
              </h1>
              <p className={styles.ruleDescription}>
                One voter can cast multiple votes
              </p>
              <Image
                src={rule3}
                alt="Rule 3"
                className={styles.ruleImage}
              />
            </div>
            <div className={`${styles.ruleItem} ${styles.ruleItemLast}`}>
              <h1 className={styles.ruleTitle}>
                Rule 4
              </h1>
              <p className={styles.ruleDescription}>
                Your payment validates your vote
              </p>
              <Image
                src={rule4}
                alt="Rule 4"
                className={styles.ruleImage}
              />
            </div>
            <div className={`${styles.ruleItem} ${styles.ruleItemLast}`}>
              <h1 className={styles.ruleTitle}>
                Rule 5
              </h1>
              <p className={styles.ruleDescription}>
                Return to page after payment to see vote
              </p>
              <Image
                src={rule5}
                alt="Rule 5"
                className={styles.ruleImage}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default VotingRules;