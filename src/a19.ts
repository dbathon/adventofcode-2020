import { p, readLines } from "./util/util";

const lines = readLines("input/a19.txt");

class Rule {
  constructor(readonly patterns: string[][], readonly char?: string) { }
}

const rules: Map<string, Rule> = new Map();
const messages: string[] = [];

lines.forEach(line => {
  if (line.indexOf(": ") >= 0) {
    const [name, rest] = line.split(": ");
    if (rest[0] === "\"") {
      rules.set(name, new Rule([], rest[1]));
    }
    else {
      rules.set(name, new Rule(rest.split(" | ").map(ruleNames => ruleNames.split(" "))));
    }
  }
  else {
    messages.push(line);
  }
});

function findMatches(message: string, index: number, ruleName: string): Set<number> {
  const rule = rules.get(ruleName)!;
  if (rule.char !== undefined && rule.char === message[index]) {
    return new Set([index + 1]);
  }
  if (rule.patterns.length === 0) {
    return new Set();
  }

  const possibilities = rule.patterns.map(pattern => ({ index, pattern }));
  const result: Set<number> = new Set();

  while (possibilities.length > 0) {
    const possibility = possibilities.shift()!;
    const patternAfter = possibility.pattern.slice(1);
    findMatches(message, possibility.index, possibility.pattern[0]).forEach(newIndex => {
      if (patternAfter.length === 0) {
        result.add(newIndex);
      }
      else {
        possibilities.push({ index: newIndex, pattern: patternAfter });
      }
    });
  }
  return result;
}

p(messages.filter(message => findMatches(message, 0, "0").has(message.length)).length);

// old 8: 42
rules.set("8", new Rule([["42"], ["42", "8"]]));
// old 11: 42 31
rules.set("11", new Rule([["42", "31"], ["42", "11", "31"]]));

p(messages.filter(message => findMatches(message, 0, "0").has(message.length)).length);
