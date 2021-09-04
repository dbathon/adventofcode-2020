import { Map2D } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a17.txt");

const initialMap: Map2D<string> = new Map2D();

lines.forEach((line, y) => {
  line.split("").forEach((pos, x) => {
    if (pos === "#") {
      initialMap.set(x, y, "#");
    }
  });
});

function runIterations(map: Map2D<string>, n: number, fourD: boolean): Map2D<Map2D<string>> {
  let space: Map2D<Map2D<string>> = new Map2D();
  space.set(0, 0, map);

  for (let i = 0; i < n; ++i) {
    let newSpace: Map2D<Map2D<string>> = new Map2D();
    const extra = i + 1;
    for (let w = fourD ? -extra : 0; w <= (fourD ? extra : 0); ++w) {
      for (let z = -extra; z <= extra; ++z) {
        const planeNode = space.getNode(w, z);
        planeNode.value = planeNode.value || new Map2D();
        for (let x = map.originX - extra; x <= map.originX + map.width + extra; ++x) {
          for (let y = map.originY - extra; y <= map.originY + map.height + extra; ++y) {
            let activeNeighborCount = 0;
            planeNode.value
              .getNode(x, y)
              .get8Neighbors()
              .forEach((node) => {
                if (node.value === "#") {
                  ++activeNeighborCount;
                }
              });
            planeNode
              .get8Neighbors()
              .filter((node) => node !== undefined)
              .map((node) => node.value)
              .filter((plane) => plane !== undefined)
              .forEach((otherPlane) => {
                if (otherPlane!.get(x, y) === "#") {
                  ++activeNeighborCount;
                }
                otherPlane!
                  .getNode(x, y)
                  .get8Neighbors()
                  .forEach((node) => {
                    if (node.value === "#") {
                      ++activeNeighborCount;
                    }
                  });
              });
            let newState = planeNode.value.get(x, y);
            if (newState === "#" && activeNeighborCount !== 2 && activeNeighborCount !== 3) {
              newState = undefined;
            } else if (newState === undefined && activeNeighborCount === 3) {
              newState = "#";
            }

            const newPlaneNode = newSpace.getNode(planeNode.x, planeNode.y);
            newPlaneNode.value = newPlaneNode.value || new Map2D();
            newPlaneNode.value.set(x, y, newState);
          }
        }
      }
    }
    space = newSpace;
  }

  return space;
}

[false, true].forEach((fourD) => {
  let activeCount = 0;
  runIterations(initialMap, 6, fourD).forEachNode((node1) => {
    if (node1.value) {
      node1.value.forEachNode((node2) => {
        if (node2.value === "#") {
          ++activeCount;
        }
      });
    }
  });
  p(activeCount);
});
