import { motion } from 'framer-motion'
import { stopLabels, contrastRatio } from '../utils/color'

export default function SwatchDisplay({ allPalettes, activeId, onCopy }) {
  return (
    <section>
      <motion.h2
        className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        Palette
      </motion.h2>

      <div className="space-y-6">
        {allPalettes.map(({ id, name, colors }) => (
          <div key={id} className="border border-neutral-200 rounded-xl p-4">
            <div className="text-xs text-neutral-500 mb-4 font-mono">
              {id === activeId && <span className="text-neutral-900">●</span>} {name} · base 500
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {colors.map((hex, i) => {
                const wRatio = contrastRatio(hex, '#FFFFFF')
                const bRatio = contrastRatio(hex, '#000000')

                return (
                  <motion.button
                    key={stopLabels[i]}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => {
                      navigator.clipboard?.writeText(hex)
                      onCopy(`Copied ${hex}`)
                    }}
                    className="flex flex-col items-center gap-1 min-w-0 flex-1 cursor-crosshair group"
                  >
                    <div
                      className="relative w-full h-14 rounded-lg border border-neutral-200 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-[10px] text-neutral-500 font-mono">{stopLabels[i]}</span>
                    <span className="text-[9px] font-mono text-neutral-700 truncate max-w-full">{hex}</span>
                    <div className="flex gap-1 text-[8px] text-neutral-400 font-mono">
                      <span>W{wRatio.toFixed(1)}</span>
                      <span>B{bRatio.toFixed(1)}</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
