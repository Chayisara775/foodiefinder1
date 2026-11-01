import { AlertCircle, LoaderCircle, SearchX } from "lucide-react";
export function LoadingState({ label = "กำลังค้นหาเมนูอร่อย ๆ..." }) {
  return <div className="state-panel"><LoaderCircle className="spin" size={25}/><p>{label}</p></div>;
}
export function EmptyState({ title = "ยังไม่พบเมนูที่ตรงกัน", detail = "ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองดูนะ" }) {
  return <div className="state-panel"><SearchX size={28}/><strong>{title}</strong><p>{detail}</p></div>;
}
export function ErrorState({ message, onRetry }) {
  return <div className="state-panel error-state"><AlertCircle size={28}/><strong>เกิดข้อผิดพลาด</strong><p>{message}</p>{onRetry && <button className="button button-dark" onClick={onRetry}>ลองอีกครั้ง</button>}</div>;
}
