// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { HomePage } from './home-page'

afterEach(() => {
  cleanup()
})

describe('HomePage', () => {
  it('renders the main promise and travel steps', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /dental care in egypt, made easy for international patients/i,
      }),
    ).toBeDefined()

    expect(
      screen.getByRole('link', { name: /request a consultation/i }),
    ).toBeDefined()

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /quality treatment, practical travel, and one clear point of contact/i,
      }),
    ).toBeDefined()

    expect(screen.getByText(/step 1/i)).toBeDefined()
    expect(screen.getByText(/step 2/i)).toBeDefined()
    expect(screen.getByText(/step 3/i)).toBeDefined()
  })
})
