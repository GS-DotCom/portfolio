"use client";

// Comet Card di Aceternity UI (https://ui.aceternity.com/components/comet-card), adattata:
// il riflesso compare solo al passaggio del mouse, con l'opzione `foil` aggiunge un riflesso
// cromatico che segue il cursore, e con movimento ridotto la scheda resta ferma.
import { cn } from "cn";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type MouseEvent, type ReactNode } from "react";

// Fasce iridescenti del riflesso "foil", ripetute su uno sfondo più grande della scheda
const FOIL_GRADIENT =
  "repeating-linear-gradient(115deg, #ff4fa3 0%, #ffcf5c 7%, #6dffb0 14%, #5cc8ff 21%, #a879ff 28%, #ff4fa3 35%)";

export const CometCard = ({
  rotateDepth = 8,
  translateDepth = 5,
  foil = false,
  className,
  children,
}: {
  rotateDepth?: number;
  translateDepth?: number;
  foil?: boolean;
  className?: string;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const hover = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const hoverSpring = useSpring(hover, { stiffness: 200, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`-${rotateDepth}deg`, `${rotateDepth}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`${rotateDepth}deg`, `-${rotateDepth}deg`]);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${translateDepth}px`, `${translateDepth}px`]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], [`${translateDepth}px`, `-${translateDepth}px`]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  const glareOpacity = useTransform(hoverSpring, [0, 1], [0, 0.6]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.75) 20%, rgba(255, 255, 255, 0) 80%)`;

  // Le fasce scorrono in senso opposto al cursore e si vedono di più attorno al punto di luce
  const foilPositionX = useTransform(mouseXSpring, [-0.5, 0.5], [100, 0]);
  const foilPositionY = useTransform(mouseYSpring, [-0.5, 0.5], [100, 0]);
  const foilPosition = useMotionTemplate`${foilPositionX}% ${foilPositionY}%`;
  const foilMask = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, #000 0%, rgb(0 0 0 / 40%) 30%, transparent 65%)`;
  // Intensità massima del riflesso cromatico: più bassa è, più il foil è leggero
  const foilOpacity = useTransform(hoverSpring, [0, 1], [0, 0.28]);

  // Con movimento ridotto i gestori non fanno nulla: la struttura resta la stessa del server,
  // dove useReducedMotion() vale ancora null, così non ci sono differenze all'idratazione
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    if (!reduceMotion) hover.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    hover.set(0);
  };

  // Con la tastiera la scheda si ingrandisce come al passaggio del mouse
  const wrapperClassName = cn(
    "perspective-distant transform-3d motion-safe:transition-transform motion-safe:duration-200 motion-safe:has-focus-visible:scale-105",
    className
  );

  return (
    <div className={wrapperClassName}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          boxShadow:
            "rgba(0, 0, 0, 0.01) 0px 520px 146px 0px, rgba(0, 0, 0, 0.04) 0px 333px 133px 0px, rgba(0, 0, 0, 0.26) 0px 83px 83px 0px, rgba(0, 0, 0, 0.29) 0px 21px 46px 0px",
        }}
        initial={{ scale: 1, z: 0 }}
        whileHover={reduceMotion ? undefined : { scale: 1.05, z: 50, transition: { duration: 0.2 } }}
        className="relative rounded-2xl"
      >
        {children}
        {foil && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-40 size-full rounded-2xl mix-blend-color-dodge"
            style={{
              backgroundImage: FOIL_GRADIENT,
              backgroundSize: "300% 300%",
              backgroundPosition: foilPosition,
              maskImage: foilMask,
              WebkitMaskImage: foilMask,
              opacity: foilOpacity,
            }}
          />
        )}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-50 size-full rounded-2xl mix-blend-overlay"
          style={{ background: glareBackground, opacity: glareOpacity }}
        />
      </motion.div>
    </div>
  );
};
