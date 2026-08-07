# ปวดเฮด (PuadHead) — project handoff spec (ฉบับรวบยอด)

ชื่อทางเทคนิค (repo, package.json, npm) ใช้ `puadhead` — ตัวพิมพ์เล็กล้วน ตาม convention ของ npm package name

แอปบันทึกและวิเคราะห์อาการปวดหัว — ตั้งใจรองรับปวดหัวทุกชนิด (ไมเกรน, tension, cluster ฯลฯ) แต่ MVP scope เอาไมเกรนอย่างเดียวก่อน

## 1. Architecture

- **Frontend**: React + Vite (สแต็กเดียวกับ Kordr) ทำเป็น PWA ติดตั้งลงหน้าจอได้ทั้ง iOS/Android
- **ไม่มี backend เลยใน Phase 1** — เก็บทุกอย่างใน IndexedDB บนเครื่อง (รวมถึงข้อมูลยา ไม่แยกระบบ)
- **โครงสร้างโฟลเดอร์ต้อง flat ที่ root ของโปรเจค** — ห้ามมี `frontend/` แยกต่างหาก (ไม่ใช่ monorepo เพราะไม่มี backend คู่กัน) `src/`, `docs/`, `PROJECT_MASTER.md` อยู่ระดับเดียวกันที่ root ทั้งหมด
- **จัดการยา (medication catalog) เป็นส่วนหนึ่งของแอปนี้เอง ไม่เชื่อมกับ MedCare** — MedCare เป็น local-only app ยังไม่มี API/export ให้ดึงข้อมูล ถ้าวันหนึ่ง MedCare เปิดทางออกมาค่อยพิจารณา import ทีหลัง
- Phase 2 (ทีหลัง): Firestore sync + Google sign-in (pattern เดียวกับ ASomYimTrade) เปิดให้คนอื่นใช้
- รายละเอียด meta tags / manifest.json / breakpoint 3 แพลตฟอร์ม (iPhone, iPad mini, Flip7) → ดู `pwa-platform-checklist.md`
- รายละเอียดสี / โครงสร้างหน้าจอ / navigation → ดู `design-reference.md`

## 2. Data schema

```json
{
  "entries": [
    {
      "entryId": "entry_20260805_001",
      "date": "2026-08-05",
      "headacheType": "migraine",
      "painStart": "07:30",
      "painEnd": "08:00",
      "severity": 3,
      "symptoms": { "photophobia": false, "phonophobia": false, "nausea": true, "aura": false },
      "medications": [
        { "medicationId": "med_003", "time": "07:35", "escalated": false }
      ],
      "isMenstruating": false,
      "cgrpInjectionDay": false,
      "extendedTriggers": { "sleepHours": null, "stressLevel": null, "weather": null, "foodTags": [], "screenTimeHours": null },
      "notes": null
    }
  ],
  "medications": [
    {
      "id": "med_001",
      "name": "พาราเซตามอล",
      "type": "acute",
      "moClass": "simple_analgesic",
      "scheduledFrequency": null,
      "maxDosePerDay": null,
      "photoUrl": null
    },
    {
      "id": "med_002",
      "name": "Flunarizine 5mg",
      "type": "preventive",
      "moClass": null,
      "scheduledFrequency": "daily_before_bed",
      "notes": "ห้ามใช้ในผู้ป่วยพาร์กินสัน"
    },
    {
      "id": "med_003",
      "name": "Nurtec ODT 75mg",
      "type": "hybrid",
      "moClass": "gepant",
      "scheduledFrequency": "every_other_day",
      "escalationRule": "เพิ่มเป็นวันละ 1 เม็ดได้หากมีอาการปวด"
    }
  ]
}
```

**จุดที่เปลี่ยนจาก draft แรกๆ ระหว่างคุยกัน:**

- `entries` เป็น array คีย์ด้วย `entryId` ไม่ใช่ `date` ตรงๆ — รองรับปวดหลายรอบในวันเดียว (เช่น เช้ากับเย็นคนละ episode)
- `medications` ในแต่ละ entry เป็น **array** ไม่ใช่ object เดียว — รองรับกินยาหลายตัวใน episode เดียว (parac ก่อน ไม่หายค่อยตาม triptan)
- ตัด `isMigraineDay`/`isHeadacheDay` ออก — มี entry ของวันนั้นก็บ่งบอกอยู่แล้วว่ามีอาการ ไม่ต้องมี flag ซ้ำ
- `headacheType` fix เป็น `"migraine"` ใน MVP ไม่ทำ UI ให้เลือกชนิดอื่นตอนนี้ (field เฉพาะไมเกรนอย่าง `aura`, `cgrpInjectionDay` ยังปล่อยเป็น field ตรงๆ ไม่ conditional)
- เพิ่ม `photoUrl` ใน medication — รองรับแนบรูปตอนเพิ่มยาใหม่ (ข้อ 6)
- `painStart`/`painEnd` ต้องแก้ไขได้อิสระทั้งคู่ในหน้า UI เพราะการบันทึกส่วนใหญ่เกิด**หลัง**อาการทุเลาแล้ว ไม่ใช่บันทึกสดตอนปวด — ดู UI ใน design-reference.md

## 3. Overuse alert logic

อิงจาก ICHD-3 diagnostic criteria (เกณฑ์เดียวกับที่ระบุในสมุดบันทึกของหมอ):

| moClass | threshold | ตัวอย่างยา |
|---|---|---|
| simple_analgesic | 15 วัน / เดือน | พาราเซตามอล |
| NSAID | 15 วัน / เดือน | ไอบูโพรเฟน, ไดโคลฟีแนค, นาพรอกเซน |
| triptan | 10 วัน / เดือน | Relpax (eletriptan) |
| ergot | 10 วัน / เดือน | — |
| opioid | 10 วัน / เดือน | ทรามาดอล |
| gepant | 10 วัน / เดือน (convention, ยังไม่มี consensus ชัด — ควรถามหมอผู้สั่งยายืนยัน) | Nurtec ODT |

```js
function checkOveruseRisk(entries, medications, asOfDate) {
  const windowStart = subtractDays(asOfDate, 29); // rolling 30 วัน
  const threshold = { simple_analgesic: 15, NSAID: 15, triptan: 10, ergot: 10, opioid: 10, gepant: 10 };
  const daysByClass = {}; // moClass -> Set ของวันที่ (กันนับซ้ำ)

  entries
    .filter(e => e.date >= windowStart && e.date <= asOfDate)
    .forEach(e => {
      (e.medications || []).forEach(m => {
        const med = medications.find(md => md.id === m.medicationId);
        if (!med?.moClass) return;
        daysByClass[med.moClass] = daysByClass[med.moClass] || new Set();
        daysByClass[med.moClass].add(e.date);
      });
    });

  return Object.entries(daysByClass).map(([moClass, dateSet]) => {
    const days = dateSet.size;
    const limit = threshold[moClass];
    const ratio = days / limit;
    const level = ratio >= 1 ? "critical" : ratio >= 0.7 ? "warning" : "safe";
    return { moClass, days, limit, level };
  });
}
```

**จุดสำคัญที่แก้จาก draft แรก**: นับเป็น**จำนวนวัน**ไม่ใช่จำนวนครั้ง — ถ้ากินยา class เดียวกัน 2 ครั้งในวันเดียว (คนละ episode) ต้องนับเป็น 1 วัน ไม่ใช่ 2 เพราะเกณฑ์ ICHD-3 นับจากวันที่ใช้ยา ไม่ใช่จำนวนโดส ใช้ `Set` ต่อ moClass กันการนับซ้ำ (แก้ไขจาก draft แรกที่ยังผูก entry กับ date ตรงๆ อยู่)

UI แนะนำ: badge เตือนตอน level เป็น `warning` (เหลือง) หรือ `critical` (แดง) โชว์บนหน้า dashboard หลัก ไม่ใช่ popup interrupt ตอนกำลังบันทึกอาการปวด

## 4. PDF export (สำหรับส่งหมอ)

ใช้ `@react-pdf/renderer` — วาด PDF จาก React component ตรงๆ เป็น vector text/icon จริง ไม่ใช่ screenshot ของหน้าจอ (คมชัดตอนซูม/ปริ้น)

- **เลือกช่วงเวลาได้จากหน้า Report** ไม่ผูกกับเดือนเดียวแบบ dashboard เพราะหมอมักอยากเห็น trend 3-6 เดือน — ปุ่ม Export ใช้ช่วงเวลาเดียวกับที่เลือกไว้ในหน้า Report อยู่แล้ว ไม่ต้องเลือกซ้ำสองที่
- Layout เลียนแบบตารางเดือนของสมุดบันทึกต้นฉบับ (grid วัน + severity + medication + symptom icons) เพราะหมอคุ้นกับ format นี้อยู่แล้ว
- Export เป็น PDF เท่านั้นใน MVP — ไม่ทำ image export (PNG) จนกว่าจะมีคนขอจริง

## 5. Icon system — ไม่ใช้ emoji

ห้ามใช้ emoji character (🌞😖 ฯลฯ) แทน symptom เพราะ render ไม่เหมือนกันข้ามแพลตฟอร์ม (iOS/Android/PDF viewer ใช้ font emoji คนละชุด) และดูไม่เป็นทางการพอสำหรับเอกสารที่จะส่งหมอ

ใช้ SVG icon set เดียวกันทั้งในแอปและใน PDF export — `lucide-react` ฝั่ง UI, export SVG path เดียวกันไปวาดใน `@react-pdf/renderer` ความหมาย icon อิงจากสมุดต้นฉบับ: sun = ไวต่อแสง, speaker = ไวต่อเสียง, droplet = คลื่นไส้, sparkle/eye = ออร่า

### ภาพประกอบตกแต่ง (ในแอป)

ไม่ทำ mascot/illustration เต็มรูปแบบใน MVP เพราะกินเวลา design แต่ไม่ช่วยให้บันทึกอาการเร็วขึ้น ใส่แค่ภาพประกอบเดียวสำหรับ empty state (ตอนยังไม่มีข้อมูล) จาก resource ฟรี เช่น unDraw หรือ Storyset แทนจ้างวาดเอง — ค่อยพิจารณาทำ mascot จริงจังตอนเปิด phase 2 ให้คนอื่นใช้

## 6. แนบภาพประกอบ — จำกัดขอบเขต

ไม่เปิดให้แนบรูปในทุก entry — เก็บภาพถ่ายรายวันจะบวมเร็วเกินไปสำหรับ IndexedDB phase 1 แถมเพิ่มความซับซ้อนเรื่อง privacy ตอนเปิด sync phase 2 โดยไม่มีประโยชน์ทางคลินิกชัดเจน (สมุดต้นฉบับก็ไม่มี field รูปเช่นกัน)

ที่ควรมีคือแนบรูปได้เฉพาะตอน**เพิ่มยาใหม่เข้า catalog** (ไม่ใช่ต่อ entry) — ใช้ pattern ถ่ายรูปซองยาแล้วอ่านชื่อ/ขนาดยา จำนวนรูปจะถูกจำกัดตามจำนวนยาที่ใช้จริง จัดการง่ายกว่ามาก

## 7. จัดการยา (medication management)

หน้านี้**ไม่ต้อง mockup ละเอียดล่วงหน้า** ให้ cc ออกแบบเองได้เลย เป็น pattern list + add/edit/delete ที่ solved แล้ว ไม่มีความซับซ้อนเชิง UX แบบหน้าอื่น แต่ต้องยึด guardrail นี้:

- ใช้ token สี/component style จาก `design-reference.md` (การ์ด, chip, ปุ่ม) ไม่คิดใหม่
- ใช้ schema ยาตามข้อ 2 (name, type, moClass, scheduledFrequency, maxDosePerDay, photoUrl)
- เก็บใน IndexedDB เดียวกัน ไม่มี backend
- เข้าถึงจากแท็บ "ตั้งค่า" ใน tab bar
- แนบรูปได้ตอนเพิ่มยาใหม่ตามข้อ 6

## 8. Next steps สำหรับ Claude Code

1. Setup React + Vite + PWA plugin แบบ flat structure ที่ root (ไม่มี `frontend/` แยก) ใส่ manifest.json + meta tags ตาม `pwa-platform-checklist.md`
2. Implement IndexedDB layer ตาม schema ข้อ 2 (entries + medications, ทั้งคู่ไม่มี backend)
3. Navigation shell: bottom tab bar 3 แท็บ (วันนี้ / รายงาน / ตั้งค่า) + back/X pattern สำหรับ task-screen (quick-log, edit-entry) — ดู `design-reference.md`
4. Dashboard (แท็บ "วันนี้"): header, stats, overuse alert banner, month heatmap (แตะวัน → เปิดแก้ entry), ปุ่ม "+บันทึกวันนี้"
5. Quick-log / edit-entry (component เดียวกัน 2 โหมด add/edit): TimeRangePicker, SeverityPicker, MedicationChips (multi-select), SymptomToggles, ปุ่มบันทึก, ปุ่มลบ (โหมด edit เท่านั้น, มี confirm ก่อนลบ), ปุ่มย้อนกลับ/ปิดมุมซ้ายบน
6. Cover-mode (จอพับ Flip7): action เดียวแบบยืดหยุ่น — กดตอนปวด หรือกดตอนกินยาก็ได้ ไม่บังคับ pattern เดียว ทุก entry ที่สร้างจากตรงนี้แก้ไขทีหลังได้เสมอ
7. Report (แท็บใหม่): period preset (1/3/6 เดือน/กำหนดเอง), stats ตามช่วง, weekly trend bar, entry list (แตะ → แก้ไข), ปุ่ม Export PDF
8. Settings (แท็บใหม่): จัดการยา CRUD ตามข้อ 7, theme override (light/dark/ตามระบบ, default = ตามระบบ)
9. `checkOveruseRisk()` (เวอร์ชัน dedup by date) + alert badge บน dashboard
10. PDF export (ข้อ 4) — ทำหลัง dashboard/report เสถียรแล้ว
11. Phase 2 (ทีหลัง): Firestore sync + auth
