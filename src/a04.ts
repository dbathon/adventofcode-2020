import { p, readLines } from "./util/util";

const lines = readLines("input/a04.txt", true, false);

function isSuperset<T>(set: Set<T>, subset: Set<T>): boolean {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

const requiredFields: Set<string> = new Set(["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]);

function createValidator(pattern: RegExp, extraCheck?: (groups: string[]) => boolean): (value: string) => boolean {
  return (value: string) => {
    const match = pattern.exec(value);
    if (match === null) {
      return false;
    }
    return !extraCheck || extraCheck(match);
  };
}

const validators: Map<string, (value: string) => boolean> = new Map();

validators.set(
  "byr",
  createValidator(/^(\d{4})$/, (groups) => {
    const year = parseInt(groups[1]);
    return year >= 1920 && year <= 2002;
  })
);

validators.set(
  "iyr",
  createValidator(/^(\d{4})$/, (groups) => {
    const year = parseInt(groups[1]);
    return year >= 2010 && year <= 2020;
  })
);

validators.set(
  "eyr",
  createValidator(/^(\d{4})$/, (groups) => {
    const year = parseInt(groups[1]);
    return year >= 2020 && year <= 2030;
  })
);

validators.set(
  "hgt",
  createValidator(/^(\d+)(cm|in)$/, (groups) => {
    const height = parseInt(groups[1]);
    const unit = groups[2];
    return (unit === "cm" && height >= 150 && height <= 193) || (unit === "in" && height >= 59 && height <= 76);
  })
);

validators.set("hcl", createValidator(/^#[0-9a-f]{6}$/));

validators.set("ecl", createValidator(/^(amb|blu|brn|gry|grn|hzl|oth)$/));

validators.set("pid", createValidator(/^\d{9}$/));

const currentFields: Set<string> = new Set();
let currentInvalid = false;

let count1 = 0,
  count2 = 0;

lines.forEach((line) => {
  if (line === "") {
    if (isSuperset(currentFields, requiredFields)) {
      ++count1;
      if (!currentInvalid) {
        ++count2;
      }
    }
    currentFields.clear();
    currentInvalid = false;
  } else {
    line
      .split(" ")
      .map((pair) => pair.split(":"))
      .forEach(([field, value]: string[]) => {
        currentFields.add(field);
        const validator = validators.get(field);
        if (validator && !validator(value)) {
          currentInvalid = true;
        }
      });
  }
});

p(count1);
p(count2);
