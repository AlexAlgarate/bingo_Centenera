export interface Equation {
  text: string;
  answer: number;
}

export const generateEquation = (): Equation => {
  const useSimpleEquation = Math.random() < 0.35;
  return useSimpleEquation ? generateSimpleEquation() : generateTwoStepEquation();
};

const generateSimpleEquation = (): Equation => {
  const firstNumber = Math.floor(Math.random() * 40) + 3;
  const secondNumber = Math.floor(Math.random() * 25) + 2;
  const operatorIndex = Math.floor(Math.random() * 3);
  const operatorSymbols = ['+', '−', '·'];
  const operator = operatorSymbols[operatorIndex];
  let resultValue: number;
  if (operator === '+') resultValue = firstNumber + secondNumber;
  else if (operator === '−') {
    resultValue = firstNumber > secondNumber
      ? firstNumber - secondNumber
      : secondNumber - firstNumber;
  } else resultValue = firstNumber * secondNumber;
  const hideVariableOnLeft = Math.random() < 0.5;
  if (operator === '−') {
    if (firstNumber > secondNumber) {
      return {
        answer: hideVariableOnLeft ? firstNumber : secondNumber,
        text: hideVariableOnLeft
          ? `x − ${secondNumber} = ${resultValue}`
          : `${firstNumber} − x = ${resultValue}`,
      };
    } else {
      return {
        answer: hideVariableOnLeft ? secondNumber : firstNumber,
        text: hideVariableOnLeft
          ? `x − ${firstNumber} = ${resultValue}`
          : `${secondNumber} − x = ${resultValue}`,
      };
    }
  } else {
    return {
      answer: hideVariableOnLeft ? firstNumber : secondNumber,
      text: hideVariableOnLeft
        ? `x ${operator} ${secondNumber} = ${resultValue}`
        : `${firstNumber} ${operator} x = ${resultValue}`,
    };
  }
};

const generateTwoStepEquation = (): Equation => {
  const multiplier = Math.floor(Math.random() * 8) + 2;
  const unknownValue = Math.floor(Math.random() * 25) + 2;
  const useAddition = Math.random() < 0.5;
  let constantValue: number;
  let resultValue: number;
  if (useAddition) {
    constantValue = Math.floor(Math.random() * 40) + 1;
    resultValue = multiplier * unknownValue + constantValue;
  } else {
    constantValue = Math.floor(Math.random() * (multiplier * unknownValue - 1)) + 1;
    resultValue = multiplier * unknownValue - constantValue;
  }
  const operator = useAddition ? '+' : '−';
  return {
    answer: unknownValue,
    text: `${multiplier}x ${operator} ${constantValue} = ${resultValue}`,
  };
};
