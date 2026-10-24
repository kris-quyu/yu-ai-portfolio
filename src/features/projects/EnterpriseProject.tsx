import { siteContent } from '../../content/siteContent';
import { resolveMediaUrl } from '../../lib/media';
import { ProjectCaseStudy } from './ProjectCaseStudy';
import { ProjectMediaGallery } from './ProjectMediaGallery';

export function EnterpriseProject() {
  const project = siteContent.projects.find(({ id }) => id === 'project-04');
  if (!project) return null;

  return (
    <ProjectCaseStudy project={project} lead={
      <div>
        <p>企业测试版 · 设备联调阶段 / TEST VERSION · DEVICE INTEGRATION TESTING</p>
        <ProjectMediaGallery nativeAspect items={[{
          src: resolveMediaUrl('media/projects/project-04/water-monitoring-dashboard.webp'),
          alt: '金梦湾水质监测平台测试界面',
          caption: '企业测试环境界面截图，展示水质指标、趋势图与设备控制布局；截图中 PLC 反馈尚在联调。',
        }]} />
      </div>
    }>
      <p>在线测试入口已提供，项目状态为企业测试版。</p>
      <p>工作范围：前端开发 → 辅助后端接口对接 → 传感器接入调试 → 联动控制调试。</p>
      <p lang="en">FRONTEND DEVELOPMENT · API INTEGRATION SUPPORT · SENSOR & CONTROL TESTING</p>
    </ProjectCaseStudy>
  );
}
