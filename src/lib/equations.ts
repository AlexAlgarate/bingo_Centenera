export interface Equation {
  text: string;
  answer: number;
}

export function generateEquation(): Equation {
  const isSimple = Math.random() < 0.35;
  if (isSimple) {
    return generateSimple();
  } else {
    return generateTwoStep();
  }
}

function generateSimple(): Equation {
  const a = Math.floor(Math.random() * 40) + 3;
  const b = Math.floor(Math.random() * 25) + 2;
  const opIx = Math.floor(Math.random() * 3);
  const ops = ['+', '−', '·'];
  const op = ops[opIx];
  let result: number;
  if (op === '+') result = a + b;
  else if (op === '−') {
    result = a > b ? a - b : b - a;
  } else result = a * b;
  const hideLeft = Math.random() < 0.5;
  if (op === '−') {
    if (a > b) {
      return {
        answer: hideLeft ? a : b,
        text: hideLeft ? `x − ${b} = ${result}` : `${a} − x = ${result}`,
      };
    } else {
      return {
        answer: hideLeft ? b : a,
        text: hideLeft ? `x − ${a} = ${result}` : `${b} − x = ${result}`,
      };
    }
  } else {
    return {
      answer: hideLeft ? a : b,
      text: hideLeft ? `x ${op} ${b} = ${result}` : `${a} ${op} x = ${result}`,
    };
  }
}

function generateTwoStep(): Equation {
  const a = Math.floor(Math.random() * 8) + 2;
  const x = Math.floor(Math.random() * 25) + 2;
  const add = Math.random() < 0.5;
  let b: number, result: number;
  if (add) {
    b = Math.floor(Math.random() * 40) + 1;
    result = a * x + b;
  } else {
    b = Math.floor(Math.random() * (a * x - 1)) + 1;
    result = a * x - b;
  }
  const op = add ? '+' : '−';
  return {
    answer: x,
    text: `${a}x ${op} ${b} = ${result}`,
  };
}
