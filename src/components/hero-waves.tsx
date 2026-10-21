"use client";

import { useEffect, useRef } from "react";

// Nastro di linee sottili ispirato a references/sfondo header.png. La curva di base passa
// in basso al centro e sale solo verso destra, per lasciare libera la zona del nome.
// Punti di controllo in frazioni di larghezza e altezza della hero.
const CONTROL_POINTS: [number, number][] = [
  [-0.1, 1.02],
  [0.04, 0.98],
  [0.18, 0.86],
  [0.42, 0.96],
  [0.72, 0.92],
  [0.86, 0.42],
  [0.97, 0.1],
  [1.15, -0.02],
];
const LINES = 40;
const SAMPLES_PER_SEGMENT = 40;
const COLORS = ["#d10ce8", "#8a1fd6", "#4a2fd0"];

type Point = { x: number; y: number; nx: number; ny: number; u: number };

// Spline Catmull-Rom che passa per tutti i punti, con la normale in ogni campione
function sampleCurve(width: number, height: number): Point[] {
  const points = CONTROL_POINTS.map(([x, y]) => ({ x: x * width, y: y * height }));
  const curve: { x: number; y: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    for (let s = 0; s < SAMPLES_PER_SEGMENT; s++) {
      const t = s / SAMPLES_PER_SEGMENT;
      const t2 = t * t;
      const t3 = t2 * t;
      const blend = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3);
      curve.push({ x: blend(p0.x, p1.x, p2.x, p3.x), y: blend(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  curve.push(points[points.length - 1]);

  return curve.map((point, i) => {
    const prev = curve[Math.max(0, i - 1)];
    const next = curve[Math.min(curve.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const length = Math.hypot(dx, dy) || 1;
    return { ...point, nx: -dy / length, ny: dx / length, u: i / (curve.length - 1) };
  });
}

export function HeroWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const context2d = canvasElement?.getContext("2d");
    if (!canvasElement || !context2d) return;
    const canvas: HTMLCanvasElement = canvasElement;
    const context: CanvasRenderingContext2D = context2d;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = performance.now();
    let curve: Point[] = [];
    let gradient: CanvasGradient | null = null;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let running = false;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      curve = sampleCurve(width, height);
      const next = context.createLinearGradient(0, 0, width, 0);
      COLORS.forEach((color, i) => next.addColorStop(i / (COLORS.length - 1), color));
      gradient = next;
      draw();
    }

    function draw() {
      if (!gradient) return;
      const time = reducedMotion.matches ? 0 : (performance.now() - start) / 1000;
      // Il nastro si allarga con lo schermo, ma non supera un tetto
      const spread = Math.min(height * 0.22, width * 0.13, 190);

      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.strokeStyle = gradient;
      context.globalAlpha = 0.85;

      for (let line = 0; line < LINES; line++) {
        const offset = line / (LINES - 1) - 0.5;
        context.beginPath();
        for (let i = 0; i < curve.length; i++) {
          const { x, y, nx, ny, u } = curve[i];
          // Dove il seno passa per zero le linee si stringono: è l'avvitamento del nastro
          const twist = Math.sin(Math.PI * 2 * (u * 1.7 + offset * 0.08) - time * 0.22);
          const distance = offset * spread * twist;
          const px = x + nx * distance;
          const py = y + ny * distance;
          if (i === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.stroke();
      }
      canvas.classList.remove("opacity-0");
    }

    function loop() {
      draw();
      frame = requestAnimationFrame(loop);
    }

    // L'animazione gira solo se la hero è visibile e il sistema non chiede movimento ridotto
    function sync() {
      const shouldRun = visible && !document.hidden && !reducedMotion.matches;
      if (shouldRun && !running) {
        running = true;
        frame = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frame);
        draw();
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    resize();
    sync();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 size-full opacity-0 transition-opacity duration-1000"
    />
  );
}
