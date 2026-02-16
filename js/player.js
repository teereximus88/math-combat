const Player = {
  x: 400,
  y: 540,
  width: 40,
  height: 50,
  lives: 3,
  score: 0,
  combo: 0,
  bestCombo: 0,
  input: '',

  reset() {
    this.x = 400;
    this.y = 540;
    this.lives = 3;
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.input = '';
  }
};
