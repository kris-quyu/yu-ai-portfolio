export function frameFileName(index: number): string;

export function buildFrameArgs(
  input: string,
  fps: number,
  width: number,
  outputPattern: string,
): string[];

export function prepareAssets(
  inputs: { portrait: string; film: string; workflow: string },
  projectRoot?: string,
): { desktopCount: number; mobileCount: number; mediaRoot: string };
