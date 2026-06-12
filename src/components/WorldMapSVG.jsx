import { MAP_W, MAP_H, RL1_X, RL2_X, GL_Y, CALM_N, CALM_S } from '../constants/mapConfig'

const WorldMapSVG = () => (
  <svg
    viewBox={`0 0 ${MAP_W} ${MAP_H}`}
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', inset: 0 }}
    preserveAspectRatio="none"
  >
    <defs>
      {/* Deep sea gradient — dark with warm amber undercurrent for aged feel */}
      <radialGradient id="oceanDeep" cx="48%" cy="50%" r="78%">
        <stop offset="0%"   stopColor="#0d1d42" />
        <stop offset="45%"  stopColor="#080f28" />
        <stop offset="100%" stopColor="#030710" />
      </radialGradient>

      {/* Parchment aging tint */}
      <radialGradient id="agingTint" cx="50%" cy="50%" r="70%">
        <stop offset="0%"   stopColor="rgba(110,75,15,0.12)" />
        <stop offset="100%" stopColor="rgba(40,20,5,0.06)"  />
      </radialGradient>

      {/* Red Line mountain gradient */}
      <linearGradient id="rlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#1a0400" />
        <stop offset="25%"  stopColor="#6b1e06" />
        <stop offset="50%"  stopColor="#8c2a0a" />
        <stop offset="75%"  stopColor="#6b1e06" />
        <stop offset="100%" stopColor="#1a0400" />
      </linearGradient>

      {/* Grand Line mystical band */}
      <linearGradient id="glGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="rgba(8,35,100,0)"    />
        <stop offset="6%"   stopColor="rgba(20,60,160,0.6)" />
        <stop offset="94%"  stopColor="rgba(20,60,160,0.6)" />
        <stop offset="100%" stopColor="rgba(8,35,100,0)"    />
      </linearGradient>

      {/* Sky zone gradient */}
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="rgba(32,18,65,0.48)" />
        <stop offset="100%" stopColor="rgba(32,18,65,0)"    />
      </linearGradient>

      {/* New World dark omen */}
      <linearGradient id="newWorldTint" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="rgba(20,6,30,0)"    />
        <stop offset="100%" stopColor="rgba(25,5,18,0.58)" />
      </linearGradient>

      {/* Island terrain gradients */}
      <radialGradient id="jungleGrad" cx="35%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#2a5e30" />
        <stop offset="100%" stopColor="#0f2812" />
      </radialGradient>
      <radialGradient id="desertGrad" cx="35%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#c09820" />
        <stop offset="100%" stopColor="#6e4c08" />
      </radialGradient>
      <radialGradient id="snowGrad" cx="35%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#dceef8" />
        <stop offset="100%" stopColor="#7aaccb" />
      </radialGradient>
      <radialGradient id="skyIslandGrad" cx="35%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#e8d8ff" />
        <stop offset="100%" stopColor="#8858cc" />
      </radialGradient>
      <radialGradient id="darkGrad" cx="35%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#222438" />
        <stop offset="100%" stopColor="#0a0c18" />
      </radialGradient>
      <radialGradient id="volcGrad" cx="35%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#4a1e05" />
        <stop offset="100%" stopColor="#1c0800" />
      </radialGradient>
      <radialGradient id="pinkGrad" cx="35%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#4a1530" />
        <stop offset="100%" stopColor="#1e0810" />
      </radialGradient>

      {/* Vignette */}
      <radialGradient id="vignette" cx="50%" cy="50%" r="74%">
        <stop offset="35%"  stopColor="rgba(0,0,0,0)"    />
        <stop offset="100%" stopColor="rgba(1,3,12,0.92)" />
      </radialGradient>

      {/* Filters */}
      <filter id="iShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="rgba(0,0,0,0.6)" />
      </filter>
      <filter id="sglow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="lglow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="fishGlow" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="textGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* ══════════════════════════════════════════
        LAYER 1 — OCEAN BASE
    ══════════════════════════════════════════ */}
    <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#oceanDeep)" />

    {/* Aged parchment warm tint */}
    <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#agingTint)" />

    {/* Very faint hatching lines — old map texture */}
    {Array.from({ length: 70 }).map((_, i) => (
      <line key={`h${i}`} x1="0" y1={i * 32} x2={MAP_W} y2={i * 32}
            stroke="rgba(80,55,10,0.028)" strokeWidth="1" />
    ))}
    {Array.from({ length: 40 }).map((_, i) => (
      <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2={MAP_H}
            stroke="rgba(80,55,10,0.018)" strokeWidth="1" />
    ))}

    {/* ══════════════════════════════════════════
        LAYER 2 — ATMOSPHERIC ZONES
    ══════════════════════════════════════════ */}
    {/* Sky island zone (top) */}
    <rect x="0" y="0" width={MAP_W} height={680} fill="url(#skyGrad)" />

    {/* Cloud wisps in sky zone */}
    <g opacity="0.15" fill="rgba(200,175,255,1)">
      {[350, 850, 1480, 1860, 2300, 2750, 3300, 3750].map((cx, i) => (
        <g key={i}>
          <ellipse cx={cx}       cy={140 + (i % 3) * 35} rx={170} ry={52} />
          <ellipse cx={cx + 100} cy={165 + (i % 3) * 25} rx={130} ry={40} />
        </g>
      ))}
    </g>

    {/* New World dark tint */}
    <rect x={RL2_X} y="0" width={MAP_W - RL2_X} height={MAP_H} fill="url(#newWorldTint)" />

    {/* Storm clouds in New World (top area) */}
    <g opacity="0.18" fill="rgba(40,20,60,1)">
      <ellipse cx="3100" cy="200" rx="200" ry="70" />
      <ellipse cx="3400" cy="160" rx="160" ry="55" />
      <ellipse cx="3700" cy="220" rx="180" ry="62" />
      <ellipse cx="3900" cy="175" rx="140" ry="48" />
    </g>

    {/* Northern Calm Belt */}
    <rect x="0" y={CALM_N}       width={MAP_W} height={GL_Y - CALM_N} fill="rgba(4,5,26,0.70)" />
    <rect x="0" y={CALM_N - 35}  width={MAP_W} height={55}            fill="rgba(10,14,50,0.32)" />

    {/* Southern Calm Belt */}
    <rect x="0" y={GL_Y}         width={MAP_W} height={CALM_S - GL_Y} fill="rgba(4,5,26,0.70)" />
    <rect x="0" y={CALM_S - 25}  width={MAP_W} height={55}            fill="rgba(10,14,50,0.32)" />

    {/* Grand Line — mystical band */}
    <rect x="0" y={GL_Y - 45}    width={MAP_W} height={90}            fill="url(#glGrad)" />
    <line x1="0" y1={GL_Y} x2={MAP_W} y2={GL_Y}
          stroke="rgba(60,130,240,0.35)" strokeWidth="3" filter="url(#sglow)" />

    {/* ══════════════════════════════════════════
        LAYER 3 — DECORATIVE BORDER FRAME
    ══════════════════════════════════════════ */}
    <rect x="18" y="18" width={MAP_W - 36} height={MAP_H - 36}
          fill="none" stroke="rgba(180,130,25,0.45)" strokeWidth="5" rx="6" />
    <rect x="30" y="30" width={MAP_W - 60} height={MAP_H - 60}
          fill="none" stroke="rgba(180,130,25,0.20)" strokeWidth="2" rx="4" />

    {/* Corner ornaments */}
    {[[40,40,0],[MAP_W-40,40,90],[MAP_W-40,MAP_H-40,180],[40,MAP_H-40,270]].map(([cx,cy,rot], i) => (
      <g key={i} transform={`translate(${cx},${cy}) rotate(${rot})`} opacity="0.55">
        <line x1="0"  y1="0"  x2="50" y2="0"  stroke="rgba(200,150,25,0.7)" strokeWidth="2.5" />
        <line x1="0"  y1="0"  x2="0"  y2="50" stroke="rgba(200,150,25,0.7)" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="5" fill="rgba(200,150,25,0.75)" />
        <circle cx="0" cy="0" r="2.5" fill="rgba(240,190,50,0.9)" />
      </g>
    ))}

    {/* ══════════════════════════════════════════
        LAYER 4 — ISLANDS
    ══════════════════════════════════════════ */}

    {/* — East Blue islands — */}
    <g filter="url(#iShadow)">
      {/* Foosha Village (x:10.5%=420, y:53.8%=1184) */}
      <ellipse cx="420"  cy="1184" rx="88"  ry="52"  fill="url(#jungleGrad)" opacity="0.9"  />
      <ellipse cx="438"  cy="1168" rx="55"  ry="32"  fill="#2a5e30"           opacity="0.6"  />
      {/* Shells Town (x:14%=560, y:48.5%=1067) */}
      <ellipse cx="560"  cy="1067" rx="72"  ry="44"  fill="url(#jungleGrad)" opacity="0.88" />
      <ellipse cx="575"  cy="1052" rx="44"  ry="27"  fill="#2a5e30"           opacity="0.58" />
      {/* Orange Town (x:17.5%=700, y:61%=1342) */}
      <ellipse cx="700"  cy="1342" rx="65"  ry="39"  fill="url(#jungleGrad)" opacity="0.85" />
      {/* Syrup Village (x:12%=480, y:67%=1474) */}
      <ellipse cx="480"  cy="1474" rx="62"  ry="38"  fill="url(#jungleGrad)" opacity="0.85" />
      <ellipse cx="495"  cy="1460" rx="38"  ry="22"  fill="#2a5e30"           opacity="0.55" />
      {/* Baratie */}
      <ellipse cx="860"  cy="1144" rx="42"  ry="21"  fill="url(#jungleGrad)" opacity="0.78" />
      {/* Arlong Park (x:8.5%=340, y:72%=1584) */}
      <ellipse cx="340"  cy="1584" rx="70"  ry="42"  fill="url(#jungleGrad)" opacity="0.88" />
      <ellipse cx="352"  cy="1568" rx="44"  ry="26"  fill="#2a5e30"           opacity="0.6"  />
      {/* Loguetown (x:24.5%=980, y:48%=1056) */}
      <ellipse cx="980"  cy="1056" rx="68"  ry="40"  fill="url(#jungleGrad)" opacity="0.88" />
      <ellipse cx="994"  cy="1042" rx="42"  ry="25"  fill="#2a5e30"           opacity="0.58" />
    </g>

    {/* North Blue islands */}
    <g filter="url(#iShadow)" opacity="0.7">
      <ellipse cx="180"  cy="420"  rx="145" ry="82"  fill="#0f2812" />
      <ellipse cx="420"  cy="330"  rx="105" ry="60"  fill="#0f2812" />
      <ellipse cx="680"  cy="288"  rx="80"  ry="46"  fill="#0f2812" />
      <ellipse cx="870"  cy="378"  rx="62"  ry="36"  fill="#0f2812" />
      <ellipse cx="240"  cy="605"  rx="72"  ry="42"  fill="#0f2812" />
      <ellipse cx="565"  cy="545"  rx="57"  ry="33"  fill="#0f2812" />
    </g>

    {/* South Blue islands */}
    <g filter="url(#iShadow)" opacity="0.68">
      <ellipse cx="220"  cy="1700" rx="124" ry="70"  fill="#0f2812" />
      <ellipse cx="505"  cy="1808" rx="90"  ry="52"  fill="#0f2812" />
      <ellipse cx="755"  cy="1655" rx="72"  ry="42"  fill="#0f2812" />
      <ellipse cx="930"  cy="1748" rx="57"  ry="33"  fill="#0f2812" />
      <ellipse cx="365"  cy="1948" rx="67"  ry="39"  fill="#0f2812" />
    </g>

    {/* — Paradise islands — */}
    <g filter="url(#iShadow)">
      {/* Whiskey Peak (x:31.5%=1260, y:43.5%=957) */}
      <ellipse cx="1260" cy="957"  rx="57"  ry="34"  fill="url(#jungleGrad)" opacity="0.85" />
      {/* Little Garden (x:35.5%=1420, y:51.5%=1133) */}
      <ellipse cx="1420" cy="1133" rx="92"  ry="57"  fill="url(#jungleGrad)" opacity="0.92" />
      <ellipse cx="1405" cy="1116" rx="60"  ry="38"  fill="#2a5e30"           opacity="0.65" />
      {/* Drum Island — snow (x:39%=1560, y:57%=1254) */}
      <ellipse cx="1560" cy="1254" rx="80"  ry="50"  fill="url(#snowGrad)"   opacity="0.92" />
      <ellipse cx="1550" cy="1236" rx="52"  ry="33"  fill="#c8e2f0"           opacity="0.72" />
      <ellipse cx="1556" cy="1226" rx="29"  ry="19"  fill="#e8f4fc"           opacity="0.82" />
      {/* Alabasta — desert (x:43%=1720, y:41.5%=913) */}
      <ellipse cx="1720" cy="913"  rx="115" ry="72"  fill="url(#desertGrad)" opacity="0.95" />
      <ellipse cx="1738" cy="896"  rx="75"  ry="47"  fill="#c09820"           opacity="0.65" />
      {[0,1,2,3,4].map(i => (
        <ellipse key={i} cx={1650 + i * 35} cy={940} rx="20" ry="7"
                 fill="rgba(180,140,20,0.28)" />
      ))}
      {/* Jaya (x:46.5%=1860, y:56%=1232) */}
      <ellipse cx="1860" cy="1232" rx="67"  ry="40"  fill="url(#jungleGrad)" opacity="0.85" />
      {/* Skypiea — sky island (x:46.5%=1860, y:14%=308) */}
      <ellipse cx="1860" cy="308"  rx="110" ry="68"  fill="url(#skyIslandGrad)" opacity="0.88" />
      <ellipse cx="1875" cy="290"  rx="72"  ry="45"  fill="#d8c8ff"              opacity="0.65" />
      <ellipse cx="1858" cy="302"  rx="46"  ry="29"  fill="#ece4ff"              opacity="0.55" />
      <ellipse cx="1755" cy="328"  rx="85"  ry="30"  fill="rgba(220,200,255,0.20)" />
      <ellipse cx="1968" cy="320"  rx="80"  ry="26"  fill="rgba(220,200,255,0.20)" />
      {/* Long Ring Long Land (x:50.5%=2020, y:50.5%=1111) */}
      <ellipse cx="2020" cy="1111" rx="150" ry="27"  fill="url(#jungleGrad)" opacity="0.80" />
      {/* Water 7 (x:53.5%=2140, y:43.5%=957) */}
      <ellipse cx="2140" cy="957"  rx="98"  ry="60"  fill="url(#jungleGrad)" opacity="0.9"  />
      <ellipse cx="2155" cy="940"  rx="62"  ry="39"  fill="#2a5e30"           opacity="0.62" />
      {[-1,0,1].map(i => (
        <rect key={i} x={2100 + i * 28} y="918" width="7" height="58"
              fill="rgba(8,38,95,0.38)" rx="3" />
      ))}
      {/* Enies Lobby (x:55.5%=2220, y:48%=1056) */}
      <ellipse cx="2220" cy="1056" rx="60"  ry="37"  fill="url(#darkGrad)"   opacity="0.88" />
      {/* Thriller Bark (x:59.5%=2380, y:54.5%=1199) */}
      <ellipse cx="2380" cy="1199" rx="94"  ry="58"  fill="url(#darkGrad)"   opacity="0.92" />
      <ellipse cx="2380" cy="1183" rx="60"  ry="37"  fill="#181c24"           opacity="0.72" />
      {/* Sabaody (x:64.5%=2580, y:47%=1034) */}
      <ellipse cx="2580" cy="1034" rx="82"  ry="50"  fill="url(#jungleGrad)" opacity="0.85" />
      {[-30,-10,10,30,0].map((ox, i) => (
        <ellipse key={i} cx={2580 + ox} cy={1034 + (i % 2 === 0 ? -22 : 14)}
                 rx="13" ry="13" fill="none"
                 stroke="rgba(79,195,247,0.28)" strokeWidth="2" />
      ))}
      {/* Amazon Lily (x:58.5%=2340, y:74%=1628) */}
      <ellipse cx="2340" cy="1628" rx="70"  ry="42"  fill="url(#jungleGrad)" opacity="0.85" />
      {/* Impel Down (x:63.5%=2540, y:79%=1738) */}
      <ellipse cx="2540" cy="1738" rx="50"  ry="32"  fill="url(#darkGrad)"   opacity="0.92" />
      {/* Marineford (x:67.5%=2700, y:35.5%=781) */}
      <ellipse cx="2700" cy="781"  rx="118" ry="72"  fill="url(#darkGrad)"   opacity="0.92" />
      <ellipse cx="2707" cy="764"  rx="76"  ry="47"  fill="#1e2038"           opacity="0.72" />
      {[-3,-1,1,3].map(i => (
        <rect key={i} x={2680 + i * 16} y="728" width="11" height="22"
              fill="rgba(110,120,175,0.38)" rx="2" />
      ))}
      {/* Decorative Paradise islands */}
      {[
        [1685,648,40,23],[1955,478,34,19],[2085,705,30,17],
        [2325,552,37,21],[2465,752,29,16],[1855,1485,34,19],
        [2205,1555,40,23],[2485,1405,32,18],
      ].map(([cx,cy,rx,ry], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                 fill="#0f2812" opacity="0.45" />
      ))}
    </g>

    {/* — New World islands — */}
    <g filter="url(#iShadow)">
      {/* Punk Hazard — split ice/fire (x:78.5%=3140, y:44.5%=979) */}
      <ellipse cx="3100" cy="979"  rx="92"  ry="57"  fill="url(#snowGrad)"   opacity="0.88" />
      <ellipse cx="3192" cy="994"  rx="92"  ry="57"  fill="url(#volcGrad)"   opacity="0.88" />
      <line x1="3148" y1="922" x2="3148" y2="1036"
            stroke="rgba(220,80,15,0.65)" strokeWidth="3" filter="url(#sglow)" />
      {/* Dressrosa (x:82.5%=3300, y:53.5%=1177) */}
      <ellipse cx="3300" cy="1177" rx="98"  ry="60"  fill="url(#pinkGrad)"   opacity="0.88" />
      <ellipse cx="3310" cy="1160" rx="62"  ry="39"  fill="#3e1830"           opacity="0.68" />
      {/* Whole Cake Island (x:75%=3000, y:57%=1254) */}
      <ellipse cx="3000" cy="1254" rx="108" ry="67"  fill="url(#pinkGrad)"   opacity="0.9"  />
      <ellipse cx="3010" cy="1236" rx="70"  ry="44"  fill="#3e1830"           opacity="0.70" />
      {/* Zou (x:80.5%=3220, y:61%=1342) */}
      <ellipse cx="3220" cy="1342" rx="88"  ry="54"  fill="url(#jungleGrad)" opacity="0.88" />
      <rect x="3188" y="1392" width="24" height="58" fill="#0f2812" rx="7"  opacity="0.62" />
      <rect x="3234" y="1392" width="24" height="58" fill="#0f2812" rx="7"  opacity="0.62" />
      {/* Wano Country (x:87.5%=3500, y:43%=946) */}
      <ellipse cx="3500" cy="946"  rx="108" ry="67"  fill="url(#volcGrad)"   opacity="0.92" />
      <ellipse cx="3495" cy="928"  rx="70"  ry="45"  fill="#3a2808"           opacity="0.72" />
      <path d="M 3458,895 L 3474,862 L 3492,893 Z" fill="rgba(170,120,35,0.42)" />
      <path d="M 3512,880 L 3532,843 L 3550,878 Z" fill="rgba(170,120,35,0.42)" />
      {/* Egghead (x:84.5%=3380, y:35.5%=781) */}
      <ellipse cx="3380" cy="781"  rx="80"  ry="49"  fill="url(#darkGrad)"   opacity="0.9"  />
      <ellipse cx="3380" cy="781"  rx="80"  ry="49"  fill="none"
               stroke="rgba(79,195,247,0.30)" strokeWidth="4" filter="url(#sglow)" />
      {/* West Blue */}
      <ellipse cx="3105" cy="258"  rx="133" ry="74"  fill="#0f2812" opacity="0.68" />
      <ellipse cx="3382" cy="208"  rx="98"  ry="55"  fill="#0f2812" opacity="0.63" />
      <ellipse cx="3755" cy="302"  rx="112" ry="63"  fill="#0f2812" opacity="0.65" />
      <ellipse cx="3656" cy="1705" rx="84"  ry="49"  fill="#0f2812" opacity="0.60" />
      <ellipse cx="3884" cy="1825" rx="72"  ry="43"  fill="#0f2812" opacity="0.58" />
      {/* Decorative NW islands */}
      {[
        [3052,602,44,25],[3282,682,38,21],[3602,552,42,23],[3822,702,36,20],
      ].map(([cx,cy,rx,ry], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                 fill="#1a1228" opacity="0.48" />
      ))}
    </g>

    {/* ══════════════════════════════════════════
        LAYER 5 — RED LINES (mountain ranges)
    ══════════════════════════════════════════ */}

    {/* RL1 base */}
    <rect x={RL1_X - 40} y="0" width="80" height={MAP_H} fill="url(#rlGrad)" />
    {/* RL1 western mountain silhouette */}
    <path fill="#501408" opacity="0.72"
      d={`M ${RL1_X-40},0
          L ${RL1_X-76},95   L ${RL1_X-40},185
          L ${RL1_X-60},288  L ${RL1_X-40},378
          L ${RL1_X-80},478  L ${RL1_X-40},568
          L ${RL1_X-64},668  L ${RL1_X-40},758
          L ${RL1_X-82},858  L ${RL1_X-40},948
          L ${RL1_X-68},1048 L ${RL1_X-40},1138
          L ${RL1_X-75},1238 L ${RL1_X-40},1328
          L ${RL1_X-62},1428 L ${RL1_X-40},1518
          L ${RL1_X-78},1618 L ${RL1_X-40},1708
          L ${RL1_X-64},1808 L ${RL1_X-40},1898
          L ${RL1_X-72},1998 L ${RL1_X-40},2088
          L ${RL1_X-57},2200
          L ${RL1_X+40},2200 L ${RL1_X+40},0 Z`}
    />
    {/* RL1 eastern mountain silhouette */}
    <path fill="#501408" opacity="0.72"
      d={`M ${RL1_X+40},0
          L ${RL1_X+76},95   L ${RL1_X+40},185
          L ${RL1_X+58},288  L ${RL1_X+40},378
          L ${RL1_X+80},478  L ${RL1_X+40},568
          L ${RL1_X+62},668  L ${RL1_X+40},758
          L ${RL1_X+82},858  L ${RL1_X+40},948
          L ${RL1_X+66},1048 L ${RL1_X+40},1138
          L ${RL1_X+73},1238 L ${RL1_X+40},1328
          L ${RL1_X+60},1428 L ${RL1_X+40},1518
          L ${RL1_X+76},1618 L ${RL1_X+40},1708
          L ${RL1_X+62},1808 L ${RL1_X+40},1898
          L ${RL1_X+70},1998 L ${RL1_X+40},2088
          L ${RL1_X+55},2200
          L ${RL1_X-40},2200 L ${RL1_X-40},0 Z`}
    />
    {/* RL1 glow */}
    <line x1={RL1_X} y1="0" x2={RL1_X} y2={MAP_H}
          stroke="rgba(160,60,12,0.32)" strokeWidth="2.5" filter="url(#sglow)" />

    {/* RL2 base */}
    <rect x={RL2_X - 40} y="0" width="80" height={MAP_H} fill="url(#rlGrad)" />
    {/* RL2 western mountain silhouette */}
    <path fill="#501408" opacity="0.72"
      d={`M ${RL2_X-40},0
          L ${RL2_X-76},95   L ${RL2_X-40},185
          L ${RL2_X-60},288  L ${RL2_X-40},378
          L ${RL2_X-80},478  L ${RL2_X-40},568
          L ${RL2_X-64},668  L ${RL2_X-40},758
          L ${RL2_X-82},858  L ${RL2_X-40},948
          L ${RL2_X-68},1048 L ${RL2_X-40},1138
          L ${RL2_X-75},1238 L ${RL2_X-40},1328
          L ${RL2_X-62},1428 L ${RL2_X-40},1518
          L ${RL2_X-78},1618 L ${RL2_X-40},1708
          L ${RL2_X-64},1808 L ${RL2_X-40},1898
          L ${RL2_X-72},1998 L ${RL2_X-40},2088
          L ${RL2_X-57},2200
          L ${RL2_X+40},2200 L ${RL2_X+40},0 Z`}
    />
    {/* RL2 eastern mountain silhouette */}
    <path fill="#501408" opacity="0.72"
      d={`M ${RL2_X+40},0
          L ${RL2_X+76},95   L ${RL2_X+40},185
          L ${RL2_X+58},288  L ${RL2_X+40},378
          L ${RL2_X+80},478  L ${RL2_X+40},568
          L ${RL2_X+62},668  L ${RL2_X+40},758
          L ${RL2_X+82},858  L ${RL2_X+40},948
          L ${RL2_X+66},1048 L ${RL2_X+40},1138
          L ${RL2_X+73},1238 L ${RL2_X+40},1328
          L ${RL2_X+60},1428 L ${RL2_X+40},1518
          L ${RL2_X+76},1618 L ${RL2_X+40},1708
          L ${RL2_X+62},1808 L ${RL2_X+40},1898
          L ${RL2_X+70},1998 L ${RL2_X+40},2088
          L ${RL2_X+55},2200
          L ${RL2_X-40},2200 L ${RL2_X-40},0 Z`}
    />
    <line x1={RL2_X} y1="0" x2={RL2_X} y2={MAP_H}
          stroke="rgba(160,60,12,0.32)" strokeWidth="2.5" filter="url(#sglow)" />

    {/* ══════════════════════════════════════════
        LAYER 6 — MARY GEOISE
    ══════════════════════════════════════════ */}
    <rect x={RL2_X - 58} y="0"   width="116" height="210" fill="#1a0a02" />
    <rect x={RL2_X - 50} y="0"   width="100" height="190" fill="#271208" />
    <rect x={RL2_X - 46} y="22"  width="92"  height="145" fill="#321708" />
    {/* Battlements */}
    {Array.from({ length: 16 }).map((_, i) => (
      <rect key={i} x={RL2_X - 44 + i * 6} y="160" width="4.5" height="16" fill="#4a220c" />
    ))}
    {/* Towers */}
    <rect x={RL2_X - 50} y="0"   width="20"  height="100" fill="#3e1e0c" />
    <rect x={RL2_X + 30} y="0"   width="20"  height="100" fill="#3e1e0c" />
    <rect x={RL2_X - 8}  y="0"   width="16"  height="115" fill="#3e1e0c" />
    {/* Gold flag top */}
    <polygon points={`${RL2_X-8},0 ${RL2_X+20},15 ${RL2_X-8},30`}
             fill="rgba(240,180,41,0.75)" />
    <text x={RL2_X} y="115" textAnchor="middle"
          fontFamily="Cinzel" fontSize="14" fontWeight="bold"
          fill="rgba(240,180,41,0.78)" letterSpacing="0.5"
          stroke="rgba(0,0,0,0.9)" strokeWidth="4" paintOrder="stroke fill">
      MARY GEOISE
    </text>

    {/* ══════════════════════════════════════════
        LAYER 7 — LANDMARK MARKERS
    ══════════════════════════════════════════ */}
    {/* Reverse Mountain RL1 × GL */}
    <circle cx={RL1_X} cy={GL_Y} r="16" fill="rgba(240,180,41,0.88)" filter="url(#lglow)" />
    <circle cx={RL1_X} cy={GL_Y} r="7"  fill="rgba(255,225,110,0.98)" />

    {/* Fishman Island corridor RL2 × GL */}
    <circle cx={RL2_X} cy={GL_Y} r="16" fill="rgba(38,198,218,0.88)"  filter="url(#fishGlow)" />
    <circle cx={RL2_X} cy={GL_Y} r="7"  fill="rgba(100,235,245,0.98)" />

    {/* Fishman Island glow (deep below RL2) */}
    <ellipse cx="2940" cy={GL_Y} rx="105" ry="58"
             fill="rgba(18,75,95,0.38)" filter="url(#fishGlow)" />

    {/* ══════════════════════════════════════════
        LAYER 8 — SHIP SILHOUETTES
    ══════════════════════════════════════════ */}
    {/* Sailing ship in East Blue sea */}
    <g transform="translate(640,1750)" opacity="0.22" fill="rgba(120,85,20,1)">
      <ellipse cx="0" cy="18" rx="55" ry="16" />
      <line x1="0" y1="-70" x2="0" y2="18" stroke="rgba(120,85,20,1)" strokeWidth="3" />
      <polygon points="0,-70 45,-22 0,-22" />
      <polygon points="0,-22 38,10 0,10" />
      <line x1="0" y1="-70" x2="-40" y2="-30" stroke="rgba(120,85,20,1)" strokeWidth="2" />
      <polygon points="0,-65 -40,-30 0,-30" />
    </g>

    {/* Sailing ship in Paradise */}
    <g transform="translate(2000,1750)" opacity="0.20" fill="rgba(100,70,15,1)">
      <ellipse cx="0" cy="18" rx="50" ry="14" />
      <line x1="0" y1="-65" x2="0" y2="18" stroke="rgba(100,70,15,1)" strokeWidth="3" />
      <polygon points="0,-65 42,-20 0,-20" />
      <polygon points="0,-20 35,10 0,10" />
    </g>

    {/* Sailing ship in New World */}
    <g transform="translate(3400,1750)" opacity="0.18" fill="rgba(80,55,10,1)">
      <ellipse cx="0" cy="18" rx="55" ry="15" />
      <line x1="0" y1="-70" x2="0" y2="18" stroke="rgba(80,55,10,1)" strokeWidth="3" />
      <polygon points="0,-70 45,-22 0,-22" />
      <polygon points="0,-22 38,10 0,10" />
    </g>

    {/* Sea king silhouette in South Blue */}
    <g opacity="0.14" fill="rgba(30,55,100,1)">
      <ellipse cx="680"  cy="1900" rx="120" ry="45" />
      <ellipse cx="760"  cy="1870" rx="55"  ry="32" />
      <ellipse cx="820"  cy="1855" rx="30"  ry="20" />
      {/* Fins */}
      <path d="M 580,1900 Q 560,1830 610,1850 Z" />
      <path d="M 780,1900 Q 820,1840 790,1870 Z" />
    </g>

    {/* Sea king in New World */}
    <g opacity="0.12" fill="rgba(60,20,80,1)">
      <ellipse cx="3650" cy="800"  rx="130" ry="50" />
      <ellipse cx="3740" cy="768"  rx="60"  ry="35" />
      <path d="M 3550,800 Q 3525,730 3580,755 Z" />
    </g>

    {/* Kraken tentacle in deep Calm Belt */}
    <g opacity="0.13" fill="rgba(25,15,50,1)">
      <path d="M 1800,1150 Q 1820,1100 1840,1140 Q 1860,1180 1850,1220 Q 1840,1260 1820,1240 Z" />
      <path d="M 1860,1120 Q 1890,1070 1905,1110 Q 1920,1150 1905,1190 Q 1890,1230 1875,1210 Z" />
      <path d="M 1920,1160 Q 1940,1110 1960,1145 Q 1975,1180 1960,1218 Z" />
    </g>

    {/* ══════════════════════════════════════════
        LAYER 9 — NAVIGATION LINES (pirate routes)
    ══════════════════════════════════════════ */}
    {/* Dotted nautical lines across the open seas */}
    {[350, 750, 1550, 1900].map((y, i) => (
      <line key={i}
        x1="50" y1={y} x2={MAP_W - 50} y2={y}
        stroke="rgba(140,100,20,0.08)" strokeWidth="1.5"
        strokeDasharray="12,18" />
    ))}

    {/* ══════════════════════════════════════════
        LAYER 10 — LABELS (high visibility)
    ══════════════════════════════════════════ */}

    {/*  Sea names  */}
    <text x="540" y="1800" textAnchor="middle" fontFamily="Cinzel" fontSize="32" fontWeight="700"
          fill="#4FC3F7"
          stroke="rgba(2,6,20,0.92)" strokeWidth="7" paintOrder="stroke fill"
          letterSpacing="5">EAST BLUE</text>

    <text x="540" y="215" textAnchor="middle" fontFamily="Cinzel" fontSize="25" fontWeight="600"
          fill="#4FC3F7"
          stroke="rgba(2,6,20,0.92)" strokeWidth="6" paintOrder="stroke fill"
          letterSpacing="4">NORTH BLUE</text>

    <text x="540" y="2060" textAnchor="middle" fontFamily="Cinzel" fontSize="25" fontWeight="600"
          fill="#4FC3F7"
          stroke="rgba(2,6,20,0.92)" strokeWidth="6" paintOrder="stroke fill"
          letterSpacing="4">SOUTH BLUE</text>

    <text x="3460" y="2060" textAnchor="middle" fontFamily="Cinzel" fontSize="25" fontWeight="600"
          fill="#4FC3F7"
          stroke="rgba(2,6,20,0.92)" strokeWidth="6" paintOrder="stroke fill"
          letterSpacing="4">WEST BLUE</text>

    {/* Grand Line */}
    <text x="2000" y={GL_Y - 8} textAnchor="middle" fontFamily="Cinzel" fontSize="18" fontWeight="700"
          fill="#F0B429"
          stroke="rgba(2,6,20,0.95)" strokeWidth="6" paintOrder="stroke fill"
          letterSpacing="7" filter="url(#textGlow)">
      ✦  THE  GRAND  LINE  ✦
    </text>

    {/* Calm Belt labels */}
    <text x="2000" y={CALM_N + 96} textAnchor="middle" fontFamily="Cinzel" fontSize="14" fontWeight="600"
          fill="#9898D8"
          stroke="rgba(2,5,20,0.95)" strokeWidth="5" paintOrder="stroke fill"
          letterSpacing="4">· · · CALM BELT · · ·</text>

    <text x="2000" y={GL_Y + 122} textAnchor="middle" fontFamily="Cinzel" fontSize="14" fontWeight="600"
          fill="#9898D8"
          stroke="rgba(2,5,20,0.95)" strokeWidth="5" paintOrder="stroke fill"
          letterSpacing="4">· · · CALM BELT · · ·</text>

    {/* Region labels */}
    <text x="2000" y="595" textAnchor="middle" fontFamily="Cinzel" fontSize="28" fontWeight="700"
          fill="#CE93D8"
          stroke="rgba(2,5,20,0.92)" strokeWidth="7" paintOrder="stroke fill"
          letterSpacing="6">PARADISE</text>

    <text x="3460" y="595" textAnchor="middle" fontFamily="Cinzel" fontSize="28" fontWeight="700"
          fill="#FF7043"
          stroke="rgba(2,5,20,0.92)" strokeWidth="7" paintOrder="stroke fill"
          letterSpacing="6">NEW WORLD</text>

    {/* Sky World */}
    <text x="2000" y="130" textAnchor="middle" fontFamily="Cinzel" fontSize="17" fontWeight="600"
          fill="#D4AAFF"
          stroke="rgba(2,5,20,0.92)" strokeWidth="5" paintOrder="stroke fill"
          letterSpacing="5">✦ · SKY WORLD · ✦</text>

    {/* Red Line labels — vertical */}
    <text x={RL1_X} y="620" textAnchor="middle" fontFamily="Cinzel" fontSize="12" fontWeight="700"
          fill="#FF7043"
          stroke="rgba(2,5,20,0.95)" strokeWidth="5" paintOrder="stroke fill"
          letterSpacing="2" transform={`rotate(-90,${RL1_X},620)`}>RED LINE</text>

    <text x={RL2_X} y="620" textAnchor="middle" fontFamily="Cinzel" fontSize="12" fontWeight="700"
          fill="#FF7043"
          stroke="rgba(2,5,20,0.95)" strokeWidth="5" paintOrder="stroke fill"
          letterSpacing="2" transform={`rotate(-90,${RL2_X},620)`}>RED LINE</text>

    {/* Named location hints */}
    <text x="2940" y="1900" textAnchor="middle" fontFamily="Cinzel" fontSize="13" fontWeight="600"
          fill="#26C6DA"
          stroke="rgba(2,5,20,0.95)" strokeWidth="5" paintOrder="stroke fill"
          letterSpacing="2">FISHMAN ISLAND</text>

    {/* ══════════════════════════════════════════
        LAYER 11 — VIGNETTE + EFFECTS
    ══════════════════════════════════════════ */}
    <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#vignette)" />

    {/* ══════════════════════════════════════════
        LAYER 12 — ORNATE COMPASS ROSE
    ══════════════════════════════════════════ */}
    <g transform="translate(3870, 2090)" opacity="0.88">
      {/* Outer ring decorations */}
      <circle r="80"  fill="none" stroke="rgba(200,150,20,0.35)" strokeWidth="1.5" />
      <circle r="62"  fill="none" stroke="rgba(200,150,20,0.25)" strokeWidth="1"   />
      <circle r="8"   fill="rgba(240,190,45,0.95)" />
      <circle r="4"   fill="rgba(255,230,120,1)"   />

      {/* 8-point star */}
      {[0,45,90,135,180,225,270,315].map(angle => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path d="M 0,0 L 5,30 L 0,75 L -5,30 Z"
                fill={angle % 90 === 0 ? "rgba(240,190,45,0.92)" : "rgba(180,140,25,0.65)"} />
        </g>
      ))}

      {/* Cardinal tick marks */}
      {Array.from({ length: 32 }).map((_, i) => (
        <line key={i}
          x1="0" y1={i % 8 === 0 ? -56 : i % 4 === 0 ? -58 : -60}
          x2="0" y2="-64"
          stroke="rgba(200,150,20,0.45)" strokeWidth={i % 8 === 0 ? 2 : 1}
          transform={`rotate(${i * 11.25})`} />
      ))}

      {/* N S E W labels */}
      <text y="-88" textAnchor="middle" fontFamily="Cinzel" fontSize="20" fontWeight="700"
            fill="rgba(240,190,45,1)"
            stroke="rgba(0,0,0,0.9)" strokeWidth="5" paintOrder="stroke fill">N</text>
      <text y="99"  textAnchor="middle" fontFamily="Cinzel" fontSize="18" fontWeight="600"
            fill="rgba(220,170,35,0.92)"
            stroke="rgba(0,0,0,0.9)" strokeWidth="5" paintOrder="stroke fill">S</text>
      <text x="-95" y="7" textAnchor="middle" fontFamily="Cinzel" fontSize="18" fontWeight="600"
            fill="rgba(220,170,35,0.92)"
            stroke="rgba(0,0,0,0.9)" strokeWidth="5" paintOrder="stroke fill">W</text>
      <text x="95"  y="7" textAnchor="middle" fontFamily="Cinzel" fontSize="18" fontWeight="600"
            fill="rgba(220,170,35,0.92)"
            stroke="rgba(0,0,0,0.9)" strokeWidth="5" paintOrder="stroke fill">E</text>
    </g>

    {/* ══════════════════════════════════════════
        LAYER 13 — TITLE CARTOUCHE (top-left area)
    ══════════════════════════════════════════ */}
    <g transform="translate(108, 90)">
      {/* Cartouche background */}
      <rect x="-85" y="-38" width="170" height="70"
            fill="rgba(10,18,45,0.75)" rx="6"
            stroke="rgba(180,130,20,0.50)" strokeWidth="2" />
      {/* Skull & crossbones decoration */}
      <text x="0" y="-2" textAnchor="middle" fontSize="18">☠</text>
      <text x="0" y="22" textAnchor="middle" fontFamily="Cinzel Decorative" fontSize="11"
            fontWeight="700" fill="rgba(240,180,41,0.85)"
            stroke="rgba(0,0,0,0.9)" strokeWidth="3" paintOrder="stroke fill"
            letterSpacing="1">GRAND VOYAGE</text>
    </g>
  </svg>
)

export default WorldMapSVG
