import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import api from '../services/api'
import Lightbox from '../components/ui/Lightbox'
import { portfolioCategories } from '../utils/helpers'

function PortfolioCard({ item, onImageClick }) {
  const imgs = item.images?.length ? item.images : (item.image ? [{ url: item.image }] : [])

  if (imgs.length > 1) {
    return (
      <div className="group relative rounded-2xl overflow-hidden bg-base-200 shadow-sm hover:shadow-lg transition-all duration-300">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          className="portfolio-swiper aspect-[4/5] [&_.swiper-button-next]:after:content-[''] [&_.swiper-button-prev]:after:content-[''] [&_.swiper-button-next]:!size-8 [&_.swiper-button-prev]:!size-8 [&_.swiper-button-next]:!bg-white/80 [&_.swiper-button-prev]:!bg-white/80 [&_.swiper-button-next]:!rounded-full [&_.swiper-button-prev]:!rounded-full [&_.swiper-button-next]:!text-black [&_.swiper-button-prev]:!text-black [&_.swiper-button-next]:!opacity-0 [&_.swiper-button-prev]:!opacity-0 group-hover:[&_.swiper-button-next]:!opacity-100 group-hover:[&_.swiper-button-prev]:!opacity-100 [&_.swiper-button-next]:!transition-all [&_.swiper-button-prev]:!transition-all"
        >
          {imgs.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="aspect-[4/5] cursor-pointer" onClick={() => onImageClick(item, i)}>
                <img src={img.url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none p-5 pt-12">
          <h4 className="text-white font-display text-lg">{item.title}</h4>
          {item.caption && <p className="text-white/70 text-xs mt-1 line-clamp-1">{item.caption}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="group relative rounded-2xl overflow-hidden cursor-pointer bg-base-200 shadow-sm hover:shadow-lg transition-all duration-300" onClick={() => onImageClick(item, 0)}>
      <div className="aspect-[4/5] overflow-hidden">
        <img src={imgs[0]?.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" loading="lazy" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5">
        <div>
          <h4 className="text-white font-display text-lg">{item.title}</h4>
          {item.caption && <p className="text-white/70 text-xs mt-1 line-clamp-1">{item.caption}</p>}
        </div>
      </div>
    </div>
  )
}

function CategorySlider({ category, items, onImageClick }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl md:text-3xl text-base-content">{category}</h2>
        <div className="flex gap-1">
          <button onClick={() => scroll(-1)} className="btn btn-ghost btn-sm rounded-xl"><ChevronLeft className="size-5" /></button>
          <button onClick={() => scroll(1)} className="btn btn-ghost btn-sm rounded-xl"><ChevronRight className="size-5" /></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 scrollbar-hide">
        {items.map((item) => (
          <div key={item._id} className="snap-start shrink-0 min-w-[250px] w-[80vw] max-w-[280px] md:max-w-[320px]">
            <PortfolioCard item={item} onImageClick={onImageClick} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function PortfolioPage() {
  const [lbItems, setLbItems] = useState([])
  const [lbIndex, setLbIndex] = useState(-1)
  const { data: items = [], isLoading } = useQuery({ queryKey: ['portfolio'], queryFn: () => api.get('/portfolio').then(r => r.data) })

  const grouped = portfolioCategories.map(cat => ({ category: cat, items: items.filter(i => i.category === cat) })).filter(g => g.items.length > 0)

  const openLightbox = (clickedItem, slideIndex = 0) => {
    const imgs = clickedItem.images?.length ? clickedItem.images : (clickedItem.image ? [{ url: clickedItem.image }] : [])
    const lightboxSlides = imgs.map(img => ({ image: img.url, title: clickedItem.title }))
    setLbItems(lightboxSlides)
    setLbIndex(slideIndex)
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>

  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-accent/50 py-24 md:py-32 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl text-base-content mb-3 md:mb-4">Portfolio</h1>
          <p className="text-base-content/70 max-w-xl mx-auto text-sm md:text-base">Browse our work by category</p>
        </div>
      </section>
      <section className="py-16 md:py-20 lg:py-24 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          {grouped.map(g => (
            <CategorySlider key={g.category} category={g.category} items={g.items} onImageClick={openLightbox} />
          ))}
        </div>
      </section>
      {lbIndex > -1 && (
        <Lightbox items={lbItems} index={lbIndex} onClose={() => setLbIndex(-1)} onPrev={() => setLbIndex(i => (i - 1 + lbItems.length) % lbItems.length)} onNext={() => setLbIndex(i => (i + 1) % lbItems.length)} />
      )}
    </div>
  )
}
