# ปวดเฮด (PuadHead) — design reference

เอกสารนี้แปลง mockup ที่คุยกันในแชทให้เป็นข้อมูลถาวร (แชทเดิม cc มองไม่เห็น)

## Theme default

ตาม **system preference** (`prefers-color-scheme`) ไม่ fix เป็น dark หรือ light ตายตัว — เหตุผลเดิมที่เคยอ้างไวแสงตอนปวดใช้ยืนยัน default ไม่ได้จริง เพราะการบันทึกมักเกิด**หลัง**อาการทุเลาแล้ว (กินยา รอ ดีขึ้นค่อยมาบันทึก) ไม่ใช่ตอนปวดสุดที่ไวแสงจัด มี toggle ในหน้า "ตั้งค่า" ให้ผู้ใช้ override เองได้ (light / dark / ตามระบบ)

## Color palette (light mode)

| Role | Hex | ใช้ที่ไหน |
|---|---|---|
| Accent / primary | `#D97757` (terracotta) — *ทิศทางที่แนะนำ ยังไม่ final confirm จากคุณ แก้ได้ทุกเมื่อ* | ปุ่มหลัก, selected state, border เน้น |
| Surface (page) | `#F8F7F4` | พื้นหลังหน้าจอ |
| Surface (card) | `#FFFFFF` | การ์ด, ช่องกรอก |
| Border | `#E5E3DC` | เส้นขอบทั่วไป |
| Text primary | `#1A1A18` | ข้อความหลัก |
| Text secondary | `#6B6A63` | label, ข้อความรอง |
| Text muted | `#9B9A91` | placeholder, timestamp |
| Severity 2 (ปานกลาง) bg / text | `#FEF3C7` / `#92400E` | badge, การ์ดระดับ 2 |
| Severity 3 (รุนแรง) bg / text | `#FEE2E2` / `#991B1B` | badge, การ์ดระดับ 3 |

terracotta เข้ากับตระกูลสี severity (amber/red เป็นโทนอุ่นเหมือนกัน) แก้ปัญหาสีขัดกันเองที่เคยเกิดตอนใช้น้ำเงินเข้มเป็น accent

## Color palette (dark mode)

| Role | Hex |
|---|---|
| Accent / primary | `#E2916F` — เฉด terracotta ที่สว่างขึ้นสำหรับพื้นมืด **ห้ามใช้ `#D97757` (เฉด light mode) ตรงๆ บนพื้นมืด** เพราะ contrast ต่ำเกินไป ดูหม่น |
| Surface (page) | `#171613` |
| Surface (card) | `#242320` |
| Border | `#3A3934` |
| Text primary | `#F0EFE9` |
| Text secondary | `#B5B3A9` |
| Severity 2 bg / text | `#3D2E0A` / `#FBBF24` |
| Severity 3 bg / text | `#3D1414` / `#F87171` |

## Navigation

**Bottom tab bar** (3 แท็บ, แสดงถาวรบน Dashboard / Report / Settings):

```
[วันนี้ (home icon)]  [รายงาน (chart icon)]  [ตั้งค่า (settings icon)]
```

**Task-screen** (quick-log / edit-entry / เพิ่ม-แก้ไขยา) — ไม่มี tab bar เพราะไม่ใช่หน้าหลัก ใช้ปุ่มย้อนกลับ/ปิด (X หรือลูกศร) ที่มุมซ้ายบนแทนเสมอ

**Cover-mode** — ไม่มี tab bar เพราะพื้นที่จอไม่พอ เป็น single-action screen โดยเจตนา

## Screen: Dashboard (แท็บ "วันนี้")

```
Header: "บันทึกอาการปวดหัว" (ซ้าย) + เดือนปัจจุบัน (ขวา)
  — ใช้ข้อความอธิบายแทนชื่อแอป "ปวดเฮด" ตรงหัวจอนี้โดยเฉพาะ (ชื่อแอปยังอยู่ใน manifest / icon / PDF ตามเดิม)
StatsRow — grid 2 คอลัมน์: metric card "วันที่ปวด" / "วันที่ทานยา"
OveruseAlertBanner — แสดงเฉพาะเมื่อมี moClass ที่ level=warning หรือ critical
  warning: severity-2 palette, icon alert-triangle
  critical: severity-3 palette, icon เดียวกัน
MonthHeatmap — grid 7 คอลัมน์, cell สี่เหลี่ยมมน 4px, สีตาม severity สูงสุดของวันนั้น
  แตะวันที่มี entry → เปิดหน้า edit-entry ของวันนั้น (โหลดข้อมูลเดิมมาเติม)
  ไม่มี entry: surface + border บาง (ไม่ fill สี)
Legend — แถวเล็กอธิบายสีของ heatmap
CTAButton — เต็มความกว้าง, ไอคอน + "บันทึกวันนี้" (เปิด quick-log โหมด add)
TabBar (ล่างสุด) — "วันนี้" active
```

## Screen: quick-log / edit-entry (โหมดกางจอเต็ม, component เดียวกัน 2 โหมด)

```
Header: ปุ่มย้อนกลับ/ปิด (ซ้าย) + "บันทึกวันนี้" หรือวันที่ของ entry ที่แก้ (ขวา)
TimeRangePicker — เวลาเริ่มปวด / เวลาหาย แก้ไขได้อิสระทั้งคู่
  โหมด add: default เวลาหาย = ตอนนี้ (มักบันทึกหลังอาการทุเลาแล้ว), เวลาเริ่ม = ว่าง ให้เลื่อนย้อนหลังเอง
  โหมด edit: โหลดค่าเดิมมาเติมทั้งคู่
SeverityPicker — 3 แถวเต็มความกว้าง, stacked, radio-select:
  ระดับ 1: neutral bg / ระดับ 2: severity-2 bg / ระดับ 3: severity-3 bg
  แต่ละแถว: วงกลมเลขระดับ + คำอธิบายสั้น
MedicationChips — pill แนวนอน wrap ได้, multi-select (รองรับกินหลายตัวใน episode เดียว) highlight ด้วย accent
SymptomToggles — grid 2 คอลัมน์ 2 แถว, icon+label, multi-select, toggle ด้วย accent bg
SaveButton — เต็มความกว้าง, accent fill, ข้อความ "บันทึก"
DeleteButton — โหมด edit เท่านั้น, text-only สีแดง/danger ด้านล่าง SaveButton, ต้อง confirm ก่อนลบจริง
```

## Screen: cover-mode (จอพับ Flip7, aspect ~1:1)

```
Label: "ปวดแค่ไหน" หรือ "กินยาแล้ว" (ปรับตามบริบทได้ ไม่บังคับ pattern เดียว)
SeverityPicker (compact) — 3 แถวเหมือนเดิมแต่ padding แคบลง ไม่มี description ยาว
SaveButton — เต็มความกว้าง
ไม่มี MedicationChips / SymptomToggles ในโหมดนี้
ทุก entry ที่สร้างจากตรงนี้แก้ไขเวลา/ความรุนแรง/รายละเอียดทีหลังได้เสมอผ่านหน้า edit-entry
```

## Screen: Report (แท็บ "รายงาน")

```
Header: "รายงาน"
PeriodSelector — pill แนวนอน 4 ตัวเลือก: 1 เดือน / 3 เดือน / 6 เดือน / กำหนดเอง (single-select)
StatsRow — grid 2 คอลัมน์: "วันที่ปวด" / "วันที่ทานยา" คำนวณจากช่วงที่เลือก
WeeklyTrend — แถบกราฟความถี่รายสัปดาห์แบบง่าย (bar สูงตามจำนวนวันที่ปวดในสัปดาห์นั้น)
EntryList — เรียงตามวัน ล่าสุดก่อน, แต่ละแถว: จุดสีตาม severity + วันที่ + ยาที่ใช้ + ช่วงเวลา + chevron
  แตะแถว → เปิดหน้า edit-entry ของ entry นั้น
ExportPDFButton — เต็มความกว้าง, ใช้ช่วงเวลาเดียวกับ PeriodSelector ด้านบน ไม่ต้องเลือกซ้ำ
TabBar (ล่างสุด) — "รายงาน" active
```

## Screen: Settings (แท็บ "ตั้งค่า")

```
ไม่ต้อง mockup ละเอียด ให้ cc ออกแบบเองได้ (list + add/edit/delete pattern ที่ solved แล้ว)
ต้องมี:
  - จัดการยา: list ยาทั้งหมด, เพิ่ม/แก้/ลบ, แนบรูปตอนเพิ่มยาใหม่ได้
  - Theme override: light / dark / ตามระบบ (default = ตามระบบ)
ใช้ token สี/component จากเอกสารนี้ทั้งหมด ไม่คิด style ใหม่
TabBar (ล่างสุด) — "ตั้งค่า" active
```

## Icon library

แนะนำ `lucide-react` ใช้กับ React ได้ตรงๆ และ import SVG path เดียวกันไปวาดใน `@react-pdf/renderer` ได้ (ไอคอนตัวอย่างที่ใช้ demo ในแชท: `alert-triangle`, `plus`, `sun`, `volume`, `droplet`, `eye`, `chevron-right`, `download`, `home`, `chart-bar`)
