import { createFileRoute } from '@tanstack/react-router'

import { HomeLanding } from '../components/home-landing'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'My EG Dentist | Dental Travel to Egypt',
      },
      {
        name: 'description',
        content:
          'A simple starting point for international patients planning dental treatment and travel in Egypt.',
      },
    ],
  }),
  component: Home,
})

function Home() {
  return <HomeLanding />
}
