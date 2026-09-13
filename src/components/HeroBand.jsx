import { motion } from 'framer-motion'

export default function HeroBand({ colors }) {
  return (
    <div className="w-full flex">
      {colors.map((hex, i) => (
        <motion.div
          key={i}
          className="flex-1 h-16 md:h-20"
          style={{ backgroundColor: hex }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.015, duration: 0.3 }}
        />
      ))}
    </div>
  )
}
