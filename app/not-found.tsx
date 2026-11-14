import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.errorCode}>404</p>
          <h1 className={styles.title}>This stitch got lost.</h1>
          <p className={styles.description}>Looks like this page wandered off.</p>
          <Link href="/" className={styles.homeLink}>
            <ArrowLeft size={17} aria-hidden="true" />
            Back to home
          </Link>
        </div>
        <Image
          src="/not-found-cat.png"
          alt="Crocheted white cat with a red bow"
          width={880}
          height={760}
          className={styles.cat}
          priority
        />
      </div>
    </main>
  );
}
