[![threejs-fps-01](https://make.fun/badge/threejs-fps-01.svg)](https://make.fun/bounty/threejs-fps-01)
[![rank](https://make.fun/badge/threejs-fps-01/Van7art/threejs-fps-01-entry/rank.svg)](https://make.fun/bounty/threejs-fps-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=threejs-fps-01)
[![reward](https://make.fun/badge/threejs-fps-01/Van7art/threejs-fps-01-entry/reward.svg)](https://make.fun/bounty/threejs-fps-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=threejs-fps-01)

# Sunscorch Yard — a three.js tactical FPS

A day-time desert refinery, five against five. The Sand Vipers attack, the
Dune Wardens defend. Plant the charge at the Pump House (Site A) or the Tank
Farm (Site B) — or wipe the enemy team. First to 7 rounds takes the yard.

Play it: `node serve.ts`, then open http://localhost:8080.

## The game

- **Round-based tactics:** 5v5, best of 13, sides swap after round 6. Freeze
  time with a buy menu, 100-second rounds, a 35-second charge timer.
- **Objective:** attackers plant the charge (hold E on a site, 4 s);
  defenders defuse it (hold E, 5 s). The charge drops where its carrier
  falls and can be picked back up.
- **Economy:** $800 to start, $300 a kill, $3250 a round win, $1900 a loss
  plus a streak bonus. Bots run the same economy and buy what they can
  afford.
- **Arsenal:** Duster pistol, Sidewinder SMG, Boomer shotgun, Longhorn
  rifle, Rattler DMR — plus Sandcharge HE and Flashpot flash grenades.
- **Gunplay:** hitscan with distance falloff and headshot multipliers,
  spread that grows while moving and firing, recoil that recovers, ADS
  zoom, crouching, jumping, and acceleration-based movement with map
  collision.
- **Bots:** waypoint routes through three lanes, hold positions, rotations
  to a planted site, investigation of heard gunfire, burst fire with
  distance- and movement-based miss chance, and strafing while engaged.
- **Map:** an original 56 x 40 m refinery — container lanes, a gantry over
  mid, pump rigs, storage tanks, and a hazard-marked Tank Farm. All
  textures are painted in code; nothing loads over the network.
- **Sound:** every shot, reload, beep and explosion is synthesized with
  the Web Audio API. No audio files ship with the game.

## Controls

| Key | Action |
| --- | ------ |
| W A S D | Move |
| Mouse | Look (click to lock) |
| Click | Fire |
| Right mouse | Aim down sights |
| R | Reload |
| Ctrl / C | Crouch |
| Space | Jump |
| B | Buy menu (freeze time) |
| 1–7 | Buy weapon / grenade |
| 6 / 7 | Throw HE / flash grenade |
| E (hold) | Plant / defuse the charge |

## Files

- `main.ts` — the entrypoint: copies `game/` and `screenshots/` to the
  output and writes `dossier.json` with the vendored make.fun library.
- `game/index.html` — the page, HUD and overlays.
- `game/src/main.js` — bootstrap, input, fixed-step loop, ray tests.
- `game/src/sim.js` — rounds, economy, player movement and shooting.
- `game/src/bots.js` — bot AI: routes, holds, rotations, burst fire.
- `game/src/map.js` — the refinery, colliders, waypoints, line of sight.
- `game/src/weapons.js` — weapon and grenade tables and ballistics.
- `game/src/entities.js` — fighter meshes, hitboxes, view model.
- `game/src/render.js` — renderer, sun, sky, tracers, effects.
- `game/src/hud.js` — HUD, buy menu, killfeed, banners.
- `game/src/audio.js` — procedural Web Audio sounds.
- `game/src/palette.js` — colours and canvas-painted textures.
- `game/src/rng.js` — seeded randomness.
- `game/vendor/three/` — three.js 0.187.0, vendored byte for byte.

## Screenshots

`?shot=start`, `?shot=play` and `?shot=end` stage the cover, mid-round and
round-end scenes. `?selftest=1` runs scripted checks in the browser and
reports them in `#selftest` and the page title.

Built for [make.fun](https://make.fun/r/4e96xqxt) — referral code `4e96xqxt`.
