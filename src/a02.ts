import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a02.txt");

p(lines);

let validCount1 = 0;
let validCount2 = 0;

lines.forEach((line) => {
  let [spec, password] = line.split(":");
  password = password.trim();
  const [minMax, specChar] = spec.split(" ");
  const [min, max] = minMax.split("-").map((str) => parseInt(str));
  const count = sum(password.split("").map((char) => (char === specChar ? 1 : 0)));

  p([min, max, specChar, password, count]);

  if (min <= count && count <= max) {
    ++validCount1;
  }

  if (sum([min, max].map((pos) => (password[pos - 1] === specChar ? 1 : 0))) === 1) {
    ++validCount2;
  }
});

p(validCount1);
p(validCount2);
