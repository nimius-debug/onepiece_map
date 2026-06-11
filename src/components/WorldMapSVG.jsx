const WorldMapSVG = () => (
  <svg
    viewBox="0 0 1200 700"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', inset: 0 }}
    preserveAspectRatio="none"
  >
    <defs>
      <radialGradient id="oceanGrad" cx="50%" cy="48%" r="72%">
        <stop offset="0%"   stopColor="#0c2060" />
        <stop offset="60%"  stopColor="#071540" />
        <stop offset="100%" stopColor="#040c20" />
      </radialGradient>

      <linearGradient id="redLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#2a0f05" />
        <stop offset="35%"  stopColor="#6b280e" />
        <stop offset="65%"  stopColor="#6b280e" />
        <stop offset="100%" stopColor="#2a0f05" />
      </linearGradient>

      <linearGradient id="grandLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="rgba(15,50,130,0)" />
        <stop offset="15%"  stopColor="rgba(15,50,130,0.45)" />
        <stop offset="85%"  stopColor="rgba(15,50,130,0.45)" />
        <stop offset="100%" stopColor="rgba(15,50,130,0)" />
      </linearGradient>

      <radialGradient id="vignetteGrad" cx="50%" cy="50%" r="70%">
        <stop offset="50%"  stopColor="rgba(0,0,0,0)" />
        <stop offset="100%" stopColor="rgba(3,6,20,0.72)" />
      </radialGradient>

      <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="islandShadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.6)" />
      </filter>
    </defs>

    {/* ── Ocean base ─────────────────────────────────────────────── */}
    <rect x="0" y="0" width="1200" height="700" fill="url(#oceanGrad)" />

    {/* Very subtle horizontal scan lines for depth texture */}
    {Array.from({ length: 35 }).map((_, i) => (
      <line
        key={i}
        x1="0" y1={i * 20} x2="1200" y2={i * 20}
        stroke="rgba(20,60,120,0.04)" strokeWidth="1"
      />
    ))}

    {/* ── Sky area (above Grand Line / North, where Skypiea floats) ── */}
    <rect x="0" y="0" width="1200" height="260"
          fill="rgba(40,30,80,0.18)" />
    <text x="590" y="60" textAnchor="middle"
          fontFamily="Cinzel" fontSize="9" fill="rgba(206,147,216,0.35)"
          letterSpacing="3">✦ · · · S K Y · W O R L D · · · ✦</text>

    {/* ── Calm Belts ─────────────────────────────────────────────── */}
    <rect x="0" y="278" width="1200" height="42" fill="rgba(4,6,28,0.58)" />
    <rect x="0" y="372" width="1200" height="42" fill="rgba(4,6,28,0.58)" />

    {/* ── Grand Line band ─────────────────────────────────────────── */}
    <rect x="0" y="320" width="1200" height="52" fill="url(#grandLineGrad)" />
    <line x1="0" y1="346" x2="1200" y2="346"
          stroke="rgba(70,130,220,0.35)" strokeWidth="1.5"
          filter="url(#softGlow)" />

    {/* ── Red Line 1 (left) ──────────────────────────────────────── */}
    <rect x="309" y="0" width="30" height="700" fill="url(#redLineGrad)" filter="url(#softGlow)" />
    <rect x="316" y="0" width="9"  height="700" fill="rgba(170,70,15,0.2)" />

    {/* ── Red Line 2 (right) ─────────────────────────────────────── */}
    <rect x="861" y="0" width="30" height="700" fill="url(#redLineGrad)" filter="url(#softGlow)" />
    <rect x="868" y="0" width="9"  height="700" fill="rgba(170,70,15,0.2)" />

    {/* ── Mary Geoise — elevated citadel on Red Line 2 ───────────── */}
    <rect x="851" y="0" width="50" height="115" fill="#1e0d04" />
    <rect x="855" y="0" width="42" height="100" fill="#2e1508" />
    {[0,1,2,3,4,5,6,7].map(i => (
      <rect key={i} x={856 + i * 5} y="90" width="3.5" height="10" fill="#3d1f0a" />
    ))}
    <text x="876" y="76" textAnchor="middle"
          fontFamily="Cinzel" fontSize="7" fill="rgba(240,180,41,0.55)"
          letterSpacing="0.5">MARY</text>
    <text x="876" y="86" textAnchor="middle"
          fontFamily="Cinzel" fontSize="7" fill="rgba(240,180,41,0.55)"
          letterSpacing="0.5">GEOISE</text>

    {/* ── East Blue Islands ───────────────────────────────────────── */}
    <g fill="#1b3d24" filter="url(#islandShadow)" opacity="0.8">
      <ellipse cx="95"  cy="378" rx="50" ry="27" />
      <ellipse cx="165" cy="415" rx="34" ry="18" />
      <ellipse cx="218" cy="450" rx="25" ry="14" />
      <ellipse cx="150" cy="463" rx="22" ry="12" />
      <ellipse cx="252" cy="402" rx="28" ry="15" />
      <ellipse cx="80"  cy="475" rx="20" ry="11" />
      <ellipse cx="192" cy="480" rx="16" ry="9"  />
    </g>
    <g fill="#22502e" opacity="0.5">
      <ellipse cx="95"  cy="375" rx="30" ry="14" />
      <ellipse cx="165" cy="412" rx="20" ry="10" />
    </g>

    {/* ── North Blue Islands ──────────────────────────────────────── */}
    <g fill="#162d1e" filter="url(#islandShadow)" opacity="0.7">
      <ellipse cx="75"  cy="148" rx="60" ry="33" />
      <ellipse cx="162" cy="122" rx="42" ry="24" />
      <ellipse cx="240" cy="162" rx="32" ry="18" />
      <ellipse cx="285" cy="130" rx="22" ry="12" />
    </g>

    {/* ── South Blue Islands ──────────────────────────────────────── */}
    <g fill="#162d1e" filter="url(#islandShadow)" opacity="0.65">
      <ellipse cx="105" cy="592" rx="52" ry="29" />
      <ellipse cx="202" cy="614" rx="38" ry="21" />
      <ellipse cx="278" cy="574" rx="26" ry="14" />
    </g>

    {/* ── Paradise decorative islands ─────────────────────────────── */}
    <g fill="#162d1e" opacity="0.42">
      <ellipse cx="408" cy="192" rx="24" ry="13" />
      <ellipse cx="472" cy="583" rx="20" ry="11" />
      <ellipse cx="618" cy="168" rx="18" ry="10" />
      <ellipse cx="734" cy="592" rx="22" ry="12" />
      <ellipse cx="548" cy="604" rx="16" ry="9"  />
      <ellipse cx="788" cy="186" rx="20" ry="11" />
      <ellipse cx="660" cy="558" rx="14" ry="8"  />
    </g>

    {/* ── West Blue / New World Sea Islands ───────────────────────── */}
    <g fill="#162d1e" filter="url(#islandShadow)" opacity="0.62">
      <ellipse cx="968"  cy="174" rx="56" ry="31" />
      <ellipse cx="1070" cy="150" rx="40" ry="23" />
      <ellipse cx="1120" cy="472" rx="48" ry="26" />
      <ellipse cx="1040" cy="518" rx="34" ry="19" />
      <ellipse cx="975"  cy="542" rx="26" ry="14" />
    </g>

    {/* ── Reverse Mountain intersection marker ────────────────────── */}
    <circle cx="324" cy="346" r="5"
            fill="rgba(240,180,41,0.8)"
            filter="url(#strongGlow)" />

    {/* ── Fishman Island intersection marker ──────────────────────── */}
    <circle cx="876" cy="346" r="5"
            fill="rgba(38,198,218,0.8)"
            filter="url(#strongGlow)" />

    {/* ── Sea Labels ──────────────────────────────────────────────── */}
    <text x="157" y="542" textAnchor="middle"
          fontFamily="Cinzel" fontSize="11" fill="rgba(79,195,247,0.42)"
          letterSpacing="2.5">EAST BLUE</text>
    <text x="157" y="88" textAnchor="middle"
          fontFamily="Cinzel" fontSize="10" fill="rgba(79,195,247,0.32)"
          letterSpacing="2">NORTH BLUE</text>
    <text x="157" y="662" textAnchor="middle"
          fontFamily="Cinzel" fontSize="10" fill="rgba(79,195,247,0.32)"
          letterSpacing="2">SOUTH BLUE</text>
    <text x="1038" y="380" textAnchor="middle"
          fontFamily="Cinzel" fontSize="10" fill="rgba(79,195,247,0.32)"
          letterSpacing="2">WEST BLUE</text>

    {/* Grand Line label */}
    <text x="600" y="342" textAnchor="middle"
          fontFamily="Cinzel" fontSize="9" fill="rgba(100,160,255,0.48)"
          letterSpacing="3.5">✦  THE  GRAND  LINE  ✦</text>

    {/* Calm Belt labels */}
    <text x="600" y="303" textAnchor="middle"
          fontFamily="Cinzel" fontSize="8" fill="rgba(120,120,200,0.38)"
          letterSpacing="2">· · CALM BELT · ·</text>
    <text x="600" y="400" textAnchor="middle"
          fontFamily="Cinzel" fontSize="8" fill="rgba(120,120,200,0.38)"
          letterSpacing="2">· · CALM BELT · ·</text>

    {/* Paradise / New World */}
    <text x="590" y="186" textAnchor="middle"
          fontFamily="Cinzel" fontSize="10" fill="rgba(150,120,255,0.32)"
          letterSpacing="2">PARADISE</text>
    <text x="1038" y="186" textAnchor="middle"
          fontFamily="Cinzel" fontSize="10" fill="rgba(255,112,67,0.38)"
          letterSpacing="2">NEW WORLD</text>

    {/* Red Line labels — rotated */}
    <text x="324" y="248" textAnchor="middle"
          fontFamily="Cinzel" fontSize="7.5" fill="rgba(190,90,30,0.48)"
          letterSpacing="1" transform="rotate(-90,324,248)">RED  LINE</text>
    <text x="876" y="248" textAnchor="middle"
          fontFamily="Cinzel" fontSize="7.5" fill="rgba(190,90,30,0.48)"
          letterSpacing="1" transform="rotate(-90,876,248)">RED  LINE</text>

    {/* ── Vignette overlay ─────────────────────────────────────────── */}
    <rect x="0" y="0" width="1200" height="700" fill="url(#vignetteGrad)" />

    {/* ── Compass Rose (bottom-right) ─────────────────────────────── */}
    <g transform="translate(1152, 648)" opacity="0.42">
      <circle r="20" fill="none" stroke="rgba(240,180,41,0.5)" strokeWidth="0.7" />
      <text y="-25" textAnchor="middle" fontFamily="Cinzel" fontSize="9" fill="rgba(240,180,41,0.75)">N</text>
      <text y="33"  textAnchor="middle" fontFamily="Cinzel" fontSize="9" fill="rgba(240,180,41,0.6)">S</text>
      <text x="-29" y="4"  textAnchor="middle" fontFamily="Cinzel" fontSize="9" fill="rgba(240,180,41,0.6)">W</text>
      <text x="29"  y="4"  textAnchor="middle" fontFamily="Cinzel" fontSize="9" fill="rgba(240,180,41,0.6)">E</text>
      <path d="M0,-18 L3.5,0 L0,18 L-3.5,0 Z" fill="rgba(240,180,41,0.7)" />
      <path d="M-18,0 L0,3.5 L18,0 L0,-3.5 Z" fill="rgba(240,180,41,0.45)" />
      <circle r="3.5" fill="rgba(240,180,41,0.9)" />
    </g>
  </svg>
)

export default WorldMapSVG
