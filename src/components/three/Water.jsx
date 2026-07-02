import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_W, WORLD_H, CALM_N_Z, CALM_S_Z, GL_Z, SUN_POSITION } from '../../constants/world3d'
import { buildHeightTexture } from '../../terrain/heightfield'
import { GLSL_WAVES } from '../../terrain/waves'
import { GLSL_NOISE } from '../../utils/noise'

const vertexShader = /* glsl */ `
  uniform sampler2D uHeightTex;
  uniform float uTime;
  varying vec3 vWorldPos;
  varying float vDepth;
  varying float vWaveH;

  ${GLSL_WAVES}

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec2 uv = wp.xz / vec2(${WORLD_W.toFixed(1)}, ${WORLD_H.toFixed(1)}) + 0.5;
    float terrainH = texture2D(uHeightTex, uv).r;
    float depth = -terrainH;

    float h = rawWave(wp.xz, uTime);
    // Calm Belt is calm
    float inCalm = step(${CALM_N_Z.toFixed(1)}, wp.z) * step(wp.z, ${CALM_S_Z.toFixed(1)});
    h = mix(h, h * 0.15, inCalm);
    // swell dies near shore
    h *= smoothstep(0.3, 2.5, depth);

    wp.y += h;
    vWorldPos = wp.xyz;
    vDepth = depth;
    vWaveH = h;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uSunDir;
  uniform vec3 uSkyColor;
  varying vec3 vWorldPos;
  varying float vDepth;
  varying float vWaveH;

  ${GLSL_NOISE}

  void main() {
    // ── depth-based color ──
    vec3 shallow = vec3(0.275, 0.769, 0.718);  // #46C4B7
    vec3 mid     = vec3(0.071, 0.451, 0.651);  // #1273A6
    vec3 deep    = vec3(0.024, 0.149, 0.247);  // #06263F
    vec3 col = mix(shallow, mid, smoothstep(0.3, 4.0, vDepth));
    col = mix(col, deep, smoothstep(4.0, 13.0, vDepth));

    // subtle Grand Line deep tint
    float gl = 1.0 - smoothstep(1.5, 4.0, abs(vWorldPos.z - (${GL_Z.toFixed(1)})));
    col = mix(col, deep, gl * 0.25);

    float alpha = mix(0.55, 0.94, smoothstep(0.0, 5.0, vDepth));

    // ── procedural surface normal ──
    // scrolling noise layers (finite difference)
    vec2 p = vWorldPos.xz;
    float e = 0.35;
    vec2 o1 = uTime * vec2(0.05, 0.02);
    vec2 o2 = -uTime * vec2(0.02, 0.06);
    float n0 = 0.35 * fbm2(p * 0.35 + o1) + 0.20 * fbm2(p * 0.9 + o2);
    float nx = 0.35 * fbm2((p + vec2(e, 0.0)) * 0.35 + o1) + 0.20 * fbm2((p + vec2(e, 0.0)) * 0.9 + o2);
    float nz = 0.35 * fbm2((p + vec2(0.0, e)) * 0.35 + o1) + 0.20 * fbm2((p + vec2(0.0, e)) * 0.9 + o2);
    vec3 N = normalize(vec3(-(nx - n0) / e, 1.0, -(nz - n0) / e));

    // ── sun specular + fresnel ──
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 H = normalize(normalize(uSunDir) + V);
    float spec = pow(max(dot(N, H), 0.0), 240.0) * 1.4;
    col += spec * vec3(1.0, 0.9, 0.75);

    float F = pow(1.0 - max(dot(V, N), 0.0), 3.0);
    col = mix(col, uSkyColor, 0.35 * F);
    alpha += 0.25 * F;

    // ── shoreline foam ──
    float shore = 1.0 - smoothstep(0.0, 1.4, vDepth);
    float band = 0.5 + 0.5 * sin(vDepth * 7.0 - uTime * 1.8 + 3.0 * fbm2(p * 0.6));
    float foam = shore * smoothstep(0.35, 0.8, band + 0.5 * fbm2(p * 1.8 + uTime * 0.15));
    // wave-crest foam
    foam += 0.3 * smoothstep(0.55, 0.9, vWaveH);
    foam = clamp(foam, 0.0, 1.0);
    col = mix(col, vec3(0.96), foam);
    alpha = mix(alpha, 1.0, foam * 0.8);

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`

const Water = () => {
  const matRef = useRef(null)

  const { uniforms } = useMemo(() => ({
    uniforms: {
      uHeightTex: { value: buildHeightTexture() },
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(...SUN_POSITION).normalize() },
      uSkyColor: { value: new THREE.Color('#BCD6E2') },
    },
  }), [])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
      <planeGeometry args={[WORLD_W, WORLD_H, 256, 144]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

export default Water
