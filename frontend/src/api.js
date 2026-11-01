const API_BASE = "https://foodie-finder-api.vercel.app";

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
  }

  return body;
}
export const fetchMeals = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value) query.set(key, value); });
  return request(`/api/meals?${query.toString()}`);
};
export const fetchMeal = id => request(`/api/meals/${id}`);
export const fetchAreas = () => request("/api/areas");
export const fetchIngredients = () => request("/api/ingredients");
export const fetchRandom = () => request("/api/random");
