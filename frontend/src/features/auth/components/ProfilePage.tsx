"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { getProfile } from '../hooks/actions';
import { updateMeService } from '../services/userService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { type IUser, type IUpdateMe, ProfileFormValues, profileSchema } from '../types/types';
import { 
  Camera, 
  Edit3, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Settings,
  CheckCircle,
  XCircle,
  Upload,
  UserCheck,
  Activity,
  ShoppingBag,
  Dumbbell
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { LogOut } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';



export default function ProfilePage() {
  const { user, setUser, token, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      gender: 'male',
    },
  });
  const { register, handleSubmit, reset, formState: { errors } } = form;

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      // If no token, no fetch is needed
      if (!token) {
        setIsFetchingProfile(false);
        return;
      }

      if (!user && token) {
        setIsFetchingProfile(true);
        try {
          const { user: userData } = await getProfile();
          if (userData) {
            setUser(userData);
            reset({
              name: userData.name,
              email: userData.email,
              phoneNumber: userData.phoneNumber || '',
              gender: userData.gender,
            });
          }
        } catch (error) {
          console.error('Failed to load user data:', error);
          toast.error('Failed to load profile data');
        } finally {
          setIsFetchingProfile(false);
        }
      } else if (user) {
        reset({
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber || '',
          gender: user.gender,
        });
        setIsFetchingProfile(false);
      }
    };

    loadUserData();
  }, [user, token, setUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // Create FormData for file upload
      const updateData = new FormData();
      updateData.append('name', values.name || '');
      updateData.append('email', values.email || '');
      updateData.append('phoneNumber', values.phoneNumber || '');
      updateData.append('gender', values.gender || 'male');
      
      if (profileImage) {
        updateData.append('profilePicture', profileImage);
      }

      const updatedUser = await updateMeService(updateData);
      setUser(updatedUser);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setProfileImage(null);
      setPreviewImage(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        gender: user.gender,
      });
    }
    setIsEditing(false);
    setProfileImage(null);
    setPreviewImage(null);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'trainer':
        return 'default';
      case 'member':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male':
        return '♂';
      case 'female':
        return '♀';
      default:
        return '⚧';
    }
  };

  if (!user) {
    if (isFetchingProfile) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No Profile Found</h3>
              <p className="text-muted-foreground">Please log in to view your profile.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <Avatar className="w-32 h-32 mx-auto border-4 border-primary-foreground/30 shadow-2xl">
                <AvatarImage 
                  src={previewImage || user.profilePicture} 
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl bg-secondary text-secondary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-2 right-2 bg-card text-foreground rounded-full p-3 cursor-pointer hover:bg-muted transition-all duration-200 shadow-lg">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge variant={getRoleBadgeVariant(user.role)} className="px-4 py-2 text-sm font-medium">
                <Shield className="w-4 h-4 mr-2" />
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium text-background">
                {getGenderIcon(user.gender)} {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
              </Badge>
            </div>
            <p className="text-primary-foreground/80 text-lg">Welcome back to your fitness journey!</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Profile Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{user.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium text-foreground">
                      {new Date(user.createdAt || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          await logout();
                          toast.success('Logged out successfully');
                        } catch (e) {
                          toast.error('Logout failed');
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                    {!isEditing ? (
                      <Button
                        variant="default"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isLoading}
                          className="flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmit(onSubmit)}
                          disabled={isLoading}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      disabled={!isEditing}
                      className={`transition-all duration-200 ${isEditing ? 'focus:ring-ring' : 'bg-muted'}`}
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      disabled={!isEditing}
                      className={`transition-all duration-200 ${isEditing ? 'focus:ring-ring' : 'bg-muted'}`}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Enter your phone number"
                      disabled={!isEditing}
                      className={`transition-all duration-200 ${isEditing ? 'focus:ring-ring' : 'bg-muted'}`}
                      {...register('phoneNumber')}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-foreground">Gender</Label>
                    <select
                      id="gender"
                      disabled={!isEditing}
                      className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-all duration-200 ${isEditing ? 'focus:ring-ring bg-background' : 'bg-muted'} disabled:cursor-not-allowed disabled:opacity-50`}
                      {...register('gender')}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-sm text-destructive">{errors.gender.message}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 p-6 bg-muted rounded-xl border">
                    <div className="flex items-center gap-3 mb-3">
                      <Upload className="w-5 h-5 text-foreground" />
                      <h4 className="font-semibold text-foreground">Profile Picture</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click the camera icon on your profile picture above to upload a new image, or use the file input below.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-sm text-foreground cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-accent"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Account Statistics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link href="/orders/my-order" className="text-center p-6 bg-muted rounded-xl border">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">0</div>
                    <div className="text-sm text-muted-foreground font-medium">Orders Placed</div>
                  </Link>
                  
                  <Link href="/cart" className="text-center p-6 bg-muted rounded-xl border">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">0</div>
                    <div className="text-sm text-muted-foreground font-medium">Items in Cart</div>
                  </Link>
                  
                  <Link href="/workout-plan" className="text-center p-6 bg-muted rounded-xl border">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <Dumbbell className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">0</div>
                    <div className="text-sm text-muted-foreground font-medium">Workout Plans</div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}