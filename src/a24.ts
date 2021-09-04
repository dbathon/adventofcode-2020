import { Map2D, Map2DNode } from "./util/map2D";
import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a24.txt");

const DIRECTIONS = new Map([
  ["n", (node: Map2DNode<boolean>) => node.getUp()],
  ["s", (node: Map2DNode<boolean>) => node.getDown()],
  ["e", (node: Map2DNode<boolean>) => node.getRight()],
  ["w", (node: Map2DNode<boolean>) => node.getLeft()],
]);

const map = new Map2D<boolean>();

function go(node: Map2DNode<boolean>, directions: string): Map2DNode<boolean> {
  for (let i = 0; i < directions.length; ++i) {
    const direction = directions[i];
    node = DIRECTIONS.get(direction)!(node);
    if (direction === "n" || direction === "s") {
      node = DIRECTIONS.get(directions[++i])!(node);
    } else {
      node = DIRECTIONS.get(direction)!(node);
    }
  }
  return node;
}

lines.forEach((line) => {
  const target = go(map.getNode(0, 0), line);
  if (target.value) {
    target.value = false;
  } else {
    target.value = true;
  }
});

function countBlack(): any {
  return sum(map.getAsArray().map((row) => sum(row.map((tile) => (tile ? 1 : 0)))));
}

p(countBlack());

const neighborDirections = ["e", "se", "sw", "w", "nw", "ne"];

function nextDay() {
  const previousMap = map.copy();
  const relevantTiles = new Map<string, Map2DNode<boolean>>();
  map.forEachNode((node) => {
    if (node.value) {
      relevantTiles.set(node.x + "," + node.y, node);
      neighborDirections.forEach((direction) => {
        const neighbor = go(node, direction);
        relevantTiles.set(neighbor.x + "," + neighbor.y, neighbor);
      });
    }
  });
  for (const node of relevantTiles.values()) {
    let previousBlackNeighborCount = 0;
    const previousNode = previousMap.getNode(node.x, node.y);
    neighborDirections.forEach((direction) => {
      if (go(previousNode, direction).value) {
        ++previousBlackNeighborCount;
      }
    });
    if (node.value && previousBlackNeighborCount !== 1) {
      node.value = false;
    }
    if (!node.value && previousBlackNeighborCount === 2) {
      node.value = true;
    }
  }
}

for (let i = 0; i < 100; ++i) {
  nextDay();
}

p(countBlack());
