import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const DESKTOP_FRAME_COUNT = 120;
const MOBILE_FRAME_COUNT = 96;
const WEBP_ARGS = ['-c:v', 'libwebp', '-quality', '78', '-compression_level', '4'];

export function frameFileName(index) {
  return `frame-${String(index).padStart(4, '0')}.webp`;
}

export function buildFrameArgs(input, fps, width, outputPattern) {
  return [
    '-y', '-i', input,
    '-vf', `fps=${fps},scale=${width}:-2:force_original_aspect_ratio=decrease:flags=lanczos`,
    ...WEBP_ARGS,
    outputPattern,
  ];
}

function parseOptions(args) {
  const options = {};

  for (let index = 0; index < args.length; index += 2) {
    const option = args[index];
    const value = args[index + 1];
    if (!['--portrait', '--film', '--workflow'].includes(option) || !value) {
      throw new Error('Usage: prepare-assets --portrait <path> --film <path> --workflow <path>');
    }
    options[option.slice(2)] = value;
  }

  for (const name of ['portrait', 'film', 'workflow']) {
    if (!options[name]) throw new Error(`Missing required --${name} path.`);
    if (!existsSync(options[name])) throw new Error(`Input file does not exist: ${options[name]}`);
  }

  return options;
}

function runFfmpeg(args) {
  const result = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`FFmpeg exited with status ${result.status}.`);
}

function recreateDirectory(path) {
  rmSync(path, { recursive: true, force: true });
  mkdirSync(path, { recursive: true });
}

function countFrames(directory) {
  return readdirSync(directory).filter((file) => /^frame-\d{4}\.webp$/.test(file)).length;
}

function buildStillArgs(input, timestamp, width, output) {
  return [
    '-y', '-ss', timestamp, '-i', input,
    '-frames:v', '1',
    '-vf', `scale=${width}:-2:force_original_aspect_ratio=decrease:flags=lanczos`,
    ...WEBP_ARGS,
    output,
  ];
}

export function prepareAssets({ portrait, film, workflow }, projectRoot = process.cwd()) {
  const mediaRoot = join(projectRoot, 'public', 'media');
  const portraitRoot = join(mediaRoot, 'portrait');
  const desktopRoot = join(portraitRoot, 'desktop');
  const mobileRoot = join(portraitRoot, 'mobile');
  const filmRoot = join(mediaRoot, 'film');
  const workflowRoot = join(mediaRoot, 'workflow');

  recreateDirectory(desktopRoot);
  recreateDirectory(mobileRoot);
  mkdirSync(filmRoot, { recursive: true });
  mkdirSync(workflowRoot, { recursive: true });

  runFfmpeg(buildFrameArgs(portrait, 15, 1600, join(desktopRoot, 'frame-%04d.webp')));
  runFfmpeg(buildFrameArgs(portrait, 12, 960, join(mobileRoot, 'frame-%04d.webp')));
  runFfmpeg(buildStillArgs(portrait, '7.2', 1600, join(portraitRoot, 'poster.webp')));

  const optimizedFilm = join(filmRoot, 'ai-product-film.mp4');
  runFfmpeg([
    '-y', '-i', film,
    '-c:v', 'libx264', '-crf', '23', '-c:a', 'aac', '-b:a', '128k',
    '-movflags', '+faststart',
    optimizedFilm,
  ]);
  runFfmpeg(buildStillArgs(optimizedFilm, '20', 1600, join(filmRoot, 'poster.webp')));
  runFfmpeg([
    '-y', '-i', workflow,
    '-frames:v', '1',
    '-vf', 'scale=1600:-2:force_original_aspect_ratio=decrease:flags=lanczos',
    ...WEBP_ARGS,
    join(workflowRoot, 'comfyui-workflow.webp'),
  ]);

  const desktopCount = countFrames(desktopRoot);
  const mobileCount = countFrames(mobileRoot);
  if (desktopCount !== DESKTOP_FRAME_COUNT || mobileCount !== MOBILE_FRAME_COUNT) {
    throw new Error(
      `Unexpected portrait frame count: desktop=${desktopCount} (expected ${DESKTOP_FRAME_COUNT}), mobile=${mobileCount} (expected ${MOBILE_FRAME_COUNT}).`,
    );
  }

  const manifest = {
    portrait: {
      poster: 'media/portrait/poster.webp',
      desktop: { pattern: 'media/portrait/desktop/frame-%04d.webp', count: DESKTOP_FRAME_COUNT },
      mobile: { pattern: 'media/portrait/mobile/frame-%04d.webp', count: MOBILE_FRAME_COUNT },
    },
    film: {
      src: 'media/film/ai-product-film.mp4',
      poster: 'media/film/poster.webp',
    },
    workflow: {
      src: 'media/workflow/comfyui-workflow.webp',
    },
  };
  writeFileSync(join(mediaRoot, 'media-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  return { desktopCount, mobileCount, mediaRoot };
}

function main() {
  const options = parseOptions(process.argv.slice(2));
  const result = prepareAssets(options);
  console.log(`Prepared media: ${result.desktopCount} desktop frames and ${result.mobileCount} mobile frames.`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
