import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { hexToOklab } from '../utils/color'

const families = [
  { name: 'Neutral', colors: ['#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151', '#1F2937', '#111827'] },
  { name: 'Warm', colors: ['#FFFBEB', '#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F'] },
  { name: 'Cool', colors: ['#ECFEFF', '#CFFAFE', '#A5F3FC', '#67E8F9', '#22D3EE', '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63'] },
  { name: 'Ocean', colors: ['#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534', '#14532D'] },
  { name: 'Berry', colors: ['#FDF2F8', '#FCE7F3', '#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899', '#DB2777', '#BE185D', '#9D174D', '#831843'] },
  { name: 'Royal', colors: ['#F5F3FF', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95'] },
  { name: 'Sky', colors: ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A'] },
  { name: 'Rose', colors: ['#FFF1F2', '#FFE4E6', '#FECDD3', '#FDA4AF', '#FB7185', '#F43F5E', '#E11D48', '#BE123C', '#9F1239', '#881337'] },
]

export default function ColorAssistant({ onSelect }) {
  const [input, setInput] = useState('')

  const handleSelect = (hex) => {
    onSelect(hex)
    setInput('')
  }

  return (
    <section>
      <motion.h2
        className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        Color assistant
      </motion.h2>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const hex = e.target.value.trim()
                if (/^#[0-9A-Fa-f]{3,6}$/.test(hex) || /^[0-9A-Fa-f]{3,6}$/.test(hex)) {
                  onSelect(hex.startsWith('#') ? hex.toUpperCase() : '#' + hex.toUpperCase())
                  setInput('')
                }
              }
            }}
            placeholder="# or hex or describe vibe..."
            className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-900 transition-all font-mono"
          />
        </div>
      </div>

      <div className="space-y-3">
        {families.map(family => (
          <motion.div
            key={family.name}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] text-neutral-400 mb-1.5 font-medium">{family.name}</p>
            <div className="flex gap-1">
              {family.colors.map(hex => (
                <motion.button
                  key={hex}
                  onClick={() => handleSelect(hex)}
                  className="w-7 h-7 rounded-md border border-neutral-200 cursor-pointer shrink-0"
                  style={{ backgroundColor: hex }}
                  whileHover={{ scale: 1.25, zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                  whileTap={{ scale: 0.9 }}
                  title={hex}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
