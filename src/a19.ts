import { parse, Rule } from "./util/parse";
import { p, readLines } from "./util/util";

const lines = readLines("input/a19.txt");

const rules: Map<string, Rule> = new Map();
const messages: string[] = [];

lines.forEach((line) => {
  if (line.indexOf(": ") >= 0) {
    const [name, rest] = line.split(": ");
    if (rest[0] === '"') {
      rules.set(name, new Rule([[new RegExp(rest[1])]]));
    } else {
      rules.set(name, new Rule(rest.split(" | ").map((ruleNames) => ruleNames.split(" "))));
    }
  } else {
    messages.push(line);
  }
});

p(messages.filter((message) => parse(message, rules, "0") !== undefined).length);

// old 8: 42
rules.set("8", new Rule([["42"], ["42", "8"]]));
// old 11: 42 31
rules.set(
  "11",
  new Rule([
    ["42", "31"],
    ["42", "11", "31"],
  ])
);

p(messages.filter((message) => parse(message, rules, "0") !== undefined).length);
