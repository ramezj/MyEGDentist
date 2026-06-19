import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authClient } from '#/lib/auth-client'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

const signInSchema = z.object({
  email: z.email({ error: 'Invalid email' }),
  password: z.string().min(1, 'Password is required'),
})

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email({ error: 'Invalid email' }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type SignInValues = z.infer<typeof signInSchema>
type SignUpValues = z.infer<typeof signUpSchema>

function SignInForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) })

  async function onSubmit(values: SignInValues) {
    const { error } = await authClient.signIn.email(values)
    if (error) {
      setError('root', { message: error.message ?? 'Sign in failed' })
      return
    }
    router.navigate({ to: '/' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      {errors.root && <p className="text-sm text-center text-destructive">{errors.root.message}</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}

function SignUpForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) })

  async function onSubmit(values: SignUpValues) {
    const { error } = await authClient.signUp.email(values)
    if (error) {
      setError('root', { message: error.message ?? 'Sign up failed' })
      return
    }
    router.navigate({ to: '/' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-name">Full name</Label>
        <Input
          id="signup-name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      {errors.root && <p className="text-sm text-center text-destructive">{errors.root.message}</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}

function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">MyEGDentist</CardTitle>
          <CardDescription>
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex rounded-md overflow-hidden border">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign up
            </button>
          </div>
          {mode === 'signin' ? <SignInForm /> : <SignUpForm />}
        </CardContent>
      </Card>
    </div>
  )
}
