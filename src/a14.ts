import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a14.txt");

// Unfortunately we cannot use the bitwise operators, because they are only 32 bit...
function isBitSet(value: number, bit: number) {
  return Math.floor(value / bit) % 2 === 1;
}

function applyMask(value: number, mask: string): number {
  let bit = 1;
  for (let i = mask.length - 1; i >= 0; --i) {
    const bitSet = isBitSet(value, bit);
    if (mask[i] === "1" && !bitSet) {
      value += bit;
    } else if (mask[i] === "0" && bitSet) {
      value -= bit;
    }
    bit *= 2;
  }
  return value;
}

function generateAddresses(address: number, mask: string): number[] {
  let bit = 1;
  const floatingBits: number[] = [];
  for (let i = mask.length - 1; i >= 0; --i) {
    if (mask[i] === "1" && !isBitSet(address, bit)) {
      address += bit;
    } else if (mask[i] === "X") {
      floatingBits.push(bit);
    }
    bit *= 2;
  }
  let result = [address];
  floatingBits.forEach((floatingBit) => {
    const newResult: number[] = [];
    result.forEach((entry) => {
      if (isBitSet(entry, floatingBit)) {
        newResult.push(entry - floatingBit);
        newResult.push(entry);
      } else {
        newResult.push(entry);
        newResult.push(entry + floatingBit);
      }
    });
    result = newResult;
  });

  return result;
}

const mem: number[] = [];
const mem2: Map<number, number> = new Map();
let mask = "";

lines.forEach((line) => {
  if (line.startsWith("mask = ")) {
    mask = line.substr(7);
  } else {
    const match = /^mem\[(\d+)] = (\d+)$/.exec(line);
    if (match !== null) {
      const address = parseInt(match[1]);
      const value = parseInt(match[2]);
      mem[address] = applyMask(value, mask);
      generateAddresses(address, mask).forEach((genAddress) => {
        mem2.set(genAddress, value);
      });
    } else {
      throw "unexpected: " + line;
    }
  }
});

p(sum(mem));

p(sum([...mem2].map((entry) => entry[1])));
