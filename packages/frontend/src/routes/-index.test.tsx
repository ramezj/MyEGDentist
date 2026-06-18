// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HomePage } from '../components/home-page'

describe('HomePage', () => {
  it('renders the main promise and primary CTA', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', {
        name: /straightforward dental trips to egypt for international patients/i,
      }),
    ).toBeTruthy()

    expect(
      screen.getByRole('link', {
        name: /start your treatment plan/i,
      }),
    ).toBeTruthy()
  })
})
