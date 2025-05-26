'use client'

import { OrthographicCamera } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function ChaoticWaves() {
  const mesh = useRef<THREE.InstancedMesh | null>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const count = 12000 // Increased particle count for better coverage
  const temp = useMemo(() => new THREE.Object3D(), [])
  const { viewport } = useThree()

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mousePosition.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mousePosition.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  const particleData = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        baseSpeed: Math.random() * 1.5 + 0.5, // Reduced speed variation
        phase: Math.random() * Math.PI * 2,
        amplitude: Math.random() * 2 + 0.5, // Reduced amplitude variation
        fadeDistance: Math.random() * 0.15 + 0.05, // Individual fade distance
      })),
    []
  )

  const colors = useMemo(() => {
    const array = new Float32Array(count * 3)
    const colorPalette = [
      [0.2, 0.5, 0.8], // Ocean blue
      [0.8, 0.3, 0.5], // Rose
      [0.3, 0.7, 0.4], // Mint green
      [0.7, 0.4, 0.8], // Purple
      [0.9, 0.5, 0.2], // Orange
      [0.4, 0.8, 0.7], // Turquoise
    ]

    for (let i = 0; i < count; i++) {
      const color = colorPalette[i % colorPalette.length]
      array[i * 3] = color[0]
      array[i * 3 + 1] = color[1]
      array[i * 3 + 2] = color[2]
    }
    return array
  }, [])

  useEffect(() => {
    const colorArray = new THREE.Float32BufferAttribute(colors, 3)
    if (mesh.current) {
      mesh.current.geometry.setAttribute('color', colorArray)
    }
  }, [colors])

  const calculateFade = (x: number, y: number, fadeDistance: number) => {
    const screenX = (x / viewport.width) * 2
    const screenY = (y / viewport.height) * 2
    const distance = Math.hypot(screenX - mousePosition.current.x, screenY - mousePosition.current.y)
    const fade = Math.max(0, Math.min(1, (distance - 0.1) / fadeDistance))
    return fade
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const { baseSpeed, phase, amplitude, fadeDistance } = particleData[i]

      // Distribute particles across the screen with slight randomization
      let x = (Math.random() - 0.5) * 120
      let y = (Math.random() - 0.5) * viewport.height * 0.85
      let z = 0

      // Smooth wave motion
      const particleTime = (time + phase) * baseSpeed
      const cyclePosition = (particleTime % 8) / 8 // 8-second cycle for slower movement

      // Gentle fluid motion
      x += Math.sin(particleTime * 0.3 + y * 0.05) * amplitude
      y += Math.cos(particleTime * 0.2 + x * 0.05) * amplitude
      z = Math.sin(particleTime * 0.4 + x * 0.03 + y * 0.03) * 0.3

      // Calculate fade based on mouse position
      const fade = calculateFade(x, y, fadeDistance)

      // Apply scale and opacity based on fade
      const scale = 0.15 + Math.random() * 0.2 * fade
      temp.position.set(x, y, z)
      temp.scale.set(scale, scale, scale)
      temp.updateMatrix()
      if (mesh.current) {
        mesh.current.setMatrixAt(i, temp.matrix)
      }
    }
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </sphereGeometry>
      <meshBasicMaterial vertexColors transparent opacity={0.4} />
    </instancedMesh>
  )
}

export default function GenerativeBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom, #000000, #1a1a2e)',
      }}
    >
      <Canvas style={{ background: 'transparent' }}>
        <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={10} />
        <ChaoticWaves />
      </Canvas>
    </div>
  )
}
