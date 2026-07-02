/* The single source of truth for all land in the 3D world.
   terrainHeight(x, z) drives: the terrain mesh, the water shader's
   depth texture, marker anchoring, vegetation scatter, route draping,
   and ship grounding. */

import * as THREE from 'three'
import locationsData from '../data/locations.json'
import { fbm, ridged, mulberry32 } from '../utils/noise'
import {
  WORLD_W, WORLD_H, RL1_X, RL2_X, locTo3D, SKY_ISLANDS,
} from '../constants/world3d'

export const SEA_FLOOR = -7
export const WATER_LEVEL = 0

// Sea-level passes through the Red Line (lore: Reverse Mountain on RL1,
// the Fishman Island gap on RL2). Without these the voyage route would
// sail through a 26-unit mountain.
const RL_PASSES = { [RL1_X]: -6.6, [RL2_X]: -5.5 }

/* ── Continents: quartic-falloff blobs in the four Blues ─────────
   Placed at map corners/edges, clear of the 30 story locations
   (x ∈ [-166, 150], z ∈ [-32, 64]) and the Grand Line corridor. */
const CONTINENTS = [
  { x: -165, z: -85, r: 62, a: 11.0 },  // North Blue (NW)
  { x: -90,  z: -92, r: 40, a: 9.5  },  // North Blue secondary
  { x: 150,  z: -88, r: 58, a: 11.0 },  // South Blue (NE)
  { x: -175, z: 92,  r: 55, a: 10.5 },  // East Blue (SW)
  { x: -150, z: 78,  r: 34, a: 9.0  },  // East Blue secondary
  { x: 160,  z: 88,  r: 60, a: 11.0 },  // West Blue (SE)
  { x: 90,   z: 96,  r: 38, a: 9.5  },  // West Blue secondary
]

const continentAt = (xw, zw) => {
  let h = 0
  for (const c of CONTINENTS) {
    const dx = xw - c.x
    const dz = zw - c.z
    const d = Math.sqrt(dx * dx + dz * dz)
    if (d >= c.r) continue
    const k = 1 - d / c.r
    const k2 = k * k
    h += c.a * k2 * (2 - k) * (2 - k)
  }
  return h
}

/* ── Red Line: two continuous mountain cordilleras ─────────────── */
const redLineAt = (x, z) => {
  let h = 0
  for (const rlx of [RL1_X, RL2_X]) {
    // range meanders ±5 along its length
    const cx = rlx + 5 * fbm(z * 0.03, rlx, { freq: 1, octaves: 2 })
    const dx = x - cx
    if (Math.abs(dx) > 26) continue
    const base = Math.exp(-(dx * dx) / (2 * 7 * 7))
    const crest = 0.55 + 0.45 * ridged(z, rlx, { freq: 0.06, octaves: 4 })
    const zPass = RL_PASSES[rlx]
    const dz = z - zPass
    const pass = 1 - 0.96 * Math.exp(-(dz * dz) / (2 * 6 * 6))
    h += 26 * base * crest * pass
  }
  return h
}

/* ── Per-location island bumps ──────────────────────────────────
   Guarantee land under all 30 markers. Two-pass: measure base
   height at each location, then add just enough gaussian bump. */

const hashStr = (str) => {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const warp = (x, z) => {
  const xw = x + 16 * fbm(x, z, { freq: 0.012, octaves: 3 })
  const zw = z + 16 * fbm(x + 71.3, z + 113.7, { freq: 0.012, octaves: 3 })
  return [xw, zw]
}

const baseHeight = (x, z) => {
  const [xw, zw] = warp(x, z)
  return (
    SEA_FLOOR +
    1.5 * fbm(x, z, { freq: 0.02, octaves: 3 }) +
    continentAt(xw, zw) +
    redLineAt(x, z)
  )
}

const buildBumps = () => {
  const bumps = []
  for (const loc of locationsData.locations) {
    if (SKY_ISLANDS.has(loc.id)) continue          // floats in the sky
    if (loc.id === 'fishman-island') continue      // stays at seabed in the RL2 pass
    if (loc.id === 'reverse-mountain') continue    // IS the RL1 pass — a bump would plug the canal
    const [wx, , wz] = locTo3D(loc)
    const rng = mulberry32(hashStr(loc.id))
    const hBase = baseHeight(wx, wz)
    const a = Math.max(2.0, 3.2 - hBase)
    const sigma = 4.5 + 3.5 * rng()
    bumps.push({ x: wx, z: wz, a, sigma, cut: (3.5 * sigma) ** 2 })
    // offset secondary bump so islands aren't perfect circles
    const a2 = 0.6 * a
    const s2 = 0.8 * sigma
    bumps.push({
      x: wx + (rng() - 0.5) * 2 * sigma,
      z: wz + (rng() - 0.5) * 2 * sigma,
      a: a2, sigma: s2, cut: (3.5 * s2) ** 2,
    })
  }
  return bumps
}

const BUMPS = buildBumps()

const bumpsAt = (x, z) => {
  let h = 0
  for (const b of BUMPS) {
    const dx = x - b.x
    const dz = z - b.z
    const d2 = dx * dx + dz * dz
    if (d2 > b.cut) continue
    h += b.a * Math.exp(-d2 / (2 * b.sigma * b.sigma))
  }
  return h
}

const smoothstep = (e0, e1, v) => {
  const t = Math.min(1, Math.max(0, (v - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

/* ── The height function ────────────────────────────────────── */
export const terrainHeight = (x, z) => {
  let h = baseHeight(x, z) + bumpsAt(x, z)
  // detail noise masked to land so the open sea floor stays smooth
  const land = smoothstep(-2.5, 0.5, h)
  if (land > 0) {
    h += land * (
      2.2 * fbm(x, z, { freq: 0.045, octaves: 5 }) +
      1.4 * ridged(x, z, { freq: 0.11, octaves: 3 }) * smoothstep(3, 10, h)
    )
  }
  return h
}

export const isWater = (x, z) => terrainHeight(x, z) < -0.5

/* ── Location anchors: grounded marker positions ────────────── */
export const LOCATION_ANCHORS = (() => {
  const anchors = new Map()
  for (const loc of locationsData.locations) {
    const [wx, , wz] = locTo3D(loc)
    if (SKY_ISLANDS.has(loc.id)) {
      anchors.set(loc.id, { x: wx, y: 34, z: wz })
    } else if (loc.id === 'fishman-island') {
      anchors.set(loc.id, { x: wx, y: Math.max(-6, terrainHeight(wx, wz)), z: wz })
    } else {
      anchors.set(loc.id, { x: wx, y: Math.max(0.5, terrainHeight(wx, wz)), z: wz })
    }
  }
  return anchors
})()

export const locAnchor = (loc) => {
  const a = LOCATION_ANCHORS.get(loc.id)
  return [a.x, a.y, a.z]
}

/* Walk from (x,z) along (dx,dz) until open water — used to find
   harbor points so the ship sails coast-to-coast instead of over
   island interiors */
export const seekWater = (x, z, dx, dz, minDepth = 0.8, maxDist = 30) => {
  const len = Math.hypot(dx, dz) || 1
  const ux = dx / len
  const uz = dz / len
  for (let d = 0; d <= maxDist; d += 1) {
    const px = x + ux * d
    const pz = z + uz * d
    if (terrainHeight(px, pz) < -minDepth) return [px + ux * 2, pz + uz * 2]
  }
  return [x + ux * maxDist, z + uz * maxDist]
}

/* ── Heightmap texture for the water shader ─────────────────── */
export const buildHeightTexture = (w = 512, h = 288) => {
  const data = new Float32Array(w * h)
  for (let j = 0; j < h; j++) {
    const z = (j / (h - 1) - 0.5) * WORLD_H
    for (let i = 0; i < w; i++) {
      const x = (i / (w - 1) - 0.5) * WORLD_W
      data[j * w + i] = terrainHeight(x, z)
    }
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RedFormat, THREE.FloatType)
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearFilter
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}
