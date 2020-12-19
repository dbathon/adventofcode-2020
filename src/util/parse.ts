
export class Node {
  constructor(readonly ruleName: string, readonly children: (string | Node)[]) { }

  toString(): string {
    return this.children.map(child => child.toString()).join("");
  }
}

export class Rule {
  constructor(readonly patterns: (string | RegExp)[][]) {
    if (patterns.find(pattern => pattern.length === 0) !== undefined) {
      throw new Error("patterns need at least one step");
    }
  }
}

class PartialResult {
  constructor(readonly node: Node | string, readonly remaining: string) { }
}

class Possibility {
  constructor(readonly remaining: string,
    readonly children: (string | Node)[], readonly remainingPattern: (string | RegExp)[]) { }
}

function parseRecursive(string: string, rules: Map<string, Rule>, ruleNameOrRegExp: string | RegExp): PartialResult[] {
  const result: PartialResult[] = [];
  if (typeof ruleNameOrRegExp === "string") {
    const ruleName = ruleNameOrRegExp;
    const rule = rules.get(ruleName);
    if (rule === undefined) {
      throw new Error("rule not found: " + ruleName);
    }

    const possibilities = rule.patterns.map(pattern => new Possibility(string, [], pattern));

    while (possibilities.length > 0) {
      const possibility = possibilities.shift()!;
      const newRemainingPattern = possibility.remainingPattern.slice(1);
      const step = possibility.remainingPattern[0];
      for (const partialResult of parseRecursive(possibility.remaining, rules, step)) {
        const newPossibility = new Possibility(partialResult.remaining, [...possibility.children, partialResult.node], newRemainingPattern);
        if (newPossibility.remainingPattern.length === 0) {
          const partialResult = new PartialResult(new Node(ruleName, newPossibility.children), newPossibility.remaining);
          if (partialResult.remaining.length === 0) {
            // we found a full match, just return it
            return [partialResult];
          }
          result.push(partialResult);
        }
        else {
          possibilities.push(newPossibility);
        }
      }
    }
  }
  else {
    const regExp = ruleNameOrRegExp;
    regExp.lastIndex = 0;
    const match = regExp.exec(string);
    if (match && match.index === 0 && match[0].length > 0) {
      result.push(new PartialResult(match[0], string.substring(match[0].length)));
    }
  }
  return result;
}

/**
 * Tries to find a parse tree that matches the given string completely with the given rules.
 *
 * If there are mulitple potential parse trees, then only one of them is returned.
 *
 * This is not the most efficient way to do the parsing, but it is simple...
 */
export function parse(string: string, rules: Map<string, Rule>, startRuleName: string): Node | undefined {
  const result = parseRecursive(string, rules, startRuleName).find(partialResult => partialResult.remaining.length === 0);
  return result && !(typeof result.node === "string") ? result.node : undefined;
}
