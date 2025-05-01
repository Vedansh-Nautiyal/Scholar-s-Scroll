import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.c1}>
      {/* Admin Login Button */}
      <div className={styles.adminLoginContainer}>
        <Link href="/admin/login">
          <button className={styles.adminLoginButton}>Admin Login</button>
        </Link>
      </div>

      <Image
        src="/images/logo.webp"
        alt="Scholar's Scroll Logo"
        width={250}
        height={250}
        className={styles.logo}
      />
      <h1 className={styles.t1}>
        Unlock a world of knowledge with Scholar&apos;s Scroll – Your Gateway to
        Scholarly eBooks!
      </h1>

      <div className={styles.btnRow}>
        <Link href="/login">
          <button className={`${styles.btn} ${styles.btn1}`}>
            Login
          </button>
        </Link>

        <Link href="/signup">
          <button className={`${styles.btn} ${styles.btn2}`}>
            Sign Up
          </button>
        </Link>
      </div>

      <Image
        src="/images/scholarscroll-scene.webp"
        alt="Ancient scholarly study scene"
        width={1000}
        height={500}
        className={styles.bottomimg}
      />
    </main>
  );
}
