// @vitest-environment jsdom

import { QueryClient } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { Route } from './index'
import { routeTree } from '../routeTree.gen'

async function renderHomePage() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
    context: {
      queryClient: new QueryClient(),
    },
    defaultPendingMs: 0,
  })

  await router.load()
  const view = render(<RouterProvider router={router} />)

  return { router, view }
}

describe('home landing page', () => {
  beforeAll(() => {
    window.scrollTo = vi.fn()
  })

  it('renders the core landing page message', async () => {
    const { view } = await renderHomePage()

    expect(
      await screen.findByRole('heading', {
        name: 'Simple dental care planning in Egypt.',
      }),
    ).toBeTruthy()
    expect(
      screen.getByText('Dental tourism for international visitors'),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Start your plan' })).toBeTruthy()

    view.unmount()
  })

  it('sets landing page metadata', () => {
    const head = Route.options.head?.()
    const meta = head?.meta ?? []

    expect(meta).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'My EG Dentist | Dental Care in Egypt',
        }),
        expect.objectContaining({
          name: 'description',
        }),
      ]),
    )
  })
})
