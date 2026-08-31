import Image from "next/image";
import React from "react";
import chairw from "../../assets/chairw.svg";
import comm1 from "../../assets/comm1.svg";
import comm2 from "../../assets/comm2.png";
import comm3 from "../../assets/comm3.png";
import comm4 from "../../assets/comm4.png";
import perm from "../../assets/perm.png";
import styles from "./Officials.module.css";

const Officials = () => {
  return (
    <main className={styles.mainContainer}>
      <section className={styles.sectionContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.headerSection}>
            <div>
              <Image src={chairw} alt="Chairperson" className={styles.chairImage} />
              <div className={styles.officialInfo}>
                <p className={styles.officialName}>
                  Ms. Olivia Olubukunola Onabanjo
                </p>
                <p className={styles.officialTitle}>
                  CHAIRMAN
                </p>
              </div>
            </div>
            
            <div className={styles.headerText}>
              <h2 className={styles.headerTitle}>
                VOTING IS NOW OPEN
              </h2>
              <h2 className={styles.headerSubtitle}>
                LET YOUR VOICE BE HEARD!
              </h2>
              <p className={styles.headerDescription}>
                Explore the inspiring nominations, learn about the remarkable <br />
                initiatives and dedication of your colleagues, friends, and 
                family, <br /> and cast your vote for those who best embody the spirit 
                of <br /> public service.
              </p>
              <p className={styles.headerDescription}>
                Thank you for joining this special recognition event. Your <br />
                participation helps ensure deserving efforts are celebrated and  <br />
                supports a continued culture of dedication and innovation within  <br />
                the Local Government Service Commission.
              </p>
            </div>
          </div>

          <div className={styles.commissionersGrid}>
            <div>
              <Image
                src={comm1}
                alt="commissioner 1"
                className={styles.commissionerImage}
              />
              <div className={styles.officialInfo}>
                <p className={styles.officialName}>
                  Hon. Lukmon Olufemi Adiro
                </p>
                <p className={styles.officialTitle}>
                  Commissioner I
                </p>
              </div>
            </div>
            
            <div>
              <Image
                src={comm2}
                alt="commissioner 2"
                className={styles.commissionerImage}
              />
              <div className={styles.officialInfo}>
                <p className={styles.officialName}>
                  Hon. Koye Ijaduoye
                </p>
                <p className={styles.officialTitle}>
                  Commissioner II
                </p>
              </div>
            </div>
            
            <div>
              <Image
                src={comm3}
                alt="commissioner 3"
                className={styles.commissionerImage}
              />
              <div className={styles.officialInfo}>
                <p className={styles.officialName}>
                  Hon. Olatunde Azeez Osunbiyi
                </p>
                <p className={styles.officialTitle}>
                  Commissioner III
                </p>
              </div>
            </div>
            
            <div>
              <Image
                src={comm4}
                alt="commissioner 4"
                className={styles.commissionerImage}
              />
              <div className={styles.officialInfo}>
                <p className={styles.officialName}>
                  Alhaji Olatunde Rasak Rufai
                </p>
                <p className={styles.officialTitle}>
                  Commissioner IV
                </p>
              </div>
            </div>
          </div>

          <div className={styles.footerSection}>
            <div className={styles.footerText}>
              <h2 className={styles.footerTitle}>
                MAKE YOUR VOTE COUNT,
              </h2>
              <h2 className={styles.footerSubtitle}>
                FOLLOW THE INSTRUCTION <br />CAREFULLY
              </h2>
              <p className={styles.footerDescription}>
                Follow the voting rules carefully. The system is designed to 
                ensure that <br /> your vote counts. Every stage of the voting process 
                needs to be <br /> followed. A detailed instruction on how to vote is 
                provided below.
              </p>
            </div>
            <div className={styles.footerImageWrapper}>
              <Image
                src={perm}
                alt="permanent secretary"
                className={styles.footerImage}
              />
              <div className={styles.officialInfo}>
                <p className={styles.officialName}>
                  Engr. Olanike Ogunbona
                </p>
                <p className={styles.officialTitle}>
                  PERMANENT SECRETARY
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Officials;