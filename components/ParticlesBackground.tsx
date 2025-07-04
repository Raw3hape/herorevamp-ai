'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
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

    // Initialize particles
    const particleCount = 1000
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        hue: Math.random() * 360
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150) {
          const force = (150 - distance) / 150
          particle.vx -= (dx / distance) * force * 0.3
          particle.vy -= (dy / distance) * force * 0.3
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Damping
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Boundaries
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Update hue for gradient effect
        particle.hue = (particle.hue + 0.5) % 360
        
        // Draw particle as glowing spark
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        )
        
        const hsl = `hsl(${particle.hue}, 70%, 60%)`
        gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`)
        gradient.addColorStop(0.5, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity * 0.5})`)
        gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 50%, 0)`)
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
        
        // Inner bright core
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 90%, ${particle.opacity})`
        ctx.fill()
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