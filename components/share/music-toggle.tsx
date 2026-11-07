"use client";

import { memo, useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import { Music2, VolumeX, LoaderCircle } from "lucide-react";
import styles from "./music-toggle.module.css";

const MUSIC_SRC = "/honey_jam.mp3?v=4bef094b7200";
const MUSIC_VOLUME = 0.2;
const POSITION_KEY = "tas-made:music-position";
const positions = ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"] as const;
type Position = typeof positions[number];

function MusicToggle() {
  const widget = useRef<HTMLDivElement>(null);
  const position = useRef<Position>("bottom-right");
  const drag = useRef<{ id: number; x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const snapAnimation = useRef<Animation | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const context = useRef<AudioContext | null>(null);
  const requested = useRef(false);
  const [status, setStatus] = useState<"off" | "loading" | "playing" | "error">("off");

  useEffect(() => {
    const player = audio.current;
    return () => {
      requested.current = false;
      player?.pause();
      void context.current?.close();
      context.current = null;
    };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(POSITION_KEY);
      if (positions.includes(saved as Position) && widget.current) {
        position.current = saved as Position;
        widget.current.dataset.position = saved!;
      }
    } catch { /* Placement still works when browser storage is unavailable. */ }
    const cancelDrag = () => {
      drag.current = null;
      if (widget.current) {
        widget.current.style.transform = "";
        delete widget.current.dataset.dragging;
      }
      snapAnimation.current?.cancel();
    };
    window.addEventListener("resize", cancelDrag);
    return () => { window.removeEventListener("resize", cancelDrag); snapAnimation.current?.cancel(); };
  }, []);

  function dock(next: Position, persist = true) {
    const element = widget.current;
    if (!element) return;
    const before = element.getBoundingClientRect();
    snapAnimation.current?.cancel();
    position.current = next;
    element.dataset.position = next;
    element.style.transform = "";
    delete element.dataset.dragging;
    const after = element.getBoundingClientRect();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      snapAnimation.current = element.animate([
        { transform: `translate3d(${before.left - after.left}px, ${before.top - after.top}px, 0)` },
        { transform: "translate3d(0, 0, 0)" },
      ], { duration: 220, easing: "cubic-bezier(.22,1,.36,1)" });
    }
    if (persist) {
      try { localStorage.setItem(POSITION_KEY, next); } catch { /* Optional persistence. */ }
      setAnnouncement(`Music button moved to ${next.replace("-", " ")}.`);
    }
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0 || drag.current) return;
    snapAnimation.current?.cancel();
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    const rect = widget.current!.getBoundingClientRect();
    suppressClick.current = false;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    const element = widget.current;
    if (!current || !element || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (!current.moved && Math.hypot(dx, dy) < 7) return;
    current.moved = true;
    suppressClick.current = true;
    element.dataset.dragging = "true";
    const bottomGap = window.innerWidth < 768 ? 100 : 24;
    const x = Math.max(12, Math.min(window.innerWidth - 60, current.left + dx));
    const y = Math.max(12, Math.min(Math.max(12, window.innerHeight - bottomGap - 48), current.top + dy));
    // Imperative transforms keep pointer movement out of React's render cycle.
    element.style.transform = `translate3d(${x - current.left}px, ${y - current.top}px, 0)`;
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    if (current.moved) {
      if (cancelled) dock(position.current, false);
      else {
        event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
        const rect = widget.current!.getBoundingClientRect();
        const side = rect.left + rect.width / 2 < window.innerWidth / 2 ? "left" : "right";
        const bottomGap = window.innerWidth < 768 ? 100 : 24;
        const centers = [48, window.innerHeight / 2, window.innerHeight - bottomGap - 24];
        const center = rect.top + rect.height / 2;
        const row = centers.reduce((best, value, index) => Math.abs(value - center) < Math.abs(centers[best] - center) ? index : best, 0);
        dock(`${["top", "middle", "bottom"][row]}-${side}` as Position);
      }
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function moveWithKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (!event.altKey || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const [row, side] = position.current.split("-");
    const rows = ["top", "middle", "bottom"];
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") dock(`${row}-${event.key === "ArrowLeft" ? "left" : "right"}` as Position);
    else dock(`${rows[Math.max(0, Math.min(2, rows.indexOf(row) + (event.key === "ArrowUp" ? -1 : 1)))]}-${side}` as Position);
  }

  async function toggleMusic() {
    const player = audio.current;
    if (!player) return;
    if (requested.current) {
      requested.current = false;
      player.pause();
      setStatus("off");
      return;
    }
    requested.current = true;
    setStatus("loading");
    try {
      if (!context.current) {
        // GainNode also controls volume on mobile browsers that ignore media.volume.
        if (typeof AudioContext !== "undefined") {
          const engine = new AudioContext();
          const source = engine.createMediaElementSource(player);
          const gain = engine.createGain();
          gain.gain.value = MUSIC_VOLUME;
          source.connect(gain);
          gain.connect(engine.destination);
          context.current = engine;
        } else {
          player.volume = MUSIC_VOLUME;
        }
      }
      await context.current?.resume();
      if (!requested.current) return;
      await player.play();
      if (!requested.current) player.pause();
    } catch {
      if (requested.current) {
        requested.current = false;
        setStatus("error");
      }
    }
  }

  const enabled = status === "playing" || status === "loading";
  const label = status === "error" ? "Retry music" : enabled ? "Turn music off" : "Play music";

  return (
    <div ref={widget} className={styles.widget} data-position="bottom-right">
      <audio ref={audio} src={MUSIC_SRC} preload="none" loop
        onPlaying={() => { if (requested.current) setStatus("playing"); else audio.current?.pause(); }}
        onPause={() => { requested.current = false; setStatus("off"); }}
        onError={() => { requested.current = false; setStatus("error"); }} />
      <button type="button" className={styles.button} data-cursor="drag" data-playing={status === "playing"} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={(event) => endDrag(event)} onPointerCancel={(event) => endDrag(event, true)} onLostPointerCapture={(event) => endDrag(event, true)} onKeyDown={moveWithKeyboard} onClick={(event) => { if (suppressClick.current && event.detail !== 0) { suppressClick.current = false; return; } void toggleMusic(); }} aria-describedby="music-position-help" aria-label={label} aria-pressed={enabled} title={`${label} · Drag to reposition`}>
        {status === "loading" ? <LoaderCircle size={21} className={styles.spinner} aria-hidden="true" /> : status === "playing" ? <Music2 size={21} aria-hidden="true" /> : <VolumeX size={21} aria-hidden="true" />}
      </button>
      <span id="music-position-help" className="sr-only">Drag to either edge to reposition. Or use Alt and arrow keys. Your position is remembered.</span>
      <span className="sr-only" role="status">{announcement}</span>
      <span className="sr-only" role="status">{status === "error" ? "Music could not load. Press the music button to retry." : ""}</span>
    </div>
  );
}

export default memo(MusicToggle);
