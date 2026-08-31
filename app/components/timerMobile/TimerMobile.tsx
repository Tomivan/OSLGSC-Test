"use client";
import React, { useState, useEffect } from "react";
import { Exo } from "next/font/google";
import styles from "./TimerMobile.module.css";

const exoFont = Exo({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

const TimerMobile = () => {
  const calculateTimeLeft = () => {
    const targetDate = new Date("2025-11-12T23:59:59");
    const now = new Date();

    const difference = targetDate.getTime() - now.getTime();

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className={`${exoFont.className} ${styles.mainContainer}`}>
      <section>
        <div className={styles.timerContainer}>
          <p className={styles.timerLabel}>
            VOTE STARTS IN
          </p>

          <div className={styles.timerDisplay}>
            {["days", "hours", "minutes", "seconds"].map((unit, i) => (
              <React.Fragment key={unit}>
                <div className={styles.timeUnit}>
                  <span className={styles.timeValue}>
                    {timeLeft[unit as keyof typeof timeLeft]
                      .toString()
                      .padStart(2, "0")}
                  </span>
                  <span className={styles.timeLabel}>
                    {unit}
                  </span>
                </div>
                {i < 3 && (
                  <span className={styles.timeSeparator}>
                    :
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default TimerMobile;