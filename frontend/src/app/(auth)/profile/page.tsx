'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
// import { useGetMe, useUpdateMe } from '@/hooks/useUser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { Pencil, Save } from 'lucide-react'
import { Form, useForm } from 'react-hook-form'
import { IUser } from '@/features/auth/types'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } }
}

export default function ProfilePage() {
  const router= useRouter();
  const { register, handleSubmit, formState: {errors}, setValue, reset} = useForm<IUser>()
  const { user, logout } = useAuthStore()
  // const { mutate: updateMeWithFile, isPending: isPendingFile } = useUpdateMeWithFile()

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    reset({
      email: user?.email,
      name: user?.name,
      gender: user?.gender,
      phoneNumber: user?.phoneNumber
    })
  }, [user, reset])

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const initials = (user?.name || 'User')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

    // const onSubmit = (data: IUpdateMe) =>{
    //   updateMe(data)
    // }

    const handelLogout = async() => {
      await logout();
      router.push("/");
      toast.success("Logout Successfully")
    }

  return (
    <div className="relative min-h-[93vh] w-screen overflow-hidden">
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-indigo-600/20 via-fuchsia-500/10 to-emerald-500/20" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="mx-auto flex h-full max-w-4xl items-center justify-center px-4 py-10">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="w-full"
        >
          <motion.div variants={item} className="mx-auto mb-6 w-full max-w-xl text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Your Profile</h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">Manage your personal information and account settings</p>
          </motion.div>

          <motion.div variants={item} className="mx-auto w-full max-w-xl">
            <Card className="border-border/60 bg-card/80 backdrop-blur-md">
              <CardHeader className="flex flex-col items-center gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="relative">
                  <label className="group block cursor-pointer">
                    <Avatar className="h-60 w-60 ring-2 ring-primary/20 transition-transform overflow-hidden">
                      {avatarPreview ? (
                        <AvatarImage src={avatarPreview} alt="Preview" className={`object-cover transition-transform duration-300 ${isEditing ? 'group-hover:scale-105' : ''}`} />
                      ) : user?.profilePicture ? (
                        <AvatarImage src={user.profilePicture} alt={user.name} className={`object-cover transition-transform duration-300 ${isEditing ? 'group-hover:scale-105' : ''}`} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                      )}
                    </Avatar>
                    {isEditing && (
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          setAvatarFile(file)
                          if (avatarPreview) URL.revokeObjectURL(avatarPreview)
                          setAvatarPreview(file ? URL.createObjectURL(file) : null)
                        // setValue("profilePicture", file);
                        }}
                      />
                    )}
                  </label>
                </motion.div>
                <div className="grid gap-1 text-center sm:text-left">
                  <CardTitle className="text-2xl font-semibold">{user?.name || 'User'}</CardTitle>
                  <span className="text-sm text-muted-foreground">{user?.email}</span>
                </div>
              </CardHeader>

              <CardContent>
                {/* {isLoading ? (
                  <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">Loading profile...</div>
                ) : isError ? (
                  <div className="space-y-3">
                    <p className="text-sm text-red-500">{error instanceof Error ? error.message : 'Failed to load profile.'}</p>
                    <Button onClick={() => logout()} variant="destructive" className="w-full sm:w-auto">Logout</Button>
                  </div>
                ) : ( */}
                  <form >
                    <motion.div variants={item} className="rounded-lg border border-border/60 bg-background/50 p-3">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Name</div>
                      {isEditing ? (
                        <Input className="mt-2" {...register('name')} />
                      ) : (
                        <div className="mt-1 text-sm">{user?.name}</div>
                      )}
                    </motion.div>
                    <motion.div variants={item} className="rounded-lg border border-border/60 bg-background/50 p-3">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Email</div>
                      <div className="mt-1 text-sm">{user?.email}</div>
                    </motion.div>
                    <motion.div variants={item} className="rounded-lg border border-border/60 bg-background/50 p-3">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Phone</div>
                      {isEditing ? (
                        <Input className="mt-2" {...register('phoneNumber')} />
                      ) : (
                        <div className="mt-1 text-sm">{user?.phoneNumber || '-'}</div>
                      )}
                    </motion.div>
                    <motion.div variants={item} className="rounded-lg border border-border/60 bg-background/50 p-3">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Role</div>
                      <div className="mt-1 text-sm capitalize">{user?.role}</div>
                    </motion.div>
                    <motion.div variants={item} className="rounded-lg border border-border/60 bg-background/50 p-3">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Gender</div>
                      {isEditing ? (
                        <div className="mt-2 flex gap-3">
                          {(['male','female','other'] as const).map((g) => (
                            <button
                              key={g}
                              type="button"
                              {...register("gender")}
                              className={`rounded-md border px-3 py-1 text-sm capitalize transition-colors ${user?.gender === g ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-1 text-sm capitalize">{user?.gender}</div>
                      )}
                    </motion.div>

                    <motion.div variants={item} className="sm:col-span-2 mt-2 flex justify-between gap-3">
                      <Button
                        type="button"
                        variant={isEditing ? 'default' : 'ghost'}
                        onClick={() => {
                          setIsEditing(!isEditing)
                        }}
                        className="flex items-center gap-2"
                        // disabled={isPending}
                      >
                        {isEditing ? (<><Save className="h-4 w-4" /><span>Save</span></>) : (<><Pencil className="h-4 w-4" /><span>Edit</span></>)}
                      </Button>
                      <Button type="button" variant="destructive" onClick={handelLogout}>Logout</Button>
                    </motion.div>
                  </form>
                {/* )} */}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

