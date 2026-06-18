// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HomeLanding } from './home-landing'

describe('Home landing page', () => {
  it('renders the core landing page message', () => {
    render(<HomeLanding />)

    expect(
      screen.getByRole('heading', {
        name: 'Simple dental trips to Egypt, planned with clarity.',
      }),
    ).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'Request information' }),
    ).toBeTruthy()
    expect(screen.getByText('Tell us your case')).toBeTruthy()
  })
})
