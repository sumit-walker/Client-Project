import { Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import AnimatedSection from '../components/ui/AnimatedSection'

export default function TestimonialsPage() {
  const { data: reviews = [], isLoading } = useQuery({ queryKey: ['reviews'], queryFn: () => api.get('/reviews').then(r => r.data) })
  const approved = reviews.filter(r => r.isApproved !== false)
  const avgRating = approved.length ? (approved.reduce((a, r) => a + r.rating, 0) / approved.length).toFixed(1) : 0

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>

  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-accent/50 py-24 md:py-32 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl text-base-content mb-3 md:mb-4">Testimonials</h1>
          <p className="text-base-content/70 max-w-xl mx-auto text-sm md:text-base">Real words from our happy clients.</p>
        </div>
      </section>
      <section className="py-16 md:py-20 lg:py-24 bg-base-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-6xl text-yellow-400 mb-2"><Star className="inline fill-current" /> {avgRating}</div>
            <p className="text-lg text-base-content/60">Based on {approved.length} reviews</p>
          </div>
          <div className="space-y-6">
            {approved.map((r, i) => (
              <AnimatedSection key={r._id} variant="fadeUp" delay={i * 0.05}>
                <div className="bg-base-200 p-8 rounded-2xl shadow-sm border border-base-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      {r.image ? (
                        <div className="w-14 rounded-full ring-2 ring-primary/20"><img src={r.image} alt={r.name} /></div>
                      ) : (
                        <div className="w-14 rounded-full ring-2 ring-primary/20 bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                          {r.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{r.name}</h4>
                      <div className="flex text-yellow-400">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className={`size-4 ${s < r.rating ? 'fill-current' : 'opacity-30'}`} />)}</div>
                    </div>
                  </div>
                  <p className="text-base-content/60 italic leading-relaxed">"{r.text}"</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
