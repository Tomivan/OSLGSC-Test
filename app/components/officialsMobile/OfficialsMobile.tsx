import Image from "next/image";
import React from "react";
import chairw from "../../assets/chairw.svg";
import comm1 from "../../assets/comm1.svg";
import comm2 from "../../assets/comm2.png";
import comm3 from "../../assets/comm3.png";
import comm4 from "../../assets/comm4.png";
import perm from "../../assets/perm.png";
import styles from "./OfficialsMobile.module.css";

const OfficialsMobile = () => {
  return (
    <main className={styles.mainContainer}>
      <section className={styles.sectionContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.headerSection}>
            <div className={styles.headerTextWrapper}>
              <h1 className={styles.headerTitle}>
                VOTING IS NOW OPEN.
              </h1>
              <h1 className={styles.headerSubtitle}>
                LET YOUR VOICE BE HEARD!
              </h1>
              <p className={styles.headerDescription}>
                Explore the inspiring nominations, learn about the remarkable initiatives and dedication of your colleagues, friends, and family, and cast your vote for those who best embody the spirit of public service.
              </p>
              <p className={styles.headerDescription}>
                Thank you for joining this special recognition event. Your participation helps ensure deserving efforts are celebrated and supports a continued culture of dedication and innovation within the Local Government Service Commission.
              </p>
            </div>

            <Image src={chairw} alt="Chairperson" className={styles.chairImage} />
            
            <div className={styles.officialInfo}>
              <h1 className={styles.officialName}>
                Ms. Olivia Olubukunola Onabanjo
              </h1>
              <h1 className={styles.officialTitle}>
                CHAIRMAN
              </h1>
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
                <h1 className={styles.officialName}>
                  Hon. Lukmon Olufemi Adiro
                </h1>
                <h1 className={styles.officialTitle}>
                  Commissioner I
                </h1>
              </div>
            </div>
            <div className={styles.commissionerItemMiddle}>
              <Image
                src={comm2}
                alt="commissioner 2"
                className={styles.commissionerImage}
              />
              <div className={styles.officialInfo}>
                <h1 className={styles.officialName}>
                  Hon. Koye Ijaduoye
                </h1>
                <h1 className={styles.officialTitle}>
                  Commissioner II
                </h1>
              </div>
            </div>
            <div>
              <Image
                src={comm3}
                alt="commissioner 3"
                className={styles.commissionerImage}
              />
              <div className={styles.officialInfo}>
                <h1 className={styles.officialName}>
                  Hon. Olatunde Azeez Osunbiyi
                </h1>
                <h1 className={styles.officialTitle}>
                  Commissioner III
                </h1>
              </div>
            </div>
            <div className={styles.commissionerItemLast}>
              <Image
                src={comm4}
                alt="commissioner 4"
                className={styles.commissionerImage}
              />
              <div className={styles.officialInfo}>
                <h1 className={styles.officialName}>
                  Alhaji Olatunde Rasak Rufai
                </h1>
                <h1 className={styles.officialTitle}>
                  Commissioner Iv
                </h1>
              </div>
            </div>
          </div>

          <div className={styles.footerSection}>
            <Image
              src={perm}
              alt="permanent secretary"
              className={styles.footerImage}
            />
            
            <div className={styles.officialInfo}>
              <h1 className={styles.officialName}>
                Engr. Olanike Ogunbona
              </h1>
              <h1 className={styles.officialTitle}>
                PERMANENT SECRETARY
              </h1>
            </div>

            <div className={styles.footerTextWrapper}>
              <h1 className={styles.footerTitle}>
                MAKE YOUR VOTE COUNT,
              </h1>
              <h1 className={styles.footerSubtitle}>
                FOLLOW THE INSTRUCTION CAREFULLY
              </h1>
              <p className={styles.footerDescription}>
                Follow the voting rules carefully. The system is designed to ensure that your vote counts. Every stage of the voting process needs to be followed. A detailed instruction on how to vote is provided below.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OfficialsMobile;