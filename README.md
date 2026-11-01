# Foodie Finder — Final Project

เว็บค้นหาไอเดียอาหารจาก TheMealDB พัฒนาด้วย **React + Vite (Frontend)** และ **Express (Backend)** โดยต่อยอดจาก Foodie Finder งาน API ครั้งแรก

> ดีไซน์: Minimal / Modern / Soft Elegant — พื้นครีม ม่วงเข้ม และลาเวนเดอร์

## 1. วิธีเปิดโปรเจกต์ใน VS Code

**สิ่งที่ต้องมี:** Node.js เวอร์ชัน 18 ขึ้นไป และ npm

1. แตกไฟล์ ZIP นี้ก่อน
2. เปิด VS Code → `File` → `Open Folder...` → เลือกโฟลเดอร์ `Foodie-Finder-Final`
3. เปิด Terminal ใน VS Code (`Terminal` → `New Terminal`)
4. ติดตั้ง dependencies ครั้งแรก:

   ```bash
   npm install
   ```

5. เปิดทั้ง Backend และ Frontend พร้อมกัน:

   ```bash
   npm run dev
   ```

6. เปิดเว็บที่ Vite แสดงใน Terminal โดยปกติคือ `http://localhost:5173`

Backend ทำงานที่ `http://localhost:3000` และ Vite จะ proxy คำขอ `/api` ไปยัง Express ให้อัตโนมัติ

**คำสั่งอื่น**

```bash
npm run build   # build Frontend สำหรับ production
npm start       # เปิด Express server
```

> ถ้าแก้โค้ดแล้วหน้าเว็บไม่อัปเดต ให้ตรวจ Terminal ทั้งสองฝั่งว่ามี error หรือไม่

## 2. โครงสร้างโปรเจกต์

```text
Foodie-Finder-Final/
├── backend/
│   ├── server.js          # Express routes, validation, sorting, hash lookup
│   ├── mealService.js     # ติดต่อ TheMealDB และ cache ข้อมูล
│   ├── dsa.js             # Hash Table (Map) และ Selection Sort
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── vite.config.js     # proxy /api → Express
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── context.jsx
│       ├── styles.css
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── MealCard.jsx
│       │   ├── MealGrid.jsx
│       │   └── States.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── Explore.jsx
│           ├── Favorites.jsx
│           └── MealDetail.jsx
├── legacy/                # โค้ดงานเดิม เก็บไว้เทียบ Before
├── .gitignore
├── package.json
└── README.md
```

## 3. Component Tree

```text
App
└── FavoritesProvider
    └── Routes
        └── Layout
            ├── Header / Navigation
            ├── Home
            │   ├── LoadingState / ErrorState
            │   └── MealGrid → MealCard
            ├── Explore
            │   ├── Search + Filters
            │   ├── LoadingState / EmptyState / ErrorState
            │   └── MealGrid → MealCard
            ├── Favorites
            │   └── MealGrid → MealCard
            └── MealDetail
                └── Ingredients + Instructions
```

- `App.jsx` จัดการเส้นทางของหน้าเว็บ
- `FavoritesProvider` เก็บ state รายการโปรดและแชร์ให้ทุก component
- `MealCard` แสดงข้อมูลอาหารหนึ่งรายการ และเรียกใช้การบันทึก/ยกเลิกรายการโปรด
- `MealGrid` แสดงรายการอาหารเป็น Grid
- `Explore` เป็นเจ้าของ state การค้นหา ตัวกรอง และการเรียงลำดับ
- `MealDetail` โหลดรายละเอียดอาหารตาม ID

## 4. ฟีเจอร์หลัก

- **Home:** แสดงเมนูแนะนำ และสุ่มเมนู
- **Explore:** ค้นหาจากชื่ออาหาร
- **Cuisine / Area filter:** เลือกสัญชาติหรือพื้นที่ของอาหาร เช่น Thai, Japanese, Italian
- **Main ingredient filter:** เลือกวัตถุดิบหลัก เช่น Chicken, Beef, Pork หรือ Seafood (ขึ้นกับข้อมูลที่ API ส่งกลับ)
- **AND filtering:** ถ้าเลือก Area และ Ingredient พร้อมกัน เมนูต้องตรงทั้งสองเงื่อนไข
- **Sort:** เรียงตาม Name หรือ Category และเลือก A–Z / Z–A
- **Favorites:** บันทึกเมนูโปรดไว้ใน `localStorage` จึงยังอยู่เมื่อ refresh หน้าใน browser เดิม
- **Meal detail:** ดูวัตถุดิบ ปริมาณ และวิธีทำ

## 5. UX States

| State | การทำงาน |
|---|---|
| Loading | แสดงข้อความ/ไอคอนระหว่างรอ API |
| Empty | แจ้งเมื่อไม่พบเมนู พร้อมแนะนำให้เปลี่ยนคำค้นหาหรือล้างตัวกรอง |
| Error | แสดงข้อความเมื่อ API มีปัญหา พร้อมปุ่มลองอีกครั้ง |
| Success | แสดงรายการเมนูและจำนวนผลลัพธ์ |

## 6. Backend และ API

Express ไม่ได้เป็นแค่ทางผ่าน แต่รับผิดชอบการตรวจสอบ query, เรียก TheMealDB, cache ผลลัพธ์, กรอง/เรียงข้อมูล และค้นหาด้วย Hash Table

| Route | หน้าที่ |
|---|---|
| `GET /api/health` | ตรวจสถานะ Backend |
| `GET /api/meals` | ค้นหา กรอง และเรียงเมนู |
| `GET /api/meals/:id` | ดูรายละเอียดเมนูด้วย ID |
| `GET /api/areas` | รายการสัญชาติ/พื้นที่อาหาร |
| `GET /api/ingredients` | รายการวัตถุดิบ |
| `GET /api/random` | สุ่มเมนู |

ตัวอย่าง:

```text
/api/meals?search=chicken&area=Japanese&ingredient=Chicken&sort=name&order=asc
```

TheMealDB เป็น API ภายนอกที่ระบบใช้:

- Search: `https://www.themealdb.com/api/json/v1/1/search.php?s=...`
- Lookup: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=...`
- Areas: `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
- Ingredients: `https://www.themealdb.com/api/json/v1/1/list.php?i=list`

Backend cache ข้อมูลที่เรียกจาก API เป็นเวลา 10 นาที เพื่อลดการเรียก API ซ้ำในช่วงเวลาสั้น ๆ

## 7. DSA ที่ใช้กับข้อมูลจริง

### 7.1 Hash Table — `Map` (ฝั่ง Express)

ไฟล์: `backend/dsa.js` และ `backend/server.js`

เมื่อได้ข้อมูลเมนู ระบบสร้าง `Map` โดยใช้ `meal.id` เป็น key และข้อมูลเมนูเป็น value เมื่อเปิดรายละเอียด `/api/meals/:id` จะค้นใน Map ก่อน หากไม่พบจึงค่อยเรียก TheMealDB lookup

- สร้าง Hash Table: O(n)
- ค้นหาด้วย ID: เฉลี่ย O(1)
- กรณีแย่ที่สุดของ Hash Table อาจเป็น O(n)
- ประโยชน์ต่อ UX: ลดการค้นหารายการใน array ทีละตัว และลดการเรียก API ภายนอกเมื่อข้อมูลอยู่ในตารางแล้ว

### 7.2 Selection Sort — (ฝั่ง Express)

ไฟล์: `backend/dsa.js`

ใช้เรียงเมนูจริงตาม `Name` หรือ `Category` โดยเปรียบเทียบค่าทีละคู่และเลือกค่าที่ควรอยู่ตำแหน่งถัดไป

- เวลา: O(n²) ทั้งกรณีเฉลี่ยและกรณีแย่ที่สุด
- พื้นที่เพิ่ม: O(n) เพราะสร้าง array สำเนาก่อนเรียง เพื่อไม่แก้ array ต้นฉบับ
- เหตุผลที่ใช้ในงานนี้: ต่อยอดจากอัลกอริทึม Sorting ที่มีในงานเดิม และทำให้เห็นขั้นตอนการเปรียบเทียบ/สลับตำแหน่งได้ชัดเจน
- ข้อจำกัด: หากข้อมูลมีจำนวนมาก ควรพิจารณาอัลกอริทึม O(n log n) เช่น Merge Sort หรือใช้ built-in sort เมื่อไม่จำเป็นต้องสาธิตอัลกอริทึมเอง

> หมายเหตุสำหรับการนำเสนอ: ค่าเวลาที่แสดงในหน้า Explore เป็นเวลาที่ใช้เรียงข้อมูลในรอบนั้น ซึ่งเปลี่ยนแปลงได้ตามเครื่องและจำนวนข้อมูล ไม่ควรใช้ตัวเลขจากการรันครั้งเดียวเป็นข้อสรุปประสิทธิภาพทั้งหมด

## 8. ต่อยอดจากงานแรก: Before → After

ตารางนี้สรุปการเปลี่ยนแปลงที่ตรวจพบจากโค้ดงานเดิมและโค้ดเวอร์ชันนี้ **โปรดปรับถ้อยคำให้ตรงกับคำแนะนำจริงที่อาจารย์ให้ในงานแรกก่อนส่ง** เพราะยังไม่มีข้อความ feedback จากอาจารย์แนบมา

| สิ่งที่พบในงานเดิม (Before) | สิ่งที่ปรับในงานนี้ (After) | หลักฐานในโปรเจกต์ |
|---|---|---|
| หน้าเว็บเป็น HTML/CSS/JavaScript รวมอยู่หน้าเดียว | แยก Frontend เป็น React + Vite และแบ่ง component/page | `frontend/src/pages/`, `frontend/src/components/` |
| การค้นหา/แสดงผลอยู่ใน JavaScript ที่ผูกกับ DOM โดยตรง | ใช้ React state และ component แยกหน้าที่ | `Explore.jsx`, `MealCard.jsx`, `MealGrid.jsx` |
| ยังไม่มีหน้า Explore และ Favorites แยกชัดเจน | เพิ่ม Home, Explore, Favorites และหน้า Meal Detail | `frontend/src/pages/` |
| การกรองหลายเงื่อนไขยังไม่ครบ | เพิ่ม Area + Ingredient filter แบบ AND | `backend/mealService.js` |
| Backend เดิมมีการเรียก API และ sort แต่ยังไม่มี cache | เพิ่ม cache 10 นาที และตรวจสอบ query ก่อนประมวลผล | `backend/mealService.js`, `backend/server.js` |
| มี Hash Table และ Sorting ในงานเดิม | แยก DSA เป็นไฟล์และใช้กับข้อมูลอาหารจริงใน API | `backend/dsa.js` |

## 9. ตารางส่วนร่วม (กรอกข้อมูลจริงก่อนส่ง)

| ชื่อ-สกุล | รหัสนักศึกษา | ชิ้นงานที่รับผิดชอบ (ไฟล์ / component / route / DSA) | ช่วงที่นำเสนอในคลิป |
|---|---|---|---|
| [กรอกชื่อสมาชิก 1] | [กรอกรหัส] | [ระบุไฟล์/ชิ้นงานจริง] | [ช่วงเวลา] |
| [กรอกชื่อสมาชิก 2] | [กรอกรหัส] | [ระบุไฟล์/ชิ้นงานจริง] | [ช่วงเวลา] |
| [กรอกชื่อสมาชิก 3 ถ้ามี] | [กรอกรหัส] | [ระบุไฟล์/ชิ้นงานจริง] | [ช่วงเวลา] |

ให้ระบุเฉพาะงานที่สมาชิกทำจริง และให้สอดคล้องกับ GitHub commit history

## 10. โครงคลิปนำเสนอ 6–8 นาที

| ช่วง | เวลาโดยประมาณ | เนื้อหา |
|---|---:|---|
| 1. เปิดงาน | 0:30–1:00 | ชื่อโปรเจกต์ API ที่ใช้ และตารางส่วนร่วม |
| 2. Before → After | 1:00–1:30 | ปัญหาหรือคำแนะนำจากงานแรก และภาพเปรียบเทียบสองเวอร์ชัน |
| 3. Demo | 2:00 | ค้นหาอาหาร เลือก Area + Ingredient พร้อมกัน เรียงข้อมูล บันทึก Favorites และเปิดรายละเอียด |
| 4. เบื้องหลัง | 1:00–1:30 | Component Tree, React ↔ Express ↔ TheMealDB, หน้าที่ Backend |
| 5. DSA | 1:00–1:30 | Hash Table และ Selection Sort, Big-O และผลต่อผู้ใช้ |
| 6. สรุป | 0:30 | สิ่งที่เรียนรู้ ข้อจำกัด และแนวทางพัฒนาต่อ |

สมาชิกทุกคนควรพูดในส่วนที่ตนรับผิดชอบจริง และอธิบายเหตุผลว่า “ทำไมจึงเลือกวิธีนี้”

## 11. GitHub และ Deploy

- สร้าง repository ใหม่หรือใช้ repository กลุ่มเดิม แล้ว push โฟลเดอร์โปรเจกต์นี้
- ให้สมาชิก commit งานด้วยบัญชีของตนเองตามชิ้นงานจริง
- ใบงานระบุว่า Deploy ไม่บังคับและไม่มีคะแนน เนื่องจากใช้คลิปแสดงระบบแทนการ demo สด
- หากต้องการ Deploy ภายหลัง ต้องแยกบริการ Frontend (Vercel) และ Backend (บริการที่รองรับ Node/Express) และตั้งค่า API base URL ให้ตรงกับระบบจริง

## 12. ข้อจำกัดที่ควรรู้

- TheMealDB เป็นบริการภายนอก จึงขึ้นกับอินเทอร์เน็ตและความพร้อมของ API
- รายการอาหารเริ่มต้นรวบรวมจากคำค้นหลายคำ ไม่ใช่ฐานข้อมูลอาหารทั้งหมดของ TheMealDB
- การค้นหาด้วยชื่อจะค้นผ่าน TheMealDB ก่อน แล้วจึงใช้ตัวกรอง Area/Ingredient กับผลที่ได้
- ข้อมูลวัตถุดิบอาจมีชื่อสะกดหรือรูปแบบต่างกันตามข้อมูลต้นทาง
- รายการ Favorites เก็บใน browser ของผู้ใช้ ไม่ได้ sync ข้ามอุปกรณ์

## 13. แหล่งข้อมูล

- TheMealDB API: https://www.themealdb.com/api.php
- React: https://react.dev/
- Vite: https://vite.dev/
- Express: https://expressjs.com/
