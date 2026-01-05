'use client';

import { BookOpen, Book, GraduationCap, Briefcase, Heart, Home, Utensils, Car, Plane, Music, Gamepad2, ShoppingBag, Laptop, Phone, Camera, Palette, Dumbbell, Coffee, Sun, Moon } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface TopicIconProps {
  icon: string | null;
  className?: string;
  size?: number;
}

// Map common emoji icons to lucide-react icons
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  '📚': BookOpen,
  '📖': Book,
  '🎓': GraduationCap,
  '💼': Briefcase,
  '❤️': Heart,
  '🏠': Home,
  '🍽️': Utensils,
  '🚗': Car,
  '✈️': Plane,
  '🎵': Music,
  '🎮': Gamepad2,
  '🛍️': ShoppingBag,
  '💻': Laptop,
  '📱': Phone,
  '📷': Camera,
  '🎨': Palette,
  '💪': Dumbbell,
  '☕': Coffee,
  '☀️': Sun,
  '🌙': Moon,
};

export function TopicIcon({ icon, className, size = 24 }: TopicIconProps) {
  if (!icon) {
    return <BookOpen className={cn(className)} size={size} />;
  }

  const IconComponent = iconMap[icon];
  
  if (IconComponent) {
    return <IconComponent className={cn(className)} size={size} />;
  }

  // Fallback: display emoji if no mapping found
  return <span className={cn('text-2xl', className)}>{icon}</span>;
}

