"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Exo } from "next/font/google";
import styles from "./Timer.module.css";

const exoFont = Exo({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

const Timer = () => {
  const targetDate = useMemo(() => new Date("2025-11-12T23:59:59"), []);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <main className={`${exoFont.className} ${styles.mainContainer}`}>
      <section>
        <div className={styles.timerContainer}>
          <p className={styles.timerLabel}>
            VOTE ENDS IN
          </p>
          <div className={styles.timerDisplay}>
            <div className={styles.timeUnit}>
              <span className={styles.timeValue}>
                {timeLeft.days.toString().padStart(2, "0")}
              </span>
              <span className={styles.timeLabel}>
                days
              </span>
            </div>
            <span className={styles.timeSeparator}>:</span>

            <div className={styles.timeUnit}>
              <span className={styles.timeValue}>
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className={styles.timeLabel}>
                hours
              </span>
            </div>
            <span className={styles.timeSeparator}>:</span>

            <div className={styles.timeUnit}>
              <span className={styles.timeValue}>
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className={styles.timeLabel}>
                minutes
              </span>
            </div>
            <span className={styles.timeSeparator}>:</span>

            <div className={styles.timeUnit}>
              <span className={styles.timeValue}>
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className={styles.timeLabel}>
                seconds
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Timer;