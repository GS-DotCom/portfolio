"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Composizione ispirata all'hero del riferimento: solidi scuri sospesi e una sfera arancione
// che li illumina. Coordinate in unità della scena: con la camera a z=18 e fov 30
// l'altezza visibile è di circa 9,6 unità.
const SLATE = "#4a5363";
const BLACK = "#0d0e12";
const ORB = new THREE.Vector3(0.64, 2.55, 0.4);

type Solid = {
  geometry: () => THREE.BufferGeometry;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  roughness?: number;
};

const solids: Solid[] = [
  // Cubo in alto a sinistra
  {
    geometry: () => new THREE.BoxGeometry(2.3, 2.3, 2.3),
    color: SLATE,
    position: [-2.3, 2.45, -1.2],
    rotation: [0.25, 0.65, 0.12],
  },
  // Cubo grande al centro, dietro al nome
  {
    geometry: () => new THREE.BoxGeometry(2.7, 2.7, 2.7),
    color: SLATE,
    position: [-0.05, 0.55, 0],
    rotation: [0.62, 0.78, 0.18],
  },
  // Cilindro nero piccolo a destra
  {
    geometry: () => new THREE.CylinderGeometry(0.42, 0.42, 0.95, 48),
    color: BLACK,
    position: [1.65, 1.6, 0.6],
    rotation: [0.5, 0, -0.35],
    roughness: 0.35,
  },
  // Cilindro inclinato in basso a sinistra
  {
    geometry: () => new THREE.CylinderGeometry(0.5, 0.5, 1.9, 48),
    color: SLATE,
    position: [-0.85, -2.15, 0.7],
    rotation: [0.3, 0.2, 0.85],
  },
  // Parallelepipedo in basso a destra
  {
    geometry: () => new THREE.BoxGeometry(1.5, 3.2, 1.4),
    color: SLATE,
    position: [1.45, -2.3, -0.9],
    rotation: [0.35, 0.55, -0.42],
  },
];

// Alone morbido attorno alla sfera, disegnato una volta su un canvas
function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255, 170, 110, 0.9)");
  gradient.addColorStop(0.25, "rgba(255, 120, 50, 0.35)");
  gradient.addColorStop(1, "rgba(255, 100, 40, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;
    const container: HTMLDivElement = containerElement;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      // WebGL non disponibile: resta il gradiente della hero
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.domElement.className = "absolute inset-0 size-full opacity-0 transition-opacity duration-1000";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#15212f", 15, 27);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 18);

    scene.add(new THREE.HemisphereLight("#5f7fa8", "#141821", 2.1));
    const rim = new THREE.DirectionalLight("#9dbcff", 0.8);
    rim.position.set(-6, 5, 4);
    scene.add(rim);

    const cluster = new THREE.Group();
    scene.add(cluster);

    const materials: THREE.Material[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const meshes = solids.map((solid, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: solid.color,
        roughness: solid.roughness ?? 0.7,
        metalness: 0.1,
      });
      materials.push(material);
      const geometry = solid.geometry();
      geometries.push(geometry);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...solid.position);
      mesh.rotation.set(...solid.rotation);
      mesh.userData = { baseY: solid.position[1], phase: index * 1.3 };
      cluster.add(mesh);
      return mesh;
    });

    // Sfera luminosa con la sua luce calda e l'alone
    const orbGeometry = new THREE.SphereGeometry(0.24, 48, 48);
    const orbMaterial = new THREE.MeshBasicMaterial({ color: "#ff9a5c", toneMapped: false });
    materials.push(orbMaterial);
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.position.copy(ORB);
    cluster.add(orb);

    const light = new THREE.PointLight("#ff7a2a", 45, 0, 2);
    light.position.copy(ORB).add(new THREE.Vector3(0, 0.2, 0.5));
    cluster.add(light);

    const glowTexture = createGlowTexture();
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });
    materials.push(glowMaterial);
    const glow = new THREE.Sprite(glowMaterial);
    glow.position.copy(ORB);
    glow.scale.setScalar(2.4);
    cluster.add(glow);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0 };
    const start = performance.now();
    const elapsed = () => (performance.now() - start) / 1000;
    let visible = true;
    let running = false;
    let shown = false;

    function resize() {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Su schermi stretti la composizione si rimpicciolisce per restare intera
      const visibleWidth = 2 * 18 * Math.tan(THREE.MathUtils.degToRad(15)) * camera.aspect;
      cluster.scale.setScalar(Math.min(1, visibleWidth / 7.5));
      renderFrame(elapsed());
    }

    function renderFrame(time: number) {
      if (!reducedMotion.matches) {
        cluster.rotation.y = Math.sin(time * 0.12) * 0.12;
        for (const mesh of meshes) {
          const { baseY, phase } = mesh.userData as { baseY: number; phase: number };
          mesh.position.y = baseY + Math.sin(time * 0.55 + phase) * 0.09;
          mesh.rotation.y += 0.0012;
        }
        glow.scale.setScalar(2.4 + Math.sin(time * 1.6) * 0.12);
        // Leggera parallasse col mouse
        camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.04;
        camera.position.y += (pointer.y * 0.45 - camera.position.y) * 0.04;
      }
      camera.lookAt(0, 0.2, 0);
      renderer.render(scene, camera);
      if (!shown) {
        shown = true;
        renderer.domElement.classList.remove("opacity-0");
      }
    }

    // L'animazione gira solo se la hero è visibile e il sistema non chiede movimento ridotto
    function sync() {
      const shouldRun = visible && !document.hidden && !reducedMotion.matches;
      if (shouldRun && !running) {
        running = true;
        renderer.setAnimationLoop(() => renderFrame(elapsed()));
      } else if (!shouldRun && running) {
        running = false;
        renderer.setAnimationLoop(null);
      }
    }

    function onPointerMove(event: PointerEvent) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();
    sync();

    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onPointerMove);
      orbGeometry.dispose();
      for (const geometry of geometries) geometry.dispose();
      glowTexture.dispose();
      for (const material of materials) material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" className="absolute inset-0" />;
}
