"use client";

import React from "react";
import Navbar from "../navbar/Navbar";
import VoteImage from "../voteImage/VoteImage";
import Officials from "../officials/Officials";
import VotingRules from "../votingRules/VotingRules";
import HowToVote from "../howToVote/HowToVote";
import FixedVoteWidget from "../fixedVoteWidget/FixedVoteWidget";
import Timer from "../timer/Timer";
import Image from "next/image";
import Hero from "../../assets/hero.svg";
import dynamic from "next/dynamic";
import { Exo } from "next/font/google";
import styles from "./Homepage.module.css";

const exoFont = Exo({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-exo"
});

const Leaderboard = dynamic(() => import("../leaderboard/Leaderboard"), {
  loading: () => (
    <div className={styles.loaderWrapper}>
      <div className={styles.loader}></div>
    </div>
  ),
  ssr: false
});

const Categories = dynamic(() => import("../categories/Categories"), {
  loading: () => (
    <div className={styles.loaderWrapper}>
      <div className={styles.loader}></div>
    </div>
  ),
  ssr: false
});

const Homepage = () => {
  return (
    <>
      <Navbar />
      
      <div className={styles.heroContainer}>
        <div className={styles.heroInner}>
          <div className={styles.heroBackgroundDesktop}>
            <Image
              src={Hero}
              alt="Desktop background"
              fill
              priority={true}
              fetchPriority="high"
              className={styles.heroImage}
              sizes="100vw"
              style={{ background: "#e5ffcc" }}
            />
          </div>
          
          <div className={styles.heroBackgroundMobile}>
            <Image
              src={Hero}
              alt="Mobile background"
              fill
              priority={true}
              fetchPriority="high"
              className={styles.heroImage}
              sizes="100vw"
              style={{ background: "#e5ffcc" }}
            />
          </div>
          
          <div className={styles.heroContent}>
            <div className={styles.heroTextWrapper}>
              <div className={styles.heroTextContainer}>
                <h1 className={`${exoFont.className} ${styles.heroTitle}`}>
                  2026 Local
                </h1>
                <h2 className={`${exoFont.className} ${styles.heroTitle}`}>
                  Government Service
                </h2>
                <h2 className={`${exoFont.className} ${styles.heroTitle}`}>
                  Week Award
                </h2>
              </div>
              
              <div className={styles.timerWrapper}>
                <Timer />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <VoteImage />
      <Officials />
      <VotingRules />
      <HowToVote />
      <Leaderboard />
      <Categories />
      <FixedVoteWidget />

      <div className={styles.spacer}></div>
    </>
  );
};

export default Homepage;