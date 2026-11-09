Foodie Finder — Final Project (ต่อยอด API ด้วย React-Vite + Express)

เว็บไซต์ค้นหาไอเดียอาหารจาก TheMealDB พัฒนาด้วย React + Vite (Frontend) และ Express (Backend) โดยต่อยอดมาจาก Foodie Finder งาน API ครั้งแรก เพื่อปรับปรุงประสบการณ์ผู้ใช้งาน (UX) และการประมวลผลข้อมูลเชิงลึก (DSA)

ลิงก์ที่เกี่ยวข้อง

Website (Vercel): https://foodie-finder-eta.vercel.app/

Original Version (Vercel): https://foodiefinder-lovat.vercel.app/

GitHub Repository: https://github.com/Chayisara775/foodiefinder1

ตารางส่วนร่วม

### 7.1 ตารางส่วนร่วม

| ชื่อ-สกุล | รหัสนักศึกษา | ชิ้นงานที่รับผิดชอบ (ไฟล์ / component / route / DSA) |
| :--- | :--- | :--- |
| ชยิสรา ปุนบุดดา | [681310775] | frontend/src/App.jsx, frontend/src/components/Popup.jsx (ระบบ Frontend, UX หน้าแสดงผล และฟีเจอร์เลือกเมนูแบบป๊อปอัพตามคำแนะนำ) |
| นิรชา คำสอง | [681310783] | backend/server.js, frontend/src/components/ComponentTree.jsx (Express Backend หน้าที่ Proxy, Validate ข้อมูล, ซ่อน API Key และโครงสร้าง Component Tree) |
| มุฑิตา วงษา | [681310789] | frontend/src/utils/dsa.js (ระบบ Data Structure & Algorithm สำหรับการค้นหา/กรองข้อมูลเชิงลึก และคำนวณ Big-O) |


### 7.2 ตารางข้อแนะนำจากงานแรก สิ่งที่แก้

| ข้อแนะนำจากงานแรก | สิ่งที่แก้ในงานนี้ | หลักฐาน Before / After |
| :--- | :--- | :--- |
| ขอบเขตการเลือกเมนูยังไม่เหมาะสม ให้ปรับแสดงผลเป็นป๊อปอัพ (Popup) | ปรับปรุง UI ให้แสดงรายละเอียดเมนูอาหารขึ้นมาเป็น Modal Popup ทับหน้าเดิม ทำให้ผู้ใช้ไม่ต้องโหลดเปลี่ยนหน้าใหม่ ลดขั้นตอน Flow ให้สั้นลง | **Before:** เลือกเมนูแล้วเปลี่ยนหน้าไปหน้าอื่น<br>**After:** คลิกเลือกเมนูแล้วเด้งป๊อปอัพแสดงรายละเอียดทันที |

Before (งานเดิม): คลิกเลือกเมนูแล้วระบบเปิด/โหลดเปลี่ยนไปอีกหน้าหนึ่ง ทำให้เสียจังหวะการใช้งาน
![Before](./![alt text](<Screenshot 2026-11-09 192642.png>))
After (งานนี้): คลิกเลือกเมนูแล้วแสดงผลเป็น Popup Overlay บนหน้าเดิมทันที มีปุ่มปิด (Close) ชัดเจน
![After](./![alt text](<Screenshot 2026-11-09 192707.png>))

สรุปฟีเจอร์และการต่อยอดในงานนี้

UX & Responsive UI:

เพิ่ม Modal Popup ตามคำแนะนำของอาจารย์

มีสถานะตอบสนองผู้ใช้ครบถ้วน: Loading (ระหว่างดึงข้อมูล), Empty (เมื่อค้นหาไม่พบ), Error (เมื่อ API มีปัญหา), และ Success (แสดงรายการอาหาร)

Express Backend:

ทำหน้าที่เป็น Proxy Gateway ช่วยปกปิด Endpoint/API Key และป้องกัน CORS issues

ตรวจสอบความถูกต้องของข้อมูล (Data Validation) ก่อนส่งต่อให้ Frontend

Data Structure & Algorithm (DSA):

ประมวลผลและกรองข้อมูลค้นหา (Search & Filter) ด้วยอัลกอริทึมที่มีประสิทธิภาพ เหมาะสมกับขนาดข้อมูลของ TheMealDB
