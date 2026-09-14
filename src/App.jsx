import { useState, useMemo, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import PaletteTool from './components/PaletteTool'
import About from './components/About'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased relative bg-grid">
      <Navbar />
      <div className="pt-14">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/palette" element={<PaletteTool />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  )
}
