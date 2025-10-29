import { jsx } from 'react/jsx-runtime';
import { c as cn } from './utils-CZo72ztR.mjs';
import { s as seedToKey } from './index-CWNUk7Yv.mjs';
import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { b as useAlgorithmService } from './router-Dgt9epnn.mjs';

const AlgorithmBitmap = ({
  algorithmId,
  seed,
  size,
  scale = 1,
  onClick,
  version = 0,
  className,
  style
}) => {
  const [ready, setIsReady] = useState(false);
  const service = useAlgorithmService();
  const canvasRef = useRef(null);
  const drawingSize = useMemo(() => size * scale, [size, scale]);
  const handleCanvasClick = useCallback(
    (e) => {
      if (e.altKey && canvasRef.current) {
        const link = document.createElement("a");
        link.download = `${algorithmId}_${seed.join("-")}.png`;
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
        setTimeout(() => {
          link.remove();
        }, 0);
      } else if (onClick) {
        onClick();
      }
    },
    [algorithmId, seed, onClick]
  );
  useEffect(() => {
    if (canvasRef.current === null) return;
    setIsReady(false);
    const abortController = new AbortController();
    service.renderWithQueue(algorithmId, drawingSize, [...seed], {
      signal: abortController.signal
    }).then((bitmap) => {
      if (!bitmap) return;
      const context = canvasRef.current.getContext("2d");
      context.clearRect(0, 0, drawingSize, drawingSize);
      context.drawImage(bitmap, 0, 0, drawingSize, drawingSize);
      setIsReady(true);
    }).catch((error) => {
      if (error.name === "AbortError") {
        console.log("abort error");
      }
    });
    return () => {
      abortController.abort();
    };
  }, [seed, algorithmId, size, drawingSize, service, version]);
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      className: cn(
        "bg-white transition-opacity",
        {
          "opacity-0": !ready,
          "cursor-pointer": !!onClick
        },
        className
      ),
      onClick: handleCanvasClick,
      ref: canvasRef,
      width: drawingSize,
      height: drawingSize,
      title: `${seedToKey(seed)} (Alt+Click to download)`,
      style: style ?? { width: size, height: size }
    }
  );
};

export { AlgorithmBitmap as A };
//# sourceMappingURL=AlgorithmBitmap-CIcD_7lU.mjs.map
