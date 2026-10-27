/**
 * Canvas-based particle system for burn effect
 * Embers, sparks, and ash flakes
 */

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.particles = []
    this.animationId = null
    this.isPaused = false
    this.rafTime = 0
    
    // Performance heuristics
    this.performanceMode = this.detectPerformanceMode()
    this.spawnCapMultiplier = this.performanceMode === 'low' ? 0.5 : 1
    
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }
  
  detectPerformanceMode() {
    if (typeof navigator === 'undefined') return 'normal'
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      return 'low'
    }
    return 'normal'
  }
  
  handleVisibilityChange() {
    if (document.hidden) {
      this.pause()
    } else {
      this.resume()
    }
  }
  
  resize(width, height) {
    this.canvas.width = width
    this.canvas.height = height
  }
  
  emit(x, y, type = 'ember') {
    if (this.isPaused) return
    const caps = {
      ember: 30 * this.spawnCapMultiplier,
      spark: 15 * this.spawnCapMultiplier,
      ash: 25 * this.spawnCapMultiplier,
    }
    
    if (this.particles.filter(p => p.type === type).length > caps[type]) {
      return
    }
    
    const particle = this.createParticle(x, y, type)
    this.particles.push(particle)
  }
  
  createParticle(x, y, type) {
    const base = {
      x,
      y,
      type,
      life: 1.0,
      decay: 0.01 + Math.random() * 0.02,
    }
    
    if (type === 'ember') {
      return {
        ...base,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 2 - 0.5,
        size: 1 + Math.random() * 2,
        color: Math.random() > 0.5 ? '#FF6B2C' : '#FFA040',
        flicker: Math.random() * 0.3,
      }
    } else if (type === 'spark') {
      return {
        ...base,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 4 - 2,
        size: 0.5 + Math.random() * 0.8,
        color: '#FFD27A',
        decay: 0.05 + Math.random() * 0.05,
        life: 0.6,
      }
    } else if (type === 'ash') {
      return {
        ...base,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -Math.random() * 0.8 - 0.2,
        size: 1.5 + Math.random() * 2.5,
        color: '#6B6560',
        decay: 0.008 + Math.random() * 0.012,
        sway: Math.random() * Math.PI * 2,
      }
    }
    return base
  }
  
  start() {
    if (this.animationId) return
    const animate = () => {
      this.update()
      this.draw()
      this.animationId = requestAnimationFrame(animate)
    }
    this.animationId = requestAnimationFrame(animate)
  }
  
  update() {
    this.particles = this.particles.filter(p => {
      p.life -= p.decay
      
      if (p.type === 'ember') {
        p.x += p.vx
        p.y += p.vy
        p.vy *= 0.98
        p.vx *= 0.99
      } else if (p.type === 'spark') {
        p.x += p.vx
        p.y += p.vy
        p.vy *= 0.95
      } else if (p.type === 'ash') {
        p.sway += 0.05
        p.x += p.vx + Math.sin(p.sway) * 0.3
        p.y += p.vy
        p.vy *= 0.99
      }
      
      return p.life > 0
    })
  }
  
  draw() {
    if (!this.ctx) return
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    for (const p of this.particles) {
      this.ctx.save()
      this.ctx.globalAlpha = p.life * (0.7 + Math.random() * 0.3)
      
      if (p.type === 'ember' || p.type === 'spark') {
        this.ctx.shadowBlur = 4
        this.ctx.shadowColor = p.color
      }
      
      this.ctx.fillStyle = p.color
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.restore()
    }
  }
  
  pause() {
    this.isPaused = true
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }
  
  resume() {
    if (!this.isPaused) return
    this.isPaused = false
    this.start()
  }
  
  clear() {
    this.particles = []
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }
  
  destroy() {
    this.pause()
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    this.particles = []
  }
}
