import { siteContent } from '../../content/siteContent';
import { ProjectCaseStudy } from './ProjectCaseStudy';

export function EnterpriseProject() {
  const project = siteContent.projects.find(({ id }) => id === 'project-04');
  if (!project) return null;

  return (
    <ProjectCaseStudy project={project}>
      <p>在线测试入口已提供，项目状态为企业测试版。</p>
      <p>工作范围：前端开发 → 辅助后端接口对接 → 传感器接入调试 → 联动控制调试。</p>
      <p lang="en">FRONTEND DEVELOPMENT · API INTEGRATION SUPPORT · SENSOR & CONTROL TESTING</p>
    </ProjectCaseStudy>
  );
}
