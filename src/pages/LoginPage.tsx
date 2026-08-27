import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { useAuthRole } from '../hooks/useAuthRole'
import { Button } from '../components/ui/Button'
import { Field, Input } from '../components/ui/Field'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { errorMessage } from '../lib/errors'
import { EmberField } from '../components/effects/EmberField'

const loginSchema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
})
type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useAuthStore((s) => s.token)
  const setToken = useAuthStore((s) => s.setToken)
  const { role, isLoading: roleLoading } = useAuthRole()
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  // Already signed in — skip the login screen and go straight to the
  // right area instead of asking for credentials again.
  useEffect(() => {
    if (!token || roleLoading) return
    const from = (location.state as { from?: Location })?.from?.pathname
    if (role === 'admin') navigate(from ?? '/admin', { replace: true })
    else navigate(from ?? '/dashboard', { replace: true })
  }, [token, role, roleLoading, navigate, location.state])

  const onSubmit = async (data: LoginForm) => {
    setServerError(null)
    setSubmitting(true)
    try {
      const tokenResponse = await login(data.username, data.password)
      setToken(tokenResponse.access_token)
    } catch (error) {
      setServerError(errorMessage(error))
      setSubmitting(false)
    }
  }

  if (token) return <Spinner label="Signing you in…" />

  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden px-6 py-20">
      <div
        className="pointer-events-none absolute bottom-[-10%] left-1/2 h-[55vh] w-[70vw] max-w-160 -translate-x-1/2 rounded-full bg-accent-strong/25 blur-[110px]"
        style={{ animation: 'ember-pulse 6s ease-in-out infinite' }}
        aria-hidden="true"
      />
      <EmberField count={36} />

      <div className="relative mx-auto flex w-full max-w-sm flex-col items-center">
        <div className="animate-fade-up mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-fog">Welcome to</p>
          <h1 className="font-display text-4xl text-bone">
            <span className="text-gradient">Ember</span>
          </h1>
        </div>

        <Card className="w-full animate-fade-up p-8">
          <h2 className="mb-1 font-display text-2xl text-bone">Sign in</h2>
          <p className="mb-6 text-sm text-fog">Access your Ember account.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Field label="Username" error={errors.username?.message}>
              <Input
                autoFocus
                autoComplete="username"
                hasError={Boolean(errors.username)}
                {...register('username')}
              />
            </Field>
            <Field label="Password" error={errors.password?.message}>
              <Input
                type="password"
                autoComplete="current-password"
                hasError={Boolean(errors.password)}
                {...register('password')}
              />
            </Field>

            {serverError && <p className="text-sm text-red-300/90">{serverError}</p>}

            <Button type="submit" loading={submitting} className="mt-2 w-full">
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
