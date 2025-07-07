import React, { ChangeEvent, FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

interface FormData {
  username: string
  password: string
}

interface Errors {
  username?: string
  password?: string
}

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

const LoginForm: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateForm = (): boolean => {
    try {
      schema.parse(formData)
      setErrors({})
      return true
    } catch (err) {
      const zodErrors = err as z.ZodError<FormData>
      const fieldErrors: Errors = {}
      zodErrors.errors.forEach((error) => {
        if (error.path.length > 0) {
          const fieldName = error.path[0] as keyof FormData
          fieldErrors[fieldName] = error.message
        }
      })
      setErrors(fieldErrors)
      return false
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
        callbackUrl: '/',
      })

      if (!response?.ok) {
        throw new Error('Login failed')
      }

      // Redirect to home page upon successful login
      await router.push(response.url || '/')
    } catch (error) {
      setSubmitError('Failed to login. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 text-left">
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
        </div>

        <div className="space-y-2 text-left">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        {submitError && (
          <div className="text-sm text-red-500 text-left">{submitError}</div>
        )}

        <button
          type="submit"
          className={`w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default LoginForm
