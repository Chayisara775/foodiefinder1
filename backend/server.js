
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import { buildMealHashTable, selectionSortMeals } from "./dsa.js";
import {
  getMeals,
  getMealById,
  getAreas,
  getIngredients,
  getCategories
} from "./mealService.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

let mealTable = new Map();

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", service: "Foodie Finder API" })
);

// Get meals with filters and sorting
app.get("/api/meals", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim().slice(0, 80);
    const category = String(req.query.category || "").trim().slice(0, 80);
    const area = String(req.query.area || "").trim().slice(0, 80);
    const ingredient = String(req.query.ingredient || "").trim().slice(0, 80);

    const sortBy = ["name", "category"].includes(req.query.sort)
      ? req.query.sort
      : "name";

    const order = req.query.order === "desc" ? "desc" : "asc";

    const meals = await getMeals({
      search,
      category,
      area,
      ingredient
    });

    mealTable = buildMealHashTable(meals);

    const started = performance.now();
    const sorted = selectionSortMeals(meals, sortBy, order);
    const elapsedMs = Number((performance.now() - started).toFixed(3));

    res.json({
      data: sorted,
      count: sorted.length,
      filters: {
        search,
        category,
        area,
        ingredient
      },
      sorting: {
        algorithm: "Selection Sort",
        sortBy,
        order,
        elapsedMs
      },
      dsa: {
        hashTableSize: mealTable.size,
        lookup: "Map average O(1)",
        sorting: "Selection Sort O(n^2)"
      }
    });
  } catch (error) {
    console.error("GET /api/meals:", error.message);

    res.status(502).json({
      message: "ขออภัย ไม่สามารถโหลดข้อมูลอาหารจาก TheMealDB ได้ในขณะนี้",
      detail: error.message
    });
  }
});

// Get one meal by ID
app.get("/api/meals/:id", async (req, res) => {
  try {
    const id = String(req.params.id).trim();

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: "รหัสเมนูไม่ถูกต้อง" });
    }

    const meal = mealTable.get(id) || await getMealById(id);

    if (!meal) {
      return res.status(404).json({ message: "ไม่พบเมนูนี้" });
    }

    res.json({
      data: meal,
      lookup: mealTable.has(id) ? "Hash Table (Map)" : "TheMealDB lookup"
    });
  } catch (error) {
    res.status(502).json({
      message: "โหลดรายละเอียดเมนูไม่สำเร็จ",
      detail: error.message
    });
  }
});

// Get food categories
app.get("/api/categories", async (_req, res) => {
  try {
    res.json({ data: await getCategories() });
  } catch (error) {
    console.error("GET /api/categories:", error.message);
    res.status(502).json({
      message: "โหลดรายการหมวดหมู่อาหารไม่สำเร็จ"
    });
  }
});

// Get food areas / nationalities
app.get("/api/areas", async (_req, res) => {
  try {
    res.json({ data: await getAreas() });
  } catch (error) {
    res.status(502).json({
      message: "โหลดรายการสัญชาติอาหารไม่สำเร็จ"
    });
  }
});

// Get ingredients
app.get("/api/ingredients", async (_req, res) => {
  try {
    res.json({ data: await getIngredients() });
  } catch (error) {
    res.status(502).json({
      message: "โหลดรายการวัตถุดิบไม่สำเร็จ"
    });
  }
});

// Get random meal
app.get("/api/random", async (_req, res) => {
  try {
    const meals = await getMeals();

    if (!meals.length) {
      return res.status(404).json({
        message: "ยังไม่มีเมนูให้สุ่ม"
      });
    }

    res.json({
      data: meals[Math.floor(Math.random() * meals.length)]
    });
  } catch (error) {
    res.status(502).json({
      message: "สุ่มเมนูไม่สำเร็จ"
    });
  }
});

// Serve frontend in production
const distPath = path.resolve(__dirname, "../frontend/dist");

app.use(express.static(distPath));

app.get("*", (_req, res) =>
  res.sendFile(path.join(distPath, "index.html"), err => {
    if (err) {
      res.status(404).send("Frontend not built yet. Run npm run build.");
    }
  })
);

app.listen(PORT, () => {
  console.log(`Foodie Finder API running at http://localhost:${PORT}`);
});
