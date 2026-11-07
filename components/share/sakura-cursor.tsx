"use client";

import { useEffect } from "react";

const interactive = 'a[href],button,input,select,textarea,summary,[role="button"],[role="link"],[role="tab"],[role="checkbox"],[role="switch"],[data-cursor="hover"]';
const draggable = '[draggable="true"],[data-cursor="drag"]';
const hotspots = { normal: [3.6, 2.8], hover: [12, 4], drag: [16, 10] } as const;

export default function SakuraCursor() {
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const cursor = document.createElement("div");
    cursor.id = "sakura-pixel-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);
    let ready = false;
    let disposed = false;
    let dragging = false;
    let pressOrigin: { x: number; y: number; id: number } | null = null;
    let lastPointer: PointerEvent | null = null;
    const root = document.documentElement;

    function hide() {
      dragging = false;
      pressOrigin = null;
      lastPointer = null;
      cursor.style.visibility = "hidden";
      root.classList.remove("sakura-cursor-active");
    }

    function track(event: PointerEvent) {
      if (!ready || event.pointerType !== "mouse" || !media.matches) {
        hide();
        return;
      }
      lastPointer = event;
      if (pressOrigin && event.pointerId === pressOrigin.id) {
        if (!(event.buttons & 1)) {
          pressOrigin = null;
          dragging = false;
        } else if (Math.hypot(event.clientX - pressOrigin.x, event.clientY - pressOrigin.y) >= 5) {
          dragging = true;
        }
      }
      const target = document.elementFromPoint(event.clientX, event.clientY);
      // Preserve insertion and disabled cursors.
      if (!dragging && target?.closest('textarea,input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]),[contenteditable]:not([contenteditable="false"]),:disabled,[aria-disabled="true"]')) {
        hide();
        return;
      }
      const state = dragging ? "drag" : target?.closest(interactive + "," + draggable) ? "hover" : "normal";
      const [offsetX, offsetY] = hotspots[state];
      cursor.dataset.state = state;
      cursor.style.transform = "translate3d(" + Math.round(event.clientX - offsetX) + "px," + Math.round(event.clientY - offsetY) + "px,0)";
      cursor.style.visibility = "visible";
      root.classList.add("sakura-cursor-active");
    }

    function press(event: PointerEvent) {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      pressOrigin = event.target instanceof Element && event.target.closest(draggable)
        ? { x: event.clientX, y: event.clientY, id: event.pointerId }
        : null;
      track(event);
    }

    function release(event: PointerEvent) {
      if (pressOrigin && event.pointerId !== pressOrigin.id) return;
      pressOrigin = null;
      dragging = false;
      track(event);
    }

    function refresh() {
      if (lastPointer) track(lastPointer);
    }

    function leave(event: MouseEvent) {
      if (!event.relatedTarget) hide();
    }

    // Retain the system cursor until all visual states load successfully.
    void Promise.all(
      ["sakura", "sakura-hover", "sakura-drag"].flatMap((name) =>
        ["animated.gif", "static.png"].map((suffix) => new Promise<void>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Cursor image could not load"));
          image.src = "/cursors/sakura/" + name + "-" + suffix;
        })),
      ),
    ).then(() => { if (!disposed) ready = true; }).catch(() => { /* Native fallback on asset failure. */ });

    window.addEventListener("pointermove", track, { passive: true });
    window.addEventListener("pointerover", track, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", hide);
    window.addEventListener("lostpointercapture", release);
    window.addEventListener("scroll", refresh, { passive: true, capture: true });
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("blur", hide);
    // Native HTML drag-and-drop controls its own cursor and preview.
    window.addEventListener("dragstart", hide);
    window.addEventListener("dragend", hide);
    document.addEventListener("mouseout", leave);
    media.addEventListener("change", hide);
    return () => {
      disposed = true;
      hide();
      cursor.remove();
      window.removeEventListener("pointermove", track);
      window.removeEventListener("pointerover", track);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", hide);
      window.removeEventListener("lostpointercapture", release);
      window.removeEventListener("scroll", refresh, true);
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("dragstart", hide);
      window.removeEventListener("dragend", hide);
      document.removeEventListener("mouseout", leave);
      media.removeEventListener("change", hide);
    };
  }, []);

  return null;
}
