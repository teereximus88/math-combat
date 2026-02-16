class Enemy {
  constructor(x, y, problem, speed) {
    this.x = x;
    this.y = y;
    this.problem = problem;
    this.speed = speed;
    this.width = 60;
    this.height = 50;
    this.targeted = false;
    this.alive = true;
    this.flash = 0;
  }

  update(dt) {
    this.y += this.speed * dt;
    if (this.flash > 0) this.flash -= dt;
  }

  get inDangerZone() {
    return this.y > 480;
  }

  get reachedBottom() {
    return this.y >= 550;
  }
}

const EnemyManager = {
  enemies: [],
  wave: 0,
  level: 1,
  waveEnemies: 0,
  waveDefeated: 0,
  spawnTimer: 0,
  spawnQueue: 0,

  levelConfig: [
    { speed: 25, count: 3 },
    { speed: 25, count: 4 },
    { speed: 35, count: 5 },
    { speed: 35, count: 5 },
    { speed: 45, count: 6 },
    { speed: 45, count: 5 },
    { speed: 45, count: 5 },
    { speed: 45, count: 7 },
    { speed: 35, count: 5 },
    { speed: 55, count: 8 },
  ],

  reset() {
    this.enemies = [];
    this.wave = 0;
    this.level = 1;
    this.spawnQueue = 0;
    this.spawnTimer = 0;
    this.waveDefeated = 0;
    this.waveEnemies = 0;
  },

  startWave() {
    this.wave++;
    var config = this.levelConfig[Math.min(this.level - 1, this.levelConfig.length - 1)];
    this.spawnQueue = config.count;
    this.waveEnemies = config.count;
    this.waveDefeated = 0;
    this.spawnTimer = 0;
  },

  update(dt) {
    if (this.spawnQueue > 0) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnOne();
        this.spawnQueue--;
        this.spawnTimer = 1.2;
      }
    }

    for (var i = 0; i < this.enemies.length; i++) {
      this.enemies[i].update(dt);
    }

    var targeted = null;
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].targeted && this.enemies[i].alive) {
        targeted = this.enemies[i];
        break;
      }
    }
    if (!targeted) {
      var alive = this.enemies.filter(function (e) { return e.alive; });
      if (alive.length > 0) {
        alive.sort(function (a, b) { return b.y - a.y; });
        alive[0].targeted = true;
      }
    }
  },

  spawnOne() {
    var config = this.levelConfig[Math.min(this.level - 1, this.levelConfig.length - 1)];
    var problem = MathEngine.generate(this.level);
    var x = 80 + Math.random() * 640;
    var enemy = new Enemy(x, -40, problem, config.speed);
    this.enemies.push(enemy);
  },

  getTargeted() {
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].targeted && this.enemies[i].alive) return this.enemies[i];
    }
    return null;
  },

  cycleTarget() {
    var alive = this.enemies.filter(function (e) { return e.alive; });
    if (alive.length <= 1) return;

    var currentIdx = -1;
    for (var i = 0; i < alive.length; i++) {
      if (alive[i].targeted) { currentIdx = i; break; }
    }
    for (var i = 0; i < alive.length; i++) {
      alive[i].targeted = false;
    }
    var nextIdx = (currentIdx + 1) % alive.length;
    alive[nextIdx].targeted = true;
  },

  removeEnemy(enemy) {
    enemy.alive = false;
    enemy.targeted = false;
    this.waveDefeated++;
  },

  get waveComplete() {
    return this.spawnQueue === 0 && this.enemies.filter(function (e) { return e.alive; }).length === 0;
  },

  cleanup() {
    this.enemies = this.enemies.filter(function (e) { return e.alive || e.y < 650; });
  }
};
