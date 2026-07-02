import { MAP_W, MAP_H, RL1_X, RL2_X, GL_Y, CALM_N, CALM_S } from '../constants/mapConfig'

/* ─── Color tokens ─────────────────────────────────────────── */
const C = {
  parch:    '#C8A86A',   // land / parchment
  parchHi:  '#DDB878',   // land highlight
  parchSh:  '#A88848',   // land shadow
  ocean:    '#2AAEC8',   // open sea teal
  calm:     '#1A8AA8',   // calm belt (slightly darker)
  grand:    '#126888',   // Grand Line (same as calm visually; handled by line)
  rl:       '#5C180A',   // Red Line base
  rlHi:     '#8C3014',   // Red Line highlight peak
  paper:    '#E8D0A0',   // outer frame/paper
  label:    '#1A0C04',   // dark brown labels
  labelSub: '#2A1A0A',   // medium labels
  border:   '#7A4818',   // frame border
  gold:     '#C07810',   // accent gold
}

export default function WorldMapSVG() {
  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', inset: 0 }}
      preserveAspectRatio="none"
    >
      <defs>
        {/* Paper texture for outer border area */}
        <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#EED8A8" />
          <stop offset="100%" stopColor="#D4B878" />
        </linearGradient>

        {/* Land parchment gradient — slightly textured */}
        <radialGradient id="landGrad" cx="40%" cy="35%" r="75%">
          <stop offset="0%"   stopColor="#D4B070" />
          <stop offset="100%" stopColor="#A88040" />
        </radialGradient>

        {/* Ocean teal gradient */}
        <radialGradient id="oceanGrad" cx="50%" cy="48%" r="72%">
          <stop offset="0%"   stopColor="#2EC0D8" />
          <stop offset="100%" stopColor="#189AB5" />
        </radialGradient>

        {/* Calm belt — notably darker teal */}
        <linearGradient id="calmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(18,120,148,0.85)" />
          <stop offset="100%" stopColor="rgba(14,96,120,0.85)"  />
        </linearGradient>

        {/* Red Line gradient */}
        <linearGradient id="rlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#280800" />
          <stop offset="30%"  stopColor="#6B1A06" />
          <stop offset="50%"  stopColor="#8C2A0E" />
          <stop offset="70%"  stopColor="#6B1A06" />
          <stop offset="100%" stopColor="#280800" />
        </linearGradient>

        {/* New World land — slightly darker/more ominous */}
        <radialGradient id="nwLandGrad" cx="40%" cy="35%" r="75%">
          <stop offset="0%"   stopColor="#B89058" />
          <stop offset="100%" stopColor="#8A6030" />
        </radialGradient>

        {/* Drop shadow for land masses */}
        <filter id="landShadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="4" dy="6" stdDeviation="10"
                        floodColor="rgba(30,10,0,0.35)" />
        </filter>

        {/* Soft glow for key markers */}
        <filter id="markerGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Subtle inner vignette on ocean */}
        <radialGradient id="oceanVig" cx="50%" cy="50%" r="70%">
          <stop offset="40%"  stopColor="rgba(0,0,0,0)"    />
          <stop offset="100%" stopColor="rgba(0,20,30,0.4)" />
        </radialGradient>
      </defs>

      {/* ═══════════════════════════════════════════════
          1. OUTER PAPER BORDER
      ═══════════════════════════════════════════════ */}
      <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#paperGrad)" />

      {/* ═══════════════════════════════════════════════
          2. OCEAN BASE (teal covers the full map,
             land masses will paint on top)
      ═══════════════════════════════════════════════ */}
      <rect x="40" y="40" width={MAP_W - 80} height={MAP_H - 80}
            fill="url(#oceanGrad)" rx="4" />

      {/* Subtle ocean depth lines */}
      {Array.from({ length: 28 }).map((_, i) => (
        <line key={i} x1="40" y1={40 + i * 76} x2={MAP_W - 40} y2={40 + i * 76}
              stroke="rgba(20,90,115,0.08)" strokeWidth="1.5" />
      ))}

      {/* ═══════════════════════════════════════════════
          3. CALM BELT BANDS
      ═══════════════════════════════════════════════ */}
      {/* Northern Calm Belt (CALM_N to GL_Y) */}
      <rect x="40" y={CALM_N} width={MAP_W - 80} height={GL_Y - CALM_N}
            fill="url(#calmGrad)" />
      {/* Southern Calm Belt (GL_Y to CALM_S) */}
      <rect x="40" y={GL_Y} width={MAP_W - 80} height={CALM_S - GL_Y}
            fill="url(#calmGrad)" />

      {/* Grand Line center stripe */}
      <rect x="40" y={GL_Y - 4} width={MAP_W - 80} height={8}
            fill="rgba(10,60,90,0.6)" />
      {/* GL current shimmer */}
      <line x1="40" y1={GL_Y} x2={MAP_W - 40} y2={GL_Y}
            stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"
            strokeDasharray="20,12" />

      {/* Calm Belt hatching */}
      {Array.from({ length: 14 }).map((_, i) => (
        <g key={i}>
          <line x1="40"        y1={CALM_N + 20 + i * 30} x2={MAP_W - 40} y2={CALM_N + 20 + i * 30}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="40"        y1={GL_Y   + 20 + i * 30} x2={MAP_W - 40} y2={GL_Y   + 20 + i * 30}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        </g>
      ))}

      {/* ═══════════════════════════════════════════════
          4. LAND MASSES — organic continent shapes
      ═══════════════════════════════════════════════ */}

      {/* ── NORTH BLUE (upper-left) ─────────────── */}
      {/* Large main continent */}
      <path filter="url(#landShadow)"
            fill="url(#landGrad)"
            d={`
              M 80,75
              Q 180,48 340,65   Q 510,42 660,72
              Q 800,50 940,80   Q 1020,95 1055,160
              Q 1072,240 1052,360 Q 1068,460 1045,560
              Q 1058,650 1028,740 Q 1000,810 950,840
              Q 880,862 780,848  Q 680,866 575,848
              Q 470,866 365,845  Q 250,864 160,840
              Q 90,820 62,758    Q 42,688 52,600
              Q 34,510 52,418   Q 36,330 58,246
              Q 54,162 80,75 Z
            `}
      />
      {/* Peninsula juts */}
      <path fill="url(#landGrad)"
            d={`M 820,840 Q 880,870 900,930 Q 860,958 820,940 Q 790,910 820,840 Z`} />
      <path fill="url(#landGrad)"
            d={`M 250,840 Q 240,890 210,930 Q 175,950 165,910 Q 168,868 250,840 Z`} />
      {/* Highlight ridge */}
      <path fill={C.parchHi} opacity="0.55"
            d={`M 120,90 Q 250,60 420,78 Q 560,55 700,85 Q 820,62 930,92
                Q 980,110 1040,180 Q 1060,200 1042,240
                Q 980,195 900,175 Q 780,150 660,130 Q 520,110 380,125
                Q 250,112 140,132 Q 100,120 80,100 Q 95,90 120,90 Z`}
      />

      {/* ── SOUTH BLUE (lower-left) ─────────────── */}
      {/* Main southern landmass */}
      <path filter="url(#landShadow)"
            fill="url(#landGrad)"
            d={`
              M 80,1295
              Q 120,1268 230,1278 Q 350,1255 480,1275
              Q 560,1258 650,1278 Q 750,1258 850,1282
              Q 960,1265 1040,1310
              Q 1068,1380 1048,1480 Q 1065,1580 1040,1680
              Q 1055,1780 1020,1870 Q 990,1940 945,1985
              Q 880,2020 775,2000 Q 670,2022 560,2000
              Q 448,2022 335,1995 Q 225,2018 148,1990
              Q 80,1962 58,1895 Q 38,1820 50,1730
              Q 32,1640 52,1550 Q 35,1458 58,1380
              Q 52,1330 80,1295 Z
            `}
      />
      {/* Separate island cluster (south-left) */}
      <path filter="url(#landShadow)"
            fill="url(#landGrad)"
            d={`M 62,2080 Q 120,2050 220,2065 Q 320,2042 420,2060
                Q 495,2070 520,2110 Q 510,2155 460,2170
                Q 370,2188 265,2172 Q 165,2190 95,2165
                Q 55,2145 55,2115 Q 58,2092 62,2080 Z`}
      />

      {/* ── PARADISE — upper island clusters ──── */}
      {/* Paradise has scattered island groups, not one big continent */}
      {/* Cluster A — upper Paradise (near Alabasta/Drum level) */}
      <path filter="url(#landShadow)" fill="url(#landGrad)"
            d={`M 1140,75 Q 1260,48 1420,68 Q 1560,45 1700,72
                Q 1820,52 1960,80 Q 2020,95 2050,155
                Q 2065,215 2038,295 Q 2055,360 2028,430
                Q 2010,480 1960,510 Q 1880,535 1780,518
                Q 1680,538 1570,515 Q 1455,535 1340,510
                Q 1238,528 1160,498 Q 1108,468 1100,400
                Q 1085,320 1105,250 Q 1090,172 1120,110 Q 1128,88 1140,75 Z`}
      />
      {/* Cluster B — mid Paradise upper */}
      <path filter="url(#landShadow)" fill="url(#landGrad)"
            d={`M 2120,65 Q 2220,42 2380,62 Q 2520,42 2660,68
                Q 2780,52 2890,105 Q 2918,165 2900,255
                Q 2915,335 2890,415 Q 2905,485 2872,548
                Q 2840,592 2780,615 Q 2700,635 2600,618
                Q 2498,638 2390,615 Q 2280,635 2180,608
                Q 2100,585 2070,525 Q 2048,462 2065,390
                Q 2050,318 2070,248 Q 2058,158 2095,100 Q 2108,78 2120,65 Z`}
      />
      {/* Small islands — Skypiea area (upper central) */}
      <ellipse cx={1860} cy={330} rx="130" ry="80" fill="url(#landGrad)"
               filter="url(#landShadow)" />
      <ellipse cx={1680} cy={280} rx="85"  ry="52" fill="url(#landGrad)" />
      <ellipse cx={2040} cy={260} rx="72"  ry="44" fill="url(#landGrad)" />

      {/* ── PARADISE — lower island clusters ──── */}
      {/* Cluster C — lower Paradise */}
      <path filter="url(#landShadow)" fill="url(#landGrad)"
            d={`M 1140,1295 Q 1260,1268 1420,1288 Q 1555,1262 1690,1288
                Q 1820,1265 1960,1295 Q 2038,1318 2050,1390
                Q 2065,1458 2038,1555 Q 2055,1640 2028,1728
                Q 2008,1800 1952,1838 Q 1875,1865 1775,1848
                Q 1670,1868 1555,1845 Q 1440,1865 1328,1840
                Q 1218,1860 1148,1828 Q 1098,1798 1090,1730
                Q 1075,1648 1098,1555 Q 1082,1468 1102,1390
                Q 1110,1325 1140,1295 Z`}
      />
      {/* Cluster D — right Paradise lower */}
      <path filter="url(#landShadow)" fill="url(#landGrad)"
            d={`M 2130,1282 Q 2248,1258 2400,1275 Q 2540,1252 2680,1278
                Q 2800,1258 2905,1305 Q 2938,1368 2918,1455
                Q 2932,1538 2905,1625 Q 2918,1710 2885,1795
                Q 2855,1865 2795,1905 Q 2715,1935 2605,1915
                Q 2498,1938 2385,1912 Q 2272,1935 2162,1908
                Q 2082,1885 2055,1815 Q 2035,1745 2052,1665
                Q 2038,1580 2058,1498 Q 2042,1415 2065,1350
                Q 2080,1302 2130,1282 Z`}
      />
      {/* Smaller islands */}
      <ellipse cx={1520} cy={1600} rx="90"  ry="55" fill="url(#landGrad)"
               filter="url(#landShadow)" />
      <ellipse cx={2350} cy={1450} rx="75"  ry="46" fill="url(#landGrad)"
               filter="url(#landShadow)" />
      <ellipse cx={2600} cy={1650} rx="65"  ry="40" fill="url(#landGrad)"
               filter="url(#landShadow)" />

      {/* ── NEW WORLD (right of RL2) — upper ─── */}
      <path filter="url(#landShadow)"
            fill="url(#nwLandGrad)"
            d={`
              M 2980,78
              Q 3100,50 3280,68   Q 3460,45 3640,72
              Q 3810,50 3960,105
              Q 3990,175 3972,275  Q 3988,365 3962,465
              Q 3978,560 3948,648  Q 3932,728 3892,788
              Q 3840,830 3755,848  Q 3655,865 3540,848
              Q 3430,865 3315,845  Q 3198,865 3082,840
              Q 2985,812 2958,748  Q 2935,675 2952,588
              Q 2932,498 2955,405  Q 2935,308 2960,222
              Q 2956,145 2980,78 Z
            `}
      />
      {/* New World peninsula */}
      <path fill="url(#nwLandGrad)"
            d={`M 3040,840 Q 3020,895 2995,950 Q 2968,978 2952,955
                Q 2942,920 2960,878 Q 2985,845 3040,840 Z`} />
      <path fill="url(#nwLandGrad)"
            d={`M 3870,840 Q 3892,888 3910,938 Q 3928,968 3958,952
                Q 3975,918 3958,878 Q 3928,845 3870,840 Z`} />

      {/* ── WEST BLUE (right of RL2, lower) ───── */}
      <path filter="url(#landShadow)"
            fill="url(#nwLandGrad)"
            d={`M 2975,1295 Q 3095,1265 3265,1285 Q 3440,1260 3615,1285
                Q 3790,1260 3960,1308 Q 3990,1372 3970,1465
                Q 3985,1558 3958,1650 Q 3972,1742 3940,1832
                Q 3908,1908 3850,1950 Q 3775,1985 3662,1968
                Q 3548,1988 3428,1965 Q 3308,1985 3188,1960
                Q 3065,1982 2975,1945 Q 2935,1905 2930,1838
                Q 2912,1758 2932,1668 Q 2915,1578 2938,1490
                Q 2920,1400 2945,1340 Q 2958,1308 2975,1295 Z`}
      />
      {/* West Blue lower island */}
      <path filter="url(#landShadow)"
            fill="url(#nwLandGrad)"
            d={`M 2968,2050 Q 3055,2022 3195,2040 Q 3325,2018 3435,2042
                Q 3510,2060 3528,2110 Q 3515,2160 3455,2175
                Q 3352,2195 3230,2178 Q 3108,2198 3018,2172
                Q 2968,2148 2958,2112 Q 2960,2078 2968,2050 Z`}
      />
      {/* Scattered NW islands */}
      <ellipse cx={3150} cy={2000} rx="80"  ry="48" fill="url(#nwLandGrad)" />
      <ellipse cx={3700} cy={2020} rx="70"  ry="42" fill="url(#nwLandGrad)" />
      <ellipse cx={3880} cy={1980} rx="55"  ry="34" fill="url(#nwLandGrad)" />

      {/* Small East Blue islands near marker positions */}
      {[
        [420,1184,72,42],[560,1067,58,35],[700,1342,55,33],
        [480,1474,55,33],[860,1144,38,22],[340,1584,60,36],
        [980,1056,58,35],
      ].map(([cx,cy,rx,ry],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                 fill="url(#landGrad)" filter="url(#landShadow)" />
      ))}

      {/* Small Paradise/NewWorld islands near marker positions */}
      {[
        // Alabasta saga
        [1260,957,52,30],[1420,1133,80,50],[1560,1254,72,44],
        [1720,913,105,65],[1860,1232,60,36],
        // Water 7 area
        [2020,1111,130,26],[2140,957,90,55],[2220,1056,55,33],
        [2380,1199,85,52],[2580,1034,75,45],
        // Summit War
        [2340,1628,65,38],[2540,1738,45,28],[2700,781,112,68],
        // New World
        [3140,979,88,54],[3300,1177,92,56],[3000,1254,100,62],
        [3220,1342,82,50],[3500,946,100,62],[3380,781,75,46],
      ].map(([cx,cy,rx,ry],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                 fill={cx > RL2_X ? 'url(#nwLandGrad)' : 'url(#landGrad)'}
                 filter="url(#landShadow)" />
      ))}

      {/* ═══════════════════════════════════════════════
          5. RED LINES — vertical mountain ranges
      ═══════════════════════════════════════════════ */}

      {/* RL1 */}
      <rect x={RL1_X - 36} y="40" width="72" height={MAP_H - 80} fill="url(#rlGrad)" />
      {/* RL1 western mountain silhouette */}
      <path fill={C.rlHi} opacity="0.55"
            d={`M ${RL1_X-36},40
                L ${RL1_X-68},132 L ${RL1_X-36},212
                L ${RL1_X-55},308 L ${RL1_X-36},388
                L ${RL1_X-72},484 L ${RL1_X-36},564
                L ${RL1_X-58},660 L ${RL1_X-36},740
                L ${RL1_X-74},836 L ${RL1_X-36},916
                L ${RL1_X-62},1012 L ${RL1_X-36},1092
                L ${RL1_X-68},1188 L ${RL1_X-36},1268
                L ${RL1_X-56},1364 L ${RL1_X-36},1444
                L ${RL1_X-70},1540 L ${RL1_X-36},1620
                L ${RL1_X-60},1716 L ${RL1_X-36},1796
                L ${RL1_X-66},1892 L ${RL1_X-36},1972
                L ${RL1_X-54},2068 L ${RL1_X-36},2160
                L ${RL1_X+36},2160 L ${RL1_X+36},40 Z`}
      />
      <path fill={C.rlHi} opacity="0.55"
            d={`M ${RL1_X+36},40
                L ${RL1_X+68},132 L ${RL1_X+36},212
                L ${RL1_X+55},308 L ${RL1_X+36},388
                L ${RL1_X+72},484 L ${RL1_X+36},564
                L ${RL1_X+58},660 L ${RL1_X+36},740
                L ${RL1_X+74},836 L ${RL1_X+36},916
                L ${RL1_X+62},1012 L ${RL1_X+36},1092
                L ${RL1_X+68},1188 L ${RL1_X+36},1268
                L ${RL1_X+56},1364 L ${RL1_X+36},1444
                L ${RL1_X+70},1540 L ${RL1_X+36},1620
                L ${RL1_X+60},1716 L ${RL1_X+36},1796
                L ${RL1_X+66},1892 L ${RL1_X+36},1972
                L ${RL1_X+54},2068 L ${RL1_X+36},2160
                L ${RL1_X-36},2160 L ${RL1_X-36},40 Z`}
      />

      {/* RL2 */}
      <rect x={RL2_X - 36} y="40" width="72" height={MAP_H - 80} fill="url(#rlGrad)" />
      <path fill={C.rlHi} opacity="0.55"
            d={`M ${RL2_X-36},40
                L ${RL2_X-68},132 L ${RL2_X-36},212
                L ${RL2_X-55},308 L ${RL2_X-36},388
                L ${RL2_X-72},484 L ${RL2_X-36},564
                L ${RL2_X-58},660 L ${RL2_X-36},740
                L ${RL2_X-74},836 L ${RL2_X-36},916
                L ${RL2_X-62},1012 L ${RL2_X-36},1092
                L ${RL2_X-68},1188 L ${RL2_X-36},1268
                L ${RL2_X-56},1364 L ${RL2_X-36},1444
                L ${RL2_X-70},1540 L ${RL2_X-36},1620
                L ${RL2_X-60},1716 L ${RL2_X-36},1796
                L ${RL2_X-66},1892 L ${RL2_X-36},1972
                L ${RL2_X-54},2068 L ${RL2_X-36},2160
                L ${RL2_X+36},2160 L ${RL2_X+36},40 Z`}
      />
      <path fill={C.rlHi} opacity="0.55"
            d={`M ${RL2_X+36},40
                L ${RL2_X+68},132 L ${RL2_X+36},212
                L ${RL2_X+55},308 L ${RL2_X+36},388
                L ${RL2_X+72},484 L ${RL2_X+36},564
                L ${RL2_X+58},660 L ${RL2_X+36},740
                L ${RL2_X+74},836 L ${RL2_X+36},916
                L ${RL2_X+62},1012 L ${RL2_X+36},1092
                L ${RL2_X+68},1188 L ${RL2_X+36},1268
                L ${RL2_X+56},1364 L ${RL2_X+36},1444
                L ${RL2_X+70},1540 L ${RL2_X+36},1620
                L ${RL2_X+60},1716 L ${RL2_X+36},1796
                L ${RL2_X+66},1892 L ${RL2_X+36},1972
                L ${RL2_X+54},2068 L ${RL2_X+36},2160
                L ${RL2_X-36},2160 L ${RL2_X-36},40 Z`}
      />

      {/* ═══════════════════════════════════════════════
          6. MARY GEOISE — citadel atop RL2
      ═══════════════════════════════════════════════ */}
      <rect x={RL2_X - 52} y="40"  width="104" height="175" fill="#2A0E04" />
      <rect x={RL2_X - 44} y="40"  width="88"  height="158" fill="#3C1608" />
      <rect x={RL2_X - 40} y="56"  width="80"  height="130" fill="#501E0C" />
      {/* Battlements */}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i}
              x={RL2_X - 38 + i * 5.8} y="178"
              width="4.2" height="14" fill="#3C1608" />
      ))}
      {/* Towers */}
      <rect x={RL2_X - 44} y="40" width="18" height="88" fill="#4A1C0A" />
      <rect x={RL2_X + 26} y="40" width="18" height="88" fill="#4A1C0A" />
      <rect x={RL2_X - 8}  y="40" width="16" height="100" fill="#4A1C0A" />
      {/* Flag */}
      <polygon points={`${RL2_X},40 ${RL2_X+22},54 ${RL2_X},68`}
               fill="rgba(220,160,30,0.80)" />
      <text x={RL2_X} y="122" textAnchor="middle"
            fontFamily="Cinzel" fontSize="12" fontWeight="bold"
            fill={C.gold} letterSpacing="0.5">
        MARY GEOISE
      </text>

      {/* ═══════════════════════════════════════════════
          7. REVERSE MOUNTAIN — the Grand Entry X
      ═══════════════════════════════════════════════ */}
      {/* X crossing at RL1 × GL */}
      <g transform={`translate(${RL1_X},${GL_Y})`}>
        {/* The crossing paths */}
        <path d={`M -55,-45 L 55,45 M 55,-45 L -55,45`}
              stroke="#1A0C04" strokeWidth="12" strokeLinecap="round" opacity="0.5" />
        <path d={`M -45,-35 L 45,35 M 45,-35 L -45,35`}
              stroke={C.parchHi} strokeWidth="6" strokeLinecap="round" opacity="0.75" />
        <circle r="14" fill={C.parch} stroke={C.label} strokeWidth="3" />
        <circle r="6"  fill={C.gold} />
      </g>

      {/* RL2 × GL marker (Fishman Island / entry to New World) */}
      <g transform={`translate(${RL2_X},${GL_Y})`}>
        <circle r="12" fill={C.parch}   stroke={C.label} strokeWidth="3" />
        <circle r="5"  fill="#1E96B0" />
      </g>

      {/* ═══════════════════════════════════════════════
          8. OCEAN DEPTH VIGNETTE
      ═══════════════════════════════════════════════ */}
      <rect x="40" y="40" width={MAP_W - 80} height={MAP_H - 80}
            fill="url(#oceanVig)" rx="4" />

      {/* ═══════════════════════════════════════════════
          9. MAP FRAME & BORDER
      ═══════════════════════════════════════════════ */}
      {/* Inner frame line */}
      <rect x="40" y="40" width={MAP_W - 80} height={MAP_H - 80}
            fill="none" stroke={C.border} strokeWidth="6" rx="4" />
      {/* Outer frame */}
      <rect x="15" y="15" width={MAP_W - 30} height={MAP_H - 30}
            fill="none" stroke={C.border} strokeWidth="3" rx="5" />

      {/* Corner decorations */}
      {[[55,55],[MAP_W-55,55],[MAP_W-55,MAP_H-55],[55,MAP_H-55]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="12" fill={C.parch}
                  stroke={C.border} strokeWidth="2.5" />
          <circle cx={cx} cy={cy} r="5"  fill={C.gold} />
        </g>
      ))}

      {/* RL labels on outer paper border — vertical */}
      <text x="12" y={MAP_H / 2} textAnchor="middle"
            fontFamily="Cinzel" fontSize="20" fontWeight="800"
            fill={C.label} letterSpacing="3"
            transform={`rotate(-90,12,${MAP_H/2})`}>
        RED LINE
      </text>
      <text x={MAP_W - 12} y={MAP_H / 2} textAnchor="middle"
            fontFamily="Cinzel" fontSize="20" fontWeight="800"
            fill={C.label} letterSpacing="3"
            transform={`rotate(90,${MAP_W-12},${MAP_H/2})`}>
        RED LINE
      </text>

      {/* ═══════════════════════════════════════════════
          10. LABELS — large, clear, authentic map style
      ═══════════════════════════════════════════════ */}

      {/* — Sea names (in the ocean teal) — */}
      {/* NORTH BLUE */}
      <text x="540"  y="480" textAnchor="middle"
            fontFamily="Cinzel" fontSize="38" fontWeight="800"
            fill={C.label} opacity="0.75" letterSpacing="4">
        NORTH BLUE
      </text>

      {/* EAST BLUE */}
      <text x="540" y="1750" textAnchor="middle"
            fontFamily="Cinzel" fontSize="38" fontWeight="800"
            fill={C.label} opacity="0.75" letterSpacing="4">
        EAST BLUE
      </text>

      {/* SOUTH BLUE */}
      <text x="540"  y="2090" textAnchor="middle"
            fontFamily="Cinzel" fontSize="30" fontWeight="700"
            fill={C.label} opacity="0.65" letterSpacing="3">
        SOUTH BLUE
      </text>

      {/* WEST BLUE */}
      <text x="3460" y="1640" textAnchor="middle"
            fontFamily="Cinzel" fontSize="36" fontWeight="800"
            fill={C.label} opacity="0.72" letterSpacing="4">
        WEST BLUE
      </text>

      {/* EAST BLUE (upper, separate from the sea level one) */}
      <text x="540" y="192" textAnchor="middle"
            fontFamily="Cinzel" fontSize="28" fontWeight="700"
            fill={C.label} opacity="0.60" letterSpacing="3">
        NORTH BLUE
      </text>

      {/* — Grand Line zone labels — */}
      {/* GRAND LINE / PARADISE (right half between RL1 and RL2) */}
      <text x="2000" y={GL_Y - 68} textAnchor="middle"
            fontFamily="Cinzel" fontSize="42" fontWeight="800"
            fill={C.label} opacity="0.85" letterSpacing="3">
        GRAND LINE
      </text>
      <text x="2000" y={GL_Y + 92} textAnchor="middle"
            fontFamily="Cinzel" fontSize="36" fontWeight="700"
            fill={C.label} opacity="0.78" letterSpacing="4">
        PARADISE
      </text>

      {/* GRAND LINE / NEW WORLD (right of RL2) */}
      <text x="3460" y={GL_Y - 68} textAnchor="middle"
            fontFamily="Cinzel" fontSize="36" fontWeight="800"
            fill={C.label} opacity="0.80" letterSpacing="3">
        GRAND LINE
      </text>
      <text x="3460" y={GL_Y + 88} textAnchor="middle"
            fontFamily="Cinzel" fontSize="32" fontWeight="700"
            fill={C.label} opacity="0.75" letterSpacing="3">
        NEW WORLD
      </text>

      {/* — Calm Belt labels — */}
      <text x="2000" y={CALM_N + (GL_Y - CALM_N) / 2 + 7} textAnchor="middle"
            fontFamily="Cinzel" fontSize="22" fontWeight="700"
            fill="rgba(255,255,255,0.72)" letterSpacing="6">
        CALM BELT
      </text>
      <text x="2000" y={GL_Y + (CALM_S - GL_Y) / 2 + 7} textAnchor="middle"
            fontFamily="Cinzel" fontSize="22" fontWeight="700"
            fill="rgba(255,255,255,0.72)" letterSpacing="6">
        CALM BELT
      </text>
      {/* Calm belt labels repeated for East Blue side */}
      <text x="540"  y={CALM_N + (GL_Y - CALM_N) / 2 + 7} textAnchor="middle"
            fontFamily="Cinzel" fontSize="18" fontWeight="600"
            fill="rgba(255,255,255,0.60)" letterSpacing="4">
        CALM BELT
      </text>
      <text x="540"  y={GL_Y + (CALM_S - GL_Y) / 2 + 7} textAnchor="middle"
            fontFamily="Cinzel" fontSize="18" fontWeight="600"
            fill="rgba(255,255,255,0.60)" letterSpacing="4">
        CALM BELT
      </text>
      <text x="3460" y={CALM_N + (GL_Y - CALM_N) / 2 + 7} textAnchor="middle"
            fontFamily="Cinzel" fontSize="18" fontWeight="600"
            fill="rgba(255,255,255,0.60)" letterSpacing="4">
        CALM BELT
      </text>
      <text x="3460" y={GL_Y + (CALM_S - GL_Y) / 2 + 7} textAnchor="middle"
            fontFamily="Cinzel" fontSize="18" fontWeight="600"
            fill="rgba(255,255,255,0.60)" letterSpacing="4">
        CALM BELT
      </text>

      {/* REVERSE MOUNTAIN label */}
      <text x={RL1_X + 90} y={GL_Y - 22} textAnchor="start"
            fontFamily="Cinzel" fontSize="14" fontWeight="600"
            fill={C.label} opacity="0.80" letterSpacing="1">
        REVERSE MOUNTAIN
      </text>

      {/* Sky world label */}
      <text x="1900" y="120" textAnchor="middle"
            fontFamily="Cinzel" fontSize="18" fontWeight="600"
            fill={C.label} opacity="0.55" letterSpacing="4">
        · SKY ISLAND ·
      </text>

      {/* ═══════════════════════════════════════════════
          11. ONE PIECE LOGO / TITLE BANNER (top center)
      ═══════════════════════════════════════════════ */}
      <g transform={`translate(${MAP_W / 2}, 0)`}>
        {/* Banner background */}
        <rect x="-210" y="0" width="420" height="42"
              fill="#2A1408" rx="0 0 8 8" />
        <rect x="-205" y="2" width="410" height="38"
              fill="#3C1E08" rx="0 0 6 6" />
        {/* Skull icons */}
        <text x="-170" y="30" textAnchor="middle" fontSize="20" fill={C.gold} opacity="0.85">☠</text>
        <text x="170"  y="30" textAnchor="middle" fontSize="20" fill={C.gold} opacity="0.85">☠</text>
        {/* Title text */}
        <text y="30" textAnchor="middle"
              fontFamily="Cinzel Decorative" fontSize="20" fontWeight="900"
              fill={C.gold} letterSpacing="2">
          ONE PIECE
        </text>
        <text y="42" textAnchor="middle"
              fontFamily="Cinzel" fontSize="9" fontWeight="600"
              fill="rgba(200,150,30,0.75)" letterSpacing="4">
          WORLD MAP
        </text>
        {/* Decorative lines */}
        <line x1="-205" y1="40" x2="-100" y2="40" stroke={C.gold} strokeWidth="1" opacity="0.5" />
        <line x1="100"  y1="40" x2="205"  y2="40" stroke={C.gold} strokeWidth="1" opacity="0.5" />
      </g>

      {/* ═══════════════════════════════════════════════
          12. COMPASS ROSE (bottom-right, on parchment)
      ═══════════════════════════════════════════════ */}
      <g transform={`translate(${MAP_W - 110}, ${MAP_H - 100})`}>
        {/* Background circle */}
        <circle r="58" fill={C.parch} stroke={C.border} strokeWidth="2" />
        <circle r="46" fill="none"    stroke={C.border} strokeWidth="1" opacity="0.5" />

        {/* 8-point rose */}
        {[0,45,90,135,180,225,270,315].map(angle => (
          <g key={angle} transform={`rotate(${angle})`}>
            <polygon
              points="0,-45 4,-18 0,0 -4,-18"
              fill={angle % 90 === 0 ? C.label : C.parchSh}
              opacity={angle % 90 === 0 ? 0.92 : 0.65}
            />
          </g>
        ))}

        {/* Center */}
        <circle r="6" fill={C.label} />
        <circle r="3" fill={C.gold}  />

        {/* Cardinal labels */}
        <text y="-52" textAnchor="middle" fontFamily="Cinzel" fontSize="14" fontWeight="800"
              fill={C.label}>N</text>
        <text y="62"  textAnchor="middle" fontFamily="Cinzel" fontSize="12" fontWeight="700"
              fill={C.label} opacity="0.85">S</text>
        <text x="-60" y="5"  textAnchor="middle" fontFamily="Cinzel" fontSize="12" fontWeight="700"
              fill={C.label} opacity="0.85">W</text>
        <text x="60"  y="5"  textAnchor="middle" fontFamily="Cinzel" fontSize="12" fontWeight="700"
              fill={C.label} opacity="0.85">E</text>
      </g>

      {/* N (north indicator) small in bottom-right corner paper */}
      <text x={MAP_W - 42} y={MAP_H - 15} textAnchor="middle"
            fontFamily="Cinzel" fontSize="10" fill={C.border} opacity="0.7">N</text>
    </svg>
  )
}
