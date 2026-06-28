import { Link } from 'react-router-dom'
import { Heart, Camera, Mail, Phone, MapPin } from 'lucide-react'
import { SITE } from '../../constants/site'

export default function Footer() {
  return (
    <footer className="bg-base-300 border-t border-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="font-display text-xl font-bold">
              <span className="text-primary">Mahi</span><span className="text-base-content"> Makeover</span>
            </Link>
            <p className="mt-3 text-sm text-base-content/60 leading-relaxed">
              {SITE.tagline}
            </p>
            <div className="flex gap-3 mt-4">
              <a href={`https://instagram.com/${SITE.instagram}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm btn-circle">
                <Camera className="size-4" />
              </a>
              <a href={`mailto:${SITE.email}`} className="btn btn-ghost btn-sm btn-circle">
                <Mail className="size-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-base-content/60">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link></li>
              <li><Link to="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link></li>
              <li><Link to="/booking" className="hover:text-primary transition-colors">Book Now</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-base-content/60">
              <li>Bridal Makeup</li>
              <li>Engagement Makeup</li>
              <li>Reception Makeup</li>
              <li>Haldi Makeup</li>
              <li>Pre Bridal Package</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-base-content/60">
              <li className="flex items-center gap-2"><Phone className="size-3.5 shrink-0" /> {SITE.phone}</li>
              <li className="flex items-center gap-2"><Mail className="size-3.5 shrink-0" /> {SITE.email}</li>
              <li className="flex items-start gap-2"><MapPin className="size-3.5 shrink-0 mt-0.5" /> {SITE.address}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-base-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-base-content/40">
          <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">Made with <Heart className="size-3 text-primary fill-current" /> for beautiful brides</p>
        </div>
      </div>
    </footer>
  )
}
