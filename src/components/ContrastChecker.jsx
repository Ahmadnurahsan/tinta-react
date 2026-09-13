import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { contrastRatio, wcagLevel, stopLabels } from '../utils/color'

export default function ContrastChecker({ palette, onCopy }) {
  const [textColor, setTextColor] = useState('#111111')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [localText, setLocalText] = useState('#111111')
  const [localBg, setLocalBg] = useState('#FFFFFF')
  const [showNonText, setShowNonText] = useState(false)
  const [showGrid, setShowGrid] = useState(false)

  const ratio = useMemo(() => contrastRatio(textColor, bgColor), [textColor, bgColor])
  const normalLevel = wcagLevel(ratio, false)
  const largeLevel = wcagLevel(ratio, true)
  const nonTextLevel = wcagLevel(ratio / 2, false)

  const handleTextBlur = () => setTextColor(localText)
  const handleBgBlur = () => setBgColor(localBg)

  return (
    <section>
      <motion.h2
        className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        WCAG contrast checker
      </motion.h2>

      <div className="flex gap-3 mb-5">
        <div className="flex-1">
          <label className="text-xs text-neutral-500 mb-1 block">Text</label>
          <div className="flex gap-2">
            <div className="relative">
              <input type="color" value={textColor} onChange={e => { setTextColor(e.target.value); setLocalText(e.target.value) }} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
              <div className="w-9 h-9 rounded-lg border border-neutral-300 cursor-pointer" style={{ backgroundColor: textColor }} />
            </div>
            <input value={localText} onChange={e => setLocalText(e.target.value)} onBlur={handleTextBlur} onKeyDown={e => e.key === 'Enter' && handleTextBlur()} className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-neutral-900 transition-all" />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs text-neutral-500 mb-1 block">Background</label>
          <div className="flex gap-2">
            <div className="relative">
              <input type="color" value={bgColor} onChange={e => { setBgColor(e.target.value); setLocalBg(e.target.value) }} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
              <div className="w-9 h-9 rounded-lg border border-neutral-300 cursor-pointer" style={{ backgroundColor: bgColor }} />
            </div>
            <input value={localBg} onChange={e => setLocalBg(e.target.value)} onBlur={handleBgBlur} onKeyDown={e => e.key === 'Enter' && handleBgBlur()} className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-neutral-900 transition-all" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <Badge label="Normal text" level={normalLevel} min="4.5:1" />
        <Badge label="Large text" level={largeLevel} min="3:1" />
        <Badge label="Non-text" level={nonTextLevel} min="3:1" onClick={() => setShowNonText(!showNonText)} />
      </div>

      <AnimatePresence>
        {showNonText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              WCAG 2.2 non-text contrast requires 3:1 for UI components. Current pair: {(ratio / 2).toFixed(2)}:1 — {nonTextLevel.pass ? 'PASS' : 'FAIL'}.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex items-center gap-4 mb-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="text-4xl font-bold font-mono tabular-nums"
          key={ratio.toFixed(2)}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {ratio.toFixed(2)}:1
        </motion.div>
        <div className="text-xs text-neutral-500">contrast ratio</div>
        <motion.button
          onClick={() => { setTextColor(bgColor); setBgColor(textColor); setLocalText(bgColor); setLocalBg(textColor) }}
          className="ml-auto text-xs text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-50 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ⇄ Swap
        </motion.button>
      </motion.div>

      <div
        className="p-5 rounded-xl border border-neutral-200 mb-5"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <p className="text-base font-semibold mb-1">The quick brown fox</p>
        <p className="text-xs opacity-80">This is a live WCAG contrast preview at 14–16px body text size. WCAG AA requires 4.5:1, AAA requires 7:1.</p>
        <div className="mt-3 flex gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: textColor + '15' }}>UI tag</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: textColor + '15' }}>{(ratio).toFixed(1)}:1</span>
        </div>
      </div>

      <motion.button
        onClick={() => setShowGrid(!showGrid)}
        className="text-xs text-neutral-500 mb-3 flex items-center gap-1 hover:text-neutral-700 transition-colors cursor-pointer"
      >
        <span className="text-neutral-400">{showGrid ? '▾' : '▸'}</span> {showGrid ? 'Hide' : 'Show'} full contrast grid
      </motion.button>

      <AnimatePresence>
        {showGrid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-5"
          >
            <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200">
              {palette.map((hex, i) => (
                <motion.button
                  key={stopLabels[i]}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.015 }}
                  onClick={() => { setTextColor(hex); setLocalText(hex) }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 text-left cursor-pointer"
                >
                  <div className="w-7 h-6 rounded border border-neutral-200 shrink-0" style={{ backgroundColor: hex }} />
                  <span className="text-[11px] text-neutral-500 font-mono w-8 shrink-0">{stopLabels[i]}</span>
                  <span className="text-[11px] font-mono text-neutral-600">{hex}</span>
                  <span className="text-[10px] text-neutral-400 ml-auto">W {contrastRatio(hex, '#FFFFFF').toFixed(1)}:1 · B {contrastRatio(hex, '#000000').toFixed(1)}:1</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Badge({ label, level, min, onClick }) {
  return (
    <motion.div
      className={`flex-1 p-3 rounded-xl text-center border-2 cursor-default ${level.pass ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}
      whileHover={onClick ? { scale: 1.02 } : {}}
      onClick={onClick}
    >
      <motion.span
        key={level.pass ? 'p' : 'f'}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        className={`text-sm font-bold ${level.pass ? 'text-green-700' : 'text-red-700'}`}
      >
        {label}
      </motion.span>
      <div className="flex items-center justify-center gap-1 mt-0.5">
        {level.pass ? (
          <span className="text-[10px] px-2 py-0.5 rounded bg-green-200 text-green-800 font-bold">PASS</span>
        ) : (
          <span className="text-[10px] px-2 py-0.5 rounded bg-red-200 text-red-800 font-bold">FAIL</span>
        )}
        {min && <span className="text-[10px] text-neutral-500">≥ {min}</span>}
      </div>
    </motion.div>
  )
}
