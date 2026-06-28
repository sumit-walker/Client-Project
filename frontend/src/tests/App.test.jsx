import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '../context/ThemeContext'
import { AuthProvider } from '../context/AuthContext'
import App from '../App'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

function renderApp(route = '/') {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('App Routing', () => {
  it('renders home page at /', () => {
    renderApp('/')
    expect(screen.getAllByText(/mahi|Home/i).length).toBeGreaterThan(0)
  })
})
