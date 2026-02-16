const MathEngine = {
  // Progressive difficulty - each level builds on the last
  levelConfig: [
    // Level 1: Super easy - 1s and 2s only, small numbers
    { tables: [1, 2], maxOther: 5, ops: ['multiply'] },
    // Level 2: 2s and 5s (easy patterns)
    { tables: [2, 5], maxOther: 6, ops: ['multiply'] },
    // Level 3: Add 10s (easy) and expand range
    { tables: [2, 5, 10], maxOther: 8, ops: ['multiply'] },
    // Level 4: Introduce 3s and 4s
    { tables: [3, 4], maxOther: 7, ops: ['multiply'] },
    // Level 5: Mix of 2-5
    { tables: [2, 3, 4, 5], maxOther: 9, ops: ['multiply'] },
    // Level 6: The tricky 6s and 7s
    { tables: [6, 7], maxOther: 8, ops: ['multiply'] },
    // Level 7: The hardest - 7s, 8s, 9s
    { tables: [7, 8, 9], maxOther: 9, ops: ['multiply'] },
    // Level 8: Full multiplication review
    { tables: [2, 3, 4, 5, 6, 7, 8, 9], maxOther: 10, ops: ['multiply'] },
    // Level 9: Introduce division (easier tables)
    { tables: [2, 3, 4, 5], maxOther: 8, ops: ['divide'] },
    // Level 10: Mixed operations - the ultimate challenge!
    { tables: [2, 3, 4, 5, 6, 7, 8, 9], maxOther: 10, ops: ['multiply', 'divide'] },
    // Level 11+: Keep it hard
    { tables: [6, 7, 8, 9], maxOther: 12, ops: ['multiply', 'divide'] },
  ],

  generate(level) {
    const config = this.levelConfig[Math.min(level - 1, this.levelConfig.length - 1)];
    const table = config.tables[Math.floor(Math.random() * config.tables.length)];
    const maxOther = config.maxOther || 10;
    const other = Math.floor(Math.random() * maxOther) + 1;
    const op = config.ops[Math.floor(Math.random() * config.ops.length)];

    if (op === 'divide') {
      const product = table * other;
      return { text: `${product} \u00f7 ${table}`, answer: other };
    }

    return { text: `${table} \u00d7 ${other}`, answer: table * other };
  }
};
