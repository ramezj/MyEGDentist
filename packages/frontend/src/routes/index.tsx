import { createFileRoute } from '@tanstack/react-router'
import { HomeLanding } from '../components/home-landing'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'My EG Dentist | Dental care in Egypt made simple',
      },
      {
        name: 'description',
        content:
          'My EG Dentist helps international patients plan dental treatment trips to Egypt with clear travel and clinic guidance.',
      },
    ],
  }),
  component: HomeLanding,
})
