import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { apiClient } from '#/lib/api-client'

export const Route = createFileRoute('/dentist-signup')({
  component: DentistSignupPage,
})

function DentistSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await apiClient.dentists.signup.$post({ json: { name, email, password } })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError((data as { message?: string }).message ?? 'Sign up failed')
      setLoading(false)
      return
    }

    setLoading(false)
    router.navigate({ to: '/' })
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Register as a Dentist</h1>
          <p className="text-muted-foreground">
            Create your dentist account to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <Input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="text-sm text-center text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating your account…' : 'Create Dentist Account'}
          </Button>
        </form>
      </div>
    </main>
  )
}
