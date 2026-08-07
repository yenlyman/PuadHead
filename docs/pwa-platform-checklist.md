# PWA platform checklist — iPhone / iPad mini 7 / Galaxy Flip7

## 1. manifest.json

```json
{
  "name": "ปวดเฮด",
  "short_name": "ปวดเฮด",
  "description": "บันทึกและวิเคราะห์อาการปวดหัว",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#F8F7F4",
  "theme_color": "#D97757",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

`theme_color`/`background_color` อ้างอิงจาก palette ใน `design-reference.md` (terracotta accent + light surface) แก้ตามได้ถ้าปรับสีทีหลัง เตรียม icon 3 ไซส์ตามด้านบน (maskable ตัวที่ 3 ใช้สำหรับ adaptive icon บน Android)

## 2. Meta tags ใน `<head>` (จำเป็นสำหรับ iOS)

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#D97757">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="ปวดเฮด">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png">
```

จุดที่พลาดบ่อย: ถ้าไม่ใส่ `viewport-fit=cover` ตัว `env(safe-area-inset-*)` ใน CSS จะไม่ทำงานเลย ต่อให้เขียน CSS ถูกก็ตาม

## 3. Safe-area CSS (กัน notch / Dynamic Island / cover-screen bezel)

```css
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
}
body {
  padding: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
}
```

## 4. Breakpoint strategy

ใช้ `aspect-ratio` ควบคู่กับ `width` เสมอ เพราะ Flip7 cover screen กับ iPhone ตัวเล็กมี width ใกล้เคียงกัน แยกกันด้วย width อย่างเดียวไม่ได้

```css
/* Cover mode — Flip7 พับอยู่: จอเกือบจัตุรัส */
@media (max-width: 400px) and (max-aspect-ratio: 6/5) {
  .full-log-sections { display: none; }
  .cover-mode { display: block; }
}

/* Phone — iPhone, Flip7 กางออก */
@media (max-width: 480px) {
  .layout { grid-template-columns: 1fr; }
}

/* Tablet — iPad mini */
@media (min-width: 700px) {
  .layout { grid-template-columns: 1fr 1fr; gap: 24px; }
}
```

## 5. Theme (light/dark)

ตาม `prefers-color-scheme` เป็น default ไม่ fix เป็น dark หรือ light ตายตัว มี toggle ในหน้าตั้งค่าให้ override เอง (รายละเอียดสี → `design-reference.md`)

```css
@media (prefers-color-scheme: dark) {
  :root { /* ดึงตัวแปรจาก dark mode table ใน design-reference.md */ }
}
```

## 6. ทดสอบจริงต้องเช็ค

- [ ] Add to Home Screen แล้วเปิดจาก icon (ไม่ใช่เปิดผ่าน Safari tab) — behavior คนละแบบกัน
- [ ] หมุนจอ landscape บน iPad mini ไม่ให้ layout พัง
- [ ] พับ/กาง Flip7 ระหว่างใช้งานแอปอยู่ (ไม่ reload หน้า ต้อง resize ตาม)
- [ ] ปิดเน็ตแล้วเปิดแอปจาก home screen ต้องยังบันทึกได้ (offline-first จริง)
- [ ] สลับ system theme (light↔dark) ตอนแอปเปิดอยู่ ต้องเปลี่ยนตามทันทีไม่ต้อง reload
