import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a16.txt");

class Field {
  constructor(readonly name: string, readonly constraints: [number, number][]) { }
}

const fields: Field[] = [];

const tickets: number[][] = [];

lines.forEach(line => {
  if (line.indexOf(": ") >= 0) {
    const [name, constraints] = line.split(": ");
    fields.push(new Field(name, constraints.split(" or ").map(spec => {
      const [min, max] = spec.split("-");
      return [parseInt(min), parseInt(max)];
    })));
  }
  else if (line.indexOf(",") >= 0) {
    tickets.push(line.split(",").map(field => parseInt(field)));
  }
});

function isValidForField(field: Field, fieldValue: number): unknown {
  return field.constraints.find(([min, max]) => min <= fieldValue && fieldValue <= max) !== undefined;
}

function getInvalidFields(ticket: number[]): number[] {
  return ticket.filter(fieldValue => {
    return fields.find(field => isValidForField(field, fieldValue)) === undefined;
  });
}

p(sum(tickets.slice(1).map(ticket => sum(getInvalidFields(ticket)))));


const potentialFields = tickets[0].map(_ => new Set(fields.map(field => field.name)));

tickets.filter(ticket => getInvalidFields(ticket).length === 0).forEach(ticket => {
  ticket.forEach((fieldValue, index) => {
    return fields.forEach(field => {
      if (!isValidForField(field, fieldValue)) {
        potentialFields[index].delete(field.name);
      }
    });
  });
});

const nameToIndex: Map<string, number> = new Map();

while (true) {
  let progress = false;
  potentialFields.forEach((set, index) => {
    if (set.size === 1) {
      nameToIndex.set([...set][0], index);
      progress = true;
    }
  });
  potentialFields.forEach((set, index) => {
    [...set].forEach(field => {
      if (nameToIndex.has(field)) {
        set.delete(field);
        progress = true;
      }
    });
  });
  if (!progress) {
    break;
  }
}

let product = 1;
nameToIndex.forEach((index, name) => {
  if (name.startsWith("departure")) {
    product *= tickets[0][index];
  }
});
p(product);
