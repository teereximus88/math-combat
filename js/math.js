const MathEngine = {
  levelConfig: [
    { tables: [1, 2], ops: ['multiply'] },
    { tables: [2, 5], ops: ['multiply'] },
    { tables: [2, 5, 10], ops: ['multiply'] },
    { tables: [3, 4], ops: ['multiply'] },
    { tables: [1, 2, 3, 4, 5], ops: ['multiply'] },
    { tables: [6, 7], ops: ['multiply'] },
    { tables: [8, 9], ops: ['multiply'] },
    { tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], ops: ['multiply'] },
    { tables: [1, 2, 3, 4, 5], ops: ['divide'] },
    { tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], ops: ['multiply', 'divide'] },
  ],

  generate(level) {
    const config = this.levelConfig[Math.min(level - 1, this.levelConfig.length - 1)];
    const table = config.tables[Math.floor(Math.random() * config.tables.length)];
    const other = Math.floor(Math.random() * 10) + 1;
    const op = config.ops[Math.floor(Math.random() * config.ops.length)];

    if (op === 'divide') {
      const product = table * other;
      return { text: `${product} \u00f7 ${table}`, answer: other };
    }

    return { text: `${table} \u00d7 ${other}`, answer: table * other };
  }
};
