import ReelVideo from "./reel-video";
import styles from "./reel-story.module.css";

export default function ReelStory() {
  return (
    <section className={styles.section} aria-labelledby="reel-story-title">
      <div className={styles.content}>
        <h2 id="reel-story-title" className={`${styles.title} loubag-font`}>
          From a little idea to something you can hold.
        </h2>
        <p className={styles.description}>
          Every crochet piece starts with a thought. We sketch the idea, work
          out the details, then bring it to life one careful stitch at a time.
          The little finishing touches make each piece feel like its own.
        </p>
      </div>
      <div className={styles.videoWrap}>
        <ReelVideo
          src="/videos/crochet-reel.mp4"
          poster="/videos/crochet-reel-poster.jpg"
          title="Make a flower pot with me"
        />
      </div>
    </section>
  );
}
