'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  z: number
  baseY: number
  vx: number
  vy: number
  size: number
  opacity: number
  rotation: number
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles in a grid for wave effect
    const cols = 50
    const rows = 20
    const particleCount = cols * rows
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = (j / cols) * canvas.width
        const y = (i / rows) * canvas.height
        
        particlesRef.current.push({
          x: x,
          y: y,
          z: 0,
          baseY: y,
          vx: 0,
          vy: 0,
          size: 3,
          opacity: 0.6,
          rotation: Math.random() * Math.PI * 2
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // 3D wave effect based on mouse position
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Create wave effect
        const waveHeight = 30
        const waveRadius = 200
        
        if (distance < waveRadius) {
          const wave = Math.sin((1 - distance / waveRadius) * Math.PI) * waveHeight
          particle.z = wave
          particle.y = particle.baseY - wave
        } else {
          particle.z *= 0.95 // Smooth return to base position
          particle.y = particle.baseY - particle.z
        }
        
        // Rotate rectangles
        particle.rotation += 0.01

        // Calculate color based on distance from mouse
        const dx2 = mouseRef.current.x - particle.x
        const dy2 = mouseRef.current.y - particle.y
        const mouseDist = Math.sqrt(dx2 * dx2 + dy2 * dy2)
        const maxDist = 300
        const colorIntensity = Math.max(0, 1 - mouseDist / maxDist)
        
        // Purple gradient based on mouse distance and z position
        const lightness = 40 + (colorIntensity * 20) + (particle.z / 30 * 20)
        const saturation = 60 + (colorIntensity * 20)
        
        // Draw rectangle with rotation
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)
        
        // Scale based on z position for 3D effect
        const scale = 1 + particle.z / 50
        
        // Rectangle with gradient
        const gradient = ctx.createLinearGradient(
          -particle.size * scale, -particle.size * scale,
          particle.size * scale, particle.size * scale
        )
        
        gradient.addColorStop(0, `hsla(270, ${saturation}%, ${lightness}%, ${particle.opacity * 0.8})`)
        gradient.addColorStop(1, `hsla(280, ${saturation - 10}%, ${lightness - 10}%, ${particle.opacity * 0.4})`)
        
        ctx.fillStyle = gradient
        ctx.fillRect(
          -particle.size * scale,
          -particle.size * scale,
          particle.size * 2 * scale,
          particle.size * 2 * scale
        )
        
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}