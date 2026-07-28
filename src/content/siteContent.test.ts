import { describe, expect, it } from 'vitest';
import { siteContent } from './siteContent';

describe('siteContent', () => {
  it('contains the approved five-section story', () => {
    expect(siteContent.navigation.map((item) => item.id)).toEqual([
      'profile',
      'film',
      'system',
      'capabilities',
      'contact',
    ]);
    expect(siteContent.capabilities).toHaveLength(3);
    expect(siteContent.contact.phone).toBe('13123986103');
    expect(siteContent.contact.email).toBe('1282736393@qq.com');
  });

  it('excludes rejected resume content', () => {
    const serialized = JSON.stringify(siteContent);

    expect(serialized).not.toContain('4年工作经验');
    expect(serialized).not.toContain('4 年工作经验');
    expect(serialized).not.toContain('下载简历');
  });
});
