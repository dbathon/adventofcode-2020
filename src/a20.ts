import { Map2D } from "./util/map2D";
import { p, readLines, intersection } from "./util/util";

const lines = readLines("input/a20.txt");

const tiles: Map<number, string[]> = new Map();

lines
  .join("\n")
  .replace(/^Tile /, "")
  .split(/\nTile /)
  .forEach((tile) => {
    const [id, tileLines] = tile.split(":\n");
    tiles.set(parseInt(id), tileLines.split("\n"));
  });

function rightEdge(tileLines: string[]) {
  return tileLines.map((line) => line[line.length - 1]).join("");
}

function leftEdge(tileLines: string[]) {
  return tileLines.map((line) => line[0]).join("");
}

function topEdge(tileLines: string[]) {
  return tileLines[0];
}

function bottomEdge(tileLines: string[]) {
  return tileLines[tileLines.length - 1];
}

function edges(tileLines: string[]) {
  const result = [topEdge(tileLines), leftEdge(tileLines), rightEdge(tileLines), bottomEdge(tileLines)];
  return [...result, ...result.map((edge) => edge.split("").reverse().join(""))];
}

const edgeToIds: Map<string, number[]> = new Map();

tiles.forEach((tile, id) => {
  edges(tile).forEach((edge) => {
    const ids = edgeToIds.get(edge) || [];
    ids.push(id);
    edgeToIds.set(edge, ids);
  });
});

const idToNeighbors: Map<number, number[]> = new Map();
tiles.forEach((tile, id) => {
  const neighborIds = new Set<number>();
  edges(tile).forEach((edge) => {
    edgeToIds.get(edge)!.forEach((id) => neighborIds.add(id));
  });
  neighborIds.delete(id);
  idToNeighbors.set(id, [...neighborIds]);
});

const cornerIds = [...idToNeighbors].filter(([id, neighbors]) => neighbors.length === 2).map(([id]) => id);

p(cornerIds.reduce((a, b) => a * b));

function rotate90(lines: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < lines[0].length; ++i) {
    result.push(
      [...lines]
        .reverse()
        .map((line) => line[i])
        .join("")
    );
  }
  return result;
}

function flip(lines: string[]): string[] {
  return [...lines].reverse();
}

function allVariants(lines: string[]): string[][] {
  const rot1 = rotate90(lines);
  const rot2 = rotate90(rot1);
  const rot3 = rotate90(rot2);
  return [lines, rot1, rot2, rot3, flip(lines), flip(rot1), flip(rot2), flip(rot3)];
}

const idsMap = new Map2D<Set<number>>();
const unusedIds = new Set(tiles.keys());

// seed the first corner
idsMap.set(0, 0, new Set([cornerIds[0]]));
unusedIds.delete(cornerIds[0]);

function getPotentialNeighbors(ids: number[]): Set<number> {
  const result = new Set<number>();
  ids.forEach((id) => {
    idToNeighbors.get(id)!.forEach((neighbor) => result.add(neighbor));
  });
  return result;
}

const edgeLength = Math.sqrt(tiles.size);
for (let y = 0; y < edgeLength; ++y) {
  for (let x = 0; x < edgeLength; ++x) {
    const node = idsMap.getNode(x, y);
    if (node.value === undefined) {
      node.value = new Set(unusedIds);
    }
    node.get4Neighbors().forEach((neighbor) => {
      if (neighbor.value !== undefined) {
        node.value = intersection(node.value!, getPotentialNeighbors([...neighbor.value]));
      }
    });
    if ((node.x === edgeLength - 1 || node.y === edgeLength - 1) && [11, 22].indexOf(node.x + node.y) >= 0) {
      node.value = intersection(node.value!, new Set(cornerIds));
    }
  }
}

// fix top right corner
const topRightNode = idsMap.getNode(edgeLength - 1, 0);
topRightNode.value = new Set([[...topRightNode.value!][0]]);

for (let i = 0; i < edgeLength * 10; ++i) {
  idsMap.forEachNode((node) => {
    const value = node.value!;
    if (value.size == 1) {
      value.forEach((id) => unusedIds.delete(id));
    } else {
      node.get4Neighbors().forEach((neighbor) => {
        if (neighbor.value !== undefined) {
          node.value = intersection(intersection(value, getPotentialNeighbors([...neighbor.value])), unusedIds);
          const neighborCount = node.get4Neighbors().filter((neighbor) => neighbor.value !== undefined).length;
          node.value = new Set([...node.value].filter((id) => idToNeighbors.get(id)!.length === neighborCount));
        }
      });
    }
  });
}

class IdAndTileVariant {
  constructor(readonly id: number, public tile?: string[]) {}
}

const map = new Map2D<IdAndTileVariant>();

idsMap.forEachNode((node) => {
  const ids = [...node.value!];
  if (ids.length !== 1) {
    throw "not unique";
  }
  map.set(node.x, node.y, new IdAndTileVariant(ids[0]));
});

map.forEachNode((node) => {
  const current = node.value!;
  if (current.tile === undefined) {
    const left = node.getLeft().value;
    const up = node.getUp().value;
    if (left !== undefined) {
      const variants: string[][] = [];
      allVariants(tiles.get(current.id)!).forEach((tile) => {
        if (rightEdge(left.tile!) === leftEdge(tile)) {
          variants.push(tile);
        }
      });
      if (variants.length !== 1) {
        throw "no unique variant: " + variants;
      }
      current.tile = variants[0];
    } else if (up != undefined) {
      const variants: string[][] = [];
      allVariants(tiles.get(current.id)!).forEach((tile) => {
        if (bottomEdge(up.tile!) === topEdge(tile)) {
          variants.push(tile);
        }
      });
      if (variants.length !== 1) {
        throw "no unique variant: " + variants;
      }
      current.tile = variants[0];
    } else {
      // top left node, init it and its right and down neighbors
      const right = node.getRight().value!;
      const down = node.getDown().value!;

      allVariants(tiles.get(current.id)!).forEach((tile1) => {
        allVariants(tiles.get(right.id)!).forEach((tile2) => {
          if (rightEdge(tile1) === leftEdge(tile2)) {
            allVariants(tiles.get(down.id)!).forEach((tile3) => {
              if (bottomEdge(tile1) === topEdge(tile3)) {
                current.tile = tile1;
                right.tile = tile2;
                down.tile = tile3;
              }
            });
          }
        });
      });
    }
  }
});

const tileDimension = map.get(0, 0)!.tile!.length;
const fullImage: string[] = [];

for (let y = 0; y < edgeLength; ++y) {
  for (let tileY = 1; tileY < tileDimension - 1; ++tileY) {
    const lineParts: string[] = [];
    for (let x = 0; x < edgeLength; ++x) {
      lineParts.push(map.get(x, y)!.tile![tileY].slice(1, -1));
    }
    fullImage.push(lineParts.join(""));
  }
}

const monster = ["                  # ", "#    ##    ##    ###", " #  #  #  #  #  #   "];

function removeMonsters(image: string[], monster: string[]): string[] {
  const result = [...image];
  for (let y = 0; y < image.length; ++y) {
    for (let x = 0; x < image[0].length; ++x) {
      let match = true;
      for (let monsterY = 0; monsterY < monster.length; ++monsterY) {
        for (let monsterX = 0; monsterX < monster[0].length; ++monsterX) {
          if (
            monster[monsterY][monsterX] === "#" &&
            (image[y + monsterY] === undefined || image[y + monsterY][x + monsterX] !== "#")
          ) {
            match = false;
          }
        }
      }
      if (match) {
        for (let monsterY = 0; monsterY < monster.length; ++monsterY) {
          const line = result[y + monsterY].split("");
          for (let monsterX = 0; monsterX < monster[0].length; ++monsterX) {
            if (monster[monsterY][monsterX] === "#") {
              line[x + monsterX] = "O";
            }
          }
          result[y + monsterY] = line.join("");
        }
      }
    }
  }
  return result;
}

allVariants(fullImage).forEach((variant) => {
  const withoutMonsters = removeMonsters(variant, monster).join("\n");
  if (withoutMonsters.indexOf("O") >= 0) {
    p(withoutMonsters.split("").filter((char) => char === "#").length);
  }
});
