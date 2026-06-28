import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Check, Star, Clock, Phone } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import api from '../services/api'
import AnimatedSection from '../components/ui/AnimatedSection'
import Lightbox from '../components/ui/Lightbox'
import ServiceCard from '../components/ui/ServiceCard'
import { SITE } from '../constants/site'

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: () => api.get('/services').then(r => r.data) })
  const { data: reviews = [] } = useQuery({ queryKey: ['reviews'], queryFn: () => api.get('/reviews').then(r => r.data) })
  const { data: portfolio = [] } = useQuery({ queryKey: ['portfolio'], queryFn: () => api.get('/portfolio').then(r => r.data) })

  const [lbService, setLbService] = useState(null)
  const [lbIndex, setLbIndex] = useState(0)

  const openLightbox = (service, idx) => {
    setLbService(service)
    setLbIndex(idx)
  }

  const lbItems = lbService
    ? (lbService.images?.length ? lbService.images.map(img => ({ image: img.url, title: lbService.name })) : [{ image: lbService.image || '', title: lbService.name }])
    : []

  return (
    <div>
      <section id="hero" ref={heroRef} className="relative min-h-screen overflow-hidden pt-16">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }} className="max-w-2xl">
              <span className="inline-block text-primary/80 font-display italic text-sm md:text-lg mb-3 md:mb-4 tracking-widest uppercase">Mahi Makeover · Gwalior</span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-tight">Your Beauty,<br /><span className="text-primary">Our Passion</span></h1>
              <p className="mt-4 md:mt-6 text-base md:text-xl text-white/70 max-w-lg leading-relaxed">Bridal, engagement, reception & party makeup — HD, Air Brush & Celebrity finishes by Muskan Thakur.</p>
              <div className="mt-8 md:mt-10 flex flex-wrap gap-3 md:gap-4">
                <Link to="/booking" className="btn btn-primary rounded-full text-white px-6 md:px-10 text-sm md:text-base btn-md md:btn-lg">Book Your Session</Link>
                <Link to="/portfolio" className="btn btn-outline rounded-full text-white border-white/30 hover:bg-white/10 px-6 md:px-10 text-sm md:text-base btn-md md:btn-lg">View Portfolio</Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{ delay: 1.5, repeat: Infinity, duration: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <ArrowDown className="text-white/60 size-5 md:size-6" />
        </motion.div>
      </section>

      <section className="py-16 md:py-20 lg:py-28 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
          <AnimatedSection variant="slideLeft">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800" alt="Artist" className="w-full h-[300px] md:h-[500px] object-cover rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
              </div>
              <div className="absolute -bottom-5 -right-5 md:-bottom-6 md:-right-6 w-28 h-28 md:w-40 md:h-40 rounded-2xl bg-primary/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                <div className="text-center"><p className="text-lg md:text-xl font-bold text-primary leading-tight">HD · Air Brush</p><p className="text-[10px] md:text-xs text-base-content/60">Celebrity</p></div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection variant="slideRight" className="space-y-5 md:space-y-6">
            <span className="text-primary font-display italic text-base md:text-lg tracking-wider">About Mahi Makeover</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-base-content leading-tight">Crafting Beauty,<br /><span className="text-primary">One Look at a Time</span></h2>
            <p className="text-sm md:text-base text-base-content/60 leading-relaxed">
              Led by makeup artist <strong className="text-base-content">{SITE.artist}</strong> and studio owner <strong className="text-base-content">{SITE.owner}</strong>, Mahi Makeover offers complete bridal and event makeup in Gwalior — from Haldi to reception, with HD, Air Brush, and Celebrity packages.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {[{ label: 'Bridal', sub: 'HD · Air Brush · Celebrity' }, { label: 'Engagement', sub: 'Full styling included' }, { label: 'Pre Bridal', sub: 'Complete grooming package' }, { label: 'Party & Reception', sub: 'All occasions covered' }].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-base-200"><Check className="text-primary size-4 md:size-5 shrink-0" /><div><p className="font-semibold text-sm">{item.label}</p><p className="text-xs text-base-content/50">{item.sub}</p></div></div>
              ))}
            </div>
            <ul className="timeline timeline-vertical pt-4">
              {[{ year: 'Studio', text: SITE.owner }, { year: 'Artist', text: SITE.artist }, { year: 'Location', text: 'Gwalior, MP' }, { year: 'Packages', text: 'HD · Air Brush · Celebrity' }].map((item, i) => (
                <li key={i}><div className="timeline-start timeline-box text-xs bg-primary/10 text-primary border-primary/30">{item.year}</div><div className="timeline-middle"><div className="badge badge-primary badge-sm" /></div><div className="timeline-end timeline-box text-xs bg-base-200">{item.text}</div></li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-14 md:py-16 lg:py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { value: '6+', label: 'Occasions', icon: Star },
            { value: '3', label: 'Makeup Tiers', icon: Check },
            { value: '16+', label: 'Packages', icon: Clock },
            { value: '1', label: 'Pre Bridal Pack', icon: Phone },
          ].map((stat, i) => (
            <AnimatedSection key={i} variant="scale" delay={i * 0.1}>
              <div className="stat place-items-center bg-base-100 rounded-2xl shadow-md border border-base-200 py-4 md:py-6">
                <div className="stat-figure text-primary"><stat.icon className="size-6 md:size-8" /></div>
                <div className="stat-value text-2xl md:text-4xl text-primary font-display">{stat.value}</div>
                <div className="stat-desc text-xs md:text-sm text-base-content/60">{stat.label}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section id="services" className="py-16 md:py-20 lg:py-28 bg-base-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10 md:mb-16">
            <span className="text-primary font-display italic text-base md:text-lg tracking-wider">What We Offer</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-base-content mt-3">Our Packages</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.slice(0, 3).map((s, i) => (
              <ServiceCard key={s._id} service={s} index={i} onImageClick={openLightbox} />
            ))}
          </div>
          <div className="text-center mt-10 md:mt-14">
            <Link to="/services" className="btn btn-outline rounded-full px-6 md:px-8 hover:bg-primary hover:text-white hover:border-primary transition-all text-sm md:text-base">View All Services</Link>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-16 md:py-20 lg:py-28 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10 md:mb-12">
            <span className="text-primary font-display italic text-base md:text-lg tracking-wider">Our Work</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-base-content mt-3">Portfolio</h2>
          </AnimatedSection>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {portfolio.slice(0, 6).map((item, i) => (
              <AnimatedSection key={item._id} variant="scale" delay={i * 0.05}>
                <Link to={`/portfolio`} className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer block">
                  <img src={item.images?.[0]?.url || item.image} alt={item.title} className="w-full rounded-2xl transition-all duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4 md:p-5">
                    <div><h4 className="text-white font-display text-sm md:text-lg font-semibold">{item.title}</h4><span className="badge badge-primary badge-outline badge-xs md:badge-sm mt-1 text-white border-white/50">{item.category}</span></div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 md:py-20 lg:py-28 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10 md:mb-12">
            <span className="text-primary font-display italic text-base md:text-lg tracking-wider">Kind Words</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-base-content mt-3">What Clients Say</h2>
          </AnimatedSection>
          <div className="carousel w-full max-w-3xl mx-auto rounded-2xl">
            {reviews.filter(r => r.isApproved !== false).slice(0, 5).map((r, i) => (
              <div key={r._id} id={`slide-${i}`} className="carousel-item w-full">
                <div className="w-full p-6 md:p-12 text-center space-y-4 md:space-y-6">
                  <div className="avatar"><div className="w-16 md:w-20 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100"><img src={r.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'} alt={r.name} /></div></div>
                  <div className="flex justify-center gap-1 text-yellow-400">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className={`size-4 md:size-5 ${s < r.rating ? 'fill-current' : 'opacity-30'}`} />)}</div>
                  <p className="text-base md:text-xl text-base-content/70 italic leading-relaxed">"{r.text}"</p>
                  <div><p className="font-semibold text-sm md:text-base">{r.name}</p></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {reviews.filter(r => r.isApproved !== false).slice(0, 5).map((_, i) => (
              <a key={i} href={`#slide-${i}`} className="btn btn-xs btn-circle bg-base-300 hover:bg-primary border-none"></a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-5xl mb-4">Ready for Your Makeover?</h2>
          <p className="text-base md:text-lg opacity-90 mb-6 md:mb-8">Book your bridal, engagement, or party session with Mahi Makeover today.</p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link to="/booking" className="btn bg-white text-primary hover:bg-gray-100 rounded-full px-6 md:px-10 border-none text-sm md:text-base">Book Now</Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="btn bg-[#25D366] text-white hover:bg-[#1da851] rounded-full px-6 md:px-10 border-none gap-2 text-sm md:text-base">WhatsApp</a>
          </div>
        </div>
      </section>
      {lbItems.length > 0 && (
        <Lightbox items={lbItems} index={lbIndex} onClose={() => { setLbService(null); setLbIndex(0) }} onPrev={() => setLbIndex(i => (i - 1 + lbItems.length) % lbItems.length)} onNext={() => setLbIndex(i => (i + 1) % lbItems.length)} />
      )}
    </div>
  )
}
