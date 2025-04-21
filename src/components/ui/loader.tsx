
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';





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
    const dots = loaderRef.current.querySelectorAll('.loader-dot');
    let frame = 0;
    let running = true;
    const totalDots = dots.length;
    const duration = 1000; // ms for a full loop
    const dotDelay = 150;

    function animate() {
      if (!running) return;
      const now = Date.now();
      dots.forEach((dot, i) => {
        // Calculate phase for each dot
        const phase = ((now / duration) + i * (dotDelay / duration)) % 1;
        // Animate scale and opacity in a wave
        const scale = 0.7 + 0.3 * Math.sin(phase * 2 * Math.PI);
        const opacity = 0.5 + 0.5 * Math.sin(phase * 2 * Math.PI);
        (dot as HTMLElement).style.transform = `scale(${scale})`;
        (dot as HTMLElement).style.opacity = `${opacity}`;
      });
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      dots.forEach(dot => {
        (dot as HTMLElement).style.transform = '';
        (dot as HTMLElement).style.opacity = '';
      });
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
    ? ['bg-primary', 'bg-secondary', 'bg-blue'] 
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
