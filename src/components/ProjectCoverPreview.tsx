import type { Project } from "../data/projects";

type ProjectCoverPreviewProps = {
  project: Project;
  compact?: boolean;
};

function VideoPreview() {
  return (
    <div className="cover-video">
      <div className="cover-video__main" />
      <div className="cover-video__timeline">
        <span />
        <span />
        <span />
      </div>
      <div className="cover-video__side">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function WorkflowPreview() {
  return (
    <div className="cover-workflow">
      <span />
      <span />
      <span />
      <span />
      <i />
      <i />
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="cover-dashboard">
      <div className="cover-dashboard__chart" />
      <div className="cover-dashboard__meters">
        <span />
        <span />
        <span />
      </div>
      <div className="cover-dashboard__grid">
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

export default function ProjectCoverPreview({ project, compact = false }: ProjectCoverPreviewProps) {
  const Preview =
    project.coverType === "workflow"
      ? WorkflowPreview
      : project.coverType === "dashboard"
        ? DashboardPreview
        : VideoPreview;

  return (
    <div className={`project-cover project-cover--${project.theme}${compact ? " is-compact" : ""}`}>
      <div className="project-cover__top">
        <span>{project.id}</span>
        <span>{project.category}</span>
      </div>
      <div className="project-cover__stage">
        <Preview />
      </div>
      <div className="project-cover__bottom">
        <span>{project.coverType}</span>
        <span>{project.year}</span>
      </div>
    </div>
  );
}
