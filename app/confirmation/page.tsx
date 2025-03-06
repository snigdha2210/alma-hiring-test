"use client";

import React from "react";
import Link from "next/link";
import styles from "../styles/confirmation.module.css";

export default function Confirmation() {
  return (
    <div className={styles.confirmationContainer}>
      <h1 className={styles.confirmationTitle}>Thank You</h1>
      <p className={styles.confirmationMessage}>
        Your information has been submitted. We’ll get in touch soon!
      </p>
      <Link href='/' className={styles.backLink}>
        Go Back to Homepage
      </Link>
    </div>
  );
}
