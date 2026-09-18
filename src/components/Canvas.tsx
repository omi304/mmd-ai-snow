import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { CharacterState } from '../types/ai'

type CanvasProps = {
  characterState: CharacterState
}

export function Canvas({ characterState }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const bodyRef = useRef<THREE.Mesh | null>(null)
  const groupRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1d1d1d)

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 1.5, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    )
    containerRef.current.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 10, 7)
    scene.add(dirLight)

    const group = new THREE.Group()
    scene.add(group)
    groupRef.current = group

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x66ccff,
      roughness: 0.4,
      metalness: 0.2,
    })

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.6), bodyMaterial)
    body.position.y = 0.5
    group.add(body)
    bodyRef.current = body

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xf5d7b5 })
    )
    head.position.set(0, 2.1, 0)
    group.add(head)

    const animate = () => {
      requestAnimationFrame(animate)

      if (groupRef.current) {
        const { motion, lookAt, emotion } = characterState

        if (lookAt === 'mouse') {
          groupRef.current.rotation.y += 0.03
        } else if (lookAt === 'user') {
          groupRef.current.rotation.y = 0.4
        } else {
          groupRef.current.rotation.y *= 0.98
        }

        if (motion === 'wave') {
          groupRef.current.rotation.z = Math.sin(Date.now() * 0.01) * 0.8
        } else if (motion === 'nod') {
          groupRef.current.rotation.x = Math.sin(Date.now() * 0.008) * 0.4
        } else {
          groupRef.current.rotation.x *= 0.95
          groupRef.current.rotation.z *= 0.95
        }

        if (emotion === 'happy') {
          bodyMaterial.color.setHex(0x7ad0ff)
        } else if (emotion === 'sad') {
          bodyMaterial.color.setHex(0x8aa3c7)
        } else if (emotion === 'angry') {
          bodyMaterial.color.setHex(0xff7b7b)
        } else if (emotion === 'tired') {
          bodyMaterial.color.setHex(0x8f9ca8)
        } else {
          bodyMaterial.color.setHex(0x66ccff)
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    const onResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [characterState])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
