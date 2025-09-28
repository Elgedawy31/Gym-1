'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { signinSchema } from '@/lib/validations/authSchema'
import type { LoginFormValues } from '@/types/authType'
import { useLogin } from '@/hooks/useAuth'
import { Loader } from 'lucide-react'


export default function SigninPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(signinSchema)
  })
  const [showPassword, setShowPassword] = useState(false)

  const { mutate, isPending } = useLogin()


  const onSubmit = (data: LoginFormValues) => {
    console.log('Sign in:', data)
    mutate(data);
  }

  return (
    <div className="min-h-[84vh] w-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="w-full rounded-2xl shadow-xl p-6">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription>Welcome back! Please enter your details.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-2 my-auto text-sm text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isPending ?<><Loader /> "Login..." </> : "Login"}
                </Button>
              </motion.div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">Sign Up</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


