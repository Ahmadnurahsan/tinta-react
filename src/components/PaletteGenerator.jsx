import { motion } from 'framer-motion'

const stopOptions = [25, 50, 100, 150, 200, 250, 300, 400, 500, 600, 650, 700, 750, 800, 850, 900, 950]

export default function PaletteGenerator({ hex, name, baseStop, mode, hueShift, satShift, lightMax, lightMin, onChange }) {
  return (
    <section>
      <motion.h2
        className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        Palette generator
      </motion.h2>

      <div className="space-y-5">
        <div>
          <label className="text-xs text-neutral-500 mb-1.5 block">Name</label>
          <input
            value={name}
            onChange={e => onChange({ name: e.target.value })}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-900 transition-all"
          />
        </div>

        <div>
          <label className="text-xs text-neutral-500 mb-1.5 block">Base value</label>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="color"
                value={hex}
                onChange={e => onChange({ hex: e.target.value.toUpperCase() })}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div className="w-9 h-9 rounded-lg border border-neutral-300 cursor-pointer" style={{ backgroundColor: hex }} />
            </div>
            <input
              value={hex}
              onChange={e => onChange({ hex: e.target.value })}
              className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-neutral-900 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-neutral-500 mb-1.5 block">Scale mode</label>
          <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg">
            <motion.button
              onClick={() => onChange({ mode: 'perceived' })}
              className={`flex-1 text-sm py-1.5 rounded-md cursor-pointer ${mode === 'perceived' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'}`}
              whileTap={{ scale: 0.98 }}
            >
              Perceived
            </motion.button>
            <motion.button
              onClick={() => onChange({ mode: 'linear' })}
              className={`flex-1 text-sm py-1.5 rounded-md cursor-pointer ${mode === 'linear' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'}`}
              whileTap={{ scale: 0.98 }}
            >
              Linear
            </motion.button>
          </div>
        </div>

        <div>
          <label className="text-xs text-neutral-500 mb-1.5 block">Base stop</label>
          <select
            value={baseStop}
            onChange={e => onChange({ baseStop: Number(e.target.value) })}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-900 transition-all bg-white appearance-none cursor-pointer"
          >
            {stopOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <Slider label="Hue shift" value={hueShift} onChange={v => onChange({ hueShift: v })} min={-180} max={180} unit="°" />
        <Slider label="Saturation shift" value={satShift} onChange={v => onChange({ satShift: v })} min={-50} max={50} unit="%" />
        <Slider label="Lightness max (50)" value={lightMax} onChange={v => onChange({ lightMax: v })} min={50} max={100} />
        <Slider label="Lightness min (950)" value={lightMin} onChange={v => onChange({ lightMin: v })} min={0} max={50} />

        <p className="text-[11px] text-neutral-400 leading-relaxed">
          <strong>How it works:</strong> your hex stays at the base stop. Stops before it are lighter, stops after are darker. <strong>Perceived</strong> uses OKLab for perceptual uniformity.
        </p>
      </div>
    </section>
  )
}

function Slider({ label, value, onChange, min, max, unit }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex justify-between text-xs text-neutral-500 mb-1">
        <span>{label}</span>
        <motion.span
          className="font-mono tabular-nums"
          key={value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
        >
          {value}{unit || ''}
        </motion.span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute left-0 right-0 h-1 bg-neutral-200 rounded-full" />
        <motion.div
          className="absolute left-0 h-1 rounded-full bg-neutral-900"
          style={{ width: `${pct}%` }}
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        <input
          type="range"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          min={min}
          max={max}
          className="relative w-full appearance-none bg-transparent cursor-pointer h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>
  )
}
