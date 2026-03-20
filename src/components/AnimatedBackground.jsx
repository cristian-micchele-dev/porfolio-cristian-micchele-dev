import { useEffect, useRef } from 'react'

const NODE_COUNT   = 80
const MAX_DISTANCE = 160
const SPEED        = 0.4
const NODE_RADIUS  = 2
const NODE_COLOR   = '168, 85, 247'

function createNode(w, h) {
  const angle = Math.random() * Math.PI * 2
  return {
    x:  Math.random() * w,
    y:  Math.random() * h,
    vx: Math.cos(angle) * SPEED * (0.3 + Math.random() * 0.7),
    vy: Math.sin(angle) * SPEED * (0.3 + Math.random() * 0.7),
  }
}

function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let raf
    let nodes = []

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      nodes = Array.from({ length: NODE_COUNT }, () =>
        createNode(canvas.width, canvas.height)
      )
    }

    const draw = () => {
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)

      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > h) node.vy *= -1
      }

      // Conexiones entre nodos cercanos
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x
          const dy   = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MAX_DISTANCE) {
            const alpha = (1 - dist / MAX_DISTANCE) * 0.35
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${NODE_COLOR}, ${alpha})`
            ctx.lineWidth   = 0.8
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Nodos: shadowBlur una vez por frame en lugar de createRadialGradient por nodo
      ctx.shadowBlur  = NODE_RADIUS * 8
      ctx.shadowColor = `rgba(${NODE_COLOR}, 0.5)`
      ctx.fillStyle   = `rgba(${NODE_COLOR}, 0.8)`

      for (const node of nodes) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.shadowBlur = 0

      raf = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.7 }}
    />
  )
}

export default AnimatedBackground
