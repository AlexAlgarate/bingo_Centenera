export interface Equation {
	text: string;
	answer: number;
}

const randomInteger = (minimum: number, maximum: number): number =>
	Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

export const generateEquation = (): Equation =>
	Math.random() < 0.35 ? generateSimpleEquation() : generateTwoStepEquation();

const generateSimpleEquation = (): Equation => {
	const firstNumber = randomInteger(3, 42);
	const secondNumber = randomInteger(2, 26);
	const operator = ["+", "−", "*"][randomInteger(0, 2)];
	const variableOnLeft = Math.random() < 0.5;
	const [leftNumber, rightNumber] =
		operator === "−" && firstNumber < secondNumber
			? [secondNumber, firstNumber]
			: [firstNumber, secondNumber];
	const resultValue =
		operator === "+"
			? leftNumber + rightNumber
			: operator === "−"
				? leftNumber - rightNumber
				: leftNumber * rightNumber;
	const leftOperand = variableOnLeft ? "x" : leftNumber;
	const rightOperand = variableOnLeft ? rightNumber : "x";

	return {
		answer: variableOnLeft ? leftNumber : rightNumber,
		text: `${leftOperand} ${operator} ${rightOperand} = ${resultValue}`,
	};
};

const generateTwoStepEquation = (): Equation => {
	const multiplier = randomInteger(2, 9);
	const unknownValue = randomInteger(2, 26);
	const useAddition = Math.random() < 0.5;
	const product = multiplier * unknownValue;
	const constantValue = useAddition
		? randomInteger(1, 40)
		: randomInteger(1, product - 1);
	const operator = useAddition ? "+" : "−";
	const resultValue = useAddition
		? product + constantValue
		: product - constantValue;

	return {
		answer: unknownValue,
		text: `${multiplier}x ${operator} ${constantValue} = ${resultValue}`,
	};
};
