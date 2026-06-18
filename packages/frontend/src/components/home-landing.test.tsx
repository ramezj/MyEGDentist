// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HomeLanding } from './home-landing'

describe('HomeLanding', () => {
  it('renders the core landing page content', () => {
    render(<HomeLanding />)

    expect(
      screen.getByRole('heading', {
        name: 'A simple way to plan dental care in Egypt.',
      }),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Plan my visit' })).toBeTruthy()
    expect(
      screen.getByRole('heading', {
        name: 'Three calm steps from first message to arrival.',
      }),
    ).toBeTruthy()
  })
})
