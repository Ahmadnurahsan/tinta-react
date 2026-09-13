const SRGB_LUM_COEFFS = [0.2126, 0.7152, 0.0722]

export const stopLabels = [25, 50, 100, 150, 200, 250, 300, 400, 500, 600, 650, 700, 750, 800, 850, 900, 950]

export function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255,
  }
}

export function rgbToHex(r, g, b) {
  const toHex = (v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function srgbTransfer(c) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function srgbTransferInv(c) {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055
}

export function rgbToOklab(r, g, b) {
  const lr = srgbTransfer(r)
  const lg = srgbTransfer(g)
  const lb = srgbTransfer(b)
  let l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  let m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  let s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
  l = Math.cbrt(l)
  m = Math.cbrt(m)
  s = Math.cbrt(s)
  return {
    L: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  }
}

export function oklabToRgb(L, a, b) {
  let l = L + 0.3963377774 * a + 0.2158037573 * b
  let m = L - 0.1055613458 * a - 0.0638541728 * b
  let s = L - 0.0894841775 * a - 1.2914855480 * b
  l = l * l * l
  m = m * m * m
  s = s * s * s
  const r = srgbTransferInv(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)
  const g = srgbTransferInv(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)
  const bl = srgbTransferInv(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
  return { r: Math.max(0, Math.min(1, r)), g: Math.max(0, Math.min(1, g)), b: Math.max(0, Math.min(1, bl)) }
}

export function hexToOklab(hex) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToOklab(r, g, b)
}

export function oklabToHex(L, a, bVal) {
  const { r, g, b: blue } = oklabToRgb(L, a, bVal)
  return rgbToHex(r, g, blue)
}

export function oklabToOklch(L, a, b) {
  return { L, C: Math.sqrt(a * a + b * b), h: Math.atan2(b, a) * (180 / Math.PI) }
}

export function hexToOklch(hex) {
  const lab = hexToOklab(hex)
  return oklabToOklch(lab.L, lab.a, lab.b)
}

export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex)
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (mx + mn) / 2
  if (mx !== mn) {
    const d = mx - mn
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn)
    switch (mx) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100
  const fn = (p, q, t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return rgbToHex(fn(p, q, h + 1 / 3), fn(p, q, h), fn(p, q, h - 1 / 3))
}

function solveLightnessForOkL(targetL, refLab) {
  let lo = 0, hi = 1
  for (let iter = 0; iter < 30; iter++) {
    const mid = (lo + hi) / 2
    const a = refLab.a * mid
    const b = refLab.b * mid
    const { r, g, b: blue } = oklabToRgb(targetL, a, b)
    if (r >= 0 && r <= 1 && g >= 0 && g <= 1 && blue >= 0 && blue <= 1) {
      lo = mid
    } else {
      hi = mid
    }
  }
  return lo
}

export function generatePalette(hex, mode = 'perceived', hueShift = 0, satShift = 0, lightMax = 100, lightMin = 0) {
  const baseHsl = hexToHsl(hex)
  const baseLab = hexToOklab(hex)

  return stopLabels.map((stop, i) => {
    const t = i / (stopLabels.length - 1)
    const targetL = (lightMax / 100) - t * ((lightMax - lightMin) / 100)

    if (mode === 'perceived') {
      const scale = solveLightnessForOkL(targetL, baseLab)
      const hueRad = (baseHsl.h + hueShift) * Math.PI / 180
      const satFactor = 1 + satShift * (t - 0.5) * 0.02
      const a = Math.cos(hueRad) * baseLab.a * scale * satFactor
      const b = Math.sin(hueRad) * baseLab.b * scale * satFactor
      return oklabToHex(targetL, a, b)
    } else {
      const l = lightMin + ((lightMax - lightMin) * (stopLabels.length - 1 - i)) / (stopLabels.length - 1)
      const h = ((baseHsl.h + hueShift * (t - 0.5)) + 360) % 360
      const s = Math.max(0, Math.min(100, baseHsl.s + satShift * (t - 0.5)))
      return hslToHex(h, s, l)
    }
  })
}

export function luminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return SRGB_LUM_COEFFS[0] * a[0] + SRGB_LUM_COEFFS[1] * a[1] + SRGB_LUM_COEFFS[2] * a[2]
}

export function contrastRatio(hex1, hex2) {
  const l1 = luminance(hex1)
  const l2 = luminance(hex2)
  const brighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (brighter + 0.05) / (darker + 0.05)
}

export function wcagLevel(ratio, largeText = false) {
  if (ratio >= 7) return { level: 'AAA', pass: true }
  if (ratio >= 4.5) return { level: 'AA', pass: true }
  if (largeText && ratio >= 3) return { level: 'AA (large)', pass: true }
  return { level: 'Fail', pass: false }
}

export function formatHex(hex) {
  return hex.toUpperCase()
}

export function formatOklch(hex) {
  const oklch = hexToOklch(hex)
  const L = (oklch.L * 100).toFixed(1)
  const C = oklch.C.toFixed(3)
  const h = oklch.h.toFixed(1)
  return `oklch(${L}% ${C} ${h})`
}

export function formatHsl(hex) {
  const hsl = hexToHsl(hex)
  return `hsl(${hsl.h.toFixed(0)} ${hsl.s.toFixed(0)}% ${hsl.l.toFixed(0)}%)`
}

export function generateSvgPalette(palette, name) {
  const swatchH = 40
  const gap = 2
  const totalH = palette.length * (swatchH + gap) - gap
  const swatchW = 100
  const labelW = 40
  const hexW = 90
  const totalW = swatchW + labelW + hexW + 20

  let rects = palette.map((hex, i) => {
    const y = i * (swatchH + gap)
    return `
    <rect x="0" y="${y}" width="${swatchW}" height="${swatchH}" fill="${hex}" rx="4" />
    <text x="${swatchW + 6}" y="${y + swatchH / 2 + 1}" font-family="IBM Plex Mono, monospace" font-size="11" fill="#666" dominant-baseline="middle">${stopLabels[i]}</text>
    <text x="${swatchW + labelW}" y="${y + swatchH / 2 + 1}" font-family="IBM Plex Mono, monospace" font-size="11" fill="#999" dominant-baseline="middle">${hex.toUpperCase()}</text>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <rect width="${totalW}" height="${totalH}" fill="white" rx="6" />
  ${rects}
</svg>`
}
