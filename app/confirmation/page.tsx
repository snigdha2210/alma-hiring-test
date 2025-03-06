"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/confirmation.module.css";

export default function Confirmation() {
  return (
    <div className={styles.confirmationContainer}>
      {/* Confirmation Icon */}
      <Image
        src='/images/folder.png'
        alt='Confirmation Icon'
        width={64}
        height={64}
        className={styles.confirmationIcon}
      />

      {/* Title */}
      <h1 className={styles.confirmationTitle}>Thank You</h1>

      {/* Subtitle / Message */}
      <p className={styles.confirmationText}>
        Your information was submitted to our team of immigration attorneys.
        Expect an email from hello@tryalma.ai.
      </p>

      {/* Go Back Button */}
      <Link href='/' className={styles.homeButton}>
        Go Back to Homepage
      </Link>
    </div>
  );
}
