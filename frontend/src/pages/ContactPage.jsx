import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Phone, MessageCircle, Camera, MapPin, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import AnimatedSection from '../components/ui/AnimatedSection'
import { SITE } from '../constants/site'

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm()
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: () => api.get('/settings').then(r => r.data) })
  const [mapLoaded, setMapLoaded] = useState(false)
  const mutation = useMutation({
    mutationFn: (data) => api.post('/contacts', data),
    onSuccess: () => { toast.success('Message sent! We will get back to you soon.'); reset() },
    onError: () => toast.error('Failed to send message'),
  })

  const phone = settings?.phone || SITE.phone
  const whatsapp = settings?.whatsapp || SITE.whatsapp
  const instagram = settings?.instagram || SITE.instagram
  const email = settings?.email || SITE.email

  const contactCards = [
    { icon: Phone, title: 'Phone', value: phone, action: `tel:+${phone.replace(/\D/g, '')}`, label: 'Call Now' },
    { icon: MessageCircle, title: 'WhatsApp', value: phone, action: `https://wa.me/${whatsapp}`, label: 'Chat Now' },
    { icon: Camera, title: 'Instagram', value: `@${instagram}`, action: `https://instagram.com/${instagram}`, label: 'Follow Us' },
    { icon: Mail, title: 'Email', value: email, action: `mailto:${email}`, label: 'Email Us' },
  ]

  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-accent/50 py-24 md:py-32 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl text-base-content mb-3 md:mb-4">Contact Us</h1>
          <p className="text-base-content/70 text-sm md:text-base">Visit us in Gwalior or reach out anytime.</p>
        </div>
      </section>
      <section className="py-16 md:py-20 lg:py-24 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
            {contactCards.map((item, i) => {
              const Icon = item.icon
              return (
                <AnimatedSection key={item.title} variant="fadeUp" delay={i * 0.1}>
                  <div className="card bg-base-200 shadow-md border border-base-200 h-full">
                    <div className="card-body items-center text-center p-6 md:p-8">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4"><Icon className="size-6 text-primary" /></div>
                      <h3 className="card-title font-display text-base">{item.title}</h3>
                      <p className="text-base-content/60 text-sm break-all">{item.value}</p>
                      <a href={item.action} target={item.action.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="btn btn-primary btn-sm rounded-full mt-3 text-white">{item.label}</a>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <AnimatedSection variant="slideLeft">
              <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="bg-base-200 p-5 md:p-8 rounded-2xl shadow-md border border-base-200 space-y-4">
                <h3 className="font-display text-2xl mb-4">Send a Message</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="form-control"><span className="label-text font-medium mb-1">Name *</span><input {...register('name', { required: true })} className="input input-bordered rounded-xl" /></label>
                  <label className="form-control"><span className="label-text font-medium mb-1">Email *</span><input type="email" {...register('email', { required: true })} className="input input-bordered rounded-xl" /></label>
                </div>
                <label className="form-control"><span className="label-text font-medium mb-1">Phone</span><input {...register('phone')} className="input input-bordered rounded-xl" /></label>
                <label className="form-control"><span className="label-text font-medium mb-1">Subject</span><input {...register('subject')} className="input input-bordered rounded-xl" /></label>
                <label className="form-control"><span className="label-text font-medium mb-1">Message *</span><textarea {...register('message', { required: true })} className="textarea textarea-bordered rounded-xl" rows="4" /></label>
                <button type="submit" className="btn btn-primary btn-block rounded-full text-white" disabled={mutation.isPending}>{mutation.isPending ? 'Sending...' : 'Send Message'}</button>
              </form>
            </AnimatedSection>
            <AnimatedSection variant="slideRight">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-base-200 h-full min-h-[400px] relative bg-base-300">
                {!mapLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-base-content/30">
                    <MapPin className="size-10 animate-pulse" />
                    <span className="text-sm font-medium">Loading map...</span>
                  </div>
                )}
                <iframe src={settings?.mapUrl || ''} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Location" className={`transition-opacity duration-500 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setMapLoaded(true)} />
              </div>
              <p className="text-sm text-base-content/50 mt-4 flex items-start gap-2">
                <MapPin className="size-4 shrink-0 mt-0.5 text-primary" />
                {settings?.address || SITE.address}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
