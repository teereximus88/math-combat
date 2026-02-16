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

  // LEARNING MODE: No movement! Accuracy only.
  // Wrong answers trigger learning explanations
  levelConfig: [
    { speed: 0, count: 4 },
    { speed: 0, count: 5 },
    { speed: 0, count: 5 },
    { speed: 0, count: 6 },
    { speed: 0, count: 6 },
    { speed: 0, count: 6 },
    { speed: 0, count: 7 },
    { speed: 0, count: 7 },
    { speed: 0, count: 6 },
    { speed: 0, count: 8 },
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
    this.waveEnemies = config.count;
    this.waveDefeated = 0;
    this.spawnQueue = 0;
    this.spawnTimer = 0;
    
    // Spawn all enemies immediately in a grid formation
    this.spawnAllEnemies(config.count);
  },

  spawnAllEnemies(count) {
    // Arrange enemies in rows
    var cols = Math.min(count, 4);
    var rows = Math.ceil(count / cols);
    var spacingX = 160;
    var spacingY = 100;
    var startX = 400 - ((cols - 1) * spacingX) / 2;
    var startY = 80;

    var index = 0;
    for (var row = 0; row < rows && index < count; row++) {
      var colsInRow = Math.min(cols, count - index);
      var rowStartX = 400 - ((colsInRow - 1) * spacingX) / 2;
      
      for (var col = 0; col < colsInRow && index < count; col++) {
        var x = rowStartX + col * spacingX;
        var y = startY + row * spacingY;
        var problem = MathEngine.generate(this.level);
        var enemy = new Enemy(x, y, problem, 0);
        this.enemies.push(enemy);
        index++;
      }
    }
    
    // Target the first enemy
    if (this.enemies.length > 0) {
      this.enemies[0].targeted = true;
    }
  },

  update(dt) {
    // No spawning needed - all enemies spawn at wave start
    
    for (var i = 0; i < this.enemies.length; i++) {
      this.enemies[i].update(dt);
    }

    // Ensure something is targeted
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
        alive[0].targeted = true;
      }
    }
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
