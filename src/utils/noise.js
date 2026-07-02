/* Seeded 2D simplex noise + fBm helpers.
   Inline implementation (no deps) so the world is deterministic
   across sessions and works offline. */

// 32-bit seeded PRNG
export const mulberry32 = (seed) => {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* 2D simplex noise (Stefan Gustavson's method), permutation table
   seeded with mulberry32 so every load generates the same world */
const GRAD = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
]

const buildPerm = (seed) => {
  const rng = mulberry32(seed)
  const p = Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  const perm = new Uint8Array(512)
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  return perm
}

const PERM = buildPerm(1337)

const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6

export const simplex2 = (xin, yin) => {
  const s = (xin + yin) * F2
  const i = Math.floor(xin + s)
  const j = Math.floor(yin + s)
  const t = (i + j) * G2
  const x0 = xin - (i - t)
  const y0 = yin - (j - t)

  const i1 = x0 > y0 ? 1 : 0
  const j1 = x0 > y0 ? 0 : 1

  const x1 = x0 - i1 + G2
  const y1 = y0 - j1 + G2
  const x2 = x0 - 1 + 2 * G2
  const y2 = y0 - 1 + 2 * G2

  const ii = i & 255
  const jj = j & 255

  let n = 0
  let t0 = 0.5 - x0 * x0 - y0 * y0
  if (t0 > 0) {
    const g = GRAD[PERM[ii + PERM[jj]] & 7]
    t0 *= t0
    n += t0 * t0 * (g[0] * x0 + g[1] * y0)
  }
  let t1 = 0.5 - x1 * x1 - y1 * y1
  if (t1 > 0) {
    const g = GRAD[PERM[ii + i1 + PERM[jj + j1]] & 7]
    t1 *= t1
    n += t1 * t1 * (g[0] * x1 + g[1] * y1)
  }
  let t2 = 0.5 - x2 * x2 - y2 * y2
  if (t2 > 0) {
    const g = GRAD[PERM[ii + 1 + PERM[jj + 1]] & 7]
    t2 *= t2
    n += t2 * t2 * (g[0] * x2 + g[1] * y2)
  }
  return 70 * n // roughly [-1, 1]
}

export const fbm = (x, y, { octaves = 5, freq = 0.035, gain = 0.5, lacunarity = 2.0 } = {}) => {
  let amp = 1
  let f = freq
  let sum = 0
  let norm = 0
  for (let o = 0; o < octaves; o++) {
    sum += amp * simplex2(x * f, y * f)
    norm += amp
    amp *= gain
    f *= lacunarity
  }
  return sum / norm
}

// Ridged multifractal — sharp mountain crests
export const ridged = (x, y, { octaves = 4, freq = 0.06, gain = 0.5, lacunarity = 2.0 } = {}) => {
  let amp = 1
  let f = freq
  let sum = 0
  let norm = 0
  for (let o = 0; o < octaves; o++) {
    const r = 1 - Math.abs(simplex2(x * f, y * f))
    sum += amp * r * r
    norm += amp
    amp *= gain
    f *= lacunarity
  }
  return sum / norm // [0, 1]
}

/* Cheap hash-based value noise for GLSL (water foam break-up and
   normal perturbation only — never needs to match the JS noise) */
export const GLSL_NOISE = /* glsl */ `
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm2(vec2 p) {
    return 0.6667 * vnoise(p) + 0.3333 * vnoise(p * 2.13 + 17.7);
  }
`
