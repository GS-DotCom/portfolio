"use client";

import { useEffect, useRef } from "react";

// Cerchio azzurro che segue il mouse con un leggero ritardo, come nel riferimento.
// Solo con mouse o trackpad: su touch non compare. Il cursore di sistema resta visibile.
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!cursor || !finePointer.matches) return;

    let targetX = -100;
    let targetY = -100;
    let x = targetX;
    let y = targetY;
    let frame = 0;

    function render() {
      // Con movimento ridotto il cerchio segue il mouse senza inseguimento
      const ease = reducedMotion.matches ? 1 : 0.18;
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      cursor!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1 ? requestAnimationFrame(render) : 0;
    }

    function onMove(event: PointerEvent) {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor!.dataset.visible = "true";
      if (!frame) frame = requestAnimationFrame(render);
    }

    function onLeave() {
      cursor!.dataset.visible = "false";
    }

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-visible="false"
      className="pointer-events-none fixed top-0 left-0 z-50 -mt-3.5 -ml-3.5 hidden size-7 items-center justify-center rounded-full border-[1.5px] border-cyan opacity-0 transition-opacity duration-300 data-[visible=true]:opacity-100 pointer-fine:flex"
    >
      <span className="size-1 rounded-full bg-cyan" />
    </div>
  );
}
