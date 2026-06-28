import daisyui from 'daisyui'

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#d4a574',
          'primary-content': '#ffffff',
          secondary: '#f5e6d3',
          'secondary-content': '#3d2b1f',
          accent: '#e8d5c4',
          'accent-content': '#3d2b1f',
          neutral: '#3d2b1f',
          'neutral-content': '#faf6f0',
          'base-100': '#faf6f0',
          'base-200': '#f5ede4',
          'base-300': '#ede0d3',
          'base-content': '#3d2b1f',
          info: '#d4a574',
          success: '#a8c5a0',
          warning: '#e8c9a0',
          error: '#d48585',
          '--rounded-box': '1rem',
          '--rounded-btn': '2rem',
          '--rounded-badge': '2rem',
        },
      },
      {
        dark: {
          primary: '#d4a574',
          'primary-content': '#ffffff',
          secondary: '#2a1f18',
          'secondary-content': '#f5e6d3',
          accent: '#c9a96e',
          'accent-content': '#0a0a0a',
          neutral: '#f5e6d3',
          'neutral-content': '#1a1a1a',
          'base-100': '#0a0a0a',
          'base-200': '#1a1a1a',
          'base-300': '#2a2a2a',
          'base-content': '#f5e6d3',
          info: '#d4a574',
          success: '#8bb87a',
          warning: '#d4a574',
          error: '#d48585',
          '--rounded-box': '1rem',
          '--rounded-btn': '2rem',
          '--rounded-badge': '2rem',
        },
      },
    ],
  },
}
