const Player = {
  x: 400,
  y: 540,
  width: 40,
  height: 50,
  score: 0,
  combo: 0,
  bestCombo: 0,
  input: '',
  
  // Learning mode stats
  totalProblems: 0,
  firstTryCorrect: 0,
  mistakes: 0,
  currentProblemAttempts: 0,

  reset() {
    this.x = 400;
    this.y = 540;
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.input = '';
    this.totalProblems = 0;
    this.firstTryCorrect = 0;
    this.mistakes = 0;
    this.currentProblemAttempts = 0;
  },

  get accuracy() {
    if (this.totalProblems === 0) return 100;
    return Math.round((this.firstTryCorrect / this.totalProblems) * 100);
  }
};
