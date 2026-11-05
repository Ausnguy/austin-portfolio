import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

// A project's slide deck, paged inline (view only). Its own chunk, so pdf.js loads only on pages that have a deck.
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const PdfDeck = ({ src, poster }) => {
  const canvasRef = useRef(null);
  const pdfRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRendered, setHasRendered] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let loadingTask;
    let isActive = true;

    const loadPdf = async () => {
      try {
        loadingTask = pdfjsLib.getDocument({ url: src, disableWorker: true });
        const pdf = await loadingTask.promise;
        if (!isActive) {
          pdf.destroy();
          return;
        }
        pdfRef.current = pdf;
        setTotalPages(pdf.numPages);
      } catch (error) {
        if (isActive) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isActive = false;
      loadingTask?.destroy();
      pdfRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    let renderTask;
    let isActive = true;

    const renderPage = async () => {
      if (!pdfRef.current || !canvasRef.current) return;

      try {
        setIsLoading(true);
        const page = await pdfRef.current.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = canvasRef.current;
        const nextCanvas = document.createElement('canvas');
        nextCanvas.width = viewport.width;
        nextCanvas.height = viewport.height;
        renderTask = page.render({
          canvasContext: nextCanvas.getContext('2d'),
          viewport,
        });
        await renderTask.promise;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.getContext('2d').drawImage(nextCanvas, 0, 0);
        if (isActive) {
          setHasRendered(true);
          setIsLoading(false);
        }
      } catch (error) {
        if (isActive && error?.name !== 'RenderingCancelledException') {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    renderPage();
    return () => {
      isActive = false;
      renderTask?.cancel();
    };
  }, [pageNumber, totalPages]);

  return (
    <div className="relative aspect-[2160/1214] w-full bg-stage">
      {!hasRendered && (
        <img
          src={`${import.meta.env.BASE_URL}${poster}`}
          alt="First slide of the project PDF"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        />
      )}
      {isLoading && !hasError && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-stage/80 px-3 py-1 font-sans text-xs font-medium text-white">
          Loading slide…
        </span>
      )}
      {hasError && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-stage/80 px-3 py-1 text-center font-sans text-xs font-medium text-white">
          The slides couldn’t load here.
        </div>
      )}
      <canvas
        ref={canvasRef}
        aria-label={`Slide ${pageNumber} of the project PDF`}
        className={`pointer-events-none absolute inset-0 h-full w-full object-contain ${hasRendered && !hasError ? 'block' : 'hidden'}`}
      />
      {totalPages > 1 && !hasError && (
        <div className="pointer-events-none absolute inset-0 z-20">
          <button
            type="button"
            disabled={pageNumber === 1 || totalPages === 0}
            onClick={() => setPageNumber((currentPage) => Math.max(1, currentPage - 1))}
            aria-label="Previous slide"
            className="pointer-events-auto absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/40 bg-stage/80 font-sans text-xl text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            ←
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 border border-white/40 bg-stage/80 px-3 py-1 font-sans text-xs text-white">
            {pageNumber} / {totalPages}
          </span>
          <button
            type="button"
            disabled={pageNumber === totalPages || totalPages === 0}
            onClick={() => setPageNumber((currentPage) => Math.min(totalPages, currentPage + 1))}
            aria-label="Next slide"
            className="pointer-events-auto absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/40 bg-stage/80 font-sans text-xl text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfDeck;
