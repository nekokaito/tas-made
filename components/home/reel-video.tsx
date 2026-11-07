"use client";

import { useEffect, useRef, useState } from "react";
import { Flower2, Play, Pause, LoaderCircle } from "lucide-react";
import styles from "./reel-video.module.css";

type ReelVideoProps = { src: string; poster: string; title: string };

export default function ReelVideo(props: ReelVideoProps) {
  // A new source gets a fresh playback state and observer.
  return <ReelPlayer key={props.src} {...props} />;
}

function ReelPlayer({ src, poster, title }: ReelVideoProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) player.pause();
    });
    const pauseWhenHidden = () => {
      if (document.hidden) player.pause();
    };
    observer.observe(player);
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      player.pause();
    };
  }, []);

  async function togglePlayback() {
    const player = video.current;
    if (!player) return;
    if (!player.paused) {
      player.pause();
      return;
    }
    player.muted = true;
    if (player.ended) player.currentTime = 0;
    setFailed(false);
    setLoading(true);
    try {
      await player.play();
    } catch (error) {
      setLoading(false);
      if (!(error instanceof DOMException && error.name === "AbortError"))
        setFailed(true);
    }
  }

  const action = playing ? "Pause reel" : ended ? "Replay reel" : "Play reel";

  return (
    <figure className={styles.reel}>
      <div className={styles.header}>
        <Flower2 size={17} strokeWidth={1.4} aria-hidden="true" />
        <span>Crochet diary</span>
        <span className={styles.dot} aria-hidden="true" />
      </div>
      <div className={styles.frame}>
        <video
          ref={video}
          className={styles.video}
          muted
          playsInline
          preload="none"
          poster={poster}
          aria-label={title}
          onPlay={() => {
            setPlaying(true);
            setEnded(false);
          }}
          onPlaying={() => setLoading(false)}
          onPause={() => {
            setPlaying(false);
            setLoading(false);
          }}
          onWaiting={() => setLoading(true)}
          onCanPlay={() => setLoading(false)}
          onEnded={() => {
            setEnded(true);
            setPlaying(false);
            setLoading(false);
          }}
          onError={() => {
            setFailed(true);
            setLoading(false);
            setPlaying(false);
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
        <button
          type="button"
          className={`${styles.stageButton} ${playing && !loading ? styles.isPlaying : ""}`}
          onClick={togglePlayback}
          aria-label={action}
        >
          <span className={styles.playDisc}>
            {loading ? (
              <LoaderCircle
                className={styles.spinner}
                size={27}
                aria-hidden="true"
              />
            ) : playing ? (
              <Pause size={25} fill="currentColor" aria-hidden="true" />
            ) : (
              <Play size={27} fill="currentColor" aria-hidden="true" />
            )}
          </span>
        </button>
      </div>
      <figcaption className={styles.caption}>{title}</figcaption>
      {failed && (
        <p className={styles.error} role="status">
          Unable to play this reel. <a href={src}>Open video</a>
        </p>
      )}
    </figure>
  );
}
