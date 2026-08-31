"use client";
import React from "react";
import logo from "../../assets/logo.svg";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.navbarContainer}>
      <section className={styles.navbarSection}>
        <div className={styles.logoWrapper}>
          <Image
            src={logo}
            alt="OSLGSC Logo"
            className={styles.logoImage}
          />
          <h1 className={styles.logoText}>
            Ogun State Local Government <br /> Service Comission
          </h1>
        </div>
        <Link 
          href="/admin/login" 
          className={styles.adminLink}
        >
          <button className={styles.adminButton}>Admin Login</button>
        </Link>
      </section>
    </div>
  );
};

export default Navbar;