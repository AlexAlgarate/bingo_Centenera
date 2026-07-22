import { describe, it, expect } from "vitest";
import { generateEquation } from "./equations";

describe("generateEquation", () => {
	it("returns an object with text and answer", () => {
		const eq = generateEquation();
		expect(eq).toHaveProperty("text");
		expect(eq).toHaveProperty("answer");
		expect(typeof eq.text).toBe("string");
		expect(typeof eq.answer).toBe("number");
	});

	it("text contains an equals sign", () => {
		const eq = generateEquation();
		expect(eq.text).toContain("=");
	});

	it("answer is positive", () => {
		for (let i = 0; i < 200; i++) {
			const eq = generateEquation();
			expect(eq.answer).toBeGreaterThan(0);
		}
	});

	it("answer correctly resolves the equation", () => {
		for (let i = 0; i < 500; i++) {
			const eq = generateEquation();
			const trimmed = eq.text.replace(/\s/g, "");
			const eqParts = trimmed.split("=");
			const rhs = Number(eqParts[1]);

			let lhsExpr = eqParts[0];
			const xPos = lhsExpr.indexOf("x");
			if (xPos === -1) throw new Error("No x found in equation: " + eq.text);
			lhsExpr = lhsExpr.replace(/(\d)x/g, "$1*x");
			lhsExpr = lhsExpr.replace("x", String(eq.answer));

			const lhs = evaluateSimpleExpression(lhsExpr);
			expect(
				lhs,
				`Equation "${eq.text}" → lhsExpr "${lhsExpr}" → lhs=${lhs}, rhs=${rhs}`,
			).toBe(rhs);
		}
	});

	it("never produces the same equation on consecutive calls", () => {
		const equations = new Set<string>();
		for (let i = 0; i < 50; i++) {
			equations.add(generateEquation().text);
		}
		expect(equations.size).toBeGreaterThan(1);
	});
});

const evaluateSimpleExpression = (expr: string): number => {
	let normalized = expr.replace(/(\d)x/g, "$1*x");
	const tokens = normalized
		.split(/([+−·*])/)
		.map((t) => t.trim())
		.filter(Boolean);
	let result = Number(tokens[0]);
	for (let i = 1; i < tokens.length; i += 2) {
		const op = tokens[i];
		const num = Number(tokens[i + 1]);
		if (op === "+") result += num;
		else if (op === "−") result -= num;
		else if (op === "·" || op === "*") result *= num;
	}
	return result;
};
