import '@testing-library/jest-dom'

class MockIntersectionObserver {
  constructor() { this.observe = () => {}; this.disconnect = () => {}; this.unobserve = () => {} }
}
window.IntersectionObserver = MockIntersectionObserver

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})
