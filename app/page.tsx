import WelcomeCrew from "@/components/home/welcome-crew";
import StorefrontHero from "@/components/home/storefront-hero";
import ReelVideo from "@/components/home/reel-video";
import ReviewsSection from "@/components/home/reviews-section";
import NewArrivals from "@/components/home/new-arrivals";
import styles from "@/components/home/home.module.css";
import { ShoppingBag, Rabbit, Flower2 } from "lucide-react";

// Replace these previews with collection links when the crochet catalog is ready.
const collections = [
  { name: "Bags", detail: "Everyday crochet", Icon: ShoppingBag, tone: "rose" },
  {
    name: "Plushies",
    detail: "Little companions",
    Icon: Rabbit,
    tone: "lavender",
  },
  {
    name: "Accessories",
    detail: "The finishing touches",
    Icon: Flower2,
    tone: "cream",
  },
];

export default function Home() {
  return (
    <main className={styles.home}>
      <WelcomeCrew />
      <StorefrontHero />

      <ReelVideo
        src="/videos/crochet-reel.mp4"
        poster="/videos/crochet-reel-poster.jpg"
        title="Make a flower pot with me"
      />
      <section
        id="collections"
        className={styles.section}
        aria-labelledby="collections-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>THE COLLECTIONS</p>
            <h2 id="collections-title">A little of everything.</h2>
          </div>
          <span className={styles.status}>Coming soon</span>
        </div>
        <div className={styles.collections}>
          {collections.map(({ name, detail, Icon, tone }, index) => (
            <article
              className={`${styles.collection} ${styles[tone]}`}
              key={name}
            >
              <div className={styles.collectionArt}>
                <span className={styles.number}>0{index + 1}</span>
                <Icon size={64} strokeWidth={1} aria-hidden="true" />
              </div>
              <div className={styles.collectionLabel}>
                <h3>{name}</h3>
                <p>{detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <NewArrivals />
      <ReviewsSection />
      <div className={styles.signature}>
        Tas Made <span>BY TASNIM</span>
      </div>
    </main>
  );
}
