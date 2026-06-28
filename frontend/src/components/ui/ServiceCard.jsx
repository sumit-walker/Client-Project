import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

function ImageSlider({ images, name, onImageClick }) {
  const hasMultiple = images?.length > 1

  if (hasMultiple) {
    return (
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop={true}
        className="w-full h-full service-swiper"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img.url}
              alt={`${name} ${idx + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onImageClick(idx)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    )
  }

  const src = images?.[0]?.url || 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800'
  return (
    <img
      src={src}
      alt={name}
      className="w-full h-full object-cover cursor-pointer"
      onClick={() => onImageClick(0)}
    />
  )
}

function PriceBadge({ price }) {
  return (
    <span className="badge badge-primary badge-lg rounded-full font-bold px-3 py-3 text-sm">
      &#8377;{price?.toLocaleString()}
    </span>
  )
}

function FeatureList({ features }) {
  const [expanded, setExpanded] = useState(false)
  const maxVisible = 4
  const hasMore = features?.length > maxVisible
  const visible = expanded ? features : features?.slice(0, maxVisible)
  const extra = features?.length - maxVisible

  if (!features?.length) return null

  return (
    <div className="space-y-1.5">
      {visible.map(f => (
        <div key={f} className="flex items-start gap-2">
          <Check className="size-4 text-primary shrink-0 mt-0.5" />
          <span className="text-sm text-base-content/70">{f}</span>
        </div>
      ))}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-primary font-medium pl-6 hover:underline transition-colors"
        >
          {expanded ? (
            <><Minus className="size-3" /> Show less</>
          ) : (
            <><Plus className="size-3" /> {extra} more</>
          )}
        </button>
      )}
    </div>
  )
}

function BookButton({ serviceName }) {
  return (
    <Link
      to={`/booking?service=${encodeURIComponent(serviceName)}`}
      className="btn btn-sm md:btn-md bg-gradient-to-r from-primary to-secondary text-base-100 rounded-xl w-full border-none hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 gap-1.5 font-semibold"
    >
      Book Now
    </Link>
  )
}

export default function ServiceCard({ service, index = 0, onImageClick }) {
  const handleImageClick = (imgIdx) => {
    if (onImageClick) onImageClick(service, imgIdx)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="flex flex-col bg-base-100 rounded-2xl overflow-hidden border border-base-200 shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div className="relative aspect-[4/3] md:aspect-video overflow-hidden bg-base-300">
        <ImageSlider images={service.images} name={service.name} onImageClick={handleImageClick} />
      </div>

      <div className="flex flex-col flex-1 px-6 py-5 gap-3">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-base-content line-clamp-2">{service.name}</h3>
          <PriceBadge price={service.price} />
        </div>

        {service.description && (
          <p className="text-sm text-base-content/60 leading-relaxed line-clamp-3">{service.description}</p>
        )}

        <FeatureList features={service.features} />

        <div className="mt-auto pt-2">
          <BookButton serviceName={service.name} />
        </div>
      </div>
    </motion.div>
  )
}