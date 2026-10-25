import { useCallback, useEffect, useRef, useState } from 'react';

export { MODEL_NAME, MODEL_DOWNLOAD_MB } from './constants';

// Picks the fastest way this browser can run the model: WebGPU with 16-bit floats (483 MB of weights),
// WebGPU without them (q4), else 8-bit on the CPU via WebAssembly (512 MB).
const detectRuntime = async () => {
  try {
    const adapter = await navigator.gpu?.requestAdapter();
    if (adapter) return { device: 'webgpu', dtype: adapter.features.has('shader-f16') ? 'q4f16' : 'q4' };
  } catch {
    // Fall through to WebAssembly.
  }
  return { device: 'wasm', dtype: 'q8' };
};

// Loads the model in a Web Worker on demand and streams answers back.
export const useLocalModel = () => {
  const workerRef = useRef(null);
  const filesRef = useRef(new Map());
  const pendingRef = useRef(new Map());
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [progress, setProgress] = useState(0);
  const [device, setDevice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => () => workerRef.current?.terminate(), []);

  const getWorker = () => {
    if (workerRef.current) return workerRef.current;
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        filesRef.current.set(data.file, { loaded: data.done ? data.total : data.loaded, total: data.total });
        let loaded = 0;
        let total = 0;
        filesRef.current.forEach((f) => {
          loaded += f.loaded;
          total += f.total;
        });
        if (total > 0) setProgress(loaded / total);
      } else if (data.type === 'ready') {
        setProgress(1);
        setStatus('ready');
      } else if (data.type === 'token') {
        pendingRef.current.get(data.id)?.onToken(data.text);
      } else if (data.type === 'done') {
        pendingRef.current.get(data.id)?.resolve();
        pendingRef.current.delete(data.id);
      } else if (data.type === 'error') {
        if (data.id && pendingRef.current.has(data.id)) {
          pendingRef.current.get(data.id).reject(new Error(data.message));
          pendingRef.current.delete(data.id);
        } else {
          setError(data.message);
          setStatus('error');
        }
      }
    };
    workerRef.current = worker;
    return worker;
  };

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    setProgress(0);
    filesRef.current.clear();
    const runtime = await detectRuntime();
    setDevice(runtime.device);
    getWorker().postMessage({ type: 'load', ...runtime });
  }, []);

  const generate = useCallback((messages, onToken) => {
    const id = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      pendingRef.current.set(id, { resolve, reject, onToken });
      getWorker().postMessage({ type: 'generate', id, messages });
    });
  }, []);

  return { status, progress, device, error, load, generate };
};
