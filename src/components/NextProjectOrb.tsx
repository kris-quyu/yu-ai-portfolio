import type { Project } from "../data/projects";
import ProjectCoverPreview from "./ProjectCoverPreview";

type NextProjectOrbProps = {
  project: Project;
  onClick: () => void;
};

export default function NextProjectOrb({ project, onClick }: NextProjectOrbProps) {
  return (
    <button className="next-orb" type="button" onClick={onClick} aria-label={`下一个项目：${project.title}`}>
      <ProjectCoverPreview project={project} compact />
      <span>Next</span>
    </button>
  );
}
