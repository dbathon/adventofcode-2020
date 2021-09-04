import { p, readLines } from "./util/util";

const lines = readLines("input/a15.txt");

const numbers = lines[0].split(",").map((num) => parseInt(num));

let next = numbers.pop()!;
let nextIndex = numbers.length;
const seenIndexes: Map<number, number> = new Map();
numbers.forEach((number, index) => seenIndexes.set(number, index));

while (nextIndex < 30000000) {
  const lastIndex = seenIndexes.get(next);
  seenIndexes.set(next, nextIndex);
  if (nextIndex + 1 === 2020 || nextIndex + 1 === 30000000) {
    p(next);
  }
  if (lastIndex === undefined) {
    next = 0;
  } else {
    next = nextIndex - lastIndex;
  }
  ++nextIndex;
}
