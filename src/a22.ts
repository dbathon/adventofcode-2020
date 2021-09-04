import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a22.txt");

const [deck1, deck2] = lines
  .slice(1)
  .join(",")
  .split(/,Player \d+:,/)
  .map((deck) => deck.split(",").map((card) => parseInt(card)));

function score(winDeck: number[]): number {
  return sum(winDeck.map((card, index) => card * (winDeck.length - index)));
}

function play(deck1: number[], deck2: number[], recursive: boolean): { score: number; player1Wins: boolean } {
  const seenStates = new Set<string>();
  while (deck1.length > 0 && deck2.length > 0) {
    if (recursive) {
      const state = deck1.join(",") + ";" + deck2.join(",");
      if (seenStates.has(state)) {
        return { score: score(deck1), player1Wins: true };
      }
      seenStates.add(state);
    }

    const card1 = deck1.shift()!;
    const card2 = deck2.shift()!;
    let player1Wins = card1 > card2;
    if (recursive && deck1.length >= card1 && deck2.length >= card2) {
      player1Wins = play(deck1.slice(0, card1), deck2.slice(0, card2), recursive).player1Wins;
    }
    if (player1Wins) {
      deck1.push(card1, card2);
    } else {
      deck2.push(card2, card1);
    }
  }
  return { score: score([...deck1, ...deck2]), player1Wins: deck1.length > 0 };
}

p(play([...deck1], [...deck2], false).score);
p(play([...deck1], [...deck2], true).score);
