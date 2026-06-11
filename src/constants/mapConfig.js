export const MAP_W = 4000
export const MAP_H = 2200

// Geographic anchor points (pixels in 4000×2200 space)
export const RL1_X = 1080   // Red Line 1 center (27%)
export const RL2_X = 2920   // Red Line 2 center (73%)
export const GL_Y  = 1056   // Grand Line center  (48%)
export const CALM_N = 880   // Calm Belt north start (40%)
export const CALM_S = 1232  // Calm Belt south start (56%)

// Convert location percentage coordinates to SVG pixel coordinates
export const svgPos = (xPct, yPct) => ({
  x: (xPct / 100) * MAP_W,
  y: (yPct / 100) * MAP_H,
})
