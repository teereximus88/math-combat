var UI = {
  comboTexts: [],

  drawHUD: function (ctx, player, level, wave) {
    // Score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SCORE: ' + player.score, 20, 30);

    // Level / Wave
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#aaaacc';
    ctx.fillText('LEVEL ' + level + '  WAVE ' + wave, 400, 30);

    // Lives as ship icons
    ctx.textAlign = 'right';
    for (var i = 0; i < player.lives; i++) {
      var lx = 770 - i * 30;
      var ly = 25;
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.moveTo(lx, ly - 10);
      ctx.lineTo(lx - 8, ly + 6);
      ctx.lineTo(lx + 8, ly + 6);
      ctx.closePath();
      ctx.fill();
    }

    // Combo display
    if (player.combo >= 3) {
      ctx.textAlign = 'center';
      ctx.font = 'bold 18px monospace';
      var comboText;
      if (player.combo >= 10) {
        ctx.fillStyle = '#ff00ff';
        comboText = player.combo + 'x MATH WIZARD!';
      } else if (player.combo >= 5) {
        ctx.fillStyle = '#ff6600';
        comboText = player.combo + 'x UNSTOPPABLE!';
      } else {
        ctx.fillStyle = '#ffcc00';
        comboText = player.combo + 'x AWESOME!';
      }
      ctx.fillText(comboText, 400, 55);
    }
  },

  drawInputArea: function (ctx, player, targeted) {
    // Input panel background
    ctx.fillStyle = 'rgba(0, 0, 40, 0.85)';
    ctx.fillRect(150, 558, 500, 38);
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(150, 558, 500, 38);

    if (targeted) {
      // Problem text
      ctx.fillStyle = '#ffcc00';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(targeted.problem.text + ' = ', 330, 583);

      // Typed answer with cursor
      ctx.fillStyle = '#00ff66';
      var cursor = Math.floor(Date.now() / 400) % 2 ? '\u2588' : ' ';
      ctx.fillText(player.input + cursor, 480, 583);
    } else {
      ctx.fillStyle = '#556677';
      ctx.font = '18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Waiting for enemies...', 400, 583);
    }
  },

  drawTitleScreen: function (ctx) {
    // Title glow effect
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 56px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MATH COMBAT', 400, 180);
    ctx.shadowBlur = 0;

    // Subtitle
    ctx.fillStyle = '#ff3366';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('DEFEND EARTH WITH MATH!', 400, 225);

    // Decorative ship
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.moveTo(400, 275);
    ctx.lineTo(370, 325);
    ctx.lineTo(430, 325);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#0088cc';
    ctx.beginPath();
    ctx.moveTo(400, 285);
    ctx.lineTo(380, 315);
    ctx.lineTo(420, 315);
    ctx.closePath();
    ctx.fill();

    // Instructions
    ctx.fillStyle = '#8888aa';
    ctx.font = '16px monospace';
    ctx.fillText('Type the answer to destroy aliens!', 400, 370);
    ctx.fillStyle = '#ff6666';
    ctx.fillText('Wrong answers make aliens jump closer!', 400, 395);
    ctx.fillStyle = '#8888aa';
    ctx.fillText('TAB = switch targets    SPACE = pause', 400, 425);
    ctx.fillText('BACKSPACE = correct    ENTER = submit', 400, 450);

    // Blinking start prompt
    var blink = Math.sin(Date.now() / 300) * 0.5 + 0.5;
    ctx.fillStyle = 'rgba(255, 204, 0, ' + (0.5 + blink * 0.5) + ')';
    ctx.font = 'bold 26px monospace';
    ctx.fillText('PRESS ENTER TO START', 400, 510);
  },

  drawGameOver: function (ctx, player) {
    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, 800, 600);

    // Game Over text
    ctx.shadowColor = '#ff3366';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ff3366';
    ctx.font = 'bold 52px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 400, 200);
    ctx.shadowBlur = 0;

    // Final score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px monospace';
    ctx.fillText('FINAL SCORE: ' + player.score, 400, 280);

    // Stats
    ctx.fillStyle = '#ffcc00';
    ctx.font = '22px monospace';
    ctx.fillText('Best Combo: ' + player.bestCombo + 'x', 400, 330);

    // Restart prompt
    var blink = Math.sin(Date.now() / 300) * 0.5 + 0.5;
    ctx.fillStyle = 'rgba(0, 212, 255, ' + (0.5 + blink * 0.5) + ')';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('PRESS ENTER TO PLAY AGAIN', 400, 430);
  },

  drawLevelComplete: function (ctx, level) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, 800, 600);

    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 44px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL ' + level + ' COMPLETE!', 400, 270);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '22px monospace';
    ctx.fillText('Get ready for Level ' + (level + 1) + '...', 400, 330);
  },

  addComboText: function (text, x, y) {
    this.comboTexts.push({ text: text, x: x, y: y, life: 1.5 });
  },

  updateComboTexts: function (dt) {
    for (var i = 0; i < this.comboTexts.length; i++) {
      this.comboTexts[i].life -= dt;
      this.comboTexts[i].y -= 50 * dt;
    }
    this.comboTexts = this.comboTexts.filter(function (t) { return t.life > 0; });
  },

  drawComboTexts: function (ctx) {
    for (var i = 0; i < this.comboTexts.length; i++) {
      var t = this.comboTexts[i];
      ctx.globalAlpha = Math.min(1, t.life);
      ctx.fillStyle = '#ffcc00';
      ctx.font = 'bold 26px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(t.text, t.x, t.y);
    }
    ctx.globalAlpha = 1;
  },

  drawPaused: function (ctx) {
    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, 800, 600);

    // Paused text
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', 400, 280);
    ctx.shadowBlur = 0;

    // Resume hint
    ctx.fillStyle = '#aaaacc';
    ctx.font = '20px monospace';
    ctx.fillText('Press SPACE to resume', 400, 340);
  }
};
