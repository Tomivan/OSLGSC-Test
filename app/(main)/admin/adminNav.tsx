"use client";
import React from "react";
import logo from "../../assets/logo.svg";
import Image from "next/image";
import styles from "./adminNav.module.css";

const AdminNav = () => {
    return (
        <div className={styles.navContainer}>
            <section className={styles.navSection}>
                <Image
                    src={logo}
                    alt="OSLGSC Logo"
                    className={styles.logo}
                />
                <h1 className={styles.navTitle}>
                    Ogun State Local Government Service Award
                </h1>
            </section>
        </div>
    );
};

export default AdminNav;