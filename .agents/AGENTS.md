# puadhead — กฎของโปรเจค

ไฟล์นี้คือกฎของโปรเจค puadhead เท่านั้น (กฎส่วนตัวที่ใช้ทุกโปรเจค เช่น ตอบภาษาไทย / coding standards
อยู่ที่ global: `~/.claude/CLAUDE.md` และ `~/.gemini/GEMINI.md`)

## 1. ความจำโปรเจค (`PROJECT_MASTER.md`)

- **อ่านก่อนเริ่ม**: เริ่มเซสชันใหม่หรือสลับโปรเจค ให้อ่าน `PROJECT_MASTER.md` ก่อนตอบ
- **เขียนกลับ**: จบเซสชัน / ทำฟีเจอร์ใหญ่เสร็จ / สั่ง "บันทึก" ให้อัปเดต `PROJECT_MASTER.md`
  (CURRENT_FOCUS / LAST_DECISION / NEXT_ACTION) — Central AutoSave (`~/Developer/_tools/autosave/`)
  จะ commit + push ให้เอง
- **ทำต่อจากอีกเครื่อง**: ดู `git log --stat` และ `~/Developer/_tools/autosave/logs/autosave.log` ก่อน

## 2. วางแผนก่อนแตะโค้ด

งานใหม่: สำรวจก่อน (อ่านอย่างเดียว) → เสนอแผน/ตัวเลือก → รอคำยืนยันก่อนแก้โค้ด
ถ้าขอบเขตหรือโปรเจคไม่ชัด ให้ถามก่อน งานเสี่ยง (deploy, build, ลบไฟล์) ต้องรอคำสั่งชัดเจนเสมอ

## 3. คุณภาพงาน

- ข้อมูลไม่พอให้ถาม อย่าเดา; เจอ error ให้หา root cause ก่อนแก้
- ฟังก์ชันไม่ยาวเกิน แยกเป็นโมดูลย่อย
- ไฟล์ทดสอบ (`test_*`, `check_*`) อยู่ในโฟลเดอร์ทดสอบ ไม่วางที่ root
- พังแล้วกู้ด้วย git (`git log` → `git show` / `git checkout <hash> -- <file>`) ไม่ลบเดา

## 4. กฎเฉพาะของ puadhead

(ยังไม่มี — เพิ่มที่นี่เมื่อมีกฎของโปรเจคนี้)
