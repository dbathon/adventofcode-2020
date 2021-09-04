import { p, readLines, sum } from "./util/util";
import { Node, OneOrMore, parse, Rule } from "./util/parse";

const lines = readLines("input/a18.txt");

function calculate(nodeChildren: (string | Node)[]): number {
  if (nodeChildren.length === 1) {
    const child = nodeChildren[0];
    if (typeof child === "string") {
      return parseInt(child);
    } else {
      return calculate(child.children);
    }
  }
  if (nodeChildren[0] === "(") {
    return calculate(nodeChildren.slice(1, -1));
  }
  const left = calculate(nodeChildren.slice(0, -2));
  const operator = nodeChildren[nodeChildren.length - 2].toString().trim();
  const right = calculate(nodeChildren.slice(-1));
  if (operator === "*") {
    return left * right;
  } else if (operator === "+") {
    return left + right;
  } else {
    throw "unexpected op: " + operator;
  }
}

const rules1 = new Map([
  ["term", new Rule([[/\d+/], [/\(/, "expression", /\)/]])],
  ["expression", new Rule([["term"], ["term", new OneOrMore([/ *(\*|\+) */, "term"])]])],
]);

p(sum(lines.map((line) => calculate(parse(line, rules1, "expression")!.children))));

const rules2 = new Map([
  ["term", new Rule([[/\d+/], [/\(/, "expression", /\)/]])],
  ["sum", new Rule([["term"], ["term", / *\+ */, "sum"]])],
  ["expression", new Rule([["sum"], ["sum", / *\* */, "expression"]])],
]);

p(sum(lines.map((line) => calculate(parse(line, rules2, "expression")!.children))));
