import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectFlow } from './ProjectFlow';

describe('ProjectFlow', () => {
  it('renders the workflow in production order and distinguishes truthful statuses', () => {
    render(<ProjectFlow />);

    expect(screen.getByRole('heading', { name: /AI CONTENT WORKFLOW/ })).toBeInTheDocument();
    expect(screen.getByText('IN DEVELOPMENT')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'AI 内容生产流程' })).toHaveTextContent(
      'Product InputAI AnalysisContent StrategyScriptStoryboardAI ImageAI VideoEditingOutput',
    );
    expect(screen.getByRole('heading', { name: 'COMPLETED / 已实践' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'EXPERIMENTAL / 实验中' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PLANNED / 计划中' })).toBeInTheDocument();
    expect(screen.getByText(/FFmpeg.*尚未达到稳定、可复用/)).toBeInTheDocument();
    expect(screen.getByText('API 接入')).toBeInTheDocument();
  });
});
