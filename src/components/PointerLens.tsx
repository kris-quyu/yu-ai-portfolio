import type { RefObject } from "react";
import { useEffect, useRef } from "react";

type PointerLensProps = {
  containerRef: RefObject<HTMLElement | null>;
  className?: string;
};

export default function PointerLens({ containerRef, className = "" }: PointerLensProps) {
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const lens = lensRef.current;
    const scanLayer = container?.querySelector<HTMLElement>("[data-lens-scan]");
    const disableMotion =
      window.matchMedia("(max-width: 900px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!container || !lens || disableMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      lens.style.left = `${x}px`;
      lens.style.top = `${y}px`;
      lens.style.opacity = "0.92";
      container.style.setProperty("--lens-x", `${x}px`);
      container.style.setProperty("--lens-y", `${y}px`);
      container.style.setProperty("--lens-opacity", "1");
      if (scanLayer) scanLayer.style.opacity = "1";
      lens.dataset.visible = "true";
      container.dataset.lensVisible = "true";
    };

    const handlePointerLeave = () => {
      lens.style.opacity = "0";
      container.style.setProperty("--lens-opacity", "0");
      if (scanLayer) scanLayer.style.opacity = "0";
      lens.dataset.visible = "false";
      container.dataset.lensVisible = "false";
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [containerRef]);

  return (
    <div
      className={`pointer-lens ${className}`.trim()}
      data-visible="false"
      ref={lensRef}
      aria-hidden="true"
    >
      <div className="pointer-lens__surface" />
    </div>
  );
}
