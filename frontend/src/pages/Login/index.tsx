import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [email, setEmail] = useState('aayu@student.edu')
  const [password, setPassword] = useState('password123')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      toast({ title: 'Welcome back!', message: 'Logged in successfully', type: 'success' })
      navigate('/dashboard')
    } catch {
      toast({ title: 'Error', message: 'Unable to sign in', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 m-0">Sign in to your account</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Enter your student credentials to access your OS
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="College Email"
          type="email"
          placeholder="name@student.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          Create one now
        </Link>
      </div>
    </div>
  )
}
