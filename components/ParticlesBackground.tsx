'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  z: number
  baseY: number
  baseX: number
  vx: number
  vy: number
  size: number
  opacity: number
  rotation: number
  waveOffset: number
  mouseWave: number
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
          baseX: x,
          vx: 0,
          vy: 0,
          size: 3,
          opacity: 0.6,
          rotation: Math.random() * Math.PI * 2,
          waveOffset: (i + j) * 0.1,
          mouseWave: 0
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    let time = 0
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.02

      particlesRef.current.forEach((particle, index) => {
        // Ambient wave animation
        const ambientWave = Math.sin(time + particle.waveOffset) * 15
        const ambientWaveX = Math.sin(time * 0.7 + particle.waveOffset * 1.5) * 10
        
        // Mouse wave with smooth follow and parallax
        const dx = mouseRef.current.x - particle.baseX
        const dy = mouseRef.current.y - particle.baseY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        const waveRadius = 400 // Wider radius
        const waveHeight = 40
        
        if (distance < waveRadius) {
          const targetWave = Math.sin((1 - distance / waveRadius) * Math.PI) * waveHeight
          // Smooth interpolation with delay
          particle.mouseWave += (targetWave - particle.mouseWave) * 0.05
        } else {
          particle.mouseWave *= 0.98 // Slower fade out
        }
        
        // Combine waves with parallax effect
        const parallaxFactor = 1 + (particle.waveOffset % 1) * 0.5
        particle.z = (ambientWave + particle.mouseWave) * parallaxFactor
        
        // Update position with both vertical and horizontal movement
        particle.y = particle.baseY - particle.z
        particle.x = particle.baseX + ambientWaveX * parallaxFactor
        
        // Gentle rotation
        particle.rotation += 0.005 + Math.sin(time + particle.waveOffset) * 0.003

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