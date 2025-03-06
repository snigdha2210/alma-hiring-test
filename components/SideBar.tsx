// components/Sidebar.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "../app/styles/AdminPage.module.css";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <>
      {/* Hamburger icon visible on small screens */}
      <div className={styles.hamburgerIcon} onClick={toggleSidebar}>
        <FaBars size={24} color='#000' />
      </div>

      {/* Sidebar container */}
      <div className={`${styles.sidebar} ${open ? styles.openSidebar : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <Image
              src='/images/alma-logo.png'
              alt='Alma Logo'
              width={100}
              height={30}
            />
          </div>
          <div className={styles.closeIcon} onClick={toggleSidebar}>
            <FaTimes size={24} color='#fff' />
          </div>
        </div>
        <nav className={styles.sidebarNav}>
          <a className={styles.sidebarNavItem}>Leads</a>
          <a className={styles.sidebarNavItem}>Settings</a>
        </nav>
      </div>

      {/* Overlay when sidebar is open on small screens */}
      {open && (
        <div className={styles.sidebarOverlay} onClick={toggleSidebar} />
      )}
    </>
  );
};

export default Sidebar;
