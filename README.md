# One Piece — Luffy's Grand Voyage

An interactive world map of the One Piece anime universe, showing every major location Luffy has visited across all 7 sagas — with hover descriptions, an animated journey path, and a game-like nautical aesthetic.

## Features

- **Custom SVG world map** — Grand Line, Red Lines, Calm Belts, Mary Geoise, and all four seas labeled in a dark treasure-map style
- **30 location markers** — each saga has its own accent color; markers stagger in on load with a pulsing glow ring
- **Hover + click info cards** — hover for a quick preview; click to pin an expanded card with the full story description, key events, and crew members present
- **Animated journey path** — a gold bezier curve draws across the world in chronological order; re-animates when you switch sagas
- **Saga filter** — sidebar (desktop) or scrolling pill row (mobile) to isolate any arc
- **Mobile-friendly** — bottom-sheet tooltips, larger touch targets, horizontal saga pills

## Sagas covered

| Saga | Locations |
|------|-----------|
| East Blue | Foosha Village → Loguetown (7) |
| Alabasta | Reverse Mountain → Alabasta (5) |
| Skypiea | Jaya + Skypiea (2) |
| Water 7 | Long Ring Long Land → Thriller Bark (4) |
| Summit War | Sabaody → Marineford (4) |
| Fishman Island | Rusukaina + Fishman Island (2) |
| New World | Punk Hazard → Egghead Island (6) |

## Running locally

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Tech stack

- React 19 + Vite
- Tailwind CSS
- Pure CSS animations (keyframes + transitions)
- No external map tiles — fully self-contained static site
