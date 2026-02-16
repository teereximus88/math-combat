var Renderer = {
  canvas: null,
  ctx: null,
  stars: [],

  init: function () {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.initStars();
  },

  initStars: function () {
    this.stars = [];
    for (var i = 0; i < 120; i++) {
      this.stars.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        speed: Math.random() * 60 + 10,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.5 + 0.5
      });
    }
  },

  updateStars: function (dt) {
    for (var i = 0; i < this.stars.length; i++) {
      var s = this.stars[i];
      s.y += s.speed * dt;
      if (s.y > 600) {
        s.y = 0;
        s.x = Math.random() * 800;
      }
    }
  },

  clear: function () {
    this.ctx.fillStyle = '#0a0a1a';
    this.ctx.fillRect(0, 0, 800, 600);
  },

  drawStars: function () {
    for (var i = 0; i < this.stars.length; i++) {
      var s = this.stars[i];
      this.ctx.fillStyle = 'rgba(255, 255, 255, ' + s.brightness + ')';
      this.ctx.fillRect(s.x, s.y, s.size, s.size);
    }
  },

  drawPlayer: function (player) {
    var ctx = this.ctx;
    var x = player.x;
    var y = player.y;

    // Ship body
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.moveTo(x, y - 25);
    ctx.lineTo(x - 20, y + 20);
    ctx.lineTo(x + 20, y + 20);
    ctx.closePath();
    ctx.fill();

    // Ship inner
    ctx.fillStyle = '#0088cc';
    ctx.beginPath();
    ctx.moveTo(x, y - 15);
    ctx.lineTo(x - 12, y + 12);
    ctx.lineTo(x + 12, y + 12);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#66eeff';
    ctx.beginPath();
    ctx.arc(x, y - 5, 5, 0, Math.PI * 2);
    ctx.fill();

    // Engine flame
    var flicker = Math.random();
    ctx.fillStyle = flicker > 0.5 ? '#ff6600' : '#ffcc00';
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 20);
    ctx.lineTo(x, y + 30 + Math.random() * 8);
    ctx.lineTo(x + 8, y + 20);
    ctx.closePath();
    ctx.fill();

    // Wing tips
    ctx.fillStyle = '#00aadd';
    ctx.beginPath();
    ctx.moveTo(x - 20, y + 20);
    ctx.lineTo(x - 28, y + 16);
    ctx.lineTo(x - 16, y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 20);
    ctx.lineTo(x + 28, y + 16);
    ctx.lineTo(x + 16, y + 10);
    ctx.closePath();
    ctx.fill();
  },

  drawEnemy: function (enemy) {
    var ctx = this.ctx;
    var x = enemy.x;
    var y = enemy.y;
    var targeted = enemy.targeted;
    var inDangerZone = enemy.inDangerZone;

    var color = '#ff3366';
    if (inDangerZone) {
      color = Math.floor(Date.now() / 200) % 2 ? '#ff0000' : '#ff3366';
    }

    // Target reticle
    if (targeted) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.stroke();

      var s = 35;
      ctx.beginPath();
      ctx.moveTo(x - s, y - s + 10); ctx.lineTo(x - s, y - s); ctx.lineTo(x - s + 10, y - s);
      ctx.moveTo(x + s - 10, y - s); ctx.lineTo(x + s, y - s); ctx.lineTo(x + s, y - s + 10);
      ctx.moveTo(x + s, y + s - 10); ctx.lineTo(x + s, y + s); ctx.lineTo(x + s - 10, y + s);
      ctx.moveTo(x - s + 10, y + s); ctx.lineTo(x - s, y + s); ctx.lineTo(x - s, y + s - 10);
      ctx.stroke();
    }

    // Enemy body (hexagon)
    ctx.fillStyle = color;
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      var r = 25;
      var px = x + Math.cos(angle) * r;
      var py = y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Enemy border glow
    ctx.strokeStyle = 'rgba(255, 100, 150, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x - 8, y - 5, 6, 0, Math.PI * 2);
    ctx.arc(x + 8, y - 5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x - 7, y - 4, 3, 0, Math.PI * 2);
    ctx.arc(x + 9, y - 4, 3, 0, Math.PI * 2);
    ctx.fill();

    // Math problem text on enemy
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(enemy.problem.text, x, y + 18);
  },

  drawLaser: function (fromX, fromY, toX, toY, progress) {
    var ctx = this.ctx;
    var currentX = fromX + (toX - fromX) * progress;
    var currentY = fromY + (toY - fromY) * progress;

    // Outer glow
    ctx.strokeStyle = 'rgba(0, 255, 100, 0.2)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Mid glow
    ctx.strokeStyle = 'rgba(0, 255, 100, 0.4)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Core
    ctx.strokeStyle = '#00ff66';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Bright center
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
  },

  drawParticles: function (particles) {
    var ctx = this.ctx;
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  },

  drawWrongFlash: function () {
    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
    this.ctx.fillRect(0, 0, 800, 600);
  }
};
