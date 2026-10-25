import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Builds a canvas texture with one short label, used for the column letters on the chart floor.
const labelSprite = (text, color) => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = '600 40px "IBM Plex Mono", monospace';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 64, 32);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }));
  sprite.scale.set(0.9, 0.45, 1);
  return sprite;
};

const cssColor = (name) => {
  const rgb = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
  return new THREE.Color(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
};

// 3D column chart, Excel style: one column per value, the highlighted index in the accent color.
const Chart3D = ({ values, labels, highlight = -1, label }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(9, 7.5, 12.5);
    camera.lookAt(0, 1.9, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const sun = new THREE.DirectionalLight(0xffffff, 1.25);
    sun.position.set(5, 10, 7);
    scene.add(sun);

    const group = new THREE.Group();
    scene.add(group);
    const max = Math.max(...values);
    const muted = cssColor('--muted');
    const accent = cssColor('--accent');
    const base = cssColor('--muted').lerp(cssColor('--paper'), 0.35);
    const gap = 1.15;
    const columns = values.map((v, i) => {
      const height = Math.max(0.12, (v / max) * 4.6);
      const geometry = new THREE.BoxGeometry(0.78, height, 0.78);
      geometry.translate(0, height / 2, 0);
      const material = new THREE.MeshStandardMaterial({ color: i === highlight ? accent : base, roughness: 0.6 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (i - (values.length - 1) / 2) * gap;
      mesh.scale.y = reduceMotion ? 1 : 0.001;
      group.add(mesh);
      const letter = labelSprite(labels[i], `#${muted.getHexString()}`);
      letter.position.set(mesh.position.x, 0.02, 0.95);
      group.add(letter);
      return mesh;
    });
    const grid = new THREE.GridHelper(values.length * gap + 1, values.length + 1, muted, muted);
    grid.material.transparent = true;
    grid.material.opacity = 0.25;
    group.add(grid);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // Columns grow when the chart scrolls into view; the loop only runs while it is visible.
    let start = null;
    const tick = (now) => {
      if (start === null) start = now;
      const t = (now - start) / 1000;
      columns.forEach((c, i) => {
        const p = Math.min(1, Math.max(0, (t - i * 0.07) / 0.8));
        c.scale.y = 1 - Math.pow(1 - p, 3);
      });
      group.rotation.y = Math.sin(t * 0.3) * 0.18 - 0.15;
      renderer.render(scene, camera);
    };
    const visible = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduceMotion) {
        renderer.setAnimationLoop(tick);
      } else {
        renderer.setAnimationLoop(null);
        renderer.render(scene, camera);
      }
    });
    visible.observe(canvas);
    renderer.render(scene, camera);

    return () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      visible.disconnect();
      scene.traverse((o) => {
        o.geometry?.dispose();
        o.material?.map?.dispose();
        o.material?.dispose();
      });
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [values, labels, highlight]);

  return <canvas ref={canvasRef} role="img" aria-label={label} className="block w-full h-full" />;
};

export default Chart3D;
