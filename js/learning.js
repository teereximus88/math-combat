// Learning explanations for multiplication and division
const Learning = {
  // Generate an explanation for a problem
  explain(problem) {
    const text = problem.text;
    const answer = problem.answer;
    
    // Parse the problem
    if (text.includes('×')) {
      return this.explainMultiply(text, answer);
    } else if (text.includes('÷')) {
      return this.explainDivide(text, answer);
    }
    return this.generic(text, answer);
  },

  explainMultiply(text, answer) {
    const parts = text.split('×').map(s => parseInt(s.trim()));
    const a = parts[0];
    const b = parts[1];
    
    // Pick the best method based on the numbers
    const methods = [];
    
    // Skip counting - good for smaller multipliers
    if (b <= 10) {
      methods.push(this.skipCounting(a, b, answer));
    }
    
    // Break apart - good for larger numbers
    if (b >= 6) {
      methods.push(this.breakApart(a, b, answer));
    }
    
    // Use tens - good for 9s
    if (a === 9 || b === 9) {
      methods.push(this.useTens(a, b, answer));
    }
    
    // Arrays - good for visual learners, smaller problems
    if (a <= 6 && b <= 6) {
      methods.push(this.arrayMethod(a, b, answer));
    }
    
    // Pick one randomly from available methods (keeps it fresh)
    if (methods.length === 0) {
      methods.push(this.skipCounting(a, b, answer));
    }
    
    return methods[Math.floor(Math.random() * methods.length)];
  },

  explainDivide(text, answer) {
    const parts = text.split('÷').map(s => parseInt(s.trim()));
    const dividend = parts[0];
    const divisor = parts[1];
    
    return {
      title: 'Think Backwards!',
      tip: divisor + ' times WHAT equals ' + dividend + '?',
      steps: this.divisionSteps(divisor, answer),
      answer: dividend + ' ÷ ' + divisor + ' = ' + answer
    };
  },

  divisionSteps(divisor, answer) {
    const steps = [];
    for (let i = 1; i <= answer; i++) {
      const product = divisor * i;
      const marker = (i === answer) ? ' ← Found it!' : '';
      steps.push(divisor + ' × ' + i + ' = ' + product + marker);
    }
    // Only show last few steps if too many
    if (steps.length > 6) {
      return ['...', ...steps.slice(-4)];
    }
    return steps;
  },

  skipCounting(a, b, answer) {
    const counts = [];
    for (let i = 1; i <= a; i++) {
      counts.push(b * i);
    }
    
    // Format with position markers
    const countStr = counts.join(', ');
    const positions = counts.map((_, i) => this.ordinal(i + 1));
    
    return {
      title: 'Skip Count by ' + b + '!',
      tip: 'Count by ' + b + 's until you reach the ' + this.ordinal(a) + ' number:',
      steps: [
        countStr,
        '',
        'The ' + this.ordinal(a) + ' number is ' + answer + '!'
      ],
      answer: a + ' × ' + b + ' = ' + answer
    };
  },

  breakApart(a, b, answer) {
    // Break the larger number into 5 + remainder or 10 - remainder
    let part1, part2;
    if (b > 5) {
      part1 = 5;
      part2 = b - 5;
    } else {
      part1 = Math.floor(b / 2);
      part2 = b - part1;
    }
    
    const result1 = a * part1;
    const result2 = a * part2;
    
    return {
      title: 'Break It Apart!',
      tip: 'Split ' + b + ' into ' + part1 + ' + ' + part2 + ':',
      steps: [
        a + ' × ' + part1 + ' = ' + result1,
        a + ' × ' + part2 + ' = ' + result2,
        result1 + ' + ' + result2 + ' = ' + answer
      ],
      answer: a + ' × ' + b + ' = ' + answer
    };
  },

  useTens(a, b, answer) {
    let ten, other, mult;
    if (a === 9) {
      ten = 10;
      other = b;
      mult = a;
    } else {
      ten = 10;
      other = a;
      mult = b;
    }
    
    const tenResult = ten * other;
    
    return {
      title: 'Use Tens!',
      tip: '9 is almost 10, so:',
      steps: [
        '10 × ' + other + ' = ' + tenResult,
        'Subtract one ' + other + ':',
        tenResult + ' - ' + other + ' = ' + answer
      ],
      answer: a + ' × ' + b + ' = ' + answer
    };
  },

  arrayMethod(a, b, answer) {
    // Build a visual array
    const rows = [];
    for (let i = 0; i < a; i++) {
      rows.push('● '.repeat(b).trim());
    }
    
    return {
      title: 'Picture It!',
      tip: a + ' rows of ' + b + ':',
      steps: rows,
      stepsAreArray: true,
      answer: 'Count them all: ' + answer + '!'
    };
  },

  ordinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  },

  generic(text, answer) {
    return {
      title: 'Let\'s Think!',
      tip: 'The answer is:',
      steps: [],
      answer: text + ' = ' + answer
    };
  }
};
