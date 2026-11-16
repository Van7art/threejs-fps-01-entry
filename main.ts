// Sunscorch Yard — a three.js tactical FPS entry for threejs-fps-01.
// Node 22, standard library only. The game itself is the static files under
// game/; this program only hands them in: it copies game/ and screenshots/
// from beside this file into the output directory and writes dossier.json,
// the summary the judge reads, with the vendored make.fun library.
//
// Play it locally with `node serve.ts` (http://localhost:8080), then run:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-threejs.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const gameDir = join(repoRoot, 'game');
if (!existsSync(gameDir)) {
  throw new Error(`no game/ beside main.ts (${gameDir}): the game is the static files under game/`);
}

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outputDir, 'game'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// Same caps the scorer applies: the dossier text cap shapes the bytes, the
// rest refuse an entry the scorer would refuse (at most 4 screenshots, each
// at most 256 KiB; game/ at most 993 entries and 48 MiB in all).
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
  }),
);
