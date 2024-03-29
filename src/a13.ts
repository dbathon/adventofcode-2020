import { p, readLines } from "./util/util";

const lines = readLines("input/a13.txt");

const earliestDeparture = parseInt(lines[0]);

const ids = lines[1]
  .split(",")
  .filter((id) => id !== "x")
  .map((id) => parseInt(id));

const waitAndIds = ids.map((id) => [(id - (earliestDeparture % id)) % id, id]);

waitAndIds.sort((a, b) => a[0] - b[0]);

p(waitAndIds[0][0] * waitAndIds[0][1]);

const idsAndOffsets = lines[1]
  .split(",")
  .map((id, offset) => [parseInt(id), offset])
  .filter((el) => el[0] === el[0]);

// inspired by https://old.reddit.com/r/adventofcode/comments/kc60ri/2020_day_13_can_anyone_give_me_a_hint_for_part_2/gfnnfm3/
let searchStep = idsAndOffsets[0][0];
let time = searchStep;
for (let i = 1; i < idsAndOffsets.length; ++i) {
  const [id, offset] = idsAndOffsets[i];
  // increase the time until it works for the ith id
  while ((time + offset) % id !== 0) {
    time += searchStep;
  }
  // now multiply the search step by the ith id (all ids are prime)
  searchStep *= id;
}

p(time);
