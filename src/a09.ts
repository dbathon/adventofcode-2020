import { p, readLines, sum } from "./util/util";

const numbers = readLines("input/a09.txt").map(line => parseInt(line));

function findError(numbers: number[], windowSize: number) {
  outer: for (let index = windowSize; index < numbers.length; ++index) {
    const num = numbers[index];

    for (let i = index - windowSize; i < index; ++i) {
      const n1 = numbers[i];
      for (let j = i + 1; j < index; ++j) {
        const n2 = numbers[j];
        if (n1 + n2 === num) {
          // valid
          continue outer;
        }
      }
    }

    return num;
  }
}

const invalidNumber = findError(numbers, 25);
p(invalidNumber);

if (invalidNumber !== undefined) {
  for (let i = 0; i < numbers.length; ++i) {
    const subset: number[] = [numbers[i]];
    for (let j = i + 1; j < numbers.length; ++j) {
      subset.push(numbers[j]);
      const currentSum = sum(subset);
      if (currentSum === invalidNumber) {
        p(Math.min(...subset) + Math.max(...subset));
      }
      if (currentSum > invalidNumber) {
        break;
      }
    }
  }
}
