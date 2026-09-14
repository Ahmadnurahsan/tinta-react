import { useState, useMemo, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import HeroBand from './HeroBand'
import ColorAssistant from './ColorAssistant'
import PaletteGenerator from './PaletteGenerator'
import SwatchDisplay from './SwatchDisplay'
import ContrastChecker from './ContrastChecker'
import PreviewDesigns from './PreviewDesigns'
import ExportPanel from './ExportPanel'
import Footer from './Footer'
import { generatePalette } from '../utils/color'

let nextId = 6

function createPalette(name, hex) {
  return { id: `p${nextId++}`, name, hex, baseStop: 500, mode: 'perceived', hueShift: 0, satShift: 0, lightMax: 100, lightMin: 0 }
}

const defaultColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#84CC16', '#14B8A6']
let colorIndex = 5

export default function PaletteTool() {
  const [palettes, setPalettes] = useState([
    { id: 'p1', name: 'indigo', hex: '#6366F1', baseStop: 500, mode: 'perceived', hueShift: 0, satShift: 0, lightMax: 100, lightMin: 0 },
    { id: 'p2', name: 'red', hex: '#EF4444', baseStop: 500, mode: 'perceived', hueShift: 0, satShift: 0, lightMax: 100, lightMin: 0 },
    { id: 'p3', name: 'amber', hex: '#F59E0B', baseStop: 500, mode: 'perceived', hueShift: 0, satShift: 0, lightMax: 100, lightMin: 0 },
    { id: 'p4', name: 'emerald', hex: '#10B981', baseStop: 500, mode: 'perceived', hueShift: 0, satShift: 0, lightMax: 100, lightMin: 0 },
    { id: 'p5', name: 'violet', hex: '#8B5CF6', baseStop: 500, mode: 'perceived', hueShift: 0, satShift: 0, lightMax: 100, lightMin: 0 },
  ])
  const [activeId, setActiveId] = useState('p1')
  const [toast, setToast] = useState(null)

  const activePalette = palettes.find(p => p.id === activeId) || palettes[0]

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }, [])

  const updateActive = useCallback((updates) => {
    setPalettes(prev => prev.map(p => p.id === activeId ? { ...p, ...updates } : p))
  }, [activeId])

  const paletteColors = useMemo(
    () => generatePalette(activePalette.hex, activePalette.mode, activePalette.hueShift, activePalette.satShift, activePalette.lightMax, activePalette.lightMin),
    [activePalette]
  )

  const handleAddPalette = () => {
    if (palettes.length >= 8) { showToast('Max 8 palettes'); return }
    const names = ['rose', 'sky', 'lime', 'teal', 'orange', 'pink', 'cyan', 'purple']
    const used = palettes.map(p => p.name)
    const name = names.find(n => !used) || `palette ${palettes.length + 1}`
    const hex = defaultColors[colorIndex % defaultColors.length]
    colorIndex++
    const newPalette = createPalette(name, hex)
    setPalettes(prev => [...prev, newPalette])
    setActiveId(newPalette.id)
  }

  const handleRemovePalette = (id) => {
    if (palettes.length <= 1) return
    setPalettes(prev => prev.filter(p => p.id !== id))
    if (activeId === id) {
      const remaining = palettes.filter(p => p.id !== id)
      setActiveId(remaining[remaining.length - 1].id)
    }
  }

  const allColors = useMemo(
    () => palettes.map(p => ({
      id: p.id,
      name: p.name,
      colors: generatePalette(p.hex, p.mode, p.hueShift, p.satShift, p.lightMax, p.lightMin)
    })),
    [palettes]
  )

  const currentColors = allColors.find(c => c.id === activeId)?.colors || paletteColors

  return (
    <div className="min-h-screen">
      <HeroBand colors={currentColors} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 relative">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[320px] shrink-0 space-y-8">
            <section>
              <motion.h2
                className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                Palettes
              </motion.h2>
              <div className="space-y-1">
                {palettes.map(p => (
                  <motion.div key={p.id} layout className="flex items-center gap-2">
                    <motion.button
                      onClick={() => setActiveId(p.id)}
                      className={`flex-1 text-sm px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${activeId === p.id ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {p.name}
                    </motion.button>
                    {palettes.length > 1 && (
                      <motion.button
                        onClick={() => handleRemovePalette(p.id)}
                        className="text-neutral-400 hover:text-red-500 text-xs w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 cursor-pointer"
                        whileHover={{ scale: 1.2 }}
                      >
                        ✕
                      </motion.button>
                    )}
                  </motion.div>
                ))}
                {palettes.length < 5 && (
                  <motion.button
                    onClick={handleAddPalette}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 cursor-pointer mt-1"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    + Add palette
                  </motion.button>
                )}
              </div>
            </section>
            <ColorAssistant onSelect={(hex) => updateActive({ hex })} />
            <PaletteGenerator
              hex={activePalette.hex}
              name={activePalette.name}
              baseStop={activePalette.baseStop}
              mode={activePalette.mode}
              hueShift={activePalette.hueShift}
              satShift={activePalette.satShift}
              lightMax={activePalette.lightMax}
              lightMin={activePalette.lightMin}
              onChange={updateActive}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-10">
            <SwatchDisplay allPalettes={allColors} activeId={activeId} onCopy={showToast} />
            <ContrastChecker palette={currentColors} onCopy={showToast} />
            <PreviewDesigns colors={currentColors} />
            <ExportPanel palette={currentColors} name={activePalette.name} showToast={showToast} />
          </div>
        </div>
      </div>

      <div className="pb-20">
        <Footer />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-1 py-2 overflow-x-auto">
          {palettes.map(p => (
            <motion.button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                activeId === p.id ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="w-3 h-3 rounded-full border border-current/20 shrink-0" style={{ backgroundColor: p.hex }} />
              {p.name}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ y: 16, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-5 py-3 rounded-full shadow-2xl z-50 font-mono tracking-wide"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
