"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

// Matrice di punti da 3px ogni 8px: ogni punto cambia luminosità a caso
// e pochi si accendono di verde, come le spie di uno switch
const DOT_SIZE = 3;
const STEP = 8;
const FLICKER_PER_SECOND = 0.6;
const LED_CHANCE = 0.005;
// Circa 30 fotogrammi al secondo bastano per un effetto così lento
const FRAME_INTERVAL = 33;

export function NetworkLedsBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const context = canvasElement?.getContext("2d");
    if (!canvasElement || !context) return;
    // Riferimenti non nulli, usabili anche dalle funzioni interne
    const canvas: HTMLCanvasElement = canvasElement;
    const ctx: CanvasRenderingContext2D = context;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let cols = 0;
    let alpha = new Float32Array(0);
    let isLed = new Uint8Array(0);
    let colors = readColors();
    let frame = 0;
    let last = 0;
    let visible = true;

    // I colori arrivano dai token di globals.css, diversi per tema chiaro e scuro
    function readColors() {
      const style = getComputedStyle(canvas);
      return {
        dot: style.getPropertyValue("--network-dot").trim(),
        led: style.getPropertyValue("--network-led").trim(),
        opacity: Number.parseFloat(style.getPropertyValue("--network-dot-opacity")) || 0.25,
      };
    }

    function seed(i: number) {
      alpha[i] = Math.random();
      isLed[i] = Math.random() < LED_CHANCE ? 1 : 0;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / STEP);
      const size = cols * Math.ceil(height / STEP);
      alpha = new Float32Array(size);
      isLed = new Uint8Array(size);
      for (let i = 0; i < size; i++) seed(i);
      draw();
    }

    function step(elapsed: number) {
      const chance = Math.min(1, (FLICKER_PER_SECOND * elapsed) / 1000);
      for (let i = 0; i < alpha.length; i++) {
        if (Math.random() < chance) seed(i);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      // Prima i punti neutri, poi i LED, così il colore si imposta due volte sole
      ctx.fillStyle = colors.dot;
      for (let i = 0; i < alpha.length; i++) {
        if (isLed[i]) continue;
        ctx.globalAlpha = alpha[i] * colors.opacity;
        ctx.fillRect((i % cols) * STEP, Math.floor(i / cols) * STEP, DOT_SIZE, DOT_SIZE);
      }
      ctx.fillStyle = colors.led;
      for (let i = 0; i < alpha.length; i++) {
        if (!isLed[i]) continue;
        ctx.globalAlpha = 0.5 + alpha[i] * 0.5;
        ctx.fillRect((i % cols) * STEP, Math.floor(i / cols) * STEP, DOT_SIZE, DOT_SIZE);
      }
      ctx.globalAlpha = 1;
    }

    // L'animazione gira solo se la hero è visibile e il sistema non chiede movimento ridotto
    const isRunning = () => visible && !document.hidden && !reducedMotion.matches;

    function tick(time: number) {
      frame = 0;
      if (!isRunning()) return;
      if (!last) last = time;
      const elapsed = time - last;
      if (elapsed >= FRAME_INTERVAL) {
        last = time;
        step(Math.min(elapsed, 200));
        draw();
      }
      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (isRunning() && !frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      start();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    intersectionObserver.observe(canvas);

    // next-themes cambia la classe di <html>: al cambio tema si rileggono i colori
    const themeObserver = new MutationObserver(() => {
      colors = readColors();
      draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    document.addEventListener("visibilitychange", start);
    reducedMotion.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", start);
      reducedMotion.removeEventListener("change", start);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        // Su mobile l'effetto scende dall'alto; da md si sposta a destra e lascia libera la colonna del testo
        "pointer-events-none absolute inset-0 -z-10 mask-[radial-gradient(ellipse_130%_65%_at_50%_0%,black_20%,transparent_78%)] md:mask-[radial-gradient(ellipse_62%_95%_at_80%_15%,black_18%,transparent_72%)]",
        className
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
