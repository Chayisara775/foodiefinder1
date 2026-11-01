// DSA used by the real meal data returned from TheMealDB.
// Hash Table: Map provides average O(1) lookup by meal ID.
// Selection Sort: O(n^2) time, O(n) extra space because we sort a copy.
// Kept intentionally visible so students can explain the algorithm.
export function buildMealHashTable(meals) {
  const table = new Map();
  for (const meal of meals) table.set(String(meal.id), meal);
  return table;
}

export function selectionSortMeals(items, sortBy = "name", order = "asc") {
  const result = [...items];
  const direction = order === "desc" ? -1 : 1;
  const key = sortBy === "category" ? "category" : "name";

  for (let i = 0; i < result.length - 1; i += 1) {
    let selectedIndex = i;
    for (let j = i + 1; j < result.length; j += 1) {
      const left = String(result[j][key] || "").toLocaleLowerCase();
      const right = String(result[selectedIndex][key] || "").toLocaleLowerCase();
      if (left.localeCompare(right) * direction < 0) selectedIndex = j;
    }
    if (selectedIndex !== i) {
      [result[i], result[selectedIndex]] = [result[selectedIndex], result[i]];
    }
  }
  return result;
}
