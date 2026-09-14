import { motion } from 'framer-motion'

export default function Footer({ onAboutClick }) {
  return (
    <motion.footer
      className="text-center py-6 text-[11px] text-neutral-400 border-t border-neutral-200 mt-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <p className="leading-relaxed mb-1">
        17-stop scales (25–950) anchored to your exact hex · perceptual spacing via the OKLab color space by Björn Ottosson · contrast per WCAG 2.1
      </p>
      <p className="transition-colors hover:text-neutral-600">
        Tinta. Color palette generator <button onClick={onAboutClick} className="underline cursor-pointer hover:text-neutral-900">designed by Kiaralabs</button>. All rights reserved.
      </p>
    </motion.footer>
  )
}
