import { p } from "../util/util";

// Find solutions for "FX Schmid Das verzwickte verflixte verrückte Pumuckl Spiel"

// G: Geige
// T: Topf
// K: Kekse
// F: Flöte

const cards: string[][] = ["GtFk", "GfKf", "GfKt", "GfKt", "TkFg", "TgFk", "TgKf", "TgTk", "KtFg"].map((line) =>
  line.split("")
);

interface Contraint {
  side: number;
  otherIndex: number;
  otherSide: number;
}

const constraints: Contraint[][] = [
  // row 1
  [],
  [
    {
      side: 3,
      otherIndex: 0,
      otherSide: 1,
    },
  ],
  [
    {
      side: 3,
      otherIndex: 1,
      otherSide: 1,
    },
  ],
  // row 2
  [
    {
      side: 0,
      otherIndex: 0,
      otherSide: 2,
    },
  ],
  [
    {
      side: 0,
      otherIndex: 1,
      otherSide: 2,
    },
    {
      side: 3,
      otherIndex: 3,
      otherSide: 1,
    },
  ],
  [
    {
      side: 0,
      otherIndex: 2,
      otherSide: 2,
    },
    {
      side: 3,
      otherIndex: 4,
      otherSide: 1,
    },
  ],
  // row 3
  [
    {
      side: 0,
      otherIndex: 3,
      otherSide: 2,
    },
  ],
  [
    {
      side: 0,
      otherIndex: 4,
      otherSide: 2,
    },
    {
      side: 3,
      otherIndex: 6,
      otherSide: 1,
    },
  ],
  [
    {
      side: 0,
      otherIndex: 5,
      otherSide: 2,
    },
    {
      side: 3,
      otherIndex: 7,
      otherSide: 1,
    },
  ],
];

interface Tile {
  card: number;
  rotation: number;
}

let checks = 0;

function checkValid(solution: Tile[]): boolean {
  ++checks;
  for (let i = 0; i < solution.length; i++) {
    const tile = solution[i];
    for (const constraint of constraints[i]) {
      const a = cards[tile.card][(constraint.side + tile.rotation) % 4];
      const otherTile = solution[constraint.otherIndex];
      const b = cards[otherTile.card][(constraint.otherSide + otherTile.rotation) % 4];
      if (!(a !== b && a.toLowerCase() === b.toLowerCase())) {
        return false;
      }
    }
  }
  return true;
}

const solution: Tile[] = [];
let solutions: Tile[][] = [];
const middleCounts: number[] = [];

function search() {
  const startLength = solution.length;
  if (startLength === 9) {
    solutions.push([...solution]);
    middleCounts[solution[4].card] = (middleCounts[solution[4].card] || 0) + 1;
    return;
  }

  for (let card = 0; card < cards.length; card++) {
    if (solution.find((tile) => tile.card === card)) {
      // card is already used
      continue;
    }
    for (let rotation = 0; rotation < 4; rotation++) {
      solution.push({
        card,
        rotation,
      });

      if (checkValid(solution)) {
        search();
      }

      solution.length = startLength;
    }
  }
}

p(cards);
p([cards.length, constraints.length]);

search();

p(checks);
p(solutions.length);
p(solutions[0]);
p(middleCounts);
