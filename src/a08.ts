import { p, readLines } from "./util/util";

const lines = readLines("input/a08.txt");

class Op {
  execCount = 0;

  constructor(public accumulator: number, public jump: number) { }
}

function parseOps(lines: string[], modIndex?: number): Op[] {
  return lines.map((line, index) => {
    let [op, arg]: string[] = line.split(" ");
    if (index === modIndex) {
      op = op === "jmp" ? "nop" : op === "nop" ? "jmp" : op;
    }
    if (op === "acc") {
      return new Op(parseInt(arg), 1);
    }
    if (op === "jmp") {
      return new Op(0, parseInt(arg));
    }
    if (op === "nop") {
      return new Op(0, 1);
    }
    throw "error: " + line;
  });
}

function exec(modIndex?: number): { pc: number, acc: number; } {
  const ops = parseOps(lines, modIndex);
  let pc = 0;
  let acc = 0;

  while (ops[pc] && ops[pc].execCount === 0) {
    const op = ops[pc];
    ++op.execCount;
    acc += op.accumulator;
    pc += op.jump;
  }
  return { pc, acc };
}

p(exec().acc);

lines.forEach((_, index) => {
  const result = exec(index);
  if (result.pc === lines.length) {
    p(result.acc);
  }
});
