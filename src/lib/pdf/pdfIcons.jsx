import { Svg, Path, Circle, Rect, Line } from '@react-pdf/renderer'

// Path data copied verbatim from the installed lucide-react package (node_modules/lucide-react/
// dist/esm/icons/{sun,speaker,droplet,sparkles,wind,rotate-cw,eye-off,hand,ear,compass,frown,
// thermometer,activity,bone,moon}.mjs) so the PDF export reuses the exact same glyphs as the
// in-app icons, per docs/puadhead-spec-handoff.md section 5.
const STROKE_PROPS = {
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
}

export function SunIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Circle cx="12" cy="12" r="4" {...p} />
      <Path d="M12 2v2" {...p} />
      <Path d="M12 20v2" {...p} />
      <Path d="m4.93 4.93 1.41 1.41" {...p} />
      <Path d="m17.66 17.66 1.41 1.41" {...p} />
      <Path d="M2 12h2" {...p} />
      <Path d="M20 12h2" {...p} />
      <Path d="m6.34 17.66-1.41 1.41" {...p} />
      <Path d="m19.07 4.93-1.41 1.41" {...p} />
    </Svg>
  )
}

export function SpeakerIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Rect width="16" height="20" x="4" y="2" rx="2" {...p} />
      <Path d="M12 6h.01" {...p} />
      <Circle cx="12" cy="14" r="4" {...p} />
      <Path d="M12 14h.01" {...p} />
    </Svg>
  )
}

export function DropletIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"
        {...p}
      />
    </Svg>
  )
}

export function SparklesIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
        {...p}
      />
      <Path d="M20 2v4" {...p} />
      <Path d="M22 4h-4" {...p} />
      <Circle cx="4" cy="20" r="2" {...p} />
    </Svg>
  )
}

export function WindIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path d="M12.8 19.6A2 2 0 1 0 14 16H2" {...p} />
      <Path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" {...p} />
      <Path d="M9.8 4.4A2 2 0 1 1 11 8H2" {...p} />
    </Svg>
  )
}

export function RotateCwIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" {...p} />
      <Path d="M21 3v5h-5" {...p} />
    </Svg>
  )
}

export function EyeOffIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" {...p} />
      <Path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" {...p} />
      <Path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" {...p} />
      <Path d="m2 2 20 20" {...p} />
    </Svg>
  )
}

export function HandIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" {...p} />
      <Path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" {...p} />
      <Path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" {...p} />
      <Path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" {...p} />
    </Svg>
  )
}

export function EarIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" {...p} />
      <Path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4" {...p} />
    </Svg>
  )
}

export function CompassIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Circle cx="12" cy="12" r="10" {...p} />
      <Path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" {...p} />
    </Svg>
  )
}

export function FrownIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Circle cx="12" cy="12" r="10" {...p} />
      <Path d="M16 16s-1.5-2-4-2-4 2-4 2" {...p} />
      <Line x1="9" x2="9.01" y1="9" y2="9" {...p} />
      <Line x1="15" x2="15.01" y1="9" y2="9" {...p} />
    </Svg>
  )
}

export function ThermometerIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" {...p} />
    </Svg>
  )
}

export function ActivityIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
        {...p}
      />
    </Svg>
  )
}

export function BoneIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"
        {...p}
      />
    </Svg>
  )
}

export function MoonIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
        {...p}
      />
    </Svg>
  )
}

// CGRP injection-day marker — mirrors the syringe circle mark on the paper diary this
// export's layout is modeled on.
export function SyringeIcon({ size = 10, color = '#1A1A18' }) {
  const p = { ...STROKE_PROPS, stroke: color }
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path d="m18 2 4 4" {...p} />
      <Path d="m17 7 3-3" {...p} />
      <Path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" {...p} />
      <Path d="m9 11 4 4" {...p} />
      <Path d="m5 19-3 3" {...p} />
      <Path d="m14 4 6 6" {...p} />
    </Svg>
  )
}

