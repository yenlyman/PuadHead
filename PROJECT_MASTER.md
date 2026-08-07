# ปวดเฮด (PuadHead) — Project Master

แอปบันทึกและวิเคราะห์อาการปวดหัว — ตั้งใจรองรับปวดหัวทุกชนิดในระยะยาว แต่ MVP scope เอาไมเกรนอย่างเดียวก่อน
เริ่มจาก PWA ใช้เองก่อน แล้วเปิดให้คนอื่นใช้ทีหลัง

> **หมายเหตุ**: ไฟล์นี้คือฉบับที่ 2 หลังจากปรับ spec ยกเครื่อง (schema entries เป็น array, tab bar navigation,
> โทนสี terracotta, หน้า Report/Settings ใหม่) เอกสาร spec 3 ไฟล์ใน `docs/` เป็นฉบับล่าสุดที่แทนที่ของเดิมทั้งหมด

## Tech stack

- React + Vite (flat structure ที่ root — **ไม่มี** `frontend/` แยก)
- **Login เป็นทางเลือกเสริม ไม่ใช่ประตูบังคับ** (ดูหัวข้อ "Phase 2.5" ด้านล่าง) — `useEntriesStore`/
  `useMedicationsStore` เป็น hybrid: **ไม่ login = IndexedDB** (เครื่องเดียว), **login แล้ว = Firestore**
  `onSnapshot` (cross-device sync) สลับอัตโนมัติตามสถานะ auth ไม่ต้องรอ/บังคับ login ก่อนใช้แอป
- Firebase Auth (Google + Email/Password) + Firestore ใช้เฉพาะตอน login แล้วเท่านั้น — offline ผ่าน Firestore
  local persistence cache ไม่ใช่ custom sync logic เอง
- IndexedDB (`idb`) — source of truth ตอนไม่ได้ login (guest mode) + ใช้สำหรับ one-time migration ตอน login
  ครั้งแรก (ดู known constraints)
- Tailwind v4, `vite-plugin-pwa`, `react-router-dom` v7, `zustand`, `@react-pdf/renderer`, `lucide-react`
- Firebase Hosting สำหรับ deploy (project: `puadheadd` → **https://puadheadd.web.app** — deploy แล้ว, ใช้
  `npm run deploy` สำหรับรอบต่อไป, `npm run deploy:rules` สำหรับ deploy Firestore security rules) — โปรเจคเก่า
  `puadhead-e350b` สร้างไว้ก่อนโดยไม่ได้ตั้งใจ ยังค้างอยู่เฉยๆ ใน Firebase console ไม่ได้ใช้งาน ลบทิ้งได้ถ้าไม่ต้องการ

## Phase 1 progress

- [x] 1. โครงสร้างโฟลเดอร์ flat ที่ root, manifest + meta tags (terracotta theme)
- [x] 2. IndexedDB layer v2 — `entries` (keyPath `entryId`, index `by-date`) + `medications`
      (`dailyEntries` store เดิม migrate/ลบทิ้งอัตโนมัติตอน DB upgrade v1→v2)
- [x] 3. Navigation shell: bottom tab bar 3 แท็บ (วันนี้/รายงาน/ตั้งค่า) + back/X pattern สำหรับ task-screen
- [x] 4. Dashboard (แท็บ "วันนี้") — stats dedup by date, overuse banner, heatmap (max severity/วัน),
      แตะวันที่มีหลาย entry → เปิด chooser sheet ก่อนเลือกไปแก้
- [x] 5. Quick-log / edit-entry — component เดียวกัน 2 โหมด, TimeRangePicker ทั้งคู่แก้ได้อิสระ,
      MedicationChips multi-select, DeleteButton (edit เท่านั้น, confirm ก่อนลบ)
- [x] 6. Cover-mode (จอพับ Flip7)
- [x] 7. Report (แท็บใหม่) — PeriodSelector (1/3/6 เดือน/กำหนดเอง), stats, WeeklyTrend, EntryList tap-to-edit
- [x] 8. Settings (แท็บใหม่) — จัดการยา CRUD + ThemeToggle (light/dark/system, default system)
- [x] 9. `checkOveruseRisk()` เวอร์ชัน dedup-by-date (Set ต่อ moClass) + alert badge
- [x] 10. PDF export — ดึงช่วงเวลาจาก Report โดยตรง ไม่มีหน้าเลือกช่วงแยกแล้ว, รองรับ medications[] หลายตัว/entry
- [x] 11. `isMenstruating` + `cgrpInjectionDay` — เพิ่ม UI toggle ในหน้า quick-log (มีอยู่ใน schema ตั้งแต่ต้น
      แต่ไม่เคยมีช่องกรอกมาก่อน) ตามที่เห็นในสมุดบันทึกต้นฉบับที่ผู้ใช้ส่งรูปมา — CGRP มีสัญลักษณ์เข็มฉีดยาใน
      PDF export ด้วย (ตรงกับสมุดต้นฉบับ), `isMenstruating` ไม่ได้ทำ marker ใน PDF (ต้นฉบับใช้ range วงกลมข้าม
      หลายวันซึ่ง layout ตาราง PDF ปัจจุบันไม่รองรับง่ายๆ — ถ้าต้องการเพิ่มทีหลังได้)
- [x] 12. บันทึกย้อนหลังได้ — เพิ่มช่องเลือกวันที่ในหน้า quick-log (เดิม hardcode เป็นวันนี้เสมอตอนโหมด "เพิ่มใหม่")
      + แตะวันว่างบน heatmap ได้แล้ว (เดิม disabled) เปิดหน้าบันทึกพร้อม pre-fill วันที่นั้น วันในอนาคตยัง
      disabled อยู่ (บันทึกล่วงหน้าไม่ได้)
- [x] 13. Heatmap cell สีเข้มขึ้น — เดิมใช้สี badge (`severity-2-bg`/`severity-3-bg`) ซึ่งจางมากตอนไม่มีตัวหนังสือ
      วางทับ เพิ่ม token ใหม่ `--color-heatmap-2`/`--color-heatmap-3` เฉพาะสำหรับ cell fill (ไม่กระทบสี badge/PDF
      เดิม), ระดับ 1 เปลี่ยนจาก near-white เป็น fill สีขอบ (`border`) ให้เห็นชัดขึ้น
- [x] 14. Phase 2: Firestore sync + auth — **โค้ดเสร็จแล้ว รอ manual setup + เทสจริง** ดูหัวข้อ "Phase 2" ด้านล่าง

## Phase 2 — Firebase Auth + Firestore sync

ขอบเขตรอบนี้ (ตามที่ผู้ใช้ตัดสินใจ): **auth + cross-device sync ของ entries/medications เท่านั้น**
trigger-correlation analysis และ weather API auto-fetch (จาก draft doc "Migraine Tracker" รอบแรกก่อนสรุปสเปค)
**ยังไม่ทำรอบนี้** เก็บไว้เป็นรอบถัดไป

- [x] `firebase` SDK (v9+ modular), `src/lib/firebase.js` (init app/auth/firestore + offline persistence cache)
- [x] `src/lib/auth.js` — **สองวิธี sign-in**: Google (popup บน desktop, redirect บนมือถือ/standalone PWA — ดู
      known constraints เรื่องทำไมต้องแยก) และ Email/Password (`createUserWithEmailAndPassword`,
      `signInWithEmailAndPassword`, `sendPasswordResetEmail` — เพิ่มเป็นทางเลือกที่สอง เพราะไม่ผ่าน
      popup/redirect เลย เสถียรกว่าข้าม browser/device)
- [x] `useAuthStore` + `LoginPage` (ปุ่ม Google + ฟอร์มอีเมล/รหัสผ่าน + ลืมรหัสผ่าน) + `AuthGate`
      (ครอบ `<Routes>` ทั้งหมดใน `App.jsx` รวม task-screen ด้วย)
- [x] `useEntriesStore`/`useMedicationsStore` เปลี่ยนจาก IndexedDB → Firestore `onSnapshot` live query
      (filter `where('uid','==',uid)`) — external shape เดิมไม่เปลี่ยน หน้าอื่นไม่ต้องแก้
- [x] รูปยา: `photoBlob` (Blob) → แปลงเป็น `photoBase64` (data URI string) ตอน save เก็บฝังใน Firestore doc ตรงๆ
      (ไม่ใช้ Firebase Storage — เลี่ยง requirement อัพเกรด Blaze plan)
- [x] `migrateLocalData.js` — one-time import ข้อมูล IndexedDB เดิม (ถ้ามี) เข้า Firestore ตอน sign-in ครั้งแรก
      guard ด้วย `localStorage` flag ต่อ uid กันซ้ำ
- [x] `firestore.rules` — แยกข้อมูลตาม `uid` ทั้ง `entries` และ `medications` collection
- [x] Settings → เพิ่มปุ่มออกจากระบบ + แสดงบัญชีที่ล็อกอินอยู่

**Manual setup — เสร็จหมดแล้ว**:
- [x] เปิด Google + Email/Password เป็น sign-in provider ใน Firebase Console (project `puadheadd`)
- [x] สร้าง Firestore database (Native mode)
- [x] `.env` มีค่า Firebase web app config ครบ, `npm run deploy:rules` deploy `firestore.rules` แล้ว
- [x] เทสจริงบน desktop (Mac Chrome, Google popup) — ยืนยันแล้วว่า sign-in สำเร็จ มี user จริงใน Firebase Console
      (`konwika.som@gmail.com`)
- [x] เทสจริงบนมือถือ (iPhone, Google redirect) — ยืนยันแล้วว่า sign-in สำเร็จ (popup→redirect switch ใช้ได้จริง)

**ยังไม่เทส**:
- [ ] Email/Password sign-in/sign-up/ลืมรหัสผ่าน (เพิ่งเพิ่ม ยังไม่เทส)
- [ ] offline write, cross-device sync (2 เครื่อง/browser พร้อมกัน), security rule isolation (คนละ Google
      account เห็นข้อมูลแยกกันจริง), migration ของข้อมูลเก่าจาก IndexedDB ครั้งแรกที่ sign-in

## Phase 2.5 — Login เป็นทางเลือกเสริม + ย้ายจัดการยาออกจาก Settings

**เหตุผล**: หลัง Phase 2 ขึ้น AuthGate บังคับ login ก่อนใช้แอปได้เลย ปัญหาจริงที่เจอ (Google popup/redirect
ไม่เสถียรข้าม browser/มือถือ — ดู known constraints ด้านล่าง) ทำให้ใช้แอปไม่ได้เลยถ้า login ไม่ผ่าน ซึ่งขัดกับ
หลักการออกแบบตั้งต้นของแอป "ตอนปวดจริงต้องกรอกไวที่สุด" ผู้ใช้ตัดสินใจให้ตัด hard gate ออก — login เป็น
ปุ่มเล็กๆ มุมจอ (`SyncStatusBadge`) กดเองเมื่ออยากซิงค์ข้ามเครื่องเท่านั้น พร้อมกันนี้ย้าย "จัดการยา" ออกจาก
Settings (ไม่ใช่ setting จริงๆ) ไปเป็นปุ่มในหน้า quick-log แทน

- [x] `useEntriesStore`/`useMedicationsStore` เป็น hybrid — branch ตาม `useAuthStore.getState().user`:
      login แล้วใช้ Firestore `onSnapshot` เดิม, ไม่ login ใช้ `src/lib/db/entries.js`/`medications.js`
      (IndexedDB เดิมจาก Phase 1 ที่ไม่เคยลบ) ตรงๆ — external shape เหมือนเดิมทั้งหมด หน้าอื่นไม่ต้องแก้
- [x] `AuthGate` ไม่บล็อกอีกต่อไป — รอแค่ `initialized` (กัน flash ตอน auth state ยังไม่ resolve) แล้ว render
      children เสมอ ไม่มี branch เช็ค `!user` แล้ว
- [x] `LoginPage` เป็น route ปกติ (`/login`) มีปุ่มปิด (X) ออกได้โดยไม่ต้อง login, login สำเร็จแล้ว
      `navigate(-1)` กลับไปที่เดิมอัตโนมัติ
- [x] `SyncStatusBadge` (ใหม่) — มุมขวาบนของ 3 แท็บหลัก (mount ใน `MainLayout`) ไม่ login โชว์ปุ่ม
      "ซิงค์ข้ามเครื่อง" → `/login`, login แล้วโชว่ ไอคอน cloud เงียบๆ → `/settings`
- [x] `MedicationListPage` (ใหม่, route `/medications`) — ย้าย "จัดการยา" (list + เพิ่มยาใหม่) ออกจาก
      `SettingsPage` มาไว้ที่นี่ เข้าถึงผ่านปุ่ม "จัดการยา" ข้างหัวข้อ "ยาที่ใช้" ในหน้า quick-log
- [x] `SettingsPage` เหลือแค่ธีม + สถานะ sync/บัญชี (login แล้วโชว่บัญชี+sign out, ไม่ login โชว่ปุ่ม
      "เข้าสู่ระบบ") — ไม่มี UI จัดการยาอีกต่อไป

**Known limitation (ไม่แก้รอบนี้)**: `migrateLocalDataIfNeeded` guard ด้วย flag ครั้งเดียวตลอดกาลต่อ uid —
ถ้าใช้แบบ guest → login (migrate) → logout → guest ใหม่ (เพิ่ม entry อีก) → login ใหม่ entry ที่เพิ่มรอบหลังจะ
ไม่ migrate ซ้ำอัตโนมัติ (flag ติดไปแล้ว) พฤติกรรมการใช้งานจริง (อยู่ login รอบเดียวยาวๆ หรืออยู่ guest ยาวๆ)
ทำให้เคสนี้ไม่ค่อยเกิด ยังไม่สร้างระบบ track ทีละ entry ให้ตอนนี้

- [x] `DiaryTable` (ใหม่, `src/components/report/DiaryTable.jsx`) — มุมมอง "ตาราง (ให้หมอดู)" ในหน้า Report
      สลับกับ "รายการ" เดิมได้ ใช้ logic กลุ่มข้อมูลตามเดือน/วันเดียวกับ `ExportDocument.jsx` (PDF) แต่ render
      เป็น HTML table ตรงๆ ไม่ต้อง export ไฟล์ — สำหรับเปิดโชว์หมอสดๆ ตามที่คุยกัน (เทียบกับ export รูปภาพ
      ที่ต้องมีขั้นตอนรอโหลดก่อนดู ไม่เหมาะกับโมเมนต์ "หยิบมือถือโชว์หมอทันที") แสดงทุกวันในช่วงเวลาที่เลือก
      (ไม่ใช่แค่วันที่มีบันทึก) ให้เห็น pattern ความถี่ได้ เหมือนสมุดต้นฉบับ
- [x] **`EntryList` อัปเกรดเป็น "รายการที่มีข้อมูลครบ"** — แต่ละแถวโชว่วงกลมระดับ (สี), วันที่/เวลา, ชื่อยา,
      ไอคอนอาการ, ไอคอนโน้ต (ถ้ามี) — พอเพียงสำหรับดูรายวันไม่ต้องพึ่งตาราง ตามที่ผู้ใช้เสนอ (ไม่ต้องแก้ปัญหา
      "1 เดือน = 30 วันย้อนหลัง ข้ามเดือนปฏิทิน" ในหน้าตาราง เพราะตารางมีไว้สำหรับ export/โชว์หมอแบบเป็นทางการ
      ที่โชว่ทุกวันรวมวันว่างอยู่แล้วเป็นเรื่องปกติ)
- [x] **แยก "ดูข้อมูล" ออกจาก "แก้ไข" ชัดเจน** — กดตัวแถวใน `EntryList` เปิด `EntryDetailSheet.jsx`
      (bottom-sheet, **read-only ล้วนๆ ไม่มีปุ่มแก้ไขในนั้น** — ตั้งใจ เพราะทางเข้าแก้ไขมีทางเดียวพอคือปุ่มดินสอ
      ที่แถว ไม่งั้นจะมี 2 ทางเข้าซ้ำซ้อนกันโดยไม่มีเหตุผล) ปุ่มดินสอ (เล็ก, มุมขวาบนของการ์ด, ต้องเล็งกด) แยก
      `onClick` + `stopPropagation` ออกจาก `onView` ของตัวแถว — เหตุผล: แก้ไม่บ่อยแต่ดูบ่อยกว่า ไม่ควรให้กด
      พลาดที่ไหนก็เข้าโหมดแก้ไข
- [x] **`DiaryTable` ปรับความกว้างคอลัมน์** — `table-fixed` + `<colgroup>`: วันที่/ระดับ แคบ (`w-12`), ยา/อาการ
      กว้าง (share ที่เหลือ) ตามที่ขอ
- [x] **`NoteField.jsx`** (ใหม่) ในหน้า quick-log — ปุ่ม "เพิ่มโน้ต" แบบ collapse (ไม่โชว่ตลอดกันรก) กางเป็น
      textarea เมื่อกด หรือกางอัตโนมัติถ้า entry มีโน้ตอยู่แล้วตอนแก้ไข ผูกกับ `entry.notes` ที่เตรียมไว้ใน
      schema ตั้งแต่ต้นแต่ไม่เคยมี UI มาก่อน โชว่เนื้อโน้ตเต็มใน `EntryDetailSheet` ด้วย

**บั๊กที่เจอจากการใช้งานจริง + แก้แล้ว**:
- [x] **หน้าแก้ไข entry/medication ขาวเปล่าสำหรับผู้ใช้ที่ login** — `QuickLogPage.jsx`/`MedicationFormPage.jsx`
      โหมด edit เดิมเรียก `getEntry()`/`getMedication()` จาก `src/lib/db/*` (IndexedDB) ตรงๆ ค้างมาตั้งแต่ก่อน
      Phase 2 — พอ login แล้วข้อมูลอยู่ Firestore ไม่ใช่ IndexedDB เลย fetch ไม่เจอ ทำให้ `ready` ไม่มีวันเป็น
      `true` หน้าเลย render `null` ค้างตลอด (ขาวเปล่า) แก้โดยเปลี่ยนไปหา entry/medication จาก array ที่โหลดไว้แล้ว
      ใน `useEntriesStore`/`useMedicationsStore` (hybrid-aware) แทนการ fetch ตรงแยกต่างหาก — เจอจากผู้ใช้กด
      heatmap วันที่มี entry จริงบนเว็บที่ deploy อยู่

## Phase 3 — ขยายการเก็บข้อมูล (อาการ/ตำแหน่ง) + บันทึกผลวินิจฉัย + จัดระเบียบฟอร์ม

**เหตุผล**: ผู้ใช้เจอโจทย์เพิ่ม — คนที่ปวดหัวถี่แต่ยังไม่รู้การวินิจฉัย อยากมีที่เก็บข้อมูลอาการปวดหัวให้ครบ
ก่อนพบหมอ (ไม่จำกัดแค่เกณฑ์ไมเกรน) หลักการที่ตกลงกันชัดเจน: **แอปเก็บข้อมูลอย่างเดียว ไม่ตีความ/ไม่แนะนำ
การรักษาใดๆ** (ปฏิเสธแนวคิด red-flag banner / AI วิเคราะห์ที่เคยคุยกันระหว่างทาง)

- [x] ขยาย "อาการร่วม" จาก 4 เป็น 15 ตัวเลือก (เพิ่ม osmophobia, vertigo, blurredVision, numbness, tinnitus,
      imbalance, confusion, fever, fatigue, neckStiffness, sleepDisturbance) — รวม config ไว้ที่เดียว
      (`src/lib/symptoms.js`) ให้ทุกจุดที่เคย hardcode ซ้ำ (`SymptomToggles`/`EntryDetailSheet`/`EntryList`/
      `DiaryTable`/PDF) import ใช้ร่วมกัน แสดง 4 ตัวเดิมก่อนเสมอ + ปุ่ม "ดูอาการเพิ่มเติม" (auto-expand ตอน
      edit ถ้า entry มี extended symptom ติดอยู่)
- [x] เพิ่ม field ใหม่ `location` (ตำแหน่งที่ปวด: ขมับ/ท้ายทอย/กระหม่อม/หน้าผาก/เบ้าตา/ทั้งหัว) — คนละมิติกับ
      อาการร่วม, multi-select, ไม่มี icon (pill ข้อความล้วนเหมือน `MedicationChips`) — `src/lib/locations.js`
- [x] ฟีเจอร์ใหม่ **"บันทึกผลวินิจฉัย"** (`diagnoses` collection/store แยกจาก entries, mirror pattern ของ
      `medications` ทั้ง data layer และ UI) — สำหรับกรอกทีหลังตอนไปหาหมอแล้วรู้ผล ("หมอบอกว่าเป็นอะไร" +
      ยาที่หมอสั่ง + โน้ต) ยาที่หมอสั่งเลือกจากคลังยาจริงผ่าน `MedicationChips` (ไม่ใช่พิมพ์ freeform ซ้ำ)
      จุดเข้าถึงเดียว: chip บนสุดของ Dashboard (ไม่ใช่ Settings — เหตุผล: ข้อมูลนี้ควรเห็นทุกครั้งที่เปิดแอป
      ไม่ใช่ของที่ซ่อนในตั้งค่า) โชว่ชื่อโรคล่าสุด + chevron ถ้ามีข้อมูลแล้ว, "+ บันทึกผลวินิจฉัย" ถ้ายังไม่มี
- [x] จัดระเบียบ `ExtraFlagsToggle` เดิม (มีประจำเดือน/วันฉีดยา CGRP ที่ไม่เคยมี heading) — แยกเป็น
      `ToggleRow.jsx` (single on/off row ใหม่): "วันฉีดยา CGRP" ย้ายไปอยู่ใต้ "ยาที่ใช้" (เป็นเหตุการณ์ยา),
      "มีประจำเดือน" อยู่ section ใหม่ "บริบทเพิ่มเติม" แยกต่างหาก
- [x] สลับลำดับฟอร์มบันทึกเป็น ระดับ→อาการ→ตำแหน่ง→ยา (เดิม ระดับ→ยา→อาการ)
- [x] **แก้พฤติกรรมปฏิทิน Dashboard** — เดิมกดวันที่มี entry แล้วพาไปหน้าแก้ไขตรงๆ (ขัดกับหลักการเดิมที่
      Report/`EntryList` ใช้: แยก "ดู" ออกจาก "แก้ไข") เปลี่ยนเป็นเปิด `EntryDetailSheet` (popup อ่านอย่างเดียว
      ที่มีอยู่แล้ว) ก่อนเสมอ มีปุ่มดินสอเล็กในตัว popup ให้กดแก้ไข (เพิ่ม prop `onEdit` แบบ optional ให้
      component นี้ — Report ไม่ส่ง prop นี้เพราะมีดินสอที่แถวแยกอยู่แล้ว)
- [x] **ตัดช่อง "วันที่" ออกจากฟอร์มตอนเพิ่มใหม่ทั้งหมด** (`mode === 'add'`) — วันที่ถูกกำหนดแน่นอนจาก
      entry point อยู่แล้ว (ปุ่ม "บันทึกวันนี้" = วันนี้เสมอ, กดวันในปฏิทิน = วันนั้นเสมอ, หัวฟอร์มบอกวันที่
      อยู่แล้ว) เหลือช่องนี้ไว้เฉพาะตอนแก้ไขของเดิม (เผื่อบันทึกผิดวันจริงๆ)

**Schema ที่เพิ่ม**: `entries.location` (array), `entries.symptoms` มี key ใหม่ 11 ตัว (ของเก่าไม่มี key ใหม่
= `undefined`, อ่านด้วย `?.[key]` อยู่แล้วไม่กระทบ), collection ใหม่ `diagnoses` (`diagnosisId`, `date`,
`diagnosisName`, `medicationIds[]`, `note`) — IndexedDB bump เป็น v3, `firestore.rules` เพิ่ม
`match /diagnoses/{diagnosisId}`

**ยังไม่ได้เทส**:
- [ ] guest mode → login migration ของ `diagnoses` (ต้องมี Google account จริงมาเทส — โค้ดใน
      `migrateLocalData.js` เพิ่ม `getAllDiagnoses()` เข้า `Promise.all` แล้วแต่ยังไม่ verify จริง)
- [ ] เทสบนเครื่องจริง (Phase 1 test log เดิมก็ยังค้างอยู่ ดูหัวข้อ "Manual/real-device test log" ด้านบน)

**หมายเหตุ**: main JS chunk โตขึ้นจาก ~271KB เป็น ~276KB gzip (ไอคอน lucide เพิ่ม + component ใหม่) ยังไม่ถึง
ระดับที่ต้อง code-split เพิ่ม แค่บันทึกไว้เผื่อโตต่อเนื่อง

## Definition of Done — Phase 1 (MVP)

- [ ] Add to Home Screen ได้ทั้ง iPhone, iPad mini, Flip7 แล้วเปิดจาก icon ใช้ได้ปกติ — **ต้องเทสบนเครื่องจริง**
- [x] บันทึก/อ่านข้อมูล offline (runtime) — verify แล้วโดย suspend dev server process ทั้งตัวระหว่างใช้งาน
      แล้ว navigate + save ยังสำเร็จ — **cold-start offline (เปิดจาก home screen ตอน airplane mode) ยังไม่เทส**
- [x] Cover-mode ใช้ได้จริงตอนจอเกือบจัตุรัส (~290×310) ไม่ล้น ไม่ crop
- [x] iPad mini ใช้ 2-column layout จริง — verify แล้วที่ 820px width
- [x] Tab bar 3 แท็บสลับได้ครบ, ทุก task-screen (quick-log/edit-entry, เพิ่ม/แก้ไขยา) มีปุ่มย้อนกลับ/ปิด
- [x] บันทึกปวดหลายรอบในวันเดียวได้จริง — verify แล้ว: 2 entries วันเดียวกัน, heatmap โชว์ max severity,
      stats dedup เป็น 1 วันถูกต้อง, tap เปิด chooser sheet เลือก entry ได้ถูกตัว
- [x] แก้ไข/ลบ entry เก่าได้จากทั้ง Dashboard heatmap และ Report entry list — verify แล้วทั้งคู่
- [x] Overuse alert badge นับเป็นวันไม่ใช่จำนวนครั้ง — verify แล้วด้วยเคส 16 entries ใน 14 วันจริง
      (ยาเดียวกัน 2 ครั้ง/วันใน 2 วัน) ได้ผล 14/15 (warning) ไม่ใช่ 16/15 (critical) ยืนยัน dedup ถูกต้อง
- [x] Export PDF ตามช่วงเวลาที่เลือกในหน้า Report — verify แล้ว รวมกรณี medications หลายตัว/วันแสดงถูกต้อง
- [x] สลับ system theme ทันที + override manual จากตั้งค่าได้ — verify แล้วผ่าน UI จริง (ไม่ใช่แค่ JS console)
      ทั้ง apply ทันทีและ persist ข้าม reload (localStorage), ไม่มี flash ของธีมผิดตอนโหลดหน้า
- [x] ไม่มี emoji character แทน symptom เลย — lucide-react (UI) + SVG path เดียวกันใน react-pdf (PDF)
- [x] ไม่มี dev artifact หลุดติดไปกับแอป — เช็คแล้ว (จุดแดงที่ผู้ใช้ถามคือรอย annotate ของผู้ใช้เอง ไม่ใช่ของแอป)

## Known constraints / decisions ที่ควรรู้

- **สีที่เข้มขึ้น (vivid) ถูกปฏิเสธแล้ว — อย่าเสนอซ้ำ**: เคยทำตัวอย่างเทียบสี terracotta ที่อิ่มสีขึ้นให้ดู
  (primary + severity badge เข้มขึ้น) ผู้ใช้ตอบว่า "ไม่เวิค แสบตา" ปฏิเสธทั้งหมด คงโทนเดิมไว้ (primary
  `#D97757` light / `#E2916F` dark) — **ข้อยกเว้น**: heatmap cell fill (ข้อ 13 ด้านบน) เป็นคนละเรื่อง ผู้ใช้ขอ
  ให้เข้มขึ้นเฉพาะจุดนั้นเพราะมองไม่เห็น (ปัญหา legibility ไม่ใช่ความชอบเรื่องสี) จึงทำแยกเป็น token ใหม่
  `--color-heatmap-2`/`--color-heatmap-3` ไม่ใช่การเปลี่ยนพาเลตหลัก
- **`medication.photoUrl` ใน spec เก็บจริงเป็น `photoBlob`** — spec เขียน field `photoUrl` แต่แอปนี้ไม่มี backend
  เลย ไม่มีที่ host URL จริง เก็บเป็น `Blob` ตรงบน record ยาแทน (resize+compress ด้วย canvas ก่อนเก็บ) แสดงผล
  ผ่าน `URL.createObjectURL()` ที่ runtime — ตัดสินใจทางเทคนิคที่จำเป็น ไม่ใช่ตาม field name ตรงตัว
- **Cover-mode breakpoint แก้จาก spec ที่ให้มา (ซ้ำกับรอบที่แล้ว)** — `max-aspect-ratio:6/5` เดี่ยวๆ ไม่กันจอ
  แคบสูงปกติ (iPhone) ออก เพิ่ม `min-aspect-ratio:4/5` ให้เข้าเงื่อนไขเฉพาะจอเกือบจัตุรัสจริง (ดู comment ใน
  `src/index.css`)
- **Heatmap tap วันที่มีหลาย entry** — spec ไม่ได้ระบุ UI ชัดเจนสำหรับกรณีนี้ (เขียนแค่ "เปิดหน้า edit-entry ของ
  วันนั้น" แบบ singular) ออกแบบเพิ่มเป็น bottom sheet ให้เลือก entry ก่อนถ้ามีมากกว่า 1 อัน ถ้ามีอันเดียวเปิดตรง
  ทันทีไม่ต้องเลือก
- **`toISODate()` bug ที่แก้ระหว่างทาง**: ของเดิมใช้ `date.toISOString()` (UTC) ทำให้ผู้ใช้ในไทย (UTC+7) ที่เปิด
  แอประหว่างเที่ยงคืน–7 โมงเช้า จะได้ "วันนี้" เป็นเมื่อวานผิด แก้เป็นใช้ local date component แทนแล้ว (สำคัญ
  เพราะแอปนี้มักถูกเปิดตอนตื่นนอนมาพร้อมอาการปวดหัวจากคืนก่อน)
- **WeeklyTrend bar chart bug ที่แก้ระหว่างทาง**: bar สูง 0 ทุกแท่งเพราะ `height:100%` resolve กับ parent ที่ไม่มี
  definite height (เพราะ `items-end` บน flex container ทำให้ child ไม่ stretch) แก้โดยให้ wrapper แต่ละแท่ง
  ได้ `h-full` จาก container ที่ไม่ตั้ง `items-end` อีกต่อไป
- **Dark mode ใช้ system preference เป็น default, override ได้จาก Settings** — เก็บ preference ใน
  `localStorage` (ไม่ใช่ IndexedDB) เพราะต้อง apply แบบ synchronous ตอน boot ก่อน React render เพื่อกัน
  flash of wrong theme
- **gepant overuse threshold (10 วัน/เดือน) เป็น convention** — ยังไม่มี consensus ทางการแพทย์ชัดเจน ตามที่
  ระบุไว้ใน `docs/puadhead-spec-handoff.md` เอง ควรถามหมอผู้สั่งยายืนยันก่อนใช้จริง
- **PDF font**: Helvetica (base-14) ไม่มี glyph ไทย ใช้ Sarabun (SIL OFL, Thai subset จาก
  `@fontsource/sarabun`) copy เป็น static file ที่ `public/fonts/` แทน ไม่ใช้ font ระบบ Apple เพราะติด license
- **PDF bundle lazy-load**: `@react-pdf/renderer` (~1.4MB) โหลดเฉพาะตอนกด export ใน Report ไม่ผูกกับ
  initial bundle (main chunk ~271KB)
- **Medication list + add/edit เป็น task-screen แยกทั้งหมด** (`/medications`, `/medications/new`,
  `/medications/:id`) ไม่มี UI จัดการยาอยู่ใน Settings เลย (ย้ายออกไปตั้งแต่ Phase 2.5) เข้าถึงผ่านปุ่ม
  "จัดการยา" ในหน้า quick-log
- **IndexedDB เป็น source of truth ตอน guest mode (ไม่ login)** ตั้งแต่ Phase 2.5 — `src/lib/db/*` และ
  dependency `idb` ไม่ใช่แค่ของ migration แล้ว แต่เป็น backend จริงของ `useEntriesStore`/`useMedicationsStore`
  เมื่อไม่ได้ login ด้วย (ดูหัวข้อ Phase 2.5) อย่าเข้าใจผิดว่าเป็น dead code แล้วลบทิ้ง
- **รูปยาเก็บเป็น `photoBase64` (data URI) ไม่ใช่ Firebase Storage** — ตัดสินใจร่วมกับผู้ใช้เพื่อเลี่ยงต้องอัพเกรด
  Blaze plan (Storage requirement) รูป resize+compress ไว้แล้วเล็กพอสำหรับ 1MiB Firestore doc limit — ถ้าวันหนึ่ง
  ต้องการรูปคุณภาพสูงขึ้น/หลายรูปต่อยา ค่อยพิจารณา Storage ทีหลัง
- **Firestore query เป็น single-field equality (`uid==`) เท่านั้น** — date-range ยัง filter ฝั่ง client เหมือนเดิม
  ไม่ต้องมี composite index ตอนนี้ ถ้าเพิ่ม server-side range query ทีหลัง Firestore จะโชว์ link สร้าง index ให้เอง
  ตอน query error — ไม่ได้เตรียมล่วงหน้า
- ~~ต้องล็อกอินออนไลน์ครั้งแรกก่อนใช้งาน offline ได้~~ — **ไม่จริงอีกต่อไปตั้งแต่ Phase 2.5**: ใช้แอปได้ทันที
  ไม่ต้อง login เลย (guest mode = IndexedDB) login ยังต้องมีเน็ตครั้งแรกเหมือนเดิม แต่เป็นแค่ทางเลือกสำหรับคน
  อยากซิงค์ข้ามเครื่องเท่านั้น ไม่ใช่เงื่อนไขบังคับก่อนใช้แอป
- **Google sign-in: popup บน desktop, redirect บนมือถือ/standalone PWA** (`src/lib/auth.js`, `isMobile()`/
  `isStandalone()`) — ตอนแรกใช้ `signInWithRedirect` ทุกที่ตามคำแนะนำทั่วไปสำหรับ PWA แต่เจอปัญหาจริงบน desktop
  Chrome: redirect กลับมาที่แอปเงียบๆ ไม่มี error ไม่ signed-in (สาเหตุน่าจะเป็น browser extension บล็อก
  IndexedDB/storage relay ระหว่าง `authDomain` (`puadheadd.firebaseapp.com`) กับตัวแอปเอง
  (`puadheadd.web.app`) ซึ่งเป็นคนละ eTLD+1) แก้โดยสลับไปใช้ `signInWithPopup` บน desktop แทน (ไม่ต้องพึ่ง
  relay ข้ามโดเมนแบบนั้น) แต่ popup กลับไม่เสถียรบนมือถือ (browser มือถือมักบล็อก/จัดการ popup ไม่ดี) เลยต้องแยก
  2 ทาง: mobile + standalone PWA ใช้ redirect (ตามเหตุผลเดิม — ไม่มี popup ให้เปิด), desktop browser tab ใช้
  popup — ยังไม่ได้เทสจริงบนมือถือหลังแก้ครั้งนี้
- **เพิ่ม Email/Password เป็นทางเลือกที่สอง** ควบคู่ Google (ไม่ได้แทนที่) เพราะ popup/redirect ของ OAuth
  มีปัญหาความเสถียรข้าม browser ตามข้อด้านบน emailpassword เป็น SDK call ตรงไม่ผ่าน third-party redirect เลย —
  ได้ `request.auth.uid` จริงเหมือน Google ทำให้ `firestore.rules` เดิมใช้ได้กับทั้งสองวิธีโดยไม่ต้องแก้อะไร
- **Account linking เมื่ออีเมลตรงกันข้ามสองวิธี** — Firebase ไม่รวมบัญชีให้อัตโนมัติแค่เพราะอีเมลตรงกัน (ถ้าไม่จัดการ
  จะกลายเป็น 2 บัญชีแยกกัน ข้อมูลคนละชุด สร้างความสับสนได้) แก้โดย: (1) สมัคร email/password ไว้ก่อน แล้วมา
  Google ทีหลัง → `auth/account-exists-with-different-credential` ถูกจับไว้ (`captureLinkableCredential` ใน
  `src/lib/auth.js`) แล้วเชื่อม credential Google เข้ากับบัญชีเดิมอัตโนมัติตอน sign-in ด้วย email/password สำเร็จ
  ครั้งถัดไป (2) Google ไว้ก่อน อยากมี password ด้วย → `LinkPasswordForm` ใน Settings (โชว์เฉพาะบัญชีที่ยังไม่มี
  provider `password` ผูกอยู่) เรียก `linkPasswordToCurrentUser()` ตอน sign-in อยู่แล้ว
- **เคยลองเปลี่ยนไปใช้เบอร์โทรเป็น identity (ไม่มี verification เลย, MindCare-style) แล้ว revert กลับ** — เป็น
  การเข้าใจผิดระหว่างคุยกัน (ผู้ใช้ถามเชิงตั้งคำถามว่า "ต้องจริงจังขนาดนั้นไหม" ไม่ได้สั่งให้ทำ) โค้ดที่เคยเขียนไป
  (`phoneIdentity.js` และแก้ store/rules ต่างๆ) ถูก revert กลับหมดแล้ว ไม่มีร่องรอยเหลือ — ถ้ามีคนเสนอแนวทางนี้อีก
  ในอนาคต ให้ถามยืนยันชัดเจนก่อนเริ่มเขียนโค้ดจริง เพราะเป็นการเปลี่ยน security model ที่กระทบมาก

## Manual/real-device test log

ต้องเทสบนเครื่องจริงก่อนถือว่า Phase 1 เสร็จสมบูรณ์ (verify ผ่าน DevTools emulation ไม่ได้จริง):

| อุปกรณ์ | รายการเทส | วันที่ | ผลลัพธ์ |
|---|---|---|---|
| iPhone | Add to Home Screen แล้วเปิดจาก icon (ไม่ใช่ Safari tab) | — | ยังไม่เทส |
| iPad mini | หมุนจอ landscape ไม่ให้ layout พัง | — | ยังไม่เทส |
| Galaxy Flip7 | พับ/กางจอระหว่างใช้งานแอปอยู่ (resize ไม่ reload) | — | ยังไม่เทส |
| ทั้ง 3 เครื่อง | ปิดเน็ต (airplane mode) แล้วเปิดแอปจาก home screen ยังบันทึกได้ (cold-start) | — | ยังไม่เทส |
| ทั้ง 3 เครื่อง | สลับ system theme ตอนแอปเปิดอยู่ เปลี่ยนตามทันทีจริงบนอุปกรณ์จริง | — | ยังไม่เทส |
| 2 เครื่องพร้อมกัน | ล็อกอิน Google account เดียวกัน แก้ entry เครื่องหนึ่ง เห็น sync อีกเครื่องแบบ real-time | — | ยังไม่เทส (รอ Firebase Console setup) |
| เครื่องใดก็ได้ | ปิดเน็ต บันทึก entry ใหม่ เปิดเน็ตกลับมา เช็คว่า sync ขึ้น Firestore โดยไม่ซ้ำ | — | ยังไม่เทส |
| เครื่องใดก็ได้ | ล็อกอินด้วย Google account อื่น เช็คว่าเห็น dashboard ว่าง ไม่เห็นข้อมูล account แรก (security rules) | — | ยังไม่เทส |

## โครงสร้างโปรเจค (flat, ไม่มี frontend/ แยก)

```
puadhead/
  docs/                          spec docs ฉบับล่าสุด (handoff, pwa checklist, design reference) +
                                   user-guide.md (คู่มือผู้ใช้สำหรับเผยแพร่/ปล่อยแอปจริง)
  public/
    icons/                       app icons (terracotta, generated placeholder)
    fonts/                       Sarabun Thai subset (OFL) สำหรับ PDF export
  src/
    components/
      nav/                       TabBar, TaskScreenHeader, MainLayout, AuthGate (non-blocking),
                                   SyncStatusBadge (มุมจอ, ทางเดียวเข้า /login)
      dashboard/                 StatsRow, OveruseAlertBanner, MonthHeatmap, Legend, DayEntriesSheet,
                                   DiagnosisChip (จุดเข้าถึงเดียวสู่ /diagnoses)
      log/                       SeverityPicker, MedicationChips, SymptomToggles, LocationPicker, ToggleRow,
                                   TimeRangePicker, SaveButton
      report/                    PeriodSelector, WeeklyTrend, EntryList, EntryDetailSheet (onEdit optional)
      settings/                  ThemeToggle, LinkPasswordForm
      medications/                MedicationForm, MedicationList
      diagnoses/                  DiagnosisForm (ยาใช้ MedicationChips), DiagnosisList
      common/                     EmptyState
    pages/
      DashboardPage.jsx           แท็บ "วันนี้"
      ReportPage.jsx               แท็บ "รายงาน"
      SettingsPage.jsx             แท็บ "ตั้งค่า" (ธีม + สถานะ sync/บัญชีเท่านั้น ไม่มี UI ยา/ผลวินิจฉัย)
      QuickLogPage.jsx              /log/new, /log/:entryId (task-screen) — มีปุ่ม "จัดการยา", ช่องวันที่
                                   โชว่เฉพาะโหมดแก้ไข
      MedicationListPage.jsx        /medications (task-screen, ใหม่ — list + เพิ่มยาใหม่ ย้ายมาจาก Settings)
      MedicationFormPage.jsx        /medications/new, /medications/:id (task-screen)
      DiagnosisListPage.jsx         /diagnoses (task-screen) — เข้าถึงจาก DiagnosisChip บน Dashboard เท่านั้น
      DiagnosisFormPage.jsx         /diagnoses/new, /diagnoses/:id (task-screen)
      LoginPage.jsx                  /login (task-screen, ทางเลือกเสริม — ปิดได้โดยไม่ต้อง login)
    store/                        zustand: useEntriesStore/useMedicationsStore/useDiagnosesStore (hybrid
                                   Firestore/IndexedDB ตามสถานะ login), useAuthStore, useThemeStore
    lib/
      firebase.js, auth.js, firestoreSanitize.js, migrateLocalData.js   Firebase init/auth/sync (ใช้ตอน login)
      db/                         idb wrapper (v3: entries/medications/diagnoses) — source of truth ตอน
                                   guest mode + ใช้โดย migrateLocalData.js
      overuse/checkOveruseRisk.js  dedup-by-date เวอร์ชันล่าสุด
      pdf/                        react-pdf ExportDocument + icon defs (pdfIcons.jsx, 15 symptom icons)
      symptoms.js, locations.js    shared config — single source of truth ให้ทุกจุดที่แสดงอาการ/ตำแหน่ง
      dateUtils.js, theme.js, images.js, reportPeriods.js
  package.json                    name: "puadhead" (ตาม convention npm lowercase)
  firebase.json, .firebaserc       Firebase Hosting + Firestore config
  firestore.rules, firestore.indexes.json   Firestore security rules (per-uid isolation)
  .env.example                     Firebase web app config template (.env จริงไม่ commit)
  PROJECT_MASTER.md                ไฟล์นี้
```

## Next steps ที่แนะนำ

1. เทส guest→login migration ของ `diagnoses` ด้วย Google account จริง (ยังไม่เคย verify)
2. เทสบนเครื่องจริง 3 เครื่องตาม manual test log ด้านบน (ทั้งของ Phase 1 เดิม, cross-device sync, และของ
   Phase 3 ใหม่วันนี้)
3. สลับ app icon placeholder เป็นของจริงถ้ามี artwork
4. ระวัง main JS chunk เริ่มโต (~276KB gzip) ถ้าเพิ่มฟีเจอร์ใหม่อีกมาก ควรพิจารณา code-split เพิ่ม
4. รอบถัดไป (ยังไม่เริ่ม, ตามที่คุยไว้): ชื่อผู้ป่วยแสดงบน PDF, แนบเอกสาร (ใบนัด/บิล), entry-level notes,
   trigger correlation analysis, weather API auto-fetch
