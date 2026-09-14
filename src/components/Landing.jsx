import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const tools = [
  {
    name: 'Palette Generator',
    description: 'Generate 17-stop color scales from any hex value using OKLab color space.',
    path: '/palette',
    color: '#6366F1',
    icon: '🎨',
  },
  {
    name: 'Contrast Checker',
    description: 'Test WCAG 2.1 contrast ratios between your colors before shipping.',
    path: '/palette',
    color: '#10B981',
    icon: '✓',
  },
  {
    name: 'Color Assistant',
    description: 'Get intelligent color suggestions based on your current palette.',
    path: '/palette',
    color: '#F59E0B',
    icon: '✨',
  },
  {
    name: 'Export Tools',
    description: 'Copy CSS variables, Tailwind config, or raw values instantly.',
    path: '/palette',
    color: '#EC4899',
    icon: '📋',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-4">
              TINTA.
            </h1>
            <p className="text-lg text-neutral-500 max-w-xl mx-auto">
              Developer-first color tools. Generate palettes, check contrasts, and export production-ready CSS.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={tool.path}
                  className="block p-6 rounded-2xl border border-neutral-200 hover:border-neutral-400 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: tool.color + '15', color: tool.color }}
                    >
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-neutral-500 mt-1">{tool.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/palette"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Open Palette Generator
              <span className="text-neutral-400">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
