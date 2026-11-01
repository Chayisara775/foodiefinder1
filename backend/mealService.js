
const API = "https://www.themealdb.com/api/json/v1/1";
const CACHE_TTL = 10 * 60 * 1000;

const cache = new Map();
let catalogPromise = null;
let catalogTime = 0;

async function fetchJson(url) {
  const cached = cache.get(url);

  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }

  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    throw new Error(`TheMealDB Error: ${response.status}`);
  }

  const data = await response.json();

  cache.set(url, {
    time: Date.now(),
    data
  });

  return data;
}

function normalizeMeal(raw) {
  if (!raw) return null;

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const name = raw[`strIngredient${i}`]?.trim();
    const measure = raw[`strMeasure${i}`]?.trim();

    if (name) {
      ingredients.push({
        name,
        measure: measure || ""
      });
    }
  }

  return {
    id: String(raw.idMeal),
    name: raw.strMeal || "Untitled meal",
    category: raw.strCategory || "Other",
    area: raw.strArea || "Unknown",
    image: raw.strMealThumb || "",
    instructions: raw.strInstructions || "",
    ingredients,
    youtube: raw.strYoutube || ""
  };
}

async function loadCatalog() {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const results = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < letters.length) {
      const index = nextIndex++;
      const letter = letters[index];

      try {
        const data = await fetchJson(
          `${API}/search.php?f=${letter}`
        );

        results.push(...(data.meals || []));
      } catch (error) {
        console.error(
          `โหลดเมนูตัว ${letter} ไม่สำเร็จ:`,
          error.message
        );
      }
    }
  }

  await Promise.all(
    Array.from({ length: 5 }, () => worker())
  );

  const uniqueMeals = new Map();

  for (const raw of results) {
    const meal = normalizeMeal(raw);

    if (meal) {
      uniqueMeals.set(meal.id, meal);
    }
  }

  if (uniqueMeals.size === 0) {
    throw new Error("ไม่สามารถโหลดเมนูจาก TheMealDB ได้");
  }

  return [...uniqueMeals.values()];
}

export async function getCatalog() {
  if (
    catalogPromise &&
    Date.now() - catalogTime < CACHE_TTL
  ) {
    return catalogPromise;
  }

  catalogTime = Date.now();

  catalogPromise = loadCatalog().catch(error => {
    catalogPromise = null;
    catalogTime = 0;
    throw error;
  });

  return catalogPromise;
}

// ค้นหาและกรองเมนู
export async function getMeals({
  search = "",
  category = "",
  area = "",
  ingredient = ""
} = {}) {
  const meals = await getCatalog();

  const keyword = search.toLowerCase().trim();
  const selectedCategory = category.toLowerCase().trim();
  const selectedArea = area.toLowerCase().trim();
  const selectedIngredient = ingredient.toLowerCase().trim();

  return meals.filter(meal => {
    const matchesSearch = !keyword ||
      meal.name.toLowerCase().includes(keyword) ||
      meal.category.toLowerCase().includes(keyword) ||
      meal.area.toLowerCase().includes(keyword) ||
      meal.ingredients.some(item =>
        item.name.toLowerCase().includes(keyword)
      );

    const matchesCategory = !selectedCategory ||
      meal.category.toLowerCase() === selectedCategory;

    const matchesArea = !selectedArea ||
      meal.area.toLowerCase() === selectedArea;

    const matchesIngredient = !selectedIngredient ||
      meal.ingredients.some(item =>
        item.name.toLowerCase().includes(selectedIngredient)
      );

    return (
      matchesSearch &&
      matchesCategory &&
      matchesArea &&
      matchesIngredient
    );
  });
}

export async function getMealById(id) {
  const meals = await getCatalog();

  const found = meals.find(
    meal => meal.id === String(id)
  );

  if (found) return found;

  const data = await fetchJson(
    `${API}/lookup.php?i=${encodeURIComponent(id)}`
  );

  return normalizeMeal(data.meals?.[0]);
}

// รายการประเภทอาหารจาก API
export async function getCategories() {
  const data = await fetchJson(`${API}/list.php?c=list`);

  return (data.meals || [])
    .map(item => item.strCategory)
    .filter(Boolean)
    .sort();
}

// รายการสัญชาติจาก API
export async function getAreas() {
  const data = await fetchJson(`${API}/list.php?a=list`);

  return (data.meals || [])
    .map(item => item.strArea)
    .filter(Boolean)
    .sort();
}

// รายการวัตถุดิบจาก API
export async function getIngredients() {
  const data = await fetchJson(`${API}/list.php?i=list`);

  return (data.meals || [])
    .map(item => item.strIngredient)
    .filter(Boolean)
    .sort();
}
