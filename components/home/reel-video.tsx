"use client";

import { useEffect, useRef, useState } from "react";
import { Flower2, Play, Pause, Volume2, VolumeX, RotateCcw, LoaderCircle } from "lucide-react";
import styles from "./reel-video.module.css";

type ReelVideoProps = { src: string; poster: string; title: string };
const timeLabel = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;

export default function ReelVideo(props: ReelVideoProps) {
  // A new source gets a fresh playback state and observer.
  return <ReelPlayer key={props.src} {...props} />;
}

function ReelPlayer({ src, poster, title }: ReelVideoProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) player.pause(); });
    const pauseWhenHidden = () => { if (document.hidden) player.pause(); };
    observer.observe(player);
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", pauseWhenHidden); player.pause(); };
  }, []);

  async function togglePlayback() {
    const player = video.current;
    if (!player) return;
    if (!player.paused) { player.pause(); return; }
    if (player.ended) player.currentTime = 0;
    setFailed(false);
    setLoading(true);
    try { await player.play(); }
    catch (error) {
      setLoading(false);
      if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true);
    }
  }

  const action = playing ? "Pause reel" : ended ? "Replay reel" : "Play reel";
  const PlayIcon = ended ? RotateCcw : Play;

  return (
    <figure className={styles.reel}>
      <div className={styles.header}><Flower2 size={17} strokeWidth={1.4} aria-hidden="true" /><span>Crochet diary</span><span className={styles.dot} aria-hidden="true" /></div>
      <div className={styles.frame}>
        <video ref={video} className={styles.video} playsInline preload="none" poster={poster} aria-label={title}
          onPlay={() => { setPlaying(true); setEnded(false); }}
          onPlaying={() => setLoading(false)}
          onPause={() => { setPlaying(false); setLoading(false); }}
          onWaiting={() => setLoading(true)}
          onCanPlay={() => setLoading(false)}
          onEnded={() => { setEnded(true); setPlaying(false); setLoading(false); }}
          onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
          onDurationChange={(event) => { const value = event.currentTarget.duration; setDuration(Number.isFinite(value) ? value : 0); }}
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
          onError={() => { setFailed(true); setLoading(false); setPlaying(false); }}>
          <source src={src} type="video/mp4" />
        </video>
        <button type="button" className={`${styles.stageButton} ${playing && !loading ? styles.isPlaying : ""}`} onClick={togglePlayback} aria-label={action}>
          <span className={styles.playDisc}>{loading ? <LoaderCircle className={styles.spinner} size={27} aria-hidden="true" /> : playing ? <Pause size={25} fill="currentColor" aria-hidden="true" /> : <PlayIcon size={27} fill={ended ? "none" : "currentColor"} aria-hidden="true" />}</span>
          {!playing && !loading && <span className={styles.playHint}>{ended ? "Watch again" : "Watch reel"}</span>}
        </button>
        <div className={styles.controls} role="group" aria-label="Reel controls">
          <div className={styles.controlRow}>
            <button type="button" className={styles.controlButton} onClick={togglePlayback} aria-label={playing ? "Pause playback" : "Start playback"}>{playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}</button>
            <span className={styles.time}>{timeLabel(current)}{duration > 0 ? ` / ${timeLabel(duration)}` : ""}</span>
            <button type="button" className={styles.controlButton} onClick={() => { if (video.current) video.current.muted = !video.current.muted; }} aria-label={muted ? "Unmute reel" : "Mute reel"}>{muted ? <VolumeX size={19} /> : <Volume2 size={19} />}</button>
          </div>
          <input className={styles.progress} type="range" min={0} max={duration || 1} step={0.1} value={Math.min(current, duration || 1)} disabled={!duration} aria-label="Seek reel" aria-valuetext={`${timeLabel(current)} of ${timeLabel(duration)}`} onChange={(event) => { const value = Number(event.target.value); if (video.current) video.current.currentTime = value; setCurrent(value); setEnded(false); }} style={{ background: `linear-gradient(to right, #f3c6e7 ${duration ? current / duration * 100 : 0}%, #ffffff45 0%)` }} />
        </div>
      </div>
      <figcaption className={styles.caption}>{title}</figcaption>
      {failed && <p className={styles.error} role="status">Unable to play this reel. <a href={src}>Open video</a></p>}
    </figure>
  );
}
