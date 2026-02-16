class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 200 + 50;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1;
    this.decay = Math.random() * 2 + 1;
    this.size = Math.random() * 4 + 2;
    this.color = color;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= this.decay * dt;
  }

  get alive() {
    return this.life > 0;
  }
}

const Particles = {
  particles: [],
  shakeAmount: 0,

  spawn(x, y, color, count) {
    count = count || 20;
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  },

  shake(amount) {
    this.shakeAmount = amount || 10;
  },

  update(dt) {
    this.particles = this.particles.filter(function (p) {
      p.update(dt);
      return p.alive;
    });
    this.shakeAmount *= 0.9;
    if (this.shakeAmount < 0.5) this.shakeAmount = 0;
  },

  getShakeOffset() {
    if (this.shakeAmount === 0) return { x: 0, y: 0 };
    return {
      x: (Math.random() - 0.5) * this.shakeAmount * 2,
      y: (Math.random() - 0.5) * this.shakeAmount * 2,
    };
  }
};
