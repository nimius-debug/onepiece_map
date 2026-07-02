/* Single wave definition shared by the water shader (GLSL, generated)
   and the ship (JS) — never hand-edit the shader copy. */

import { CALM_N_Z, CALM_S_Z } from '../constants/world3d'
import { terrainHeight } from './heightfield'

export const WAVES = [
  { dx: 1.0,  dz: 0.0, freq: 0.11, speed: 0.8,  amp: 0.30 },
  { dx: 0.3,  dz: 1.0, freq: 0.15, speed: 1.05, amp: 0.22 },
  { dx: 0.7,  dz: 0.7, freq: 0.06, speed: 0.55, amp: 0.40 },
  { dx: -0.6, dz: 0.8, freq: 0.28, speed: 1.6,  amp: 0.08 },
]

const smoothstep = (e0, e1, v) => {
  const t = Math.min(1, Math.max(0, (v - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

// Raw wave sum, before shore/calm damping
const rawWave = (x, z, t) => {
  let h = 0
  for (const w of WAVES) {
    h += w.amp * Math.sin((x * w.dx + z * w.dz) * w.freq + t * w.speed)
  }
  return h
}

/* Water surface height at (x, z) — used by the ship so it rides the
   exact same surface the shader displaces */
export const waveHeight = (x, z, t) => {
  let h = rawWave(x, z, t)
  if (z > CALM_N_Z && z < CALM_S_Z) h *= 0.15   // Calm Belt is calm
  const depth = -terrainHeight(x, z)
  h *= smoothstep(0.3, 2.5, depth)               // swell dies near shore
  return h
}

/* GLSL equivalent, generated from the same WAVES array.
   Declares: float rawWave(vec2 p, float t) */
export const GLSL_WAVES = /* glsl */ `
  float rawWave(vec2 p, float t) {
    float h = 0.0;
${WAVES.map((w) =>
  `    h += ${w.amp.toFixed(3)} * sin((p.x * ${w.dx.toFixed(2)} + p.y * ${w.dz.toFixed(2)}) * ${w.freq.toFixed(3)} + t * ${w.speed.toFixed(3)});`
).join('\n')}
    return h;
  }
`
