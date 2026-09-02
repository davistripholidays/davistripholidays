"use client";

/**
 * HeroScene — low-poly Himalayan terrain rendered with three.js / React Three Fiber.
 *
 * Design intent: an atmospheric dusk valley in the brand palette (pine greens,
 * gold sun, cream snow) that replaces the hero *photograph* visually while the
 * photo remains as the instant-paint layer and permanent fallback:
 *
 *   - No WebGL / prefers-reduced-motion → component renders nothing (photo only)
 *   - Scene fades in over the photo once the GPU has drawn its first frame
 *   - Rendering pauses when the hero scrolls out of view or the tab is hidden
 *   - Mouse parallax listens on `window` (canvas itself is pointer-events-none)
 *   - Loaded via next/dynamic → three.js lives in its own lazy chunk, so
 *     First Load JS of the page is unaffected (LCP stays the photo + HTML)
 *
 * Brightness strategy (learned the hard way): the hero's legibility scrims sit
 * ON TOP of this canvas, so the scene must be rendered 2–3 stops brighter than
 * the final desired look. The backdrop gradient + sun glow ignore fog, tone
 * mapping is disabled (`flat`) and lights are tuned accordingly.
 *
 * Palette + behaviour knobs are grouped in SCENE below so a redesign can
 * re-tune the mood without reading the geometry code.
 */

/* eslint-disable react-hooks/immutability -- R3F's design: three.js objects
   (camera, geometry attributes) are mutated imperatively inside useFrame,
   outside React's render cycle. */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { fbm, valueNoise2D } from "@/lib/noise";

/* ------------------------------------------------------------------ */
/* Mood / palette — re-tune here when the brand palette changes        */
/* ------------------------------------------------------------------ */
const SCENE = {
  // Backdrop gradient (painted on a canvas texture, unaffected by fog)
  backdrop: {
    topLeft: "#0d2019", // deep dusk pine (behind the headline — stays dark)
    bottomRight: "#3f7a5e", // luminous valley haze
    horizon: "#c98d4e", // warm dusk band near the sun
  },
  sun: "#e8a04c", // brand gold
  fogColor: "#1d4a39", // fog blends ridges into the horizon glow
  fogNear: 22,
  fogFar: 78,
  snow: "#f7f2e6",
  snowLayers: [
    { count: 300, size: 0.16, speed: 1.0 }, // fine distant flakes
    { count: 130, size: 0.32, speed: 0.65 }, // large bokeh-ish near flakes
  ],
  stars: 130,
  terrain: {
    deep: "#254536", // valley floor
    pine: "#33604c", // forested slopes
    rock: "#5a7263", // upper rock band
    snow: "#efe9da", // snow caps
  },
} as const;

/* ------------------------------------------------------------------ */
/* Mount gate: only render when motion is allowed and WebGL exists     */
/* ------------------------------------------------------------------ */
function useCanRender3D(): boolean {
  // Lazy initialiser is safe: this component is only ever mounted client-side
  // (next/dynamic with ssr: false), so there is no SSR/hydration to mismatch.
  const [ok] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      /* WebGL unavailable — photo fallback stays */
      return false;
    }
  });
  return ok;
}

/* ------------------------------------------------------------------ */
/* Backdrop — dusk gradient painted behind everything (fog: false)     */
/* ------------------------------------------------------------------ */
function Backdrop() {
  const texture = useMemo(() => {
    const w = 1024;
    const h = 512;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    // Diagonal base gradient: darker top-left (headline zone) → teal valley
    const base = ctx.createLinearGradient(0, 0, w, h);
    base.addColorStop(0, SCENE.backdrop.topLeft);
    base.addColorStop(0.55, "#22503e");
    base.addColorStop(1, SCENE.backdrop.bottomRight);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    // Warm dusk glow toward the lower right (sun side)
    const glow = ctx.createRadialGradient(
      w * 0.68,
      h * 0.78,
      0,
      w * 0.68,
      h * 0.78,
      w * 0.55,
    );
    glow.addColorStop(0, "rgba(201,141,78,0.85)");
    glow.addColorStop(0.4, "rgba(201,141,78,0.28)");
    glow.addColorStop(1, "rgba(201,141,78,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[0, 10, -70]} renderOrder={-1}>
      <planeGeometry args={[340, 170]} />
      <meshBasicMaterial map={texture} fog={false} depthWrite={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Terrain: displaced plane with elevation-based vertex colours        */
/* ------------------------------------------------------------------ */
function Terrain() {
  const geometry = useMemo(() => {
    const W = 110;
    const D = 70;
    const SX = 132;
    const SZ = 84;
    const geo = new THREE.PlaneGeometry(W, D, SX, SZ);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);

    const cDeep = new THREE.Color(SCENE.terrain.deep);
    const cPine = new THREE.Color(SCENE.terrain.pine);
    const cRock = new THREE.Color(SCENE.terrain.rock);
    const cSnow = new THREE.Color(SCENE.terrain.snow);
    const tmp = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Ridges rise toward the back of the valley
      const back = THREE.MathUtils.smoothstep(-z, 4, D / 2);
      const ridge = Math.pow(fbm(x * 0.05 + 7.3, z * 0.05 - 2.1, 4), 1.7);
      const detail = fbm(x * 0.16, z * 0.16, 3);
      // Soft carve through the foreground so the camera sits in a valley
      const valley = Math.max(0, 1 - Math.hypot(x / 26, (z - 6) / 20));

      const y = back * (4 + ridge * 12) + detail * 1.6 - valley * 2.2 + 1.2;
      pos.setY(i, y);

      // Elevation-based colour bands with per-vertex jitter to avoid banding
      const h = THREE.MathUtils.clamp((y - 1) / 12, 0, 1);
      const j = (valueNoise2D(x * 0.9, z * 0.9) - 0.5) * 0.12;
      if (h < 0.45) {
        tmp.copy(cDeep).lerp(cPine, h / 0.45);
      } else if (h < 0.62) {
        tmp.copy(cPine).lerp(cRock, (h - 0.45) / 0.17);
      } else {
        tmp
          .copy(cRock)
          .lerp(cSnow, THREE.MathUtils.clamp((h - 0.62 + j) / 0.3, 0, 1));
      }
      tmp.offsetHSL(0, 0, j * 0.5);

      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} position={[0, -2.6, 0]}>
      <meshStandardMaterial vertexColors flatShading roughness={0.95} metalness={0} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Drifting snow — soft round flakes in two size layers               */
/* ------------------------------------------------------------------ */
function SnowLayer({ count, size, speedScale }: { count: number; size: number; speedScale: number }) {
  const ref = useRef<THREE.Points>(null);

  const flakeTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(255,252,244,1)");
    gradient.addColorStop(0.45, "rgba(255,252,244,0.55)");
    gradient.addColorStop(1, "rgba(255,252,244,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = Math.random() * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 5;
      speeds[i] = (0.55 + Math.random() * 0.9) * speedScale;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, phases };
  }, [count, speedScale]);

  useEffect(() => () => flakeTexture.dispose(), [flakeTexture]);

  useFrame((state, delta) => {
    const points = ref.current;
    if (!points) return;
    const t = state.clock.elapsedTime;
    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= speeds[i] * delta;
      arr[i * 3] += Math.sin(t * 0.6 + phases[i]) * delta * 0.35;
      if (arr[i * 3 + 1] < -1) {
        arr[i * 3 + 1] = 21 + Math.random() * 2;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        map={flakeTexture}
        color={SCENE.snow}
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Snow() {
  return (
    <>
      {SCENE.snowLayers.map((layer, i) => (
        <SnowLayer key={i} count={layer.count} size={layer.size} speedScale={layer.speed} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Stars — faint twinkling points in the upper dusk sky               */
/* ------------------------------------------------------------------ */
function Stars() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = SCENE.stars;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 160;
      arr[i * 3 + 1] = 16 + Math.random() * 30;
      arr[i * 3 + 2] = -20 - Math.random() * 45;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const points = ref.current;
    if (!points) return;
    const t = state.clock.elapsedTime;
    const material = points.material as THREE.PointsMaterial;
    material.opacity = 0.38 + Math.sin(t * 0.5) * 0.14;
  });

  return (
    <points ref={ref} frustumCulled={false} renderOrder={-1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#f2ecd9"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        fog={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Sun glow — additive radial sprite near the horizon (fog: false)     */
/* ------------------------------------------------------------------ */
function SunGlow() {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(240,180,105,0.95)");
    gradient.addColorStop(0.35, "rgba(232,160,76,0.35)");
    gradient.addColorStop(1, "rgba(232,160,76,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <sprite position={[-22, 9, -62]} scale={[60, 60, 1]} renderOrder={1}>
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        fog={false}
        blending={THREE.AdditiveBlending}
        opacity={0.95}
      />
    </sprite>
  );
}

/* ------------------------------------------------------------------ */
/* Camera rig — slow drift + mouse parallax via window listener        */
/* ------------------------------------------------------------------ */
function Rig() {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(0, 3.2, -14), []);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const targetX = Math.sin(t * 0.09) * 1.4 + mouse.current.x * 0.9;
    const targetY = 3.1 + Math.cos(t * 0.07) * 0.3 - mouse.current.y * 0.45;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 1.6, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 1.6, delta);
    camera.lookAt(look);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* Exported scene                                                      */
/* ------------------------------------------------------------------ */
export function HeroScene() {
  const canRender = useCanRender3D();
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [canRender]);

  if (!canRender) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <Canvas
        flat
        dpr={[1, 1.75]}
        camera={{ position: [0, 3.1, 14], fov: 55, near: 0.1, far: 160 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        frameloop={paused ? "never" : "always"}
        onCreated={() => setReady(true)}
      >
        <fog attach="fog" args={[SCENE.fogColor, SCENE.fogNear, SCENE.fogFar]} />

        <hemisphereLight args={["#a8cec0", "#2c3f28", 1.15]} />
        <directionalLight position={[-26, 16, -30]} intensity={3.0} color={SCENE.sun} />
        <directionalLight position={[18, 22, 16]} intensity={0.7} color="#b8d4e6" />

        <Backdrop />
        <Stars />
        <Terrain />
        <SunGlow />
        <Snow />
        <Rig />
      </Canvas>
    </div>
  );
}
