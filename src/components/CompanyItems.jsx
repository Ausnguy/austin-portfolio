import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// One small 3D model per company, showing what the company does. Each sits on y = 0 and is
// about 1 unit wide, so it can rest on top of a chart column.

const DARK = '#1D2329';
const METAL = '#9aa4ae';

// HPE builds servers.
const Server = () => (
  <group>
    <RoundedBox args={[0.6, 1, 0.55]} radius={0.04} smoothness={3} position={[0, 0.5, 0]}>
      <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.25} />
    </RoundedBox>
    {[0.2, 0.38, 0.56, 0.74].map((y, i) => (
      <mesh key={y} position={[0, y, 0.28]}>
        <boxGeometry args={[0.46, 0.07, 0.01]} />
        <meshStandardMaterial color={i % 2 ? '#3b4651' : '#01A982'} emissive={i % 2 ? '#000000' : '#01A982'} emissiveIntensity={0.9} />
      </mesh>
    ))}
  </group>
);

// Bloomberg's terminal: amber text on black, with its keyboard.
const terminalScreen = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#05070a';
  ctx.fillRect(0, 0, 256, 160);
  ctx.font = '600 15px monospace';
  const rows = ['MARKETS <GO>', 'EQUITY', 'FIXED INCOME', 'COMMODITIES', 'DATA', 'NEWS <GO>'];
  rows.forEach((row, i) => {
    ctx.fillStyle = i === 0 ? '#ffb000' : i % 2 ? '#f5f5f5' : '#ffb000';
    ctx.fillText(row, 14, 26 + i * 23);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};
const Terminal = () => {
  const screen = useMemo(terminalScreen, []);
  return (
    <group>
      <RoundedBox args={[1, 0.64, 0.07]} radius={0.03} smoothness={3} position={[0, 0.66, 0]}>
        <meshStandardMaterial color={DARK} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.66, 0.037]}>
        <planeGeometry args={[0.9, 0.55]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.2, -0.02]}>
        <boxGeometry args={[0.08, 0.3, 0.06]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.3} />
      </mesh>
      <RoundedBox args={[0.9, 0.05, 0.3]} radius={0.02} position={[0, 0.03, 0.34]}>
        <meshStandardMaterial color="#2a323a" roughness={0.5} />
      </RoundedBox>
    </group>
  );
};

// USI sells insurance: the umbrella.
const Umbrella = () => (
  <group>
    <mesh position={[0, 0.95, 0]}>
      <coneGeometry args={[0.62, 0.34, 8, 1, true]} />
      <meshStandardMaterial color="#0B4EA2" roughness={0.45} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[0.022, 0.022, 0.95, 12]} />
      <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
    </mesh>
    <mesh position={[0.09, 0.05, 0]} rotation={[0, 0, Math.PI]}>
      <torusGeometry args={[0.09, 0.025, 10, 24, Math.PI]} />
      <meshStandardMaterial color={DARK} roughness={0.5} />
    </mesh>
  </group>
);

// Carnegie Mellon: a graduation cap with a CMU-red tassel.
const GradCap = () => (
  <group>
    <mesh position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0.3, 0.33, 0.3, 32]} />
      <meshStandardMaterial color={DARK} roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.38, 0]} rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry args={[0.9, 0.05, 0.9]} />
      <meshStandardMaterial color={DARK} roughness={0.55} />
    </mesh>
    <mesh position={[0, 0.42, 0]}>
      <sphereGeometry args={[0.04, 12, 10]} />
      <meshStandardMaterial color="#C41230" />
    </mesh>
    <mesh position={[0.45, 0.24, 0.22]}>
      <boxGeometry args={[0.04, 0.3, 0.04]} />
      <meshStandardMaterial color="#C41230" roughness={0.6} />
    </mesh>
  </group>
);

// Costco: the shopping cart.
const Cart = () => {
  const panel = (args, position) => (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.35} />
    </mesh>
  );
  return (
    <group position={[-0.05, 0, 0]}>
      {panel([0.8, 0.03, 0.5], [0, 0.28, 0])}
      {panel([0.8, 0.4, 0.03], [0, 0.48, 0.25])}
      {panel([0.8, 0.4, 0.03], [0, 0.48, -0.25])}
      {panel([0.03, 0.4, 0.5], [-0.4, 0.48, 0])}
      {panel([0.03, 0.4, 0.5], [0.4, 0.48, 0])}
      {panel([0.03, 0.3, 0.03], [0.48, 0.78, 0.22])}
      {panel([0.03, 0.3, 0.03], [0.48, 0.78, -0.22])}
      <mesh position={[0.5, 0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.52, 12]} />
        <meshStandardMaterial color="#E31837" roughness={0.4} />
      </mesh>
      {[[-0.32, 0.2], [-0.32, -0.2], [0.32, 0.2], [0.32, -0.2]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.07, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
          <meshStandardMaterial color={DARK} roughness={0.6} />
        </mesh>
      ))}
      {panel([0.03, 0.22, 0.03], [-0.32, 0.18, 0.2])}
      {panel([0.03, 0.22, 0.03], [-0.32, 0.18, -0.2])}
      {panel([0.03, 0.22, 0.03], [0.32, 0.18, 0.2])}
      {panel([0.03, 0.22, 0.03], [0.32, 0.18, -0.2])}
    </group>
  );
};

// ToolAndMore sold power tools: a cordless drill.
const Drill = () => (
  <group rotation={[0, 0.3, 0]}>
    <RoundedBox args={[0.62, 0.24, 0.22]} radius={0.07} smoothness={4} position={[0, 0.78, 0]}>
      <meshStandardMaterial color="#F2B705" roughness={0.45} />
    </RoundedBox>
    <mesh position={[0.4, 0.78, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.07, 0.09, 0.18, 20]} />
      <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.3} />
    </mesh>
    <mesh position={[0.6, 0.78, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.018, 0.018, 0.24, 10]} />
      <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.25} />
    </mesh>
    <RoundedBox args={[0.18, 0.46, 0.18]} radius={0.05} smoothness={4} position={[-0.08, 0.44, 0]} rotation={[0, 0, -0.18]}>
      <meshStandardMaterial color={DARK} roughness={0.6} />
    </RoundedBox>
    <RoundedBox args={[0.36, 0.16, 0.28]} radius={0.04} smoothness={4} position={[-0.12, 0.1, 0]}>
      <meshStandardMaterial color={DARK} roughness={0.5} />
    </RoundedBox>
    <mesh position={[-0.12, 0.185, 0]}>
      <boxGeometry args={[0.37, 0.02, 0.29]} />
      <meshStandardMaterial color="#F2B705" roughness={0.45} />
    </mesh>
  </group>
);

export const ITEMS = { server: Server, terminal: Terminal, umbrella: Umbrella, gradcap: GradCap, cart: Cart, drill: Drill };
// How tall each model is, so the logo card can float just above it.
export const ITEM_HEIGHT = { server: 1, terminal: 1, umbrella: 1.12, gradcap: 0.45, cart: 0.95, drill: 0.9 };
