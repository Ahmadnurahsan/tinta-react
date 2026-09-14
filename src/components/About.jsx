import { motion } from 'framer-motion'

export default function About({ onBack }) {
  return (
    <motion.div
      className="min-h-screen bg-white text-neutral-900 antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-20">
        <motion.button
          onClick={onBack}
          className="text-sm text-neutral-500 hover:text-neutral-900 mb-8 cursor-pointer"
          whileHover={{ x: -4 }}
        >
          ← Back to Tinta
        </motion.button>

        <motion.h1
          className="text-4xl font-light tracking-tight mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          About Tinta
        </motion.h1>

        <motion.div
          className="space-y-6 text-neutral-600 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p>
            Tinta was born from a simple frustration: generating color palettes for Tailwind CSS projects shouldn't feel like solving a puzzle.
          </p>

          <p>
            Most palette generators give you random colors. We wanted something different — pick one hex, get a full 17-stop scale (25–950) that actually works together. No more guessing whether your indigo-300 clashes with your indigo-700.
          </p>

          <h2 className="text-xl font-medium text-neutral-900 pt-4">Why Tinta exists</h2>

          <p>
            As developers and designers, we kept running into the same problems:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Clipboard scripts that copy Tailwind config objects instead of ready-to-use CSS strings</li>
            <li>WCAG contrast issues that only surface after deployment</li>
            <li>Color scales that look great at 500 but fall apart at the extremes</li>
            <li>No easy way to preview how palettes look in real UI components</li>
          </ul>

          <p>
            Tinta solves all of this in one place.
          </p>

          <h2 className="text-xl font-medium text-neutral-900 pt-4">Built with</h2>

          <p>
            Tinta uses OKLab color space (by Björn Ottosson) for perceptual spacing, ensuring that the visual difference between color stops feels natural and consistent. All contrast ratios follow WCAG 2.1 standards.
          </p>

          <h2 className="text-xl font-medium text-neutral-900 pt-4">Designed by Kiaralabs</h2>

          <p>
            Every detail — from the gradient animations to the export formats — was crafted to make your color workflow faster and more enjoyable.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
