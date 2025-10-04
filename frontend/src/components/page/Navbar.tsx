'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserRound,
  LayoutDashboard,
  Package,
  ShoppingCart,
  User,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function Navbar() {
  const { user, token } = useAuthStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 w-full bg-background/95 backdrop-blur-md border-b border-border z-50 transition-colors duration-500">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Left: Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Center Logo */}
        <Link href="/" className="text-2xl text-primary font-bold text-center flex-1 md:flex-none">
          Gym
        </Link>

        {/* Center Links (desktop only) */}
        <div className="hidden md:flex space-x-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products/woman" className="flex items-center gap-2">
              <UserRound className="w-4 h-4" /> Woman
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products/men" className="flex items-center gap-2">
              <UserRound className="w-4 h-4" /> Men
            </Link>
          </Button>
          {user?.role === "admin" && 
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            </Button>
          }
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products/general" className="flex items-center gap-2">
              <Package className="w-4 h-4" /> Products
            </Link>
          </Button>
        </div>

       {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
          {/* Cart */}
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="p-2" asChild>
              <Link href="/cart">
                <ShoppingCart className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Avatar */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link href="/profile">
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </Link>
          </motion.div>
          {!token &&
            <div className="hidden lg:flex gap-4">
              {/* Sign In */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
              </motion.div>

              {/* Sign Up */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/register">
                  <Button variant="default" size="sm">Register</Button>
                </Link>
              </motion.div>
            </div>
          }
        </div>

      </div>

      {/* Sidebar for mobile */}
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col"
        >
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h2 className="text-xl font-bold">Menu</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex flex-col p-6 space-y-4">
            <Link href="/women" onClick={() => setIsOpen(false)} className="text-lg">Woman</Link>
            <Link href="/men" onClick={() => setIsOpen(false)} className="text-lg">Men</Link>
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-lg">Dashboard</Link>
            <Link href="/products" onClick={() => setIsOpen(false)} className="text-lg">Products</Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
