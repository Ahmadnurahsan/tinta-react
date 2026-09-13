import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const taglines = [
  'Tailwind CSS palette generator · API output · WCAG contrast lab',
  '✨ colors that pop · contrasts that pass · gradients that slap',
  'from hex to harmony · OKLab powered · WCAG approved',
  'stop guessing · start generating · your palette awaits',
]

export default function Header({ palette }) {
  const [taglineIdx, setTaglineIdx] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setTaglineIdx(i => (i + 1) % taglines.length), 4000)
    return () => clearInterval(iv)
  }, [])

  return (
    <header className="relative text-center pt-16 pb-20 overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        animate={{
          background: [
            `radial-gradient(ellipse at 20% 50%, ${palette?.[5] || '#6366F1'} 0%, transparent 60%)`,
            `radial-gradient(ellipse at 80% 50%, ${palette?.[3] || '#A5B4FC'} 0%, transparent 60%)`,
            `radial-gradient(ellipse at 20% 50%, ${palette?.[5] || '#6366F1'} 0%, transparent 60%)`,
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.h1
        className="text-8xl font-light tracking-tight select-none"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        TINTA.
      </motion.h1>

      <motion.p
        key={taglineIdx}
        className="text-lg text-neutral-500 mt-4 h-7"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
      >
        {taglines[taglineIdx]}
      </motion.p>

      <motion.div
        className="flex justify-center gap-2 mt-8 text-sm text-neutral-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {['✦ Color assistant', '✦ Palette generator', '✦ Contrast checker'].map((item, i) => (
          <motion.span
            key={item}
            className="border border-neutral-300 rounded-full px-4 py-1.5 cursor-default"
            whileHover={{ scale: 1.05, borderColor: palette?.[5] || '#6366F1', color: palette?.[5] || '#6366F1' }}
          >
            {item}
          </motion.span>
        ))}
      </motion.div>
    </header>
  )
}
