var Game = {
  state: 'TITLE',
  lastTime: 0,
  laser: null,
  wrongFlash: 0,
  levelCompleteTimer: 0,
  wavesPerLevel: 2,
  paused: false,
  
  // Learning mode
  showingLesson: false,
  currentLesson: null,
  wrongAnswer: null,

  init: function () {
    Renderer.init();
    Audio.init();
    this.bindInput();
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  },

  bindInput: function () {
    var self = this;
    document.addEventListener('keydown', function (e) {
      if (self.state === 'TITLE') {
        if (e.key === 'Enter') self.startGame();
        return;
      }

      if (self.state === 'GAME_OVER') {
        if (e.key === 'Enter') self.state = 'TITLE';
        return;
      }

      if (self.state !== 'PLAYING') return;

      // If showing lesson, Enter dismisses it
      if (self.showingLesson) {
        if (e.key === 'Enter') {
          self.dismissLesson();
          e.preventDefault();
        }
        return;
      }

      // Space bar to pause/unpause
      if (e.key === ' ') {
        self.paused = !self.paused;
        e.preventDefault();
        return;
      }

      if (self.paused) return;
      if (self.levelCompleteTimer > 0) return;

      // Number keys
      if (e.key >= '0' && e.key <= '9') {
        Player.input += e.key;
        Audio.keyPress();
        self.checkAutoSubmit();
      }

      // Backspace
      if (e.key === 'Backspace') {
        Player.input = Player.input.slice(0, -1);
        e.preventDefault();
      }

      // Enter to submit
      if (e.key === 'Enter') {
        self.submitAnswer();
      }

      // Tab to cycle target
      if (e.key === 'Tab') {
        e.preventDefault();
        EnemyManager.cycleTarget();
        Player.input = '';
        Player.currentProblemAttempts = 0;
      }
    });
  },

  checkAutoSubmit: function () {
    var targeted = EnemyManager.getTargeted();
    if (!targeted) return;

    var answerStr = String(targeted.problem.answer);
    if (answerStr.length === 1 && Player.input.length === 1) {
      this.submitAnswer();
    }
  },

  submitAnswer: function () {
    var targeted = EnemyManager.getTargeted();
    if (!targeted || Player.input === '') return;

    var playerAnswer = parseInt(Player.input, 10);
    Player.currentProblemAttempts++;

    if (playerAnswer === targeted.problem.answer) {
      // CORRECT!
      this.fireLaser(targeted);
      Audio.laser();
      
      // Track stats
      Player.totalProblems++;
      if (Player.currentProblemAttempts === 1) {
        Player.firstTryCorrect++;
        Player.combo++;
        if (Player.combo > Player.bestCombo) Player.bestCombo = Player.combo;
      } else {
        Player.combo = 0; // Reset combo if needed retry
      }

      var points = 100 + (Player.combo - 1) * 25;
      if (Player.currentProblemAttempts === 1) {
        Player.score += points;
        if (Player.combo >= 3) Audio.combo(Player.combo);
        if (Player.combo === 3) UI.addComboText('AWESOME!', targeted.x, targeted.y - 40);
        else if (Player.combo === 5) UI.addComboText('UNSTOPPABLE!', targeted.x, targeted.y - 40);
        else if (Player.combo === 10) UI.addComboText('MATH WIZARD!', targeted.x, targeted.y - 40);
        else if (Player.combo > 1) UI.addComboText('+' + points, targeted.x, targeted.y - 40);
      } else {
        // Got it on retry - encouraging message
        UI.addComboText('GOT IT!', targeted.x, targeted.y - 40);
        Player.score += 50; // Partial points for learning
      }
      
      Player.currentProblemAttempts = 0;
      Player.input = '';
    } else {
      // WRONG - Show learning moment!
      Player.mistakes++;
      Player.combo = 0;
      Audio.wrong();
      
      // Generate lesson
      this.currentLesson = Learning.explain(targeted.problem);
      this.wrongAnswer = playerAnswer;
      this.showingLesson = true;
      
      Player.input = '';
    }
  },

  dismissLesson: function () {
    this.showingLesson = false;
    this.currentLesson = null;
    this.wrongAnswer = null;
    // Player must now retry the same problem
  },

  fireLaser: function (enemy) {
    this.laser = {
      fromX: Player.x,
      fromY: Player.y - 25,
      toX: enemy.x,
      toY: enemy.y,
      progress: 0,
      duration: 0.15,
      enemy: enemy
    };
  },

  startGame: function () {
    Audio.start();
    Player.reset();
    EnemyManager.reset();
    Particles.particles = [];
    UI.comboTexts = [];
    this.laser = null;
    this.wrongFlash = 0;
    this.levelCompleteTimer = 0;
    this.paused = false;
    this.showingLesson = false;
    this.currentLesson = null;
    this.wrongAnswer = null;
    this.state = 'PLAYING';
    EnemyManager.startWave();
  },

  loop: function (time) {
    var dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop.bind(this));
  },

  update: function (dt) {
    Renderer.updateStars(dt);

    if (this.state !== 'PLAYING') return;
    if (this.paused) return;
    if (this.showingLesson) return;

    // Level complete countdown
    if (this.levelCompleteTimer > 0) {
      this.levelCompleteTimer -= dt;
      if (this.levelCompleteTimer <= 0) {
        EnemyManager.level++;
        EnemyManager.wave = 0;
        EnemyManager.startWave();
      }
      return;
    }

    // Update enemies (no movement in learning mode, but keep the update for targeting)
    EnemyManager.update(dt);

    // Update laser
    if (this.laser) {
      this.laser.progress += dt / this.laser.duration;
      if (this.laser.progress >= 1) {
        var hitEnemy = this.laser.enemy;
        Particles.spawn(hitEnemy.x, hitEnemy.y, '#ff3366', 25);
        Particles.spawn(hitEnemy.x, hitEnemy.y, '#ffcc00', 15);
        Particles.shake(5 + Math.min(Player.combo, 10));
        Audio.explosion();
        EnemyManager.removeEnemy(hitEnemy);
        this.laser = null;
      }
    }

    // Update particles and combo texts
    Particles.update(dt);
    UI.updateComboTexts(dt);

    // Check wave complete
    if (EnemyManager.waveComplete && this.levelCompleteTimer <= 0) {
      if (EnemyManager.wave >= this.wavesPerLevel) {
        this.levelCompleteTimer = 3;
        Audio.levelComplete();
      } else {
        EnemyManager.startWave();
      }
    }

    // Cleanup dead enemies
    EnemyManager.cleanup();
  },

  render: function () {
    var ctx = Renderer.ctx;

    // Screen shake
    var shake = Particles.getShakeOffset();
    ctx.save();
    ctx.translate(shake.x, shake.y);

    Renderer.clear();
    Renderer.drawStars();

    if (this.state === 'TITLE') {
      UI.drawTitleScreen(ctx);
      ctx.restore();
      return;
    }

    // Draw enemies
    var enemies = EnemyManager.enemies;
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].alive) Renderer.drawEnemy(enemies[i]);
    }

    // Draw player
    Renderer.drawPlayer(Player);

    // Draw laser
    if (this.laser) {
      Renderer.drawLaser(
        this.laser.fromX, this.laser.fromY,
        this.laser.toX, this.laser.toY,
        Math.min(this.laser.progress, 1)
      );
    }

    // Draw particles
    Renderer.drawParticles(Particles.particles);

    // HUD
    UI.drawHUD(ctx, Player, EnemyManager.level, EnemyManager.wave);
    UI.drawInputArea(ctx, Player, EnemyManager.getTargeted());
    UI.drawComboTexts(ctx);

    // Level complete overlay
    if (this.levelCompleteTimer > 0) {
      UI.drawLevelComplete(ctx, EnemyManager.level, Player);
    }

    // Paused overlay
    if (this.paused) {
      UI.drawPaused(ctx);
    }

    // Learning lesson overlay
    if (this.showingLesson) {
      var targeted = EnemyManager.getTargeted();
      UI.drawLesson(ctx, targeted ? targeted.problem : null, this.wrongAnswer, this.currentLesson);
    }

    // Game over overlay (not really used in learning mode, but keep for completeness)
    if (this.state === 'GAME_OVER') {
      UI.drawGameOver(ctx, Player);
    }

    ctx.restore();
  }
};

window.addEventListener('load', function () {
  Game.init();
});
