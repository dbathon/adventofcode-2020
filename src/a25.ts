import { p, readLines } from "./util/util";

const lines = readLines("input/a25.txt");

function transform(value: number, subjectNumber: number, loopSize = 1): number {
  for (let i = 0; i < loopSize; ++i) {
    value = (value * subjectNumber) % 20201227;
  }
  return value;
}

function findLoopSize(subjectNumber: number, publicKey: number): number {
  let value = 1;
  let loopSize = 1;
  while (true) {
    value = transform(value, subjectNumber);
    if (value === publicKey) {
      return loopSize;
    }
    ++loopSize;
  }
}

const publicKeys = lines.map(line => parseInt(line));
const loopSizes = publicKeys.map(publicKey => findLoopSize(7, publicKey));

p(transform(1, publicKeys[0], loopSizes[1]));
