import { useForm } from 'react-hook-form'
import { useSearchParams, Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CheckCircle, MessageCircle, Phone, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { timeSlots } from '../utils/helpers'
import AnimatedSection from '../components/ui/AnimatedSection'
import { SITE } from '../constants/site'

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: () => api.get('/services').then(r => r.data) })

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: { service: searchParams.get('service') || '', eventDate: new Date().toISOString().split('T')[0], time: '' }
  })

  const selectedService = services.find(s => s.name === watch('service'))
  const price = selectedService?.price || 0

  const mutation = useMutation({
    mutationFn: (data) => api.post('/bookings', data),
    onSuccess: () => { toast.success('Booking submitted! We will confirm within 24 hours.'); reset() },
    onError: () => toast.error('Failed to submit booking'),
  })

  const onSubmit = (data) => mutation.mutate(data)

  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-accent/50 py-24 md:py-32 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl text-base-content mb-3 md:mb-4">Book an Appointment</h1>
          <p className="text-base-content/70 text-sm md:text-base">Secure your session with us.</p>
        </div>
      </section>
      <section className="py-16 md:py-20 lg:py-24 bg-base-100">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-5 gap-6 md:gap-8">
          <AnimatedSection variant="slideLeft" className="md:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-base-200 rounded-2xl shadow-xl p-5 md:p-8 space-y-4 md:space-y-5 border border-base-200">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="form-control"><span className="label-text font-medium mb-1">Name *</span><input {...register('name', { required: true })} className="input input-bordered rounded-xl" /></label>
                <label className="form-control"><span className="label-text font-medium mb-1">Phone *</span><input {...register('phone', { required: true })} className="input input-bordered rounded-xl" /></label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="form-control"><span className="label-text font-medium mb-1">Email *</span><input type="email" {...register('email', { required: true })} className="input input-bordered rounded-xl" /></label>
                <label className="form-control"><span className="label-text font-medium mb-1">Service *</span>
                  <select {...register('service', { required: true })} className="select select-bordered rounded-xl">
                    <option value="">Select</option>
                    {services.map(s => <option key={s._id} value={s.name}>{s.name} - ₹{s.price}</option>)}
                  </select>
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="form-control"><span className="label-text font-medium mb-1">Date *</span><input type="date" {...register('eventDate', { required: true })} className="input input-bordered rounded-xl" /></label>
                <label className="form-control"><span className="label-text font-medium mb-1">Location</span><input {...register('eventLocation')} className="input input-bordered rounded-xl" placeholder="Event location" /></label>
              </div>
              <label className="form-control">
                <span className="label-text font-medium mb-1">Time</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {timeSlots.map(t => (
                    <div key={t} onClick={() => setValue('time', t)} className={`text-center py-2 px-1 rounded-xl text-xs cursor-pointer border transition-all ${watch('time') === t ? 'bg-primary text-white border-primary' : 'border-base-200 hover:border-primary bg-base-100'}`}>{t}</div>
                  ))}
                </div>
              </label>
              <label className="form-control"><span className="label-text font-medium mb-1">Notes</span><textarea {...register('notes')} className="textarea textarea-bordered rounded-xl" rows="3" /></label>
              <div className="flex justify-between items-center p-4 bg-base-100 rounded-xl">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">₹{price.toLocaleString()}</span>
              </div>
              <button type="submit" className="btn btn-primary btn-block rounded-full text-white text-base" disabled={mutation.isPending}>{mutation.isPending ? 'Submitting...' : 'Confirm Booking'}</button>
            </form>
          </AnimatedSection>
          <AnimatedSection variant="slideRight" className="md:col-span-2 space-y-4">
            <div className="bg-base-200 rounded-2xl shadow-md p-6 border border-base-200">
              <h3 className="font-display text-xl font-semibold mb-4">Booking Info</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><CheckCircle className="size-5 text-primary mt-0.5 shrink-0" /><span>HD, Air Brush & Celebrity tiers available</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="size-5 text-primary mt-0.5 shrink-0" /><span>20% advance to confirm booking</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="size-5 text-primary mt-0.5 shrink-0" /><span>Studio located in Gwalior</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="size-5 text-primary mt-0.5 shrink-0" /><span>Confirmation within 24 hrs</span></li>
              </ul>
            </div>
            <div className="bg-base-200 rounded-2xl shadow-md p-6 border border-base-200">
              <h3 className="font-display text-xl font-semibold mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm rounded-full w-full gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"><MessageCircle className="size-4" /> WhatsApp</a>
                <a href={`tel:+${SITE.phoneTel}`} className="btn btn-outline btn-sm rounded-full w-full gap-2"><Phone className="size-4" /> Call Now</a>
                <Link to="/contact" className="btn btn-outline btn-sm rounded-full w-full gap-2"><Mail className="size-4" /> Email Us</Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
