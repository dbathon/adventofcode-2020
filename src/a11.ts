import { Map2D, Map2DNode } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a11.txt");

const map: Map2D<string> = new Map2D();

function load() {
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      map.set(x, y, char);
    });
  });
}
load();

function performStep(
  map: Map2D<string>,
  getOccupiedNeighbors: (map: Map2DNode<string>) => number,
  minOccupied = 4
): boolean {
  let changes = false;
  const newMap: Map2D<string> = new Map2D();

  map.forEachNode((node) => {
    let newValue = node.value;
    if (node.value === "L" && getOccupiedNeighbors(node) === 0) {
      newValue = "#";
      changes = true;
    } else if (node.value === "#" && getOccupiedNeighbors(node) >= minOccupied) {
      newValue = "L";
      changes = true;
    }
    newMap.set(node.x, node.y, newValue);
  });

  if (changes) {
    map.forEachNode((node) => {
      node.value = newMap.get(node.x, node.y);
    });
  }

  return changes;
}

while (performStep(map, (node) => node.get8Neighbors().filter((node) => node.value === "#").length));

function countOccupied(map: Map2D<string>): number {
  let occupied = 0;
  map.forEachNode((node) => {
    if (node.value === "#") {
      ++occupied;
    }
  });
  return occupied;
}

p(countOccupied(map));

// reset
load();

const NEIGHBOR_STEPS: ((node: Map2DNode<string>) => Map2DNode<string>)[] = [
  (node) => node.getUp().getLeft(),
  (node) => node.getUp(),
  (node) => node.getUp().getRight(),
  (node) => node.getLeft(),
  (node) => node.getRight(),
  (node) => node.getDown().getLeft(),
  (node) => node.getDown(),
  (node) => node.getDown().getRight(),
];

function getVisibleOccupiedNeighbors(node: Map2DNode<string>): number {
  function visibleOccupied(start: Map2DNode<string>, step: (node: Map2DNode<string>) => Map2DNode<string>): boolean {
    let current = start;
    while (true) {
      current = step(current);
      if (current.value === "#") {
        return true;
      }
      if (current.value === "L" || !current.value) {
        return false;
      }
    }
  }

  return NEIGHBOR_STEPS.filter((step) => visibleOccupied(node, step)).length;
}

while (performStep(map, getVisibleOccupiedNeighbors, 5));

p(countOccupied(map));
