import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/home-page'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'My EG Dentist | Dental Care Trips to Egypt',
      },
      {
        name: 'description',
        content:
          'A simple way for international patients to arrange dental treatment, travel support, and aftercare in Egypt.',
      },
    ],
  }),
  component: HomePage,
})
