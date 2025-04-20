
import { useEffect, useRef } from 'react';
import * as animeLib from 'animejs';
import { cn } from '@/lib/utils';

// Handle anime.js import properly
// @ts-ignore - Ignore TypeScript error as anime.js has a different export structure than its types suggest
const anime = animeLib.default || animeLib;

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'colorful';
  className?: string;
}

export function Loader({ 
  size = 'medium', 
  variant = 'default',
  className 
}: LoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaderRef.current) return;
    
    const animation = anime({
      targets: loaderRef.current.querySelectorAll('.loader-dot'),
      scale: [0, 1],
      opacity: [0.5, 1],
      delay: anime.stagger(150),
      duration: 500,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });

    return () => {
      animation.pause();
    };
  }, []);

  const sizeClass = {
    small: 'gap-1',
    medium: 'gap-2',
    large: 'gap-3'
  };

  const dotSizeClass = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };
  
  const dotColors = variant === 'colorful' 
    ? ['bg-[#F8C537]', 'bg-[#C5B4F0]', 'bg-[#A6C7F7]'] 
    : ['bg-current', 'bg-current', 'bg-current'];

  return (
    <div 
      ref={loaderRef} 
      className={cn('flex items-center justify-center', sizeClass[size], className)}
      aria-label="Loading"
    >
      <div className={cn(
        dotSizeClass[size], 
        dotColors[0], 
        'loader-dot rounded-full'
      )}></div>
      <div className={cn(
        dotSizeClass[size], 
        dotColors[1], 
        'loader-dot rounded-full'
      )}></div>
      <div className={cn(
        dotSizeClass[size], 
        dotColors[2], 
        'loader-dot rounded-full'
      )}></div>
    </div>
  );
}

export default Loader;
