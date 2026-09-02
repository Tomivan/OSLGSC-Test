"use client"
import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import Link from 'next/link';
import styles from './VoteCompleted.module.css';

const VoteCompleted = () => {
    return(
        <div className={styles.pageContainer}>
            <Navbar />
            <div className={styles.contentContainer}>
                <h1 className={styles.title}>THANK YOU</h1>
                <p className={styles.message}>You have successfully casted your votes and <br /> your nominee(s) thank you for your support</p>
                <p className={styles.prompt}>Wanna vote again</p>
                <Link href="/" className={styles.link}>
                    <button className={styles.button}> Yes, I want to</button>
                </Link>
            </div>
        </div>
    )
}

export default VoteCompleted;