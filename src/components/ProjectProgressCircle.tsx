import type { CSSProperties } from "react";

type ProjectProgressCircleProps = {
  activeIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function ProjectProgressCircle({
  activeIndex,
  total,
  onPrev,
  onNext,
}: ProjectProgressCircleProps) {
  const progress = ((activeIndex + 1) / total) * 100;

  return (
    <div className="progress-circle" style={{ "--progress": `${progress}%` } as CSSProperties}>
      <div className="progress-circle__inner">
        <span>
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div>
          <button type="button" onClick={onPrev} aria-label="上一个项目">
            ←
          </button>
          <button type="button" onClick={onNext} aria-label="下一个项目">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
