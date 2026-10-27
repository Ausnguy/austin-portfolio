// Renders one project thumbnail per page load: ?scene=<project slug>.
// Run `npm run dev`, open /austin-portfolio/tools/thumbnails/?scene=interdomain and screenshot the 1280×720 canvas
// (render.cjs in this folder does all of them and writes public/thumbs/<slug>.png).
import { Suspense, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Grid,
  Instance,
  Instances,
  Lightformer,
  Line,
  QuadraticBezierLine,
  RoundedBox,
  useTexture,
} from '@react-three/drei';
import * as THREE from 'three';

const GREEN = '#107C41';
const GREEN_LIGHT = '#5FB784';
const INK = '#1D2329';
const AMBER = '#E8A33D';
const logo = (name) => `${import.meta.env.BASE_URL}logos/${name}.png`;

// Seeded random so every render is identical.
const seeded = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// A white rounded card with a logo on its front face.
const LogoCard = ({ name, width = 1.6, position, rotation }) => {
  const texture = useTexture(logo(name));
  const aspect = texture.image.width / texture.image.height;
  const h = width / aspect;
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[width + 0.3, h + 0.3, 0.08]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color="#ffffff" roughness={0.45} />
      </RoundedBox>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[width, h]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </group>
  );
};

// Routing arcs over a globe of networks; one withdrawn route in amber.
const Interdomain = () => {
  const r = 2;
  const nodes = useMemo(() => {
    const rand = seeded(23);
    return Array.from({ length: 30 }, () => {
      const u = rand() * 1.6 - 0.6;
      const t = rand() * Math.PI * 1.6 - 0.8;
      const s = Math.sqrt(1 - u * u);
      return new THREE.Vector3(s * Math.sin(t), u, s * Math.cos(t)).multiplyScalar(r);
    });
  }, []);
  // Latitude and longitude lines, drawn as clean polylines.
  const graticule = useMemo(() => {
    const lines = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = Math.sin((lat * Math.PI) / 180) * r;
      const rr = Math.cos((lat * Math.PI) / 180) * r;
      lines.push(Array.from({ length: 73 }, (_, i) => new THREE.Vector3(Math.cos((i / 72) * Math.PI * 2) * rr, y, Math.sin((i / 72) * Math.PI * 2) * rr)));
    }
    for (let lon = 0; lon < 180; lon += 30) {
      const a = (lon * Math.PI) / 180;
      lines.push(Array.from({ length: 73 }, (_, i) => {
        const t = (i / 72) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(t) * Math.cos(a) * r, Math.sin(t) * r, Math.cos(t) * Math.sin(a) * r);
      }));
    }
    return lines;
  }, []);
  const links = useMemo(() => {
    const out = [];
    nodes.forEach((p, i) => {
      const near = nodes.map((q, j) => [j, p.distanceTo(q)]).filter(([j]) => j > i).sort((a, b) => a[1] - b[1]);
      if (near[1] && near[1][1] > 0.9) out.push([i, near[1][0]]);
    });
    return out.slice(0, 16);
  }, [nodes]);
  const arc = (a, b) => a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(r * (1.18 + a.distanceTo(b) * 0.12));
  return (
    <group rotation={[0.3, -0.3, 0]} position={[0, 0.35, 0]}>
      <mesh>
        <sphereGeometry args={[r, 64, 48]} />
        <meshStandardMaterial color="#eef2f5" roughness={0.9} />
      </mesh>
      {graticule.map((pts, i) => (
        <Line key={i} points={pts} color="#c7d0d8" lineWidth={1} />
      ))}
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.065, 16, 12]} />
          <meshStandardMaterial color={i % 4 === 0 ? GREEN : INK} />
        </mesh>
      ))}
      {links.map(([a, b], i) => (
        <QuadraticBezierLine
          key={i}
          start={nodes[a]}
          end={nodes[b]}
          mid={arc(nodes[a], nodes[b])}
          color={i === 5 ? AMBER : GREEN}
          lineWidth={i === 5 ? 2.5 : 3}
          dashed={i === 5}
          dashSize={0.12}
          gapSize={0.08}
        />
      ))}
    </group>
  );
};

// A handwritten 7 as voxels on a slate.
const Mnist = () => {
  const cells = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 28;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 28, 28);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(7, 7); ctx.lineTo(20, 7); ctx.lineTo(11, 23); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10, 15); ctx.lineTo(18, 15); ctx.stroke();
    const px = ctx.getImageData(0, 0, 28, 28).data;
    const out = [];
    for (let y = 0; y < 28; y++) for (let x = 0; x < 28; x++) out.push({ x, y, v: px[(y * 28 + x) * 4] / 255 });
    return out;
  }, []);
  const s = 0.17;
  return (
    <group rotation={[0, -0.55, 0]} position={[0, -0.6, 0]}>
      <RoundedBox args={[28 * s + 0.6, 0.3, 28 * s + 0.6]} radius={0.12} smoothness={4} position={[0, -0.15, 0]}>
        <meshStandardMaterial color={INK} roughness={0.35} metalness={0.1} />
      </RoundedBox>
      <Instances limit={784}>
        <boxGeometry args={[s * 0.86, 1, s * 0.86]} />
        <meshStandardMaterial roughness={0.4} />
        {cells.map(({ x, y, v }) => {
          const h = v > 0.08 ? 0.12 + v * 0.55 : 0.03;
          return (
            <Instance
              key={`${x}-${y}`}
              position={[(x - 13.5) * s, h / 2, (y - 13.5) * s]}
              scale={[1, h, 1]}
              color={v > 0.08 ? GREEN_LIGHT : '#2c343c'}
            />
          );
        })}
      </Instances>
    </group>
  );
};

// A server rack routing requests: most go to small models, one to the big model.
const Bny = () => {
  const hub = new THREE.Vector3(-2.4, 2.2, 0.3);
  const smalls = [[0.9, 0.35, 1.5], [2.0, 0.35, 1.1], [1.1, 0.35, 2.6], [2.3, 0.35, 2.3]].map((p) => new THREE.Vector3(...p));
  const big = new THREE.Vector3(2.6, 3.4, -1.6);
  return (
    <group position={[0, -1.6, 0]} rotation={[0, -0.25, 0]}>
      <RoundedBox args={[1.7, 3.4, 1.3]} radius={0.08} smoothness={4} position={[-2.4, 1.7, 0]}>
        <meshStandardMaterial color={INK} roughness={0.4} metalness={0.2} />
      </RoundedBox>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[-2.4, 0.45 + i * 0.36, 0.66]}>
          <boxGeometry args={[1.3, 0.06, 0.02]} />
          <meshStandardMaterial color={i % 3 === 0 ? '#7CFFB0' : '#3b4651'} emissive={i % 3 === 0 ? GREEN : '#000'} emissiveIntensity={1.2} />
        </mesh>
      ))}
      <LogoCard name="bny" width={1.1} position={[-2.4, 3.95, 0.4]} />
      <RoundedBox args={[1.5, 3.4, 1.5]} radius={0.1} smoothness={4} position={[2.6, 1.7, -1.6]}>
        <meshStandardMaterial color="#d6dbe0" roughness={0.6} />
      </RoundedBox>
      {smalls.map((p, i) => (
        <RoundedBox key={i} args={[0.7, 0.7, 0.7]} radius={0.1} smoothness={4} position={p}>
          <meshStandardMaterial color={GREEN_LIGHT} roughness={0.45} />
        </RoundedBox>
      ))}
      {smalls.map((p, i) => (
        <QuadraticBezierLine key={i} start={hub} end={p.clone().setY(0.7)} mid={hub.clone().lerp(p, 0.5).setY(3.6)} color={GREEN} lineWidth={4} />
      ))}
      <QuadraticBezierLine start={hub} end={big} mid={hub.clone().lerp(big, 0.5).setY(4.6)} color="#aab4bf" lineWidth={2} />
    </group>
  );
};

// Inventory for the Amazon store: taped boxes on a pallet, Amazon logo on the front.
const ToolAndMore = () => {
  const texture = useTexture(logo('amazon'));
  const boxes = [];
  for (let layer = 0; layer < 3; layer++) {
    const across = layer === 2 ? 2 : 3;
    for (let x = 0; x < across; x++) {
      for (let z = 0; z < 2; z++) {
        boxes.push({ x: (x - (across - 1) / 2) * 1.55, y: 0.35 + layer * 1.12 + 0.55, z: (z - 0.5) * 1.6, front: z === 1 });
      }
    }
  }
  const kraft = ['#d7ae76', '#cfa46a', '#dcb784'];
  return (
    <group position={[0, -1.7, 0]} rotation={[0, -0.45, 0]}>
      <RoundedBox args={[5, 0.3, 3.4]} radius={0.04} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#b9a58a" roughness={0.9} />
      </RoundedBox>
      {boxes.map((b, i) => (
        <group key={i} position={[b.x, b.y, b.z]}>
          <RoundedBox args={[1.5, 1.1, 1.55]} radius={0.04} smoothness={3}>
            <meshStandardMaterial color={kraft[i % 3]} roughness={0.85} />
          </RoundedBox>
          <mesh position={[0, 0.552, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.28, 1.56]} />
            <meshStandardMaterial color="#c49456" roughness={0.6} />
          </mesh>
          {b.front && (
            <mesh position={[0, -0.05, 0.78]}>
              <planeGeometry args={[1.0, 0.3]} />
              <meshBasicMaterial map={texture} transparent toneMapped={false} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

// BP oil barrels in front of two lagged series, the shape of the rates-vs-oil analysis.
const Bp = () => {
  const series = (offset, z, amp) => {
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const x = -3.6 + i * 0.09;
      pts.push(new THREE.Vector3(x, 2.3 + Math.sin((i - offset) / 8) * amp + Math.sin((i - offset) / 3) * 0.12, z));
    }
    return new THREE.CatmullRomCurve3(pts);
  };
  const rate = useMemo(() => series(0, -1.6, 0.6), []);
  const oil = useMemo(() => series(11, -1.2, 0.75), []);
  return (
    <group position={[0, -1.7, 0]} rotation={[0, -0.3, 0]}>
      <mesh>
        <tubeGeometry args={[rate, 200, 0.06, 10]} />
        <meshStandardMaterial color={INK} roughness={0.4} />
      </mesh>
      <mesh>
        <tubeGeometry args={[oil, 200, 0.07, 10]} />
        <meshStandardMaterial color={GREEN} roughness={0.4} />
      </mesh>
      {[-1.5, 0, 1.5].map((x, i) => (
        <group key={i} position={[x, 0.85, 1.2 + (i === 1 ? 0.5 : 0)]}>
          <mesh>
            <cylinderGeometry args={[0.62, 0.62, 1.7, 48]} />
            <meshStandardMaterial color="#0f6b3a" roughness={0.35} metalness={0.3} />
          </mesh>
          {[-0.55, 0, 0.55].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.625, 0.025, 8, 48]} />
              <meshStandardMaterial color="#0b5a31" roughness={0.3} metalness={0.4} />
            </mesh>
          ))}
          {i === 1 && <LogoCard name="bp" width={0.55} position={[0, 0.15, 0.66]} />}
        </group>
      ))}
    </group>
  );
};

// A candlestick chart for the paper-trading app, with a trend line and an order ticket floating over it.
const MarketStreet = () => {
  const candles = useMemo(() => {
    const rand = seeded(11);
    let price = 0.5;
    return Array.from({ length: 16 }, (_, i) => {
      const open = price;
      price += (rand() - 0.38) * 0.55 + 0.06;
      const close = Math.max(0.15, price);
      const high = Math.max(open, close) + rand() * 0.25;
      const low = Math.max(0.05, Math.min(open, close) - rand() * 0.25);
      return { i, open, close, high, low };
    });
  }, []);
  const gap = 0.46;
  const H = 2.2; // price to world height
  const base = Math.min(...candles.map((c) => c.low)) * H; // lowest wick rests on the slab
  const x = (i) => (i - 7.5) * gap;
  const trend = candles.map((c) => new THREE.Vector3(x(c.i), c.close * H - base + 0.45, 0.35));
  return (
    <group position={[0, -1.1, 0]} rotation={[0, -0.32, 0]}>
      <RoundedBox args={[16 * gap + 1, 0.3, 1.5]} radius={0.1} smoothness={4} position={[0, -0.15, 0]}>
        <meshStandardMaterial color={INK} roughness={0.35} metalness={0.1} />
      </RoundedBox>
      {candles.map((c) => {
        const up = c.close >= c.open;
        const lo = Math.min(c.open, c.close);
        const hi = Math.max(c.open, c.close);
        const body = Math.max(0.14, (hi - lo) * H);
        const color = up ? GREEN_LIGHT : AMBER;
        return (
          <group key={c.i} position={[x(c.i), 0.02 - base, 0]}>
            <mesh position={[0, ((c.high + c.low) / 2) * H + 0.05, 0]}>
              <boxGeometry args={[0.05, (c.high - c.low) * H + 0.1, 0.05]} />
              <meshStandardMaterial color="#aab4bf" roughness={0.5} />
            </mesh>
            <RoundedBox args={[0.3, body, 0.3]} radius={0.04} smoothness={3} position={[0, lo * H + body / 2 + 0.05, 0]}>
              <meshStandardMaterial color={color} roughness={0.4} />
            </RoundedBox>
          </group>
        );
      })}
      <Line points={trend} color={GREEN} lineWidth={3} />
      <group position={[-2.5, 3.5, 0.6]} rotation={[0, 0.18, 0]}>
        <RoundedBox args={[1.9, 1.15, 0.07]} radius={0.07} smoothness={4}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.35} roughness={0.45} />
        </RoundedBox>
        <mesh position={[-0.45, 0.28, 0.045]}><planeGeometry args={[0.7, 0.2]} /><meshBasicMaterial color={GREEN} /></mesh>
        <mesh position={[-0.2, 0.0, 0.045]}><planeGeometry args={[1.2, 0.1]} /><meshBasicMaterial color="#cfd5db" /></mesh>
        <mesh position={[-0.35, -0.2, 0.045]}><planeGeometry args={[0.9, 0.1]} /><meshBasicMaterial color="#cfd5db" /></mesh>
        <mesh position={[0.55, -0.38, 0.045]}><planeGeometry args={[0.6, 0.18]} /><meshBasicMaterial color={INK} /></mesh>
      </group>
    </group>
  );
};

const SCENES = {
  interdomain: { Component: Interdomain, camera: [0, 1.6, 10.5] },
  'mnist-digit-recognition': { Component: Mnist, camera: [0, 6.2, 6.4] },
  'ai-efficiency-modeling': { Component: Bny, camera: [1.2, 3.4, 10.5] },
  'sales-analytics-dashboard': { Component: ToolAndMore, camera: [2.5, 3.4, 9] },
  'fed-oil-price-analysis': { Component: Bp, camera: [1.2, 2.4, 9.5] },
  marketstreet: { Component: MarketStreet, camera: [1.5, 3.2, 10.5] },
};

const Ready = () => {
  useEffect(() => {
    const t = setTimeout(() => (window.__ready = true), 1500);
    return () => clearTimeout(t);
  }, []);
  return null;
};

const App = () => {
  const slug = new URLSearchParams(location.search).get('scene') ?? 'interdomain';
  const { Component, camera } = SCENES[slug];
  return (
    <Canvas
      dpr={1}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      camera={{ position: camera, fov: 32 }}
      onCreated={({ camera: cam }) => cam.lookAt(0, 0, 0)}
      style={{ width: 1280, height: 720 }}
    >
      <color attach="background" args={['#f3f5f7']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 9, 6]} intensity={1.7} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} position={[0, 6, 6]} scale={[12, 5, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[-7, 3, 3]} scale={[5, 5, 1]} />
        <Lightformer form="circle" intensity={0.8} position={[6, 2, -4]} scale={3} />
      </Environment>
      <Suspense fallback={null}>
        <Component />
        <Ready />
      </Suspense>
      <Grid position={[0, -1.7, 0]} args={[40, 40]} cellSize={0.5} cellColor="#dfe3e8" sectionSize={2.5} sectionColor="#cdd3da" fadeDistance={26} fadeStrength={1.5} infiniteGrid />
      <ContactShadows position={[0, -1.69, 0]} opacity={0.35} scale={16} blur={2.4} far={6} />
    </Canvas>
  );
};

createRoot(document.getElementById('root')).render(<App />);
