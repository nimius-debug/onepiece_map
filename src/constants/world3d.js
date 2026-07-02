/* Shared constants for the 3D voyage world.
   The 2D map uses percentage coords (x: 0-100, y: 0-100).
   The 3D world maps those onto an ocean plane centered at origin:
   x% → world X (west→east), y% → world Z (north→south). */

// Bundled font for 3D text labels — troika must NOT hit its CDN fallback
import cinzelWoff from '@fontsource/cinzel/files/cinzel-latin-700-normal.woff'

export const LABEL_FONT = cinzelWoff

export const WORLD_W = 400
export const WORLD_H = 220

// Region lines, converted from the 2D map percentages
export const RL1_X = (27 / 100 - 0.5) * WORLD_W   // Red Line 1  → -92
export const RL2_X = (73 / 100 - 0.5) * WORLD_W   // Red Line 2  → +92
export const GL_Z = (48 / 100 - 0.5) * WORLD_H    // Grand Line  → -4.4
export const CALM_N_Z = (40 / 100 - 0.5) * WORLD_H // -22
export const CALM_S_Z = (56 / 100 - 0.5) * WORLD_H // +13.2

export const locTo3D = (loc) => [
  (loc.x / 100 - 0.5) * WORLD_W,
  0,
  (loc.y / 100 - 0.5) * WORLD_H,
]

export const SAGA_COLORS = {
  'East Blue':      '#4A90D9',
  'Alabasta':       '#C97B2F',
  'Skypiea':        '#8B7DF5',
  'Water 7':        '#2ECC71',
  'Summit War':     '#E74C3C',
  'Fishman Island': '#1ABC9C',
  'New World':      '#FF6B35',
}

// Special island placement: Skypiea floats in the sky,
// Fishman Island sits inside a bubble on the sea floor line.
export const SKY_ISLANDS = new Set(['skypiea'])
export const UNDERSEA_ISLANDS = new Set(['fishman-island'])
export const SKY_ALTITUDE = 34
