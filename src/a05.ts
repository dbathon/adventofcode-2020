import { p, readLines } from "./util/util";

const lines = readLines("input/a05.txt");

const seatIds = lines.map(line => {
  const binaryString = line.replace(/[BR]/g, "1").replace(/[FL]/g, "0");
  return parseInt(binaryString, 2);
});

p(Math.max(...seatIds));

seatIds.sort((a, b) => a - b);

let prev = seatIds[0] - 1;
seatIds.forEach(seatId => {
  if (prev + 2 === seatId) {
    p(seatId - 1);
  }
  prev = seatId;
});
