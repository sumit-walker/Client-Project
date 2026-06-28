import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const GAP = 16
const CARD_CLASS = 'flex-shrink-0 w-[260px] sm:w-[300px] md:w-[320px]'
const SLIDE_CLASS = '!w-[260px] sm:!w-[300px] md:!w-[320px] h-auto'

const containerClass =
  'w-full max-w-7xl mx-auto rounded-2xl bg-base-200/40 border border-base-200 overflow-hidden'

function FeedbackCard({ review, renderReview }) {
  return (
    <article className={`${CARD_CLASS} h-full`}>
      <div className="h-full rounded-xl bg-base-100/60 border border-base-200/80 shadow-sm">
        {renderReview(review)}
      </div>
    </article>
  )
}

/** Duplicate slides so Swiper loop stays seamless with few items. */
function buildMarqueeSlides(reviews) {
  if (reviews.length === 0) return []
  const minSlides = 8
  const repeats = Math.ceil(minSlides / reviews.length)
  return Array.from({ length: repeats }, () => reviews).flat()
}

export default function TestimonialShowcase({ reviews, renderReview }) {
  const containerRef = useRef(null)
  const measureRef = useRef(null)
  const [needsSwiper, setNeedsSwiper] = useState(false)

  useLayoutEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure || !reviews.length) {
      setNeedsSwiper(false)
      return
    }

    const checkOverflow = () => {
      setNeedsSwiper(measure.scrollWidth > container.clientWidth + 2)
    }

    checkOverflow()

    const observer = new ResizeObserver(checkOverflow)
    observer.observe(container)
    observer.observe(measure)

    return () => observer.disconnect()
  }, [reviews])

  const marqueeSlides = useMemo(
    () => (needsSwiper ? buildMarqueeSlides(reviews) : reviews),
    [reviews, needsSwiper],
  )

  if (!reviews.length) {
    return (
      <div className={`${containerClass} px-6 py-10 text-center`}>
        <p className="text-base-content/50 text-sm md:text-base">Be the first to share your experience!</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`${containerClass} py-4 sm:py-5 relative`}>
      {/* Hidden row used to detect horizontal overflow */}
      <div
        ref={measureRef}
        aria-hidden
        className="invisible absolute top-0 left-0 flex flex-nowrap px-4 sm:px-5"
        style={{ gap: GAP }}
      >
        {reviews.map((review) => (
          <FeedbackCard key={review._id} review={review} renderReview={renderReview} />
        ))}
      </div>

      {needsSwiper ? (
        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={GAP}
          loop
          loopAdditionalSlides={reviews.length}
          speed={8000}
          allowTouchMove
          grabCursor
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: false,
          }}
          className="testimonial-swiper testimonial-marquee px-4 sm:px-5"
        >
          {marqueeSlides.map((review, index) => (
            <SwiperSlide key={`${review._id}-${index}`} className={SLIDE_CLASS}>
              <FeedbackCard review={review} renderReview={renderReview} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div
          className="flex flex-nowrap justify-center px-4 sm:px-5"
          style={{ gap: GAP }}
        >
          {reviews.map((review) => (
            <FeedbackCard key={review._id} review={review} renderReview={renderReview} />
          ))}
        </div>
      )}
    </div>
  )
}
