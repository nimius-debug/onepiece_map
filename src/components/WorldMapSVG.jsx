import { MAP_W, MAP_H, RL1_X, RL2_X, GL_Y, CALM_N, CALM_S } from '../constants/mapConfig'

const WorldMapSVG = () => (
  <svg
    viewBox={`0 0 ${MAP_W} ${MAP_H}`}
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', inset: 0 }}
    preserveAspectRatio="none"
  >
    <defs>
      <radialGradient id="oceanDeep" cx="50%" cy="48%" r="80%">
        <stop offset="0%"   stopColor="#091838" />
        <stop offset="55%"  stopColor="#060f28" />
        <stop offset="100%" stopColor="#030815" />
      </radialGradient>

      {/* Regional tints */}
      <linearGradient id="newWorldTint" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="rgba(18,6,28,0)" />
        <stop offset="100%" stopColor="rgba(22,5,18,0.55)" />
      </linearGradient>

      {/* Red Line gradient */}
      <linearGradient id="rlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#1a0600" />
        <stop offset="28%"  stopColor="#5c1e08" />
        <stop offset="50%"  stopColor="#6e280d" />
        <stop offset="72%"  stopColor="#5c1e08" />
        <stop offset="100%" stopColor="#1a0600" />
      </linearGradient>

      {/* Grand Line band */}
      <linearGradient id="glGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="rgba(10,40,110,0)" />
        <stop offset="8%"   stopColor="rgba(18,55,140,0.55)" />
        <stop offset="92%"  stopColor="rgba(18,55,140,0.55)" />
        <stop offset="100%" stopColor="rgba(10,40,110,0)" />
      </linearGradient>

      {/* Sky zone */}
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="rgba(36,22,72,0.42)" />
        <stop offset="100%" stopColor="rgba(36,22,72,0)" />
      </linearGradient>

      {/* Desert island */}
      <radialGradient id="desertGrad" cx="40%" cy="40%" r="65%">
        <stop offset="0%"   stopColor="#b08a22" />
        <stop offset="100%" stopColor="#6e4e0a" />
      </radialGradient>

      {/* Snow island */}
      <radialGradient id="snowGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%"   stopColor="#d8eaf4" />
        <stop offset="100%" stopColor="#8ab0c8" />
      </radialGradient>

      {/* Sky island */}
      <radialGradient id="skyIslandGrad" cx="40%" cy="40%" r="65%">
        <stop offset="0%"   stopColor="#e0d0ff" />
        <stop offset="100%" stopColor="#9878d0" />
      </radialGradient>

      {/* Dark/ominous island */}
      <radialGradient id="darkGrad" cx="40%" cy="40%" r="65%">
        <stop offset="0%"   stopColor="#1e2038" />
        <stop offset="100%" stopColor="#0d0f1c" />
      </radialGradient>

      {/* Volcanic island */}
      <radialGradient id="volcGrad" cx="40%" cy="40%" r="65%">
        <stop offset="0%"   stopColor="#3a1805" />
        <stop offset="100%" stopColor="#1e0a02" />
      </radialGradient>

      {/* Vignette */}
      <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
        <stop offset="38%"  stopColor="rgba(0,0,0,0)" />
        <stop offset="100%" stopColor="rgba(2,5,18,0.88)" />
      </radialGradient>

      {/* Island shadow */}
      <filter id="iShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="rgba(0,0,0,0.55)" />
      </filter>

      {/* Soft glow */}
      <filter id="sglow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>

      {/* Strong glow for landmarks */}
      <filter id="lglow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>

      {/* Teal glow for Fishman Island */}
      <filter id="fishGlow" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* ── Ocean base ── */}
    <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#oceanDeep)" />

    {/* Subtle horizontal scan texture */}
    {Array.from({ length: 55 }).map((_, i) => (
      <line key={i} x1="0" y1={i * 40} x2={MAP_W} y2={i * 40}
            stroke="rgba(18,45,110,0.028)" strokeWidth="1" />
    ))}

    {/* ── Sky island zone (top, ethereal) ── */}
    <rect x="0" y="0" width={MAP_W} height={700} fill="url(#skyGrad)" />

    {/* Cloud wisps high up */}
    <g opacity="0.13" fill="rgba(180,155,255,1)">
      {[400, 900, 1480, 1900, 2400, 2900, 3400, 3800].map((cx, i) => (
        <g key={i}>
          <ellipse cx={cx}      cy={150 + (i % 3) * 40} rx={160 - i * 5} ry={55} />
          <ellipse cx={cx + 90} cy={170 + (i % 3) * 30} rx={120}         ry={40} />
        </g>
      ))}
    </g>

    {/* ── New World dark tint ── */}
    <rect x={RL2_X} y="0" width={MAP_W - RL2_X} height={MAP_H} fill="url(#newWorldTint)" />

    {/* ── Northern Calm Belt ── */}
    <rect x="0" y={CALM_N}      width={MAP_W} height={GL_Y - CALM_N} fill="rgba(4,6,28,0.68)" />
    <rect x="0" y={CALM_N - 30} width={MAP_W} height={50}            fill="rgba(8,12,45,0.3)" />

    {/* ── Southern Calm Belt ── */}
    <rect x="0" y={GL_Y}        width={MAP_W} height={CALM_S - GL_Y} fill="rgba(4,6,28,0.68)" />
    <rect x="0" y={CALM_S - 20} width={MAP_W} height={50}            fill="rgba(8,12,45,0.3)" />

    {/* ── Grand Line center current ── */}
    <rect x="0" y={GL_Y - 40} width={MAP_W} height={80} fill="url(#glGrad)" />
    <line x1="0" y1={GL_Y} x2={MAP_W} y2={GL_Y}
          stroke="rgba(55,120,230,0.28)" strokeWidth="2.5" filter="url(#sglow)" />

    {/* Wavy current lines through Grand Line */}
    {[0, 1, 2].map(i => (
      <path key={i}
        d={`M 0,${GL_Y + (i - 1) * 18}
            Q 500,${GL_Y + (i - 1) * 18 - 8} 1000,${GL_Y + (i - 1) * 18}
            Q 1500,${GL_Y + (i - 1) * 18 + 8} 2000,${GL_Y + (i - 1) * 18}
            Q 2500,${GL_Y + (i - 1) * 18 - 8} 3000,${GL_Y + (i - 1) * 18}
            Q 3500,${GL_Y + (i - 1) * 18 + 8} 4000,${GL_Y + (i - 1) * 18}`}
        fill="none" stroke="rgba(40,90,200,0.06)" strokeWidth="1.5" />
    ))}

    {/* ── EAST BLUE ISLANDS ── */}
    {/* These are near the Grand Line in the left quadrant */}
    <g filter="url(#iShadow)">
      {/* Foosha Village area (x:10.5%=420, y:53.8%=1184) */}
      <ellipse cx="420" cy="1184" rx="85"  ry="50"  fill="#1c4826" opacity="0.88" />
      <ellipse cx="435" cy="1168" rx="52"  ry="30"  fill="#245a30" opacity="0.65" />
      <ellipse cx="415" cy="1175" rx="32"  ry="18"  fill="#2c6e3a" opacity="0.55" />

      {/* Shells Town area (x:14%=560, y:48.5%=1067) */}
      <ellipse cx="560" cy="1067" rx="70"  ry="42"  fill="#1c4826" opacity="0.85" />
      <ellipse cx="572" cy="1055" rx="44"  ry="26"  fill="#245a30" opacity="0.6"  />

      {/* Orange Town area (x:17.5%=700, y:61%=1342) */}
      <ellipse cx="700" cy="1342" rx="62"  ry="37"  fill="#1c4826" opacity="0.82" />
      <ellipse cx="710" cy="1330" rx="38"  ry="22"  fill="#245a30" opacity="0.55" />

      {/* Syrup Village (x:12%=480, y:67%=1474) */}
      <ellipse cx="480" cy="1474" rx="60"  ry="36"  fill="#1c4826" opacity="0.82" />
      <ellipse cx="492" cy="1462" rx="36"  ry="21"  fill="#2c6e3a" opacity="0.55" />

      {/* Baratie — floating restaurant, small */}
      <ellipse cx="860" cy="1144" rx="40"  ry="20"  fill="#1c4826" opacity="0.75" />

      {/* Arlong Park (x:8.5%=340, y:72%=1584) */}
      <ellipse cx="340" cy="1584" rx="68"  ry="40"  fill="#164020" opacity="0.85" />
      <ellipse cx="350" cy="1570" rx="42"  ry="25"  fill="#1c4826" opacity="0.6"  />

      {/* Loguetown (x:24.5%=980, y:48%=1056) */}
      <ellipse cx="980" cy="1056" rx="65"  ry="38"  fill="#1c4826" opacity="0.85" />
      <ellipse cx="992" cy="1044" rx="40"  ry="24"  fill="#245a30" opacity="0.6"  />
    </g>

    {/* North Blue islands (above CALM_N) */}
    <g filter="url(#iShadow)" opacity="0.72">
      <ellipse cx="180" cy="420"  rx="140" ry="78"  fill="#142c1a" />
      <ellipse cx="420" cy="330"  rx="100" ry="58"  fill="#142c1a" />
      <ellipse cx="680" cy="290"  rx="78"  ry="45"  fill="#142c1a" />
      <ellipse cx="870" cy="380"  rx="60"  ry="35"  fill="#142c1a" />
      <ellipse cx="240" cy="600"  rx="70"  ry="40"  fill="#142c1a" />
      <ellipse cx="560" cy="540"  rx="55"  ry="32"  fill="#142c1a" />
    </g>

    {/* South Blue islands (below CALM_S) */}
    <g filter="url(#iShadow)" opacity="0.68">
      <ellipse cx="220" cy="1700" rx="120" ry="68"  fill="#142c1a" />
      <ellipse cx="500" cy="1800" rx="88"  ry="50"  fill="#142c1a" />
      <ellipse cx="750" cy="1650" rx="70"  ry="40"  fill="#142c1a" />
      <ellipse cx="920" cy="1740" rx="55"  ry="32"  fill="#142c1a" />
      <ellipse cx="360" cy="1940" rx="65"  ry="38"  fill="#142c1a" />
    </g>

    {/* ── PARADISE ISLANDS (between Red Lines) ── */}
    <g filter="url(#iShadow)">
      {/* Whiskey Peak (x:31.5%=1260, y:43.5%=957) */}
      <ellipse cx="1260" cy="957"  rx="55"  ry="32"  fill="#1c4826" opacity="0.82" />
      <ellipse cx="1268" cy="946"  rx="32"  ry="18"  fill="#245a30" opacity="0.6"  />

      {/* Little Garden — large prehistoric jungle (x:35.5%=1420, y:51.5%=1133) */}
      <ellipse cx="1420" cy="1133" rx="88"  ry="54"  fill="#154020" opacity="0.88" />
      <ellipse cx="1408" cy="1118" rx="58"  ry="36"  fill="#1c4826" opacity="0.65" />
      <ellipse cx="1428" cy="1125" rx="38"  ry="22"  fill="#245a30" opacity="0.5"  />

      {/* Drum Island — snow/ice (x:39%=1560, y:57%=1254) */}
      <ellipse cx="1560" cy="1254" rx="78"  ry="48"  fill="url(#snowGrad)" opacity="0.88" />
      <ellipse cx="1552" cy="1238" rx="50"  ry="32"  fill="#c0d8e8"         opacity="0.7"  />
      <ellipse cx="1558" cy="1228" rx="28"  ry="18"  fill="#e0eef5"         opacity="0.8"  />

      {/* Alabasta — large desert (x:43%=1720, y:41.5%=913) */}
      <ellipse cx="1720" cy="913"  rx="110" ry="68"  fill="url(#desertGrad)" opacity="0.9"  />
      <ellipse cx="1736" cy="896"  rx="72"  ry="45"  fill="#a88020"          opacity="0.65" />
      <ellipse cx="1724" cy="906"  rx="48"  ry="30"  fill="#c09a28"          opacity="0.5"  />
      {/* Alabasta dunes detail */}
      {[0,1,2,3].map(i => (
        <ellipse key={i} cx={1660 + i * 38} cy={940} rx="22" ry="8" fill="rgba(180,140,30,0.25)" />
      ))}

      {/* Jaya (x:46.5%=1860, y:56%=1232) */}
      <ellipse cx="1860" cy="1232" rx="65"  ry="38"  fill="#1c4826" opacity="0.82" />
      <ellipse cx="1868" cy="1220" rx="40"  ry="24"  fill="#245a30" opacity="0.55" />

      {/* Skypiea — cloud island floating high (x:46.5%=1860, y:14%=308) */}
      <ellipse cx="1860" cy="308"  rx="105" ry="65"  fill="url(#skyIslandGrad)" opacity="0.82" />
      <ellipse cx="1872" cy="290"  rx="70"  ry="44"  fill="#d4c4f8"             opacity="0.65" />
      <ellipse cx="1858" cy="300"  rx="44"  ry="28"  fill="#ece4ff"             opacity="0.55" />
      {/* Cloud wisps around Skypiea */}
      <ellipse cx="1760" cy="325"  rx="80"  ry="28"  fill="rgba(220,200,255,0.18)" />
      <ellipse cx="1965" cy="318"  rx="75"  ry="24"  fill="rgba(220,200,255,0.18)" />
      <ellipse cx="1830" cy="265"  rx="60"  ry="20"  fill="rgba(220,200,255,0.22)" />

      {/* Long Ring Long Land — elongated archipelago (x:50.5%=2020, y:50.5%=1111) */}
      <ellipse cx="2020" cy="1111" rx="145" ry="28"  fill="#1c4826" opacity="0.78" />

      {/* Water 7 — canal city (x:53.5%=2140, y:43.5%=957) */}
      <ellipse cx="2140" cy="957"  rx="95"  ry="58"  fill="#1c4826" opacity="0.85" />
      <ellipse cx="2154" cy="940"  rx="60"  ry="38"  fill="#245a30" opacity="0.6"  />
      {/* Canal details */}
      {[-1,0,1].map(i => (
        <rect key={i} x={2100 + i * 28} y="920" width="6" height="55"
              fill="rgba(10,40,100,0.35)" rx="3" />
      ))}

      {/* Enies Lobby — fortress (x:55.5%=2220, y:48%=1056) */}
      <ellipse cx="2220" cy="1056" rx="58"  ry="35"  fill="#162830" opacity="0.85" />
      <ellipse cx="2220" cy="1048" rx="36"  ry="22"  fill="#1e3040" opacity="0.7"  />

      {/* Thriller Bark — ghost ship island (x:59.5%=2380, y:54.5%=1199) */}
      <ellipse cx="2380" cy="1199" rx="90"  ry="55"  fill="#0e1a1c" opacity="0.9"  />
      <ellipse cx="2380" cy="1184" rx="58"  ry="36"  fill="#141e20" opacity="0.72" />
      <ellipse cx="2372" cy="1175" rx="36"  ry="22"  fill="#1a2428" opacity="0.6"  />

      {/* Sabaody Archipelago — bubble mangrove (x:64.5%=2580, y:47%=1034) */}
      <ellipse cx="2580" cy="1034" rx="80"  ry="48"  fill="#1a3a22" opacity="0.82" />
      {/* Bubble decorations */}
      {[-28,-10,10,28,0].map((ox, i) => (
        <ellipse key={i} cx={2580 + ox} cy={1034 + (i % 2 === 0 ? -20 : 12)}
                 rx="12" ry="12" fill="none"
                 stroke="rgba(79,195,247,0.22)" strokeWidth="1.5" />
      ))}

      {/* Amazon Lily — hidden in Calm Belt (x:58.5%=2340, y:74%=1628) */}
      <ellipse cx="2340" cy="1628" rx="68"  ry="40"  fill="#1c3822" opacity="0.82" />
      <ellipse cx="2348" cy="1615" rx="42"  ry="26"  fill="#245a30" opacity="0.6"  />

      {/* Impel Down — underwater prison (x:63.5%=2540, y:79%=1738) */}
      <ellipse cx="2540" cy="1738" rx="48"  ry="30"  fill="#0c1620" opacity="0.9"  />
      <ellipse cx="2540" cy="1728" rx="30"  ry="18"  fill="#101820" opacity="0.8"  />

      {/* Marineford — marine HQ (x:67.5%=2700, y:35.5%=781) */}
      <ellipse cx="2700" cy="781"  rx="115" ry="70"  fill="#181a2c" opacity="0.9"  />
      <ellipse cx="2706" cy="764"  rx="74"  ry="46"  fill="#1e2038" opacity="0.72" />
      {/* Fortress battlements */}
      {[-3,-1,1,3].map(i => (
        <rect key={i} x={2680 + i * 16} y="730" width="10" height="20"
              fill="rgba(120,130,180,0.35)" rx="2" />
      ))}

      {/* Scattered decorative Paradise islands */}
      <ellipse cx="1680" cy="650"  rx="38"  ry="22"  fill="#142c1a" opacity="0.45" />
      <ellipse cx="1950" cy="480"  rx="32"  ry="18"  fill="#142c1a" opacity="0.4"  />
      <ellipse cx="2080" cy="700"  rx="28"  ry="16"  fill="#142c1a" opacity="0.42" />
      <ellipse cx="2320" cy="550"  rx="35"  ry="20"  fill="#142c1a" opacity="0.38" />
      <ellipse cx="2460" cy="750"  rx="28"  ry="16"  fill="#142c1a" opacity="0.4"  />
      <ellipse cx="1850" cy="1480" rx="32"  ry="18"  fill="#142c1a" opacity="0.42" />
      <ellipse cx="2200" cy="1550" rx="38"  ry="22"  fill="#142c1a" opacity="0.38" />
      <ellipse cx="2480" cy="1400" rx="30"  ry="17"  fill="#142c1a" opacity="0.4"  />
    </g>

    {/* ── NEW WORLD ISLANDS ── */}
    <g filter="url(#iShadow)">
      {/* Punk Hazard — split ice/fire (x:78.5%=3140, y:44.5%=979) */}
      <ellipse cx="3100" cy="979"  rx="90"  ry="55"  fill="url(#snowGrad)"  opacity="0.85" />
      <ellipse cx="3188" cy="992"  rx="90"  ry="55"  fill="url(#volcGrad)"  opacity="0.85" />
      {/* Split line */}
      <line x1="3145" y1="924" x2="3145" y2="1034"
            stroke="rgba(200,80,20,0.55)" strokeWidth="2.5" filter="url(#sglow)" />

      {/* Dressrosa (x:82.5%=3300, y:53.5%=1177) */}
      <ellipse cx="3300" cy="1177" rx="95"  ry="58"  fill="#2a1828" opacity="0.85" />
      <ellipse cx="3308" cy="1160" rx="60"  ry="38"  fill="#361e32" opacity="0.68" />
      <ellipse cx="3298" cy="1168" rx="38"  ry="24"  fill="#421e3e" opacity="0.55" />

      {/* Whole Cake Island (x:75%=3000, y:57%=1254) */}
      <ellipse cx="3000" cy="1254" rx="105" ry="65"  fill="#2e1025" opacity="0.88" />
      <ellipse cx="3008" cy="1235" rx="68"  ry="42"  fill="#3a1430" opacity="0.7"  />
      <ellipse cx="2998" cy="1245" rx="44"  ry="28"  fill="#461638" opacity="0.55" />

      {/* Zou — island on elephant (x:80.5%=3220, y:61%=1342) */}
      <ellipse cx="3220" cy="1342" rx="85"  ry="52"  fill="#1c3820" opacity="0.85" />
      <ellipse cx="3228" cy="1325" rx="54"  ry="34"  fill="#245a2a" opacity="0.65" />
      {/* Elephant leg hint */}
      <rect x="3190" y="1390" width="22" height="55" fill="#162c1a" rx="6" opacity="0.6" />
      <rect x="3235" y="1390" width="22" height="55" fill="#162c1a" rx="6" opacity="0.6" />

      {/* Wano Country — feudal Japan style (x:87.5%=3500, y:43%=946) */}
      <ellipse cx="3500" cy="946"  rx="105" ry="65"  fill="#2a200a" opacity="0.9"  />
      <ellipse cx="3495" cy="928"  rx="68"  ry="44"  fill="#382c10" opacity="0.72" />
      <ellipse cx="3505" cy="938"  rx="44"  ry="28"  fill="#463614" opacity="0.58" />
      {/* Mountain peaks for Wano */}
      <path d="M 3460,896 L 3475,865 L 3490,895 Z" fill="rgba(160,120,40,0.4)" />
      <path d="M 3510,882 L 3530,845 L 3548,880 Z" fill="rgba(160,120,40,0.4)" />

      {/* Egghead Island — futuristic sphere (x:84.5%=3380, y:35.5%=781) */}
      <ellipse cx="3380" cy="781"  rx="78"  ry="48"  fill="#182040" opacity="0.88" />
      <ellipse cx="3380" cy="766"  rx="50"  ry="32"  fill="#1e2850" opacity="0.72" />
      {/* Futuristic glow */}
      <ellipse cx="3380" cy="781"  rx="78"  ry="48"  fill="none"
               stroke="rgba(79,195,247,0.25)" strokeWidth="3" filter="url(#sglow)" />

      {/* West Blue islands (far right) */}
      <ellipse cx="3100" cy="260"  rx="130" ry="72"  fill="#142c1a" opacity="0.68" />
      <ellipse cx="3380" cy="210"  rx="95"  ry="54"  fill="#142c1a" opacity="0.63" />
      <ellipse cx="3750" cy="300"  rx="110" ry="62"  fill="#142c1a" opacity="0.65" />
      <ellipse cx="3650" cy="1700" rx="82"  ry="48"  fill="#142c1a" opacity="0.6"  />
      <ellipse cx="3880" cy="1820" rx="70"  ry="42"  fill="#142c1a" opacity="0.58" />
      <ellipse cx="3100" cy="1900" rx="62"  ry="36"  fill="#142c1a" opacity="0.55" />

      {/* Scattered New World islands */}
      <ellipse cx="3050" cy="600"  rx="42"  ry="24"  fill="#1a1428" opacity="0.48" />
      <ellipse cx="3280" cy="680"  rx="36"  ry="20"  fill="#1a1428" opacity="0.42" />
      <ellipse cx="3600" cy="550"  rx="40"  ry="22"  fill="#1a1428" opacity="0.45" />
      <ellipse cx="3820" cy="700"  rx="35"  ry="20"  fill="#1a1428" opacity="0.42" />
    </g>

    {/* ── RED LINE 1 — mountain range ── */}
    {/* Base body */}
    <rect x={RL1_X - 38} y="0" width="76" height={MAP_H} fill="url(#rlGrad)" />

    {/* Western face mountain silhouette */}
    <path
      d={`M ${RL1_X - 38},0
          L ${RL1_X - 72},100 L ${RL1_X - 38},190
          L ${RL1_X - 58},295 L ${RL1_X - 38},385
          L ${RL1_X - 75},485 L ${RL1_X - 38},575
          L ${RL1_X - 62},672 L ${RL1_X - 38},762
          L ${RL1_X - 78},858 L ${RL1_X - 38},948
          L ${RL1_X - 65},1045 L ${RL1_X - 38},1135
          L ${RL1_X - 72},1232 L ${RL1_X - 38},1322
          L ${RL1_X - 60},1418 L ${RL1_X - 38},1508
          L ${RL1_X - 75},1605 L ${RL1_X - 38},1695
          L ${RL1_X - 62},1792 L ${RL1_X - 38},1882
          L ${RL1_X - 70},1978 L ${RL1_X - 38},2068
          L ${RL1_X - 55},2200
          L ${RL1_X + 38},2200 L ${RL1_X + 38},0 Z`}
      fill="#3c1606" opacity="0.68"
    />

    {/* Eastern face mountain silhouette */}
    <path
      d={`M ${RL1_X + 38},0
          L ${RL1_X + 72},100 L ${RL1_X + 38},190
          L ${RL1_X + 55},295 L ${RL1_X + 38},385
          L ${RL1_X + 75},485 L ${RL1_X + 38},575
          L ${RL1_X + 60},672 L ${RL1_X + 38},762
          L ${RL1_X + 78},858 L ${RL1_X + 38},948
          L ${RL1_X + 64},1045 L ${RL1_X + 38},1135
          L ${RL1_X + 70},1232 L ${RL1_X + 38},1322
          L ${RL1_X + 58},1418 L ${RL1_X + 38},1508
          L ${RL1_X + 74},1605 L ${RL1_X + 38},1695
          L ${RL1_X + 60},1792 L ${RL1_X + 38},1882
          L ${RL1_X + 68},1978 L ${RL1_X + 38},2068
          L ${RL1_X + 52},2200
          L ${RL1_X - 38},2200 L ${RL1_X - 38},0 Z`}
      fill="#3c1606" opacity="0.68"
    />

    {/* RL1 highlight ridge */}
    <line x1={RL1_X - 4} y1="0" x2={RL1_X - 4} y2={MAP_H}
          stroke="rgba(150,60,12,0.28)" strokeWidth="2" filter="url(#sglow)" />

    {/* ── RED LINE 2 — mountain range ── */}
    <rect x={RL2_X - 38} y="0" width="76" height={MAP_H} fill="url(#rlGrad)" />

    <path
      d={`M ${RL2_X - 38},0
          L ${RL2_X - 72},100 L ${RL2_X - 38},190
          L ${RL2_X - 58},295 L ${RL2_X - 38},385
          L ${RL2_X - 75},485 L ${RL2_X - 38},575
          L ${RL2_X - 62},672 L ${RL2_X - 38},762
          L ${RL2_X - 78},858 L ${RL2_X - 38},948
          L ${RL2_X - 65},1045 L ${RL2_X - 38},1135
          L ${RL2_X - 72},1232 L ${RL2_X - 38},1322
          L ${RL2_X - 60},1418 L ${RL2_X - 38},1508
          L ${RL2_X - 75},1605 L ${RL2_X - 38},1695
          L ${RL2_X - 62},1792 L ${RL2_X - 38},1882
          L ${RL2_X - 70},1978 L ${RL2_X - 38},2068
          L ${RL2_X - 55},2200
          L ${RL2_X + 38},2200 L ${RL2_X + 38},0 Z`}
      fill="#3c1606" opacity="0.68"
    />

    <path
      d={`M ${RL2_X + 38},0
          L ${RL2_X + 72},100 L ${RL2_X + 38},190
          L ${RL2_X + 55},295 L ${RL2_X + 38},385
          L ${RL2_X + 75},485 L ${RL2_X + 38},575
          L ${RL2_X + 60},672 L ${RL2_X + 38},762
          L ${RL2_X + 78},858 L ${RL2_X + 38},948
          L ${RL2_X + 64},1045 L ${RL2_X + 38},1135
          L ${RL2_X + 70},1232 L ${RL2_X + 38},1322
          L ${RL2_X + 58},1418 L ${RL2_X + 38},1508
          L ${RL2_X + 74},1605 L ${RL2_X + 38},1695
          L ${RL2_X + 60},1792 L ${RL2_X + 38},1882
          L ${RL2_X + 68},1978 L ${RL2_X + 38},2068
          L ${RL2_X + 52},2200
          L ${RL2_X - 38},2200 L ${RL2_X - 38},0 Z`}
      fill="#3c1606" opacity="0.68"
    />

    <line x1={RL2_X - 4} y1="0" x2={RL2_X - 4} y2={MAP_H}
          stroke="rgba(150,60,12,0.28)" strokeWidth="2" filter="url(#sglow)" />

    {/* ── MARY GEOISE — citadel atop RL2 ── */}
    <rect x={RL2_X - 55} y="0"   width="110" height="200" fill="#1a0902" />
    <rect x={RL2_X - 48} y="0"   width="96"  height="180" fill="#251206" />
    <rect x={RL2_X - 44} y="20"  width="88"  height="140" fill="#2e160a" />
    {/* Battlements */}
    {Array.from({ length: 14 }).map((_, i) => (
      <rect key={i} x={RL2_X - 42 + i * 6.5} y="155" width="5" height="14" fill="#3d1f0a" />
    ))}
    {/* Towers */}
    <rect x={RL2_X - 44} y="0" width="18" height="90" fill="#3d1e0c" />
    <rect x={RL2_X + 26} y="0" width="18" height="90" fill="#3d1e0c" />
    <text x={RL2_X} y="105" textAnchor="middle"
          fontFamily="Cinzel" fontSize="13" fill="rgba(240,180,41,0.62)" letterSpacing="0.5">
      MARY
    </text>
    <text x={RL2_X} y="122" textAnchor="middle"
          fontFamily="Cinzel" fontSize="13" fill="rgba(240,180,41,0.62)" letterSpacing="0.5">
      GEOISE
    </text>

    {/* ── Key intersection markers ── */}
    {/* Reverse Mountain — RL1 × GL */}
    <circle cx={RL1_X} cy={GL_Y} r="14" fill="rgba(240,180,41,0.85)" filter="url(#lglow)" />
    <circle cx={RL1_X} cy={GL_Y} r="6"  fill="rgba(255,220,100,0.95)" />

    {/* Fishman Island corridor — RL2 × GL */}
    <circle cx={RL2_X} cy={GL_Y} r="14" fill="rgba(38,198,218,0.85)"  filter="url(#fishGlow)" />
    <circle cx={RL2_X} cy={GL_Y} r="6"  fill="rgba(100,230,240,0.95)" />

    {/* Fishman Island underwater glow (at x:73.5%=2940, y:47.5%=1045) */}
    <ellipse cx="2940" cy={GL_Y} rx="100" ry="55"
             fill="rgba(20,80,100,0.35)" filter="url(#fishGlow)" />

    {/* ── Mist / fog on Calm Belts ── */}
    {[900, 950, 990, 1030, 1070, 1110, 1150, 1190].map((y, i) => (
      <rect key={i} x="0" y={y} width={MAP_W} height="18"
            fill={`rgba(15,20,55,${0.04 + (i % 3) * 0.015})`}
            rx="2" />
    ))}

    {/* ── Subtle ocean current lines ── */}
    {[380, 720, 1450, 1850].map((y, i) => (
      <path key={i}
        d={`M 0,${y} Q 600,${y - 12 + i * 4} 1200,${y} Q 1800,${y + 12} 2400,${y} Q 3000,${y - 10} 3600,${y} Q 3800,${y + 8} 4000,${y}`}
        fill="none" stroke="rgba(18,45,120,0.055)" strokeWidth="2" />
    ))}

    {/* ── LABELS ── */}
    {/* Sea names */}
    <text x="540"  y="1820" textAnchor="middle" fontFamily="Cinzel" fontSize="26"
          fill="rgba(79,195,247,0.28)" letterSpacing="5">EAST  BLUE</text>
    <text x="540"  y="210"  textAnchor="middle" fontFamily="Cinzel" fontSize="22"
          fill="rgba(79,195,247,0.22)" letterSpacing="4">NORTH  BLUE</text>
    <text x="540"  y="2080" textAnchor="middle" fontFamily="Cinzel" fontSize="22"
          fill="rgba(79,195,247,0.22)" letterSpacing="4">SOUTH  BLUE</text>
    <text x="3460" y="2080" textAnchor="middle" fontFamily="Cinzel" fontSize="22"
          fill="rgba(79,195,247,0.22)" letterSpacing="4">WEST  BLUE</text>

    {/* Grand Line */}
    <text x="2000" y={GL_Y - 6} textAnchor="middle" fontFamily="Cinzel" fontSize="16"
          fill="rgba(90,150,255,0.48)" letterSpacing="6">
      ✦  THE  GRAND  LINE  ✦
    </text>

    {/* Calm Belt labels */}
    <text x="2000" y={CALM_N + 88} textAnchor="middle" fontFamily="Cinzel" fontSize="13"
          fill="rgba(120,120,200,0.38)" letterSpacing="4">
      · · · C A L M  B E L T · · ·
    </text>
    <text x="2000" y={GL_Y + 115} textAnchor="middle" fontFamily="Cinzel" fontSize="13"
          fill="rgba(120,120,200,0.38)" letterSpacing="4">
      · · · C A L M  B E L T · · ·
    </text>

    {/* Region labels */}
    <text x="2000" y="580" textAnchor="middle" fontFamily="Cinzel" fontSize="24"
          fill="rgba(150,120,255,0.28)" letterSpacing="5">P A R A D I S E</text>
    <text x="3460" y="580" textAnchor="middle" fontFamily="Cinzel" fontSize="24"
          fill="rgba(255,112,67,0.30)" letterSpacing="5">N E W  W O R L D</text>

    {/* Sky World */}
    <text x="2000" y="130" textAnchor="middle" fontFamily="Cinzel" fontSize="16"
          fill="rgba(200,170,255,0.35)" letterSpacing="5">
      ✦ · · · S K Y  W O R L D · · · ✦
    </text>

    {/* Red Line labels — rotated */}
    <text x={RL1_X} y="640" textAnchor="middle" fontFamily="Cinzel" fontSize="11"
          fill="rgba(190,90,30,0.45)" letterSpacing="1.5"
          transform={`rotate(-90,${RL1_X},640)`}>RED  LINE</text>
    <text x={RL2_X} y="640" textAnchor="middle" fontFamily="Cinzel" fontSize="11"
          fill="rgba(190,90,30,0.45)" letterSpacing="1.5"
          transform={`rotate(-90,${RL2_X},640)`}>RED  LINE</text>

    {/* Fishman Island label */}
    <text x="2940" y="1920" textAnchor="middle" fontFamily="Cinzel" fontSize="12"
          fill="rgba(38,198,218,0.42)" letterSpacing="2">FISHMAN ISLAND</text>

    {/* ── Vignette overlay ── */}
    <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#vignette)" />

    {/* ── Compass rose (bottom-right) ── */}
    <g transform="translate(3880, 2100)" opacity="0.45">
      <circle r="48" fill="none" stroke="rgba(240,180,41,0.5)" strokeWidth="1" />
      <circle r="4"  fill="rgba(240,180,41,0.5)" />
      {/* Cardinal lines */}
      {[0, 90, 180, 270].map(angle => (
        <line key={angle} x1="0" y1="-50" x2="0" y2="-72"
              stroke="rgba(240,180,41,0.3)" strokeWidth="1"
              transform={`rotate(${angle})`} />
      ))}
      <text y="-60" textAnchor="middle" fontFamily="Cinzel" fontSize="18" fill="rgba(240,180,41,0.85)">N</text>
      <text y="78"  textAnchor="middle" fontFamily="Cinzel" fontSize="16" fill="rgba(240,180,41,0.65)">S</text>
      <text x="-70" y="6"  textAnchor="middle" fontFamily="Cinzel" fontSize="16" fill="rgba(240,180,41,0.65)">W</text>
      <text x="70"  y="6"  textAnchor="middle" fontFamily="Cinzel" fontSize="16" fill="rgba(240,180,41,0.65)">E</text>
      <path d="M 0,-42 L 7,0 L 0,42 L -7,0 Z"  fill="rgba(240,180,41,0.78)" />
      <path d="M -42,0 L 0,7 L 42,0 L 0,-7 Z"  fill="rgba(240,180,41,0.48)" />
      <circle r="7" fill="rgba(240,180,41,0.95)" />
    </g>
  </svg>
)

export default WorldMapSVG
