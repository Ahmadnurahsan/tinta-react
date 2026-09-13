import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { contrastRatio } from '../utils/color'

const previews = ['Abstract', 'Noren', 'Buttons', 'Typography', 'Web UI']

export default function PreviewDesigns({ colors: paletteColors }) {
  const [activePreview, setActivePreview] = useState('Abstract')
  const [shuffleKey, setShuffleKey] = useState(0)

  const colors = useMemo(() => {
    if (!paletteColors) return {}
    const c = paletteColors
    return {
      c50: c[0] || '#F5F3FF',
      c100: c[1] || '#EDE9FE',
      c200: c[2] || '#DDD6FE',
      c300: c[3] || '#C4B5FD',
      c400: c[4] || '#A78BFA',
      c500: c[5] || '#8B5CF6',
      c600: c[6] || '#7C3AED',
      c700: c[7] || '#6D28D9',
      c800: c[8] || '#5B21B6',
      c900: c[9] || '#4C1D95',
    }
  }, [paletteColors, shuffleKey])

  const renderPreview = () => {
    switch (activePreview) {
      case 'Abstract':
        return <AbstractPreview colors={colors} />
      case 'Noren':
        return <NorenPreview colors={colors} />
      case 'Buttons':
        return <ButtonsPreview colors={colors} />
      case 'Typography':
        return <TypographyPreview colors={colors} />
      case 'Web UI':
        return <WebUIPreview colors={colors} />
      default:
        return null
    }
  }

  return (
    <section>
      <motion.h2
        className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        Preview designs
      </motion.h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        {previews.map(p => (
          <motion.button
            key={p}
            onClick={() => setActivePreview(p)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${activePreview === p ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {p}
          </motion.button>
        ))}
        <motion.button
          onClick={() => setShuffleKey(k => k + 1)}
          className="ml-auto text-xs px-3 py-1.5 border border-neutral-300 rounded-lg text-neutral-500 hover:bg-neutral-100 cursor-pointer"
          whileHover={{ scale: 1.04, rotate: 90 }}
          whileTap={{ scale: 0.96 }}
        >
          ↻
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activePreview}-${shuffleKey}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="border border-neutral-200 rounded-xl overflow-hidden"
        >
          {renderPreview()}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function AbstractPreview({ colors }) {
  return (
    <div className="p-6" style={{ backgroundColor: colors.c100 }}>
      <svg viewBox="0 0 400 200" className="w-full h-auto rounded-lg">
        <rect x="0" y="0" width="400" height="200" fill={colors.c200} rx="8" />
        <circle cx="80" cy="100" r="50" fill={colors.c500} opacity="0.8" />
        <circle cx="200" cy="80" r="40" fill={colors.c400} opacity="0.7" />
        <circle cx="320" cy="120" r="45" fill={colors.c600} opacity="0.75" />
        <rect x="150" y="130" width="100" height="30" fill={colors.c700} rx="6" />
        <line x1="50" y1="30" x2="350" y2="30" stroke={colors.c300} strokeWidth="2" strokeDasharray="6 4" />
        <line x1="50" y1="170" x2="350" y2="170" stroke={colors.c300} strokeWidth="2" strokeDasharray="6 4" />
      </svg>
    </div>
  )
}

function NorenPreview({ colors }) {
  const strips = [colors.c500, colors.c400, colors.c300, colors.c600, colors.c700, colors.c500, colors.c400, colors.c300]
  return (
    <div className="p-6" style={{ backgroundColor: colors.c100 }}>
      <div className="flex gap-1 justify-center">
        {strips.map((color, i) => (
          <motion.div
            key={i}
            className="w-10 h-40 rounded-b-lg"
            style={{ backgroundColor: color }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  )
}

function ButtonsPreview({ colors }) {
  const variants = [
    { label: 'Solid', style: { backgroundColor: colors.c500, color: '#fff', border: 'none' } },
    { label: 'Outline', style: { border: `2px solid ${colors.c500}`, color: colors.c500, backgroundColor: 'transparent' } },
    { label: 'Ghost', style: { color: colors.c500, backgroundColor: colors.c100, border: 'none' } },
    { label: 'Subtle', style: { color: colors.c700, backgroundColor: colors.c200, border: 'none' } },
  ]
  return (
    <div className="p-6 space-y-3" style={{ backgroundColor: colors.c50 }}>
      {variants.map((v, i) => (
        <motion.button
          key={i}
          className="w-full py-2.5 rounded-lg text-sm font-medium cursor-pointer"
          style={v.style}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {v.label}
        </motion.button>
      ))}
    </div>
  )
}

function TypographyPreview({ colors }) {
  return (
    <div className="p-6 space-y-4" style={{ backgroundColor: colors.c50, color: colors.c900 }}>
      <h1 className="text-2xl font-bold" style={{ color: colors.c800 }}>Heading 1</h1>
      <h2 className="text-xl font-semibold" style={{ color: colors.c700 }}>Heading 2</h2>
      <p className="text-sm leading-relaxed" style={{ color: colors.c800 }}>
        Body text using the palette&apos;s darker stops. WCAG AA requires 4.5:1 for normal text.
        The quick brown fox jumps over the lazy dog.
      </p>
      <p className="text-xs font-mono" style={{ color: colors.c600 }}>Caption / metadata text</p>
      <div className="flex gap-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.c200, color: colors.c700 }}>Tag</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.c300, color: colors.c800 }}>Tag</span>
      </div>
    </div>
  )
}

function WebUIPreview({ colors }) {
  return (
    <div style={{ backgroundColor: colors.c50, color: colors.c800 }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: colors.c200, backgroundColor: colors.c100 }}>
        <span className="font-bold text-sm" style={{ color: colors.c700 }}>Tinta</span>
        <nav className="flex gap-4 text-xs">
          <span>Home</span>
          <span>Work</span>
          <span>About</span>
        </nav>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="p-4 rounded-xl shadow-sm border"
              style={{ backgroundColor: colors.c50, borderColor: colors.c200 }}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            >
              <div className="h-16 rounded-lg mb-2" style={{ backgroundColor: i % 2 === 0 ? colors.c300 : colors.c400 }} />
              <p className="text-xs font-medium">Card {i + 1}</p>
              <p className="text-[10px] opacity-60">Preview mockup</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
