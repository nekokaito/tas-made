import WelcomeCrew from "@/components/home/welcome-crew";
import StorefrontHero from "@/components/home/storefront-hero";
import StorefrontStory from "@/components/home/storefront-story";
import ReelVideo from "@/components/home/reel-video";
import ReviewsSection from "@/components/home/reviews-section";
import NewArrivals from "@/components/home/new-arrivals";
import styles from "@/components/home/home.module.css";
import StoreCollections from "@/components/home/store-collections";

export default function Home() {
  return (
    <main id="top" className={styles.home}>
      <WelcomeCrew />
      <StoreCollections />
      <div id="arrivals">
        <NewArrivals />
      </div>

      <ReelVideo
        src="/videos/crochet-reel.mp4"
        poster="/videos/crochet-reel-poster.jpg"
        title="Make a flower pot with me"
      />
      <div id="reviews">
        <ReviewsSection />
      </div>
      <section
        id="story"
        className={styles.storefrontSection}
        aria-label="The Tas Made story"
      >
        <StorefrontHero />
        <StorefrontStory />
      </section>
    </main>
  );
}
