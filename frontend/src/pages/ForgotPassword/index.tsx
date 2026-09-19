import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export const ForgotPasswordPage: React.FC = () => {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      toast({
        title: 'Reset link sent',
        message: `Recovery instructions dispatched to ${email}`,
        type: 'info',
      })
    }, 600)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 m-0">Reset your password</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Enter your registered student email address
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-3">
          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
          <div>
            <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              Check your inbox
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
              We sent a recovery email to <strong>{email}</strong>.
            </p>
          </div>
          <Link to="/login" className="inline-block text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
            Return to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="College Email"
            type="email"
            placeholder="name@student.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send Reset Link
          </Button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
