import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { stopLabels, formatHex, formatOklch, formatHsl, generateSvgPalette } from '../utils/color'

export default function ExportPanel({ palette, name, showToast }) {
  const [tab, setTab] = useState('tailwind-v4')

  const snippets = {
    'tailwind-v4': () => {
      const lines = palette.map((hex, i) => `      ${stopLabels[i]}: ${hex},`)
      return `@theme {\n  --color-${name || 'primary'}-*: initial;\n  --color-${name || 'primary'}:\n${lines.join('\n')}\n  ;\n}`
    },
    'tailwind-v3': () => {
      const lines = palette.map((hex, i) => `        ${stopLabels[i]}: "${hex}",`)
      return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        '${name || 'primary'}': {\n${lines.join('\n')}\n        },\n      },\n    },\n  },\n}`
    },
    json: () => JSON.stringify({ [name || 'primary']: Object.fromEntries(palette.map((h, i) => [stopLabels[i], h])) }, null, 2),
    api: () => JSON.stringify({
      name: name || 'primary',
      hex: palette[5] || '#6366F1',
      stops: Object.fromEntries(palette.map((h, i) => [stopLabels[i], h])),
      mode: 'perceived',
      generated: new Date().toISOString(),
    }, null, 2),
  }

  const tabs = [
    { key: 'tailwind-v4', label: 'Tailwind v4 · @theme' },
    { key: 'tailwind-v3', label: 'Tailwind v3 · config' },
    { key: 'json', label: 'JSON' },
    { key: 'api', label: 'API payload' },
  ]

  const content = snippets[tab]()

  const handleCopy = (format, value) => {
    navigator.clipboard?.writeText(value)
    showToast?.('Copied ' + format)
  }

  const handleDownloadSvg = () => {
    const svg = generateSvgPalette(palette, name)
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name || 'palette'}.svg`
    a.click()
    URL.revokeObjectURL(url)
    showToast?.('Downloaded SVG')
  }

  return (
    <section>
      <motion.h2
        className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        Export
      </motion.h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <motion.button
          onClick={() => handleCopy('hex', formatHex(palette[5]))}
          className="text-xs text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-50 transition-colors cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Copy hex
        </motion.button>
        <motion.button
          onClick={() => handleCopy('oklch', formatOklch(palette[5]))}
          className="text-xs text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-50 transition-colors cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Copy oklch
        </motion.button>
        <motion.button
          onClick={() => handleCopy('hsl', formatHsl(palette[5]))}
          className="text-xs text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-50 transition-colors cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Copy hsl
        </motion.button>
        <motion.button
          onClick={handleDownloadSvg}
          className="text-xs text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-50 transition-colors cursor-pointer ml-auto"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ↓ SVG
        </motion.button>
        <motion.button
          onClick={() => { navigator.clipboard?.writeText(content); showToast?.('Copied snippet') }}
          className="text-xs text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-50 transition-colors cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Copy snippet
        </motion.button>
      </div>

      <div className="flex border-b border-neutral-200 mb-4">
        {tabs.map(t => (
          <motion.button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-xs border-b-2 transition-colors cursor-pointer ${tab === t.key ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
            whileHover={tab !== t.key ? { y: -1 } : {}}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.pre
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-[11px] font-mono overflow-x-auto whitespace-pre leading-relaxed"
        >
          {content}
        </motion.pre>
      </AnimatePresence>
    </section>
  )
}
