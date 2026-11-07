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
    <div className="grid w-full flex-1 lg:grid-cols-[minmax(0,1fr)_30rem]">
      <section className="relative flex min-h-[46svh] flex-col justify-end overflow-hidden p-8 lg:min-h-svh lg:p-14">
        <div className="bloom" aria-hidden="true" />
        <EmberField count={36} />
        <div className="relative animate-fade-up">
          <h1 className="flex max-w-none items-center gap-[0.12em] font-display text-[clamp(5rem,16vw,13rem)] font-medium leading-[0.85] tracking-[-0.04em] text-accent">
            <img src="/ember-mark.svg" alt="" width={120} height={120} className="-ml-[0.27em] -mr-[0.14em] size-[1.05em] shrink-0" />
            Ember
          </h1>
          <p className="mt-6 max-w-sm text-base text-bone-dim">The content manager for artists.</p>
        </div>
      </section>

      <section className="flex items-center border-t border-hairline bg-sidebar px-8 py-14 lg:border-l lg:border-t-0 lg:px-12">
        <div className="mx-auto w-full max-w-sm animate-fade-up">
          <h2 className="mb-1 font-display text-3xl text-bone">Sign in</h2>
          <p className="mb-8 text-sm text-fog">Access your Ember account.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Field label="Username" error={errors.username?.message}>
              <Input autoComplete="username" hasError={Boolean(errors.username)} {...register('username')} />
            </Field>
            <Field label="Password" error={errors.password?.message}>
              <Input
                type="password"
                autoComplete="current-password"
                hasError={Boolean(errors.password)}
                {...register('password')}
              />
            </Field>

            {serverError && <p className="text-sm text-danger">{serverError}</p>}

            <Button type="submit" loading={submitting} className="mt-2 min-h-11 w-full">
              Sign in
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
