import React, { useEffect, useRef } from 'react'

interface ThreeDBackgroundCanvasProps {
  scrollProgress: number // 0 to 1
  mousePos: { x: number; y: number }
}

export const ThreeDBackgroundCanvas: React.FC<ThreeDBackgroundCanvasProps> = ({
  scrollProgress,
  mousePos,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Generate 3D particles with (x, y, z)
    const particleCount = 75
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.8,
      z: Math.random() * 1000 + 100, // 100 to 1100 depth
      baseRadius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: -(Math.random() * 1.2 + 0.6), // Moving towards camera
      hue: Math.random() > 0.4 ? 245 : Math.random() > 0.5 ? 280 : 190, // Indigo, Violet, Cyan
    }))

    // 3D Geometric Floating Prisms / Cubes
    const shapes = [
      { x: -width * 0.32, y: -height * 0.2, z: 400, rotX: 0, rotY: 0, rotZ: 0, size: 45, hue: 240 },
      { x: width * 0.34, y: height * 0.15, z: 500, rotX: 0.5, rotY: 0.3, rotZ: 0.2, size: 60, hue: 280 },
      { x: -width * 0.25, y: height * 0.35, z: 650, rotX: 1.2, rotY: -0.4, rotZ: 0.5, size: 40, hue: 195 },
      { x: width * 0.28, y: -height * 0.3, z: 550, rotX: -0.8, rotY: 0.8, rotZ: 0.1, size: 50, hue: 260 },
    ]

    const focalLength = 400

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Background Gradient shift based on scroll
      const bgGrad = ctx.createRadialGradient(
        width / 2 + mousePos.x * 120,
        height * 0.45 - scrollProgress * 150,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      )

      if (scrollProgress < 0.5) {
        // Page 1: Cosmic Scholar Theme (Deep Slate / Indigo)
        bgGrad.addColorStop(0, 'rgba(30, 27, 75, 0.45)')
        bgGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.7)')
        bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)')
      } else {
        // Page 2: Portal Cyber Theme (Violet / Purple Glow)
        bgGrad.addColorStop(0, 'rgba(59, 7, 100, 0.45)')
        bgGrad.addColorStop(0.5, 'rgba(24, 9, 53, 0.75)')
        bgGrad.addColorStop(1, 'rgba(3, 7, 18, 0.98)')
      }

      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Perspective camera offsets
      const camX = mousePos.x * 140
      const camY = mousePos.y * 100 + scrollProgress * 300

      // Render 3D Shapes (wireframe cubes/diamonds)
      shapes.forEach((s) => {
        s.rotX += 0.007
        s.rotY += 0.01
        s.rotZ += 0.005

        const relX = s.x - camX
        const relY = s.y - camY
        const relZ = s.z

        if (relZ <= 10) return

        const scale = focalLength / relZ
        const screenX = width / 2 + relX * scale
        const screenY = height / 2 + relY * scale

        // Simple 3D wireframe box
        const d = s.size * scale
        ctx.save()
        ctx.translate(screenX, screenY)
        ctx.rotate(s.rotZ)

        ctx.strokeStyle = `hsla(${s.hue}, 85%, 65%, ${0.25 * (1 - relZ / 1200)})`
        ctx.lineWidth = 1.5
        ctx.strokeRect(-d / 2, -d / 2, d, d)

        // Inner diamond
        ctx.beginPath()
        ctx.moveTo(0, -d * 0.7)
        ctx.lineTo(d * 0.7, 0)
        ctx.lineTo(0, d * 0.7)
        ctx.lineTo(-d * 0.7, 0)
        ctx.closePath()
        ctx.stroke()

        ctx.restore()
      })

      // Render 3D Starfield & Constellation Lines
      const projectedPoints: { x: number; y: number; z: number; radius: number; hue: number }[] = []

      particles.forEach((p) => {
        // Update Z position
        p.z += p.vz * (1 + scrollProgress * 1.5)
        if (p.z <= 10) p.z = 1100

        p.x += p.vx
        p.y += p.vy

        const relX = p.x - camX
        const relY = p.y - camY
        const relZ = p.z

        const scale = focalLength / relZ
        const screenX = width / 2 + relX * scale
        const screenY = height / 2 + relY * scale
        const radius = Math.max(0.5, p.baseRadius * scale)

        // Store for distance checking
        if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
          projectedPoints.push({ x: screenX, y: screenY, z: relZ, radius, hue: p.hue })

          const alpha = Math.min(1, Math.max(0.1, (1 - relZ / 1100) * 1.2))
          ctx.beginPath()
          ctx.arc(screenX, screenY, radius, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${alpha})`
          ctx.fill()
        }
      })

      // Connect nearby particles for constellation lattice
      const maxDist = 90
      for (let i = 0; i < projectedPoints.length; i++) {
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p1 = projectedPoints[i]
          const p2 = projectedPoints[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18 * (1 - p1.z / 1200)
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(165, 180, 252, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [scrollProgress, mousePos])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full transition-opacity duration-700"
    />
  )
}
