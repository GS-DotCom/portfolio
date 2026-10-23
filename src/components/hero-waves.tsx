"use client";

import { useEffect, useRef } from "react";

import {
  createWavesAnimation,
  type WavesAnimation,
  type WavesMessage,
  type WavesReply,
  type WavesSize,
  type WavesState,
} from "@/lib/hero-waves";

// Sfondo animato della hero (il disegno è in src/lib/hero-waves.ts). Dove il browser lo permette
// il nastro si disegna in un Web Worker; altrimenti, o se il worker non parte, sul thread principale.
export function HeroWaves() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;
    const container: HTMLDivElement = containerElement;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let size: WavesSize | null = null;
    let state: WavesState = { running: false, still: false };
    let target: WavesAnimation | null = null;
    // Il canvas si crea qui e non nel JSX: uno ceduto al worker non si può più riusare,
    // né per il ripiego né al secondo montaggio dell'effetto in sviluppo.
    let canvas = createCanvas();

    function createCanvas() {
      const element = document.createElement("canvas");
      element.className = "block size-full";
      container.appendChild(element);
      return element;
    }

    function reveal() {
      container.classList.remove("opacity-0");
    }

    function apply() {
      target?.setState(state);
      if (size) target?.resize(size);
    }

    function startOnMainThread() {
      target?.dispose();
      canvas.remove();
      canvas = createCanvas();
      target = createWavesAnimation(canvas, reveal);
      apply();
    }

    function startInWorker(): boolean {
      if (typeof Worker === "undefined" || !("transferControlToOffscreen" in canvas)) return false;
      try {
        // Se qualcosa fallisce dopo la cessione, il ripiego crea comunque un canvas nuovo
        const offscreen = canvas.transferControlToOffscreen();
        const worker = new Worker(new URL("./hero-waves.worker.ts", import.meta.url), { type: "module" });
        const send = (message: WavesMessage, transfer: Transferable[] = []) => worker.postMessage(message, transfer);
        send({ type: "init", canvas: offscreen }, [offscreen]);
        worker.addEventListener("message", (event: MessageEvent<WavesReply>) => {
          if (event.data.type === "drawn") reveal();
          else startOnMainThread();
        });
        worker.addEventListener("error", startOnMainThread);
        target = {
          resize: (next) => send({ type: "resize", ...next }),
          setState: (next) => send({ type: "state", ...next }),
          dispose: () => worker.terminate(),
        };
        return true;
      } catch {
        return false;
      }
    }

    function resize() {
      size = {
        width: Math.max(1, container.clientWidth),
        height: Math.max(1, container.clientHeight),
        ratio: Math.min(window.devicePixelRatio || 1, 2),
      };
      target?.resize(size);
    }

    // L'animazione gira solo se la hero è visibile e il sistema non chiede movimento ridotto
    function sync() {
      state = { running: visible && !document.hidden && !reducedMotion.matches, still: reducedMotion.matches };
      target?.setState(state);
    }

    if (!startInWorker()) startOnMainThread();
    sync();
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      target?.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 opacity-0 transition-opacity duration-1000"
    />
  );
}
