import Image from "next/image";
import React from "react";
import hand from "../../assets/handy.png";
import Link from "next/link";
import styles from "./VoteImage.module.css";

const VoteImage = () => {
  return (
    <main className={styles.mainContainer}>
      <h2 className={styles.mainTitle}>
        Welcome to the official voting website for the 2026 Local <br />Government Service Commission Week Awards!
      </h2>
      <section className={styles.sectionContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.textSection}>
            <h2 className={styles.textTitle}>
              VOTE FOR YOUR <br /> <span className={styles.textTitleHighlight}> FAVORITE NOMINEE </span>
            </h2>

            <div className={styles.descriptionWrapper}>
              <p className={styles.description}>
                As we honor the vital contributions of our committed local <br /> 
                government workforce, we invite you to take part in <br />
                recognizing excellence. Your vote is essential in celebrating <br /> 
                the individuals and teams who have gone above and beyond to <br /> 
                serve our communities.
              </p>
            </div>

            <Link href="#categories" className={styles.buttonLink}>
              <button className={styles.voteButton}>
                VOTE NOW
              </button>
            </Link>
          </div>

          <div className={styles.imageWrapper}>
            <Image
              src={hand}
              alt="hand"
              className={styles.handImage}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default VoteImage;