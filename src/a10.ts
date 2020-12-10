import { p, readLines } from "./util/util";

const ratings = readLines("input/a10.txt").map(line => parseInt(line));

ratings.push(0);
ratings.sort((a, b) => a - b);

let countOnes = 0;
let countThrees = 1;

for (let i = 1; i < ratings.length; ++i) {
  const diff = ratings[i] - ratings[i - 1];
  if (diff === 1) {
    ++countOnes;
  }
  if (diff === 3) {
    ++countThrees;
  }
}

p(countOnes * countThrees);

const ratingsSet = new Set(ratings);
const cache: Map<number, number> = new Map();

function possibilities(startingFrom: number): number {
  const cachedResult = cache.get(startingFrom);
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  let result = 0;
  for (let i = 1; i <= 3; ++i) {
    if (ratingsSet.has(startingFrom + i)) {
      result += possibilities(startingFrom + i);
    }
  }
  result = Math.max(result, 1);
  cache.set(startingFrom, result);
  return result;
}

p(possibilities(0));
