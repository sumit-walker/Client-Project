import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const SWIPER_THRESHOLD = 3

export default function TestimonialShowcase({ reviews, renderReview }) {
  const containerClass =
    'w-full max-w-3xl mx-auto rounded-2xl bg-base-200/40 border border-base-200 overflow-hidden'

  if (!reviews.length) {
    return (
      <div className={`${containerClass} px-6 py-10 text-center`}>
        <p className="text-base-content/50 text-sm md:text-base">Be the first to share your experience!</p>
      </div>
    )
  }

  if (reviews.length < SWIPER_THRESHOLD) {
    return (
      <div className={containerClass}>
        <div className={reviews.length > 1 ? 'divide-y divide-base-200/80' : ''}>
          {reviews.map((review) => (
            <div key={review._id}>{renderReview(review)}</div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={containerClass}>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop={reviews.length > 1}
        className="testimonial-swiper"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review._id}>{renderReview(review)}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
