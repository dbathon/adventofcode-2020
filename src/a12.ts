import { p, readLines } from "./util/util";

const lines = readLines("input/a12.txt");

const DEG_TO_DIR = new Map([[0, "N"], [90, "E"], [180, "S"], [270, "W"]]);

const state = {
  direction: 90,
  x: 0,
  y: 0
};

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function apply(instruction: string) {
  const command = instruction[0];
  const arg = parseInt(instruction.substr(1));
  switch (command) {
    case "N":
      state.y -= arg;
      break;
    case "S":
      state.y += arg;
      break;
    case "E":
      state.x += arg;
      break;
    case "W":
      state.x -= arg;
      break;
    case "L":
      state.direction = mod(state.direction - arg, 360);
      break;
    case "R":
      state.direction = mod(state.direction + arg, 360);
      break;
    case "F":
      const dir = DEG_TO_DIR.get(state.direction);
      if (!dir) {
        throw "enexpected direction: " + state.direction;
      }
      apply(dir + arg);
      break;
    default:
      throw "unexpected: " + instruction;
  }
}

lines.forEach(apply);

p(Math.abs(state.x) + Math.abs(state.y));


const state2 = {
  x: 0,
  y: 0,
  waypointX: 10,
  waypointY: -1
};

function apply2(instruction: string) {
  const command = instruction[0];
  let arg = parseInt(instruction.substr(1));
  switch (command) {
    case "N":
      state2.waypointY -= arg;
      break;
    case "S":
      state2.waypointY += arg;
      break;
    case "E":
      state2.waypointX += arg;
      break;
    case "W":
      state2.waypointX -= arg;
      break;
    case "L":
      // convert to right turn
      arg = mod(-arg, 360);
    // fall through
    case "R":
      while (arg > 0) {
        const waypointXOld = state2.waypointX;
        state2.waypointX = -state2.waypointY;
        state2.waypointY = waypointXOld;
        arg -= 90;
      }
      break;
    case "F":
      state2.x += state2.waypointX * arg;
      state2.y += state2.waypointY * arg;
      break;
    default:
      throw "unexpected: " + instruction;
  }
}

lines.forEach(apply2);

p(Math.abs(state2.x) + Math.abs(state2.y));
