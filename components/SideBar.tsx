// components/Sidebar.tsx
"use client";

import React from "react";
import styles from "../app/styles/AdminPage.module.css";
import Image from "next/image";

const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        <div className={styles.sidebarLogo}>
          {" "}
          <Image
            src='/images/logo-white.png'
            alt='Alma Logo'
            width={90}
            height={25}
          />
        </div>
        <nav className={styles.sidebarNav}>
          <a className={styles.sidebarNavItem}>Leads</a>
          <a className={styles.sidebarNavItem}>Settings</a>
        </nav>
      </div>
      <div className={styles.sidebarBottom}>
        <div className={styles.sidebarNavItem}>Admin</div>
      </div>
    </aside>
  );
};

export default Sidebar;
