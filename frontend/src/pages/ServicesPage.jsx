import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import Lightbox from '../components/ui/Lightbox'
import ServiceCard from '../components/ui/ServiceCard'

import { serviceCategories } from '../utils/helpers'

function ServiceSlider({ category, items, onImageClick }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl text-base-content">{category}</h2>
        <div className="flex gap-1">
          <button onClick={() => scroll(-1)} className="btn btn-ghost btn-sm rounded-xl"><ChevronLeft className="size-5" /></button>
          <button onClick={() => scroll(1)} className="btn btn-ghost btn-sm rounded-xl"><ChevronRight className="size-5" /></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 scrollbar-hide">
        {items.map((s) => (
          <div key={s._id} className="snap-start shrink-0 min-w-[280px] w-[85vw] max-w-[320px] md:max-w-[360px]">
            <ServiceCard service={s} onImageClick={onImageClick} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ServicesPage() {
  const { data: services = [], isLoading } = useQuery({ queryKey: ['services'], queryFn: () => api.get('/services').then(r => r.data) })
  const [lbService, setLbService] = useState(null)
  const [lbIndex, setLbIndex] = useState(0)

  const grouped = serviceCategories.map(cat => ({ category: cat, items: services.filter(s => s.category === cat) })).filter(g => g.items.length > 0)

  const openLightbox = (service, idx) => {
    setLbService(service)
    setLbIndex(idx)
  }

  const lbItems = lbService
    ? (lbService.images?.length ? lbService.images.map(img => ({ image: img.url, title: lbService.name })) : [{ image: lbService.image || lbService.images?.[0]?.url || '', title: lbService.name }])
    : []

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary" /></div>

  return (
    <div>
      <section className="relative pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-base-200 via-base-100 to-base-200" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="text-primary font-display italic text-base md:text-lg tracking-widest uppercase">Mahi Makeover</span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-7xl font-bold text-base-content mt-3 leading-tight">Our <span className="text-primary">Packages</span></h1>
          <p className="text-base-content/60 max-w-xl mx-auto mt-3 md:mt-4 text-sm md:text-lg">HD, Air Brush & Celebrity makeup for every occasion — prices as per our catalog.</p>
        </div>
      </section>
      <section className="pb-16 md:pb-20 lg:pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {grouped.map(g => <ServiceSlider key={g.category} category={g.category} items={g.items} onImageClick={openLightbox} />)}
        </div>
      </section>
      {lbItems.length > 0 && (
        <Lightbox items={lbItems} index={lbIndex} onClose={() => { setLbService(null); setLbIndex(0) }} onPrev={() => setLbIndex(i => (i - 1 + lbItems.length) % lbItems.length)} onNext={() => setLbIndex(i => (i + 1) % lbItems.length)} />
      )}
    </div>
  )
}