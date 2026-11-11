import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import styles from "./home-footer.module.css";

function Bow() {
  return (
    <svg
      className={styles.bow}
      viewBox="0 0 92 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M45 17c-10-2-20-17-28-13-9 5 0 19 13 17 7-1 13-5 16-8 4 5 11 9 18 8 14-1 21-15 11-19-8-3-20 11-29 15Z"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path
        d="M42 17c-8 10-17 12-31 10M49 17c8 10 18 12 32 10"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M42 14c2-3 6-3 8 0l1 5c-3 3-7 3-10 0l1-5Z"
        fill="#fff9fb"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function HomeFooter() {
  const facebookUserId = process.env.NEXT_PUBLIC_FACEBOOK_USER_ID;
  const instagramUserId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;

  return (
    <footer className={styles.outer}>
      <svg
        className={styles.topWave}
        viewBox="0 0 1200 68"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 31C103-4 188 52 299 30c121-24 172-32 288 2 107 31 167-27 279-13 119 15 205 35 334 3v46H0V31Z"
          fill="currentColor"
        />
        <path
          d="M0 31C103-4 188 52 299 30c121-24 172-32 288 2 107 31 167-27 279-13 119 15 205 35 334 3"
          fill="none"
          stroke="#a9778f"
          strokeWidth="3"
        />
      </svg>
      <div className={styles.panel}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <Bow />
            <Link href="/" className={`${styles.brandName} loubag-font`}>
              Tas Made
            </Link>
            <p>
              HANDMADE WITH LOVE <span aria-hidden="true">♡</span>
            </p>
          </div>
          <div className={styles.right}>
            <nav className={styles.navigation} aria-label="Footer navigation">
              <Link href="/products">Shop all</Link>
              <Link href="/#story">Our story</Link>
              <Link href="/#reviews">Kind words</Link>
            </nav>
            <div className={styles.socials} aria-label="Connect with us">
              <a
                href={`https://www.facebook.com/profile.php?id=61577835062584`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook size={19} aria-hidden="true" />
              </a>

              <a
                href={`https://www.instagram.com/tas.made/`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={19} aria-hidden="true" />
              </a>
              <a
                href={`https://www.tiktok.com/@tas.made`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <FaTiktok size={19} aria-hidden="true" />
              </a>

              <a
                className={styles.developer}
                href="https://siddiqsazzad.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Meet the developer</span>
                <span className={styles.developerLogo}>
                  <Image
                    src="/footer/developer-logo.png"
                    alt=""
                    width={100}
                    height={100}
                    loading="eager"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>

        <p className={styles.credit}>
          © {new Date().getFullYear()} Tas Made · Made slowly, loved forever.
        </p>
      </div>
    </footer>
  );
}
