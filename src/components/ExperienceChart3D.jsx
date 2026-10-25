import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Billboard, Bounds, ContactShadows, Environment, Lightformer, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { ITEMS, ITEM_HEIGHT } from './CompanyItems';

const BASE = import.meta.env.BASE_URL;
const GAP = 1.55;

const cssColor = (name) => {
  const [r, g, b] = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
  return new THREE.Color(r / 255, g / 255, b / 255);
};

// A company with no logo file gets its name drawn as a wordmark.
const wordmarkTexture = (text) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1D2329';
  ctx.font = '700 64px "IBM Plex Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 66);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

// White card with the logo on it, always turned toward the camera.
const LogoCard = ({ texture, position }) => {
  const { width, height } = texture.image;
  const aspect = width / height;
  const w = Math.min(1.25, 0.5 * aspect);
  const h = w / aspect;
  return (
    <Billboard position={position}>
      <RoundedBox args={[w + 0.22, h + 0.2, 0.06]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </Billboard>
  );
};

// A column whose height is months in the role, topped by a model of what the company does and its logo.
const Column = ({ index, count, value, max, current, item, texture, colors, grow }) => {
  const column = useRef();
  const top = useRef();
  const height = 0.3 + (value / max) * 3.2;
  const x = (index - (count - 1) / 2) * GAP;
  const Item = ITEMS[item];
  const itemHeight = ITEM_HEIGHT[item] ?? 1;

  useFrame(() => {
    const g = Math.max(0.001, grow.current[index]);
    if (column.current) column.current.scale.y = g;
    if (top.current) top.current.position.y = height * g;
  });

  return (
    <group position={[x, 0, 0]}>
      <group ref={column}>
        <RoundedBox args={[0.95, height, 0.95]} radius={0.06} smoothness={4} position={[0, height / 2, 0]}>
          <meshStandardMaterial color={current ? colors.accent : colors.base} roughness={0.45} metalness={0.05} />
        </RoundedBox>
      </group>
      <group ref={top}>
        {Item && (
          <group scale={0.82}>
            <Item />
          </group>
        )}
        <LogoCard texture={texture} position={[0, itemHeight * 0.82 + 0.45, 0]} />
      </group>
    </group>
  );
};

// Grows the columns once when `active` turns on; asks for frames only while growing.
const Growth = ({ count, grow, active, reduceMotion }) => {
  const invalidate = useThree((s) => s.invalidate);
  const start = useRef(null);
  useEffect(() => {
    if (reduceMotion) grow.current = grow.current.map(() => 1);
    invalidate();
  }, [active, reduceMotion, grow, invalidate]);
  useFrame((state) => {
    if (!active || reduceMotion) return;
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;
    let done = true;
    for (let i = 0; i < count; i++) {
      const p = Math.min(1, Math.max(0, (t - i * 0.08) / 0.8));
      grow.current[i] = 1 - Math.pow(1 - p, 3);
      if (p < 1) done = false;
    }
    if (!done) state.invalidate();
  });
  return null;
};

const Scene = ({ roles, active, reduceMotion }) => {
  const urls = roles.map((r) => (r.logo ? `${BASE}${r.logo}` : `${BASE}favicon.svg`));
  const loaded = useTexture(urls);
  const textures = useMemo(
    () => roles.map((r, i) => (r.logo ? loaded[i] : wordmarkTexture(r.name))),
    [roles, loaded],
  );
  const colors = useMemo(() => ({ accent: cssColor('--accent'), base: cssColor('--muted').lerp(cssColor('--paper'), 0.45) }), []);
  const grow = useRef(roles.map(() => (reduceMotion ? 1 : 0)));
  const max = Math.max(...roles.map((r) => r.months));

  return (
    <>
      <Growth count={roles.length} grow={grow} active={active} reduceMotion={reduceMotion} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 6]} intensity={1.6} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 5, 5]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1} position={[-6, 2, 2]} scale={[4, 4, 1]} />
      </Environment>
      {/* Bounds fits the camera to the chart at any width, so nothing is cropped on phones. */}
      <Bounds fit clip observe margin={0.72}>
      <group rotation={[0, -0.16, 0]} position={[0, -2.1, 0]}>
        {roles.map((r, i) => (
          <Column
            key={r.name}
            index={i}
            count={roles.length}
            value={r.months}
            max={max}
            current={r.current}
            item={r.item}
            texture={textures[i]}
            colors={colors}
            grow={grow}
          />
        ))}
        {/* Invisible box at the chart's full grown size, so Bounds frames the final layout from the start. */}
        <mesh position={[0, 2.9, 0]}>
          <boxGeometry args={[roles.length * GAP, 5.8, 1.2]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <ContactShadows position={[0, 0.001, 0]} opacity={0.28} scale={[roles.length * GAP + 2, 3]} blur={2} far={4} />
      </group>
      </Bounds>
    </>
  );
};

// 3D column chart of months per role with each company's logo above its column.
const ExperienceChart3D = ({ roles, label }) => {
  const wrapper = useRef(null);
  const [active, setActive] = useState(false);
  const reduceMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setActive(true), { threshold: 0.3 });
    observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapper} role="img" aria-label={label} className="w-full h-full">
      <Canvas frameloop="demand" dpr={[1, 2]} camera={{ position: [2.5, 3.6, 13.5], fov: 34 }} onCreated={({ camera }) => camera.lookAt(0, 0.2, 0)}>
        <Suspense fallback={null}>
          <Scene roles={roles} active={active} reduceMotion={reduceMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ExperienceChart3D;
