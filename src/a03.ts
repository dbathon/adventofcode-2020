import { p, readLines } from "./util/util";

const lines = readLines("input/a03.txt");

function checkSlope(right: number, down: number): number {
  let count = 0;

  let x = 0;
  for (let y = 0; y < lines.length; y += down) {
    const line = lines[y];
    const tree = line[x % line.length] === "#";
    if (tree) {
      ++count;
    }
    x += right;
  }
  return count;
}

p(checkSlope(3, 1));

p(checkSlope(1, 1) * checkSlope(3, 1) * checkSlope(5, 1) * checkSlope(7, 1) * checkSlope(1, 2));
