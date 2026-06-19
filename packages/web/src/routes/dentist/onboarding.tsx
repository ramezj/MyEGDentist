import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dentist/onboarding')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dentist/onboarding"!</div>
}
