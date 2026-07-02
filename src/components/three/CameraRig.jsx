/* eslint-disable react-hooks/immutability -- R3F useFrame mutates camera/controls imperatively by design */
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { terrainHeight } from '../../terrain/heightfield'

/*
  CameraRig drives two behaviors on top of OrbitControls:
  - Fly-to: when focusGoalRef holds {target, camPos}, smoothly lerp there, then clear it
  - Follow: while followingRef.current is true, keep the controls target glued
    to the ship position (followRef) so the camera chases the voyage
*/
const CameraRig = ({ controlsRef, focusGoalRef, followingRef, followRef }) => {
  const { camera } = useThree()
  const tmpTarget = useRef(new THREE.Vector3())
  const tmpCam = useRef(new THREE.Vector3())

  useFrame((_, dt) => {
    const controls = controlsRef.current
    if (!controls) return
    const ease = 1 - Math.pow(0.0015, dt) // frame-rate independent smoothing

    if (followingRef.current && followRef.current) {
      const { x, y, z } = followRef.current
      tmpTarget.current.set(x, y + 2, z)
      controls.target.lerp(tmpTarget.current, ease)
      // keep a cinematic chase distance without fighting user orbiting
      const dist = camera.position.distanceTo(controls.target)
      if (dist > 70 || dist < 12) {
        const dir = camera.position.clone().sub(controls.target).normalize()
        tmpCam.current.copy(controls.target).addScaledVector(dir, THREE.MathUtils.clamp(dist, 12, 70))
        camera.position.lerp(tmpCam.current, ease)
      }
      controls.update()
    }

    const goal = followingRef.current ? null : focusGoalRef.current
    if (goal) {
      tmpTarget.current.set(...goal.target)
      tmpCam.current.set(...goal.camPos)
      controls.target.lerp(tmpTarget.current, ease)
      camera.position.lerp(tmpCam.current, ease)
      controls.update()
      if (
        controls.target.distanceTo(tmpTarget.current) < 0.4 &&
        camera.position.distanceTo(tmpCam.current) < 0.8
      ) {
        focusGoalRef.current = null
      }
    }

    // never let the camera go inside terrain (Red Line ridges especially)
    const ground = terrainHeight(camera.position.x, camera.position.z) + 5
    if (camera.position.y < ground) {
      camera.position.y += (ground - camera.position.y) * Math.min(1, ease * 3)
      controls.update()
    }
  })

  return null
}

export default CameraRig
