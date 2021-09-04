import { intersection, p, readLines } from "./util/util";

const lines = readLines("input/a21.txt");

const allIngredients: string[] = [];
const allergenPossibilities = new Map<string, Set<string>>();

lines.forEach((line) => {
  const [part1, part2] = line.split(" (contains ");
  const ingredients = part1.split(" ");
  const allergens = part2.slice(0, -1).split(", ");
  allIngredients.push(...ingredients);
  const ingredientsSet = new Set(ingredients);
  allergens.forEach((allergen) => {
    const previous = allergenPossibilities.get(allergen) || ingredientsSet;
    allergenPossibilities.set(allergen, intersection(previous, ingredientsSet));
  });
});

p(
  allIngredients.filter((ingredient) => {
    return (
      [...allergenPossibilities.entries()].find(([allergen, ingredients]) => ingredients.has(ingredient)) === undefined
    );
  }).length
);

const allergens = new Map<string, string>();

while (allergens.size < allergenPossibilities.size) {
  allergenPossibilities.forEach((ingredients, allergen) => {
    if (ingredients.size === 1) {
      allergens.set(allergen, [...ingredients][0]);
    } else {
      for (const knownIngredient of allergens.values()) {
        ingredients.delete(knownIngredient);
      }
    }
  });
}

p(
  [...allergens.keys()]
    .sort()
    .map((allergen) => allergens.get(allergen))
    .join(",")
);
