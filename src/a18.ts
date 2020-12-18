import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a18.txt");

function getLeftAndRest(expression: string): string[] {
  expression = expression.trim();
  if (expression.startsWith("(")) {
    let depth = 1;
    let i = 1;
    while (depth > 0) {
      if (expression[i] == "(") {
        ++depth;
      }
      else if (expression[i] == ")") {
        --depth;
      }
      ++i;
    }
    return [expression.substring(1, i - 1), expression.substring(i)];
  }
  else {
    const [_, left, rest] = /^(\d+)(.*)$/.exec(expression) || ["", "", ""];
    return [left, rest];
  }
}

class Node {
  constructor(readonly left: Node | number, readonly op = "+", readonly right: Node | number = 0) { }

  eval(): number {
    const leftNum = typeof this.left === "number" ? this.left : this.left.eval();
    const rightNum = typeof this.right === "number" ? this.right : this.right.eval();
    if (this.op === "*") {
      return leftNum * rightNum;
    }
    else if (this.op === "+") {
      return leftNum + rightNum;
    }
    else {
      throw "unexpected op: " + this.op;
    }
  }
}

function parse(expression: string, lowerPrecendenceOp?: string): Node {
  const parts: Node[] = [];
  let current: Node | undefined = undefined;
  let lastOp: string | undefined = undefined;
  while (expression.length > 0) {
    const [leftStr, rest] = getLeftAndRest(expression);
    expression = rest.substring(3);
    const left = /^(\d+)$/.exec(leftStr) !== null ? parseInt(leftStr) : parse(leftStr, lowerPrecendenceOp);
    if (current === undefined) {
      current = new Node(left);
    }
    else if (lastOp !== undefined) {
      if (lowerPrecendenceOp === lastOp) {
        parts.push(current);
        current = new Node(left);
      }
      else {
        current = new Node(current, lastOp, left);
      }
    }
    else {
      throw "error";
    }

    lastOp = rest[1];
  }
  if (lowerPrecendenceOp === undefined) {
    return current!;
  }
  else {
    if (current !== undefined) {
      parts.push(current);
    }

    return parts.reduce((a, b) => new Node(a, lowerPrecendenceOp, b));
  }
}

p(sum(lines.map(line => parse(line).eval())));

p(sum(lines.map(line => parse(line, "*").eval())));
