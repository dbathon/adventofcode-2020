import { p, readLines, intersection } from "./util/util";

const lines = readLines("input/a06.txt", true, false);

const currentLetters: Set<string> = new Set();
let currentLettersAll: Set<string> | undefined = undefined;
let sum1 = 0;
let sum2 = 0;

lines.forEach((line) => {
  if (line === "" && currentLettersAll != undefined) {
    sum1 += currentLetters.size;
    sum2 += currentLettersAll.size;
    currentLetters.clear();
    currentLettersAll = undefined;
  } else {
    const personLetters: Set<string> = new Set();
    line.split("").forEach((letter) => {
      currentLetters.add(letter);
      personLetters.add(letter);
    });

    if (currentLettersAll === undefined) {
      currentLettersAll = personLetters;
    } else {
      currentLettersAll = intersection(currentLettersAll, personLetters);
    }
  }
});

p(sum1);
p(sum2);
