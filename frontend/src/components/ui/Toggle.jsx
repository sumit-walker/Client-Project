export default function Toggle({ checked, onChange, color = 'primary', id }) {
  const onColor = color === 'success' ? 'peer-checked:bg-success' : 'peer-checked:bg-primary'

  return (
    <label htmlFor={id} className="relative inline-flex shrink-0 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <span
        className={`relative block h-6 w-11 rounded-full border border-base-content/10 bg-base-300 transition-colors duration-200 ${onColor} after:absolute after:left-[3px] after:top-1/2 after:h-[18px] after:w-[18px] after:-translate-y-1/2 after:rounded-full after:bg-white after:shadow-md after:transition-transform after:duration-200 after:content-[''] peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30`}
        aria-hidden
      />
    </label>
  )
}
