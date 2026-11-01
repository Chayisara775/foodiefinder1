
import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  UtensilsCrossed,
  Globe2,
  Carrot,
  ArrowDownAZ
} from "lucide-react";

import {
  fetchAreas,
  fetchIngredients,
  fetchMeals
} from "../api";

import MealGrid from "../components/MealGrid";
import {
  EmptyState,
  ErrorState,
  LoadingState
} from "../components/States";

function getIngredientCount(meal) {
  if (Array.isArray(meal.ingredients)) {
    return meal.ingredients.length;
  }

  return Number(meal.ingredientCount || 0);
}

export default function Explore() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [sort, setSort] = useState("name");

  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [meals, setMeals] = useState([]);

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [meta, setMeta] = useState(null);

  const activeCount = [
    category,
    area,
    ingredient
  ].filter(Boolean).length;

  const runSearch = async (filters = {}) => {
    const current = {
      search: filters.search ?? search,
      category: filters.category ?? category,
      area: filters.area ?? area,
      ingredient: filters.ingredient ?? ingredient,
      sort: filters.sort ?? sort
    };

    setStatus("loading");
    setError("");

    try {
      const result = await fetchMeals({
        search: current.search,
        area: current.area,
        ingredient: current.ingredient,
        sort: "name",
        order: "asc"
      });

      let filteredMeals = result.data || [];

      // กรองตามประเภทอาหาร
      if (current.category) {
        filteredMeals = filteredMeals.filter(
          meal =>
            (meal.category || "").toLowerCase() ===
            current.category.toLowerCase()
        );
      }

      // เรียงลำดับชื่ออาหาร A-Z
      if (current.sort === "name") {
        filteredMeals.sort((a, b) =>
          (a.name || "").localeCompare(
            b.name || "",
            "en",
            { sensitivity: "base" }
          )
        );
      }

      // เรียงจำนวนวัตถุดิบจากมากไปน้อย
      if (current.sort === "ingredients") {
        filteredMeals.sort(
          (a, b) =>
            getIngredientCount(b) - getIngredientCount(a)
        );
      }

      setMeals(filteredMeals);
      setMeta(result);
      setStatus("success");
    } catch (e) {
      setError(e.message || "ไม่สามารถโหลดเมนูอาหารได้");
      setStatus("error");
    }
  };

  useEffect(() => {
    let active = true;

    const loadOptions = async () => {
      try {
        const [
          areaResult,
          ingredientResult,
          mealResult
        ] = await Promise.all([
          fetchAreas(),
          fetchIngredients(),
          fetchMeals()
        ]);

        if (!active) return;

        const allMeals = mealResult.data || [];

        setAreas(areaResult.data || []);
        setIngredients(ingredientResult.data || []);

        const categoryList = [
          ...new Set(
            allMeals
              .map(meal => meal.category)
              .filter(Boolean)
          )
        ].sort((a, b) => a.localeCompare(b));

        setCategories(categoryList);

        setMeals(
          [...allMeals].sort((a, b) =>
            (a.name || "").localeCompare(b.name || "", "en")
          )
        );

        setMeta(mealResult);
        setStatus("success");
      } catch (e) {
        if (!active) return;

        setError(e.message || "โหลดข้อมูลไม่สำเร็จ");
        setStatus("error");
      }
    };

    loadOptions();

    return () => {
      active = false;
    };
  }, []);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setArea("");
    setIngredient("");
    setSort("name");

    runSearch({
      search: "",
      category: "",
      area: "",
      ingredient: "",
      sort: "name"
    });
  };

  return (
    <div className="page-wrap ff-explore">

      {/* INTRO */}
      <section className="page-intro ff-explore-intro">
        <span className="eyebrow">
          THE RECIPE COLLECTION
        </span>

        <h1>
          Explore <em>something new.</em>
        </h1>

        <p>
          ค้นพบเมนูอาหารจากทั่วโลก
          แล้วเลือกเมนูที่ตรงกับความชอบของคุณ
        </p>
      </section>

      {/* SEARCH AND FILTER */}
      <section className="search-panel ff-search-panel">

        <form
          className="search-form"
          onSubmit={e => {
            e.preventDefault();
            runSearch();
          }}
        >
          <Search size={19} />

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาชื่ออาหาร เช่น pasta, chicken..."
            aria-label="ค้นหาเมนูอาหาร"
          />

          <button
            className="button button-dark"
            type="submit"
          >
            ค้นหา
          </button>
        </form>

        <div className="ff-filter-title">
          <div>
            <span className="ff-filter-icon">
              <SlidersHorizontal size={17} />
            </span>

            <div>
              <h3>กำหนดขอบเขตเมนู</h3>
              <p>เลือกประเภท สัญชาติ และวัตถุดิบที่ต้องการ</p>
            </div>
          </div>

          <button
            className="clear-button"
            onClick={clearFilters}
            type="button"
          >
            <X size={14} />
            ล้างตัวกรอง
          </button>
        </div>

        <div className="ff-filter-grid">

          <label className="ff-filter-field">
            <span>
              <UtensilsCrossed size={15} />
              ประเภทอาหาร
            </span>

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">ทุกประเภทอาหาร</option>

              {categories.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="ff-filter-field">
            <span>
              <Globe2 size={15} />
              สัญชาติอาหาร
            </span>

            <select
              value={area}
              onChange={e => setArea(e.target.value)}
            >
              <option value="">ทุกสัญชาติ</option>

              {areas.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="ff-filter-field ff-filter-wide">
            <span>
              <Carrot size={15} />
              วัตถุดิบ
            </span>

            <select
              value={ingredient}
              onChange={e => setIngredient(e.target.value)}
            >
              <option value="">วัตถุดิบทั้งหมด</option>

              {ingredients.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

        </div>

        <div className="ff-sort-section">
          <label className="ff-filter-field">
            <span>
              <ArrowDownAZ size={15} />
              เรียงลำดับเมนู
            </span>

            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="name">
                ชื่ออาหาร A – Z
              </option>

              <option value="ingredients">
                จำนวนวัตถุดิบ มากไปน้อย
              </option>
            </select>
          </label>
        </div>

        <div className="ff-filter-bottom">
          <span>
            เลือกตัวกรองได้หลายรายการพร้อมกัน
          </span>

          <button
            className="button button-dark ff-apply-button"
            onClick={() => runSearch()}
            type="button"
          >
            <Search size={16} />
            แสดงเมนูอาหาร
          </button>
        </div>
      </section>

      {/* RESULTS */}
      <section className="results-section">

        <div className="results-heading">
          <div>
            <span className="eyebrow">
              MADE FOR YOUR TASTE
            </span>

            <h2>เมนูอาหาร</h2>

            {status === "success" && (
              <p className="ff-result-subtitle">
                พบเมนูอาหาร {meals.length.toLocaleString()} รายการ
              </p>
            )}
          </div>
        </div>

        {status === "loading" && <LoadingState />}

        {status === "error" && (
          <ErrorState
            message={error}
            onRetry={() => runSearch()}
          />
        )}

        {status === "success" && (
          meals.length > 0 ? (
            <MealGrid meals={meals} />
          ) : (
            <EmptyState
              title="ไม่พบเมนูอาหาร"
              detail="ลองเปลี่ยนตัวกรองหรือคำค้นหา แล้วค้นหาอีกครั้งนะ"
            />
          )
        )}

      </section>
    </div>
  );
}
