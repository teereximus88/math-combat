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

    // Accuracy indicator (replaces lives)
    ctx.textAlign = 'right';
    ctx.font = 'bold 18px monospace';
    var acc = player.accuracy;
    if (acc >= 90) ctx.fillStyle = '#00ff66';
    else if (acc >= 70) ctx.fillStyle = '#ffcc00';
    else ctx.fillStyle = '#ff6666';
    ctx.fillText(acc + '% ACCURACY', 780, 28);
    
    // Problems solved
    ctx.font = '14px monospace';
    ctx.fillStyle = '#8888aa';
    ctx.fillText(player.firstTryCorrect + '/' + player.totalProblems + ' first try', 780, 48);

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
        comboText = player.combo + 'x STREAK!';
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
      ctx.fillText('Wave complete!', 400, 583);
    }
  },

  drawTitleScreen: function (ctx) {
    // Title glow effect
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 56px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MATH COMBAT', 400, 160);
    ctx.shadowBlur = 0;

    // Subtitle
    ctx.fillStyle = '#ff3366';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('LEARN MULTIPLICATION!', 400, 200);

    // Decorative ship
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.moveTo(400, 245);
    ctx.lineTo(370, 295);
    ctx.lineTo(430, 295);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#0088cc';
    ctx.beginPath();
    ctx.moveTo(400, 255);
    ctx.lineTo(380, 285);
    ctx.lineTo(420, 285);
    ctx.closePath();
    ctx.fill();

    // Instructions
    ctx.fillStyle = '#8888aa';
    ctx.font = '16px monospace';
    ctx.fillText('Type the answer to destroy aliens!', 400, 345);
    ctx.fillStyle = '#66dd66';
    ctx.fillText('No rush - take your time to think!', 400, 370);
    ctx.fillStyle = '#ffaa66';
    ctx.fillText('Wrong answers teach you HOW to solve it', 400, 395);
    ctx.fillStyle = '#8888aa';
    ctx.fillText('TAB = switch targets    SPACE = pause', 400, 430);

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
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 52px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GREAT JOB!', 400, 180);
    ctx.shadowBlur = 0;

    // Stats
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px monospace';
    ctx.fillText('FINAL SCORE: ' + player.score, 400, 250);

    ctx.fillStyle = '#ffcc00';
    ctx.font = '22px monospace';
    ctx.fillText('Accuracy: ' + player.accuracy + '%', 400, 300);
    ctx.fillText('First Try: ' + player.firstTryCorrect + '/' + player.totalProblems, 400, 335);
    ctx.fillText('Best Streak: ' + player.bestCombo + 'x', 400, 370);

    // Restart prompt
    var blink = Math.sin(Date.now() / 300) * 0.5 + 0.5;
    ctx.fillStyle = 'rgba(0, 212, 255, ' + (0.5 + blink * 0.5) + ')';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('PRESS ENTER TO PLAY AGAIN', 400, 450);
  },

  drawLevelComplete: function (ctx, level, player) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, 800, 600);

    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 44px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL ' + level + ' COMPLETE!', 400, 230);
    ctx.shadowBlur = 0;

    // Show accuracy for this session
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px monospace';
    ctx.fillText('Accuracy: ' + player.accuracy + '%', 400, 290);
    
    var firstTry = player.firstTryCorrect;
    var total = player.totalProblems;
    ctx.fillStyle = '#aaddaa';
    ctx.font = '20px monospace';
    ctx.fillText(firstTry + ' of ' + total + ' correct on first try!', 400, 330);

    ctx.fillStyle = '#aaaacc';
    ctx.fillText('Get ready for Level ' + (level + 1) + '...', 400, 380);
  },

  drawLesson: function (ctx, problem, wrongAnswer, lesson) {
    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 20, 0.92)';
    ctx.fillRect(0, 0, 800, 600);

    // Box
    ctx.fillStyle = 'rgba(20, 20, 60, 0.95)';
    ctx.strokeStyle = '#ff6666';
    ctx.lineWidth = 3;
    ctx.fillRect(100, 80, 600, 440);
    ctx.strokeRect(100, 80, 600, 440);

    // Header - Not quite!
    ctx.fillStyle = '#ff6666';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✗ NOT QUITE!', 400, 130);

    // Show the problem and wrong answer
    if (problem) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px monospace';
      ctx.fillText(problem.text + ' = ?', 400, 180);
      
      ctx.fillStyle = '#ff8888';
      ctx.font = '20px monospace';
      ctx.fillText('You said: ' + wrongAnswer, 400, 215);
    }

    // Divider
    ctx.strokeStyle = '#444488';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 240);
    ctx.lineTo(650, 240);
    ctx.stroke();

    // Lesson content
    if (lesson) {
      // Tip title
      ctx.fillStyle = '#ffcc00';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('💡 ' + lesson.title, 400, 280);

      // Tip explanation
      ctx.fillStyle = '#aaddff';
      ctx.font = '18px monospace';
      ctx.fillText(lesson.tip, 400, 315);

      // Steps
      ctx.fillStyle = '#ffffff';
      ctx.font = lesson.stepsAreArray ? '16px monospace' : '20px monospace';
      var stepY = 355;
      var stepSpacing = lesson.stepsAreArray ? 22 : 28;
      
      for (var i = 0; i < lesson.steps.length && i < 8; i++) {
        ctx.fillText(lesson.steps[i], 400, stepY);
        stepY += stepSpacing;
      }

      // Final answer
      ctx.fillStyle = '#00ff66';
      ctx.font = 'bold 26px monospace';
      ctx.fillText(lesson.answer, 400, Math.min(stepY + 15, 470));
    }

    // Continue prompt
    var blink = Math.sin(Date.now() / 300) * 0.5 + 0.5;
    ctx.fillStyle = 'rgba(0, 212, 255, ' + (0.5 + blink * 0.5) + ')';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('[ Press ENTER to try again ]', 400, 505);
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
