import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_W, WORLD_H, GL_Z, CALM_N_Z, CALM_S_Z, RL1_X, RL2_X } from '../../constants/world3d'

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorldPos;
  varying float vWave;

  void main() {
    vec3 pos = position;
    vec4 wp = modelMatrix * vec4(pos, 1.0);

    float w1 = sin(wp.x * 0.12 + uTime * 0.9)  * 0.55;
    float w2 = sin(wp.z * 0.17 + uTime * 1.15) * 0.45;
    float w3 = sin((wp.x + wp.z) * 0.07 + uTime * 0.6) * 0.65;
    float h = w1 + w2 + w3;

    // Calm Belt is calm — flatten waves inside the belt bands
    float inCalm = step(${CALM_N_Z.toFixed(1)}, wp.z) * step(wp.z, ${CALM_S_Z.toFixed(1)});
    h = mix(h, h * 0.15, inCalm);

    wp.y += h;
    vWave = h;
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorldPos;
  varying float vWave;

  void main() {
    vec3 ocean = vec3(0.165, 0.682, 0.784);   // open-sea teal
    vec3 calm  = vec3(0.086, 0.494, 0.608);   // calm belt darker
    vec3 deep  = vec3(0.05, 0.36, 0.47);      // grand line channel

    float inCalm = step(${CALM_N_Z.toFixed(1)}, vWorldPos.z) * step(vWorldPos.z, ${CALM_S_Z.toFixed(1)});
    vec3 col = mix(ocean, calm, inCalm * 0.85);

    // Grand Line channel
    float gl = 1.0 - smoothstep(1.5, 3.5, abs(vWorldPos.z - (${GL_Z.toFixed(1)})));
    col = mix(col, deep, gl * 0.7);

    // Animated current dashes along the Grand Line
    float dash = step(0.0, sin(vWorldPos.x * 0.8 - uTime * 3.0));
    col += vec3(0.28) * gl * dash * (1.0 - smoothstep(0.0, 1.2, abs(vWorldPos.z - (${GL_Z.toFixed(1)}))));

    // Wave crests get a light foam tint
    col += vec3(0.10, 0.12, 0.12) * smoothstep(0.8, 1.6, vWave);

    // Gentle sparkle
    float sparkle = sin(vWorldPos.x * 2.1 + uTime * 1.7) * sin(vWorldPos.z * 2.3 - uTime * 1.3);
    col += vec3(0.05) * smoothstep(0.92, 1.0, sparkle);

    // Vignette toward map edges
    float dx = abs(vWorldPos.x) / ${(WORLD_W / 2).toFixed(1)};
    float dz = abs(vWorldPos.z) / ${(WORLD_H / 2).toFixed(1)};
    float edge = smoothstep(0.75, 1.0, max(dx, dz));
    col = mix(col, col * 0.55, edge);

    gl_FragColor = vec4(col, 1.0);
  }
`

const Ocean = () => {
  const matRef = useRef(null)

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[WORLD_W, WORLD_H, 220, 120]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Red Line — two colossal mountain walls running north-south
export const RedLineWalls = () => {
  const wallGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const verts = []
    const SEGMENTS = 60
    const step = WORLD_H / SEGMENTS

    for (let i = 0; i < SEGMENTS; i++) {
      const z0 = -WORLD_H / 2 + i * step
      const z1 = z0 + step
      const zm = (z0 + z1) / 2
      // jagged peak height varies per segment
      const h = 10 + Math.abs(Math.sin(i * 2.7)) * 9 + Math.abs(Math.sin(i * 1.3)) * 5

      // two triangles per segment forming a ridge tent
      const w = 4.5
      // front face
      verts.push(-w, 0, z0, w, 0, z0, 0, h, zm)
      verts.push(w, 0, z1, -w, 0, z1, 0, h, zm)
      // side faces
      verts.push(-w, 0, z0, 0, h, zm, -w, 0, z1)
      verts.push(w, 0, z1, 0, h, zm, w, 0, z0)
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <>
      {[RL1_X, RL2_X].map((x) => (
        <mesh key={x} geometry={wallGeo} position={[x, 0, 0]} castShadow>
          <meshStandardMaterial
            color="#A03818" roughness={0.85} flatShading
            emissive="#4A1408" emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      {/* Mary Geoise — golden citadel atop Red Line 2 at the holy land */}
      <group position={[RL2_X, 19, GL_Z - 40]}>
        <mesh castShadow>
          <cylinderGeometry args={[2.4, 3.4, 5, 6]} />
          <meshStandardMaterial color="#D9B84A" roughness={0.5} metalness={0.3} flatShading />
        </mesh>
        <mesh position={[0, 3.6, 0]} castShadow>
          <coneGeometry args={[2, 3, 6]} />
          <meshStandardMaterial color="#B08A20" roughness={0.6} flatShading />
        </mesh>
      </group>
    </>
  )
}

export default Ocean
