import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export const RegisterPage: React.FC = () => {
  const { register } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({ title: 'Validation Error', message: 'Passwords do not match', type: 'error' })
      return
    }

    setIsLoading(true)
    try {
      await register(name, email, password)
      toast({ title: 'Account Created', message: 'Welcome to Student Life OS!', type: 'success' })
      navigate('/dashboard')
    } catch {
      toast({ title: 'Error', message: 'Registration failed', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 m-0">Create your account</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Set up your college workspace in seconds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Aayu Makadia"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="College Email"
          type="email"
          placeholder="name@student.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
