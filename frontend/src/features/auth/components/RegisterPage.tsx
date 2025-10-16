'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Image, Loader } from 'lucide-react';
import Link from 'next/link';
import { RegisterFormValues } from '@/features/auth/types/types';
import toast from 'react-hot-toast';
import { authAction } from '../hooks/actions';
import { API_CONFIG } from '@/config/api';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterFormValues>();
  const { setUser, setToken } = useAuthStore()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('profilePicture', file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async(data: RegisterFormValues) => {
    setIsPending(true);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("gender", data.gender);
    if (data.profilePicture instanceof File) {
      formData.append("profilePicture", data.profilePicture);
    }

    try {
      const res = await authAction(formData, API_CONFIG.ENDPOINTS.AUTH.REGISTER)
      if (res.data.token) {
        setUser(res.user);
        setToken(res.data.token);
        router.push("/");
        toast.success("Register successful!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }


  };

  return (
    <div className="min-h-[84vh] w-screen flex items-center justify-center mt-12 p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="w-full rounded-2xl shadow-xl p-6">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Register</CardTitle>
            <CardDescription>Create your account to get started.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Profile Picture */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Label htmlFor="profile-pic" className="text-sm font-medium">Profile Picture</Label>
                <div className="flex flex-col items-center space-y-2 mt-2">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full border-2 border-border flex items-center justify-center bg-muted">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Profile preview"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm">No image</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleImageClick}
                      className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                    >
                      <Image className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {errors.profilePicture && (
                    <p className="text-sm text-red-500">{errors.profilePicture.message}</p>
                  )}
                </div>
              </motion.div>

              {/* Name */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Label htmlFor="name" className="text-sm font-medium mb-1">Name</Label>
                <Input id="name" placeholder="Enter your name" {...register('name')} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </motion.div>

              {/* Email */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Label htmlFor="email" className="text-sm font-medium mb-1">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Label htmlFor="password" className="text-sm font-medium mb-1">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" {...register('password')} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </motion.div>

              {/* Phone Number */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Label htmlFor="phone" className="text-sm font-medium mb-1">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter your phone number" {...register('phoneNumber')} />
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
              </motion.div>

             {/* Gender + Animation */}
            <div className="flex items-center gap-4 relative">
              <div className="flex-1">
                <Label className='mb-1'>Gender</Label>
                <Select onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
              </div>

              {/* Animated balls */}
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-black"
                    animate={{ opacity: [0, 1, 0], y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </div>

              {/* Submit Button */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <Button type="submit" className="w-full">
                  {isPending ?<><Loader className='animate-spin'/> Register... </> : "Register"}
                  </Button>
              </motion.div>

              {/* Submit Button */}
              <div className="block text-center w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <Link href="/login" className=" ">Do you have an account? <span className='text-blue-600 hover:text-blue-500'>Signin</span></Link>
                </motion.div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
