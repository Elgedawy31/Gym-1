'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useAuthStore } from '../store/authStore'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { authAction } from '../hooks/actions'
import { LoginFormValues } from '../types/types'
import { API_CONFIG } from '@/config/api'


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { setUser, setToken } = useAuthStore((state) => state);

  const onSubmit = async (values: LoginFormValues) => {
    setIsPending(true);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const res = await authAction(formData, API_CONFIG.ENDPOINTS.AUTH.LOGIN);
      if (res.data.token) {
        setUser(res.data.user);
        setToken(res.data.token);
        router.push("/");
        toast.success("Login successful!"); // Using a generic success message for now, can be internationalized later
      } else {
        toast.error(res.message || "Something went wrong during login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

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
            <CardTitle className="text-3xl font-bold">Login</CardTitle>
            <CardDescription>Welcome back! Please enter your details.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form className="space-y-4"  onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email, password });
        }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-2 my-auto text-sm text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Button type="submit" className="w-full" >
                {isPending ?<><Loader className='animate-spin'/> Login... </> : "Login"}
                </Button>
              </motion.div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-primary hover:underline">Register</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


