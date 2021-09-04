import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a07.txt");

class QuantityAndColor {
  constructor(readonly quantity: number, readonly color: string) {}
}

const rules: Map<string, QuantityAndColor[]> = new Map();

lines.forEach((line) => {
  const [outerColor, containSpecs]: string[] = line.split(" bags contain ");
  if (containSpecs !== "no other bags.") {
    rules.set(
      outerColor,
      containSpecs.split(", ").map((containSpec) => {
        const parts = containSpec.split(" ");
        return new QuantityAndColor(parseInt(parts[0]), parts[1] + " " + parts[2]);
      })
    );
  } else {
    rules.set(outerColor, []);
  }
});

function canContain(outerColor: string, innerColor: string): boolean {
  for (let quantityAndColor of rules.get(outerColor) || []) {
    if (quantityAndColor.color === innerColor || canContain(quantityAndColor.color, innerColor)) {
      return true;
    }
  }
  return false;
}

let count1 = 0;
for (let [color] of rules) {
  if (canContain(color, "shiny gold")) {
    ++count1;
  }
}

p(count1);

function countTotalBags(color: string): number {
  return (
    1 +
    sum(
      (rules.get(color) || []).map(
        (quantityAndColor) => quantityAndColor.quantity * countTotalBags(quantityAndColor.color)
      )
    )
  );
}

p(countTotalBags("shiny gold") - 1);
