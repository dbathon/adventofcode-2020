import { p, readLines } from "./util/util";

const lines = readLines("input/a23.txt");

const start = lines[0].split("").map(number => parseInt(number));

class State {
  next = new Map<number, number>();
  prev = new Map<number, number>();
  readonly min: number;
  readonly max: number;

  constructor(public current: number, startState: number[]) {
    startState.forEach((element, index) => {
      this.next.set(element, startState[(index + 1) % startState.length]);
      this.prev.set(element, startState[(index + startState.length - 1) % startState.length]);
    });
    this.min = startState.reduce((prev, cur) => Math.min(prev, cur));
    this.max = startState.reduce((prev, cur) => Math.max(prev, cur));
  }

  step() {
    const pickUpStart = this.next.get(this.current)!;
    const pickUpMiddle = this.next.get(pickUpStart)!;
    const pickUpEnd = this.next.get(pickUpMiddle)!;

    // remove pickup from maps
    const afterPickup = this.next.get(pickUpEnd)!;
    this.next.set(this.current, afterPickup);
    this.prev.set(afterPickup, this.current);

    let destination = this.current;
    do {
      destination = destination - 1;
      if (destination < this.min) {
        destination = this.max;
      }
    }
    while (destination === pickUpStart || destination === pickUpMiddle || destination === pickUpEnd);

    // "insert" pickup again
    const afterDestination = this.next.get(destination)!;
    this.next.set(pickUpEnd, afterDestination);
    this.prev.set(afterDestination, pickUpEnd);
    this.next.set(destination, pickUpStart);
    this.prev.set(pickUpStart, destination);

    this.current = this.next.get(this.current)!;
  }

  getAfter(element: number, count: number): number[] {
    const result: number[] = [];
    while (count > 0) {
      element = this.next.get(element)!;
      result.push(element);
      --count;
    }
    return result;
  }
}

const state1 = new State(start[0], start);

for (let i = 0; i < 100; ++i) {
  state1.step();
}

p(state1.getAfter(1, start.length - 1).join(""));

let next = Math.max(...start) + 1;
while (start.length < 1000000) {
  start.push(next++);
}
const state2 = new State(start[0], start);

for (let i = 0; i < 10000000; ++i) {
  state2.step();
}

p(state2.getAfter(1, 2).reduce((a, b) => a * b));
