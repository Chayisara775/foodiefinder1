
import { useEffect, useState } from "react";
import { ArrowRight, Shuffle, Sparkles, Languages } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchMeals, fetchRandom } from "../api";
import MealGrid from "../components/MealGrid";
import { ErrorState, LoadingState } from "../components/States";

export default function Home() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("foodie-language") || "th"
  );
  const [meals, setMeals] = useState([]);
  const [random, setRandom] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [randomLoading, setRandomLoading] = useState(false);

  const isThai = language === "th";

  const toggleLanguage = () => {
    const next = isThai ? "en" : "th";
    setLanguage(next);
    localStorage.setItem("foodie-language", next);
  };

  const load = async () => {
    setStatus("loading");
    setError("");
    try {
      const result = await fetchMeals({ sort: "name" });
      setMeals(result.data.slice(0, 20));
      setStatus("success");
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const surprise = async () => {
    setRandomLoading(true);
    try {
      const result = await fetchRandom();
      setRandom(result.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setRandomLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="home-toolbar">
        <span>{isThai ? "ยินดีต้อนรับสู่ Foodie Finder" : "WELCOME TO FOODIE FINDER"}</span>
        <button className="language-button" onClick={toggleLanguage}>
          <Languages size={16} />
          {isThai ? "TH | EN" : "EN | TH"}
        </button>
      </div>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={14} />
            {isThai ? "ไอเดียอาหารประจำวันของคุณ" : "YOUR DAILY FOOD INSPIRATION"}
          </span>

          <h1>
            {isThai ? "ค้นพบเมนูใหม่" : "Find a dish."}
            <br />
            <em>{isThai ? "แล้วตกหลุมรัก" : "Fall in love."}</em>
          </h1>

          <p>
            {isThai
              ? "รวมไอเดียอาหารจากทั่วโลก สำหรับวันที่ยังไม่รู้ว่าจะกินอะไรดี"
              : "Food ideas from around the world, for days when you don't know what to eat."}
          </p>

          <div className="hero-actions">
            <Link to="/explore" className="button button-dark">
              {isThai ? "ค้นหาเมนูอาหาร" : "Explore recipes"}
              <ArrowRight size={16} />
            </Link>

            <button
              className="button button-outline"
              onClick={surprise}
              disabled={randomLoading}
            >
              <Shuffle size={16} />
              {randomLoading
                ? (isThai ? "กำลังสุ่ม..." : "Finding a surprise...")
                : (isThai ? "สุ่มเมนูให้หน่อย" : "Surprise me")}
            </button>
          </div>

          {random && (
            <div className="surprise-result">
              <img src={random.image} alt={random.name} />
              <div>
                <small>{isThai ? "เมนูเซอร์ไพรส์ของคุณ" : "YOUR SURPRISE DISH"}</small>
                <strong>{random.name}</strong>
                <Link to={`/meal/${random.id}`}>
                  {isThai ? "ดูสูตรอาหาร" : "View recipe"} <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="hero-art">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-photo">
            <img
              src="https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg"
              alt="Featured food"
            />
          </div>
          <div className="hero-caption">
            <span>01 / DISCOVER</span>
            <strong>Good food, good mood.</strong>
          </div>
          <div className="hero-sticker">made<br />with<br /><b>love ♡</b></div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {isThai ? "เมนูแนะนำจากเรา" : "A FEW IDEAS TO START"}
            </span>
            <h2>{isThai ? "เมนูน่ากินวันนี้" : "Fresh from the kitchen"}</h2>
            <p>
              {isThai
                ? "เลือกเมนูที่ใช่ แล้วออกไปสนุกกับมื้อถัดไป"
                : "Find something delicious for your next meal."}
            </p>
          </div>
          <Link to="/explore" className="text-link">
            {isThai ? "ดูเมนูทั้งหมด" : "View all recipes"}
            <ArrowRight size={15} />
          </Link>
        </div>

        {status === "loading" && <LoadingState />}
        {status === "error" && <ErrorState message={error} onRetry={load} />}
        {status === "success" && <MealGrid meals={meals} />}
      </section>
    </div>
  );
}
