
import * as animeLib from 'animejs';
import React from 'react';

// Use the proper way to import anime
const anime = animeLib.default || animeLib;

// Utility functions for animations
export const animations = {
  // Button press animation
  buttonPress: (element: HTMLElement) => {
    return anime({
      targets: element,
      scale: 0.95,
      duration: 100,
      easing: 'easeInOutQuad',
      complete: () => {
        anime({
          targets: element,
          scale: 1,
          duration: 300,
          easing: 'easeOutElastic(1, .5)'
        });
      }
    });
  },
  
  // Page transition in
  pageEnter: (container: HTMLElement) => {
    const elements = container.querySelectorAll('.animate-item');
    
    return anime({
      targets: elements,
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutExpo',
      duration: 600,
      delay: anime.stagger(100, {start: 300})
    });
  },
  
  // Card hover effect
  cardHover: (element: HTMLElement, enter: boolean) => {
    return anime({
      targets: element,
      translateY: enter ? -8 : 0,
      boxShadow: enter ? [
        '8px 8px 0px 0px rgba(0,0,0,1)', 
        '12px 12px 0px 0px rgba(0,0,0,1)'
      ] : [
        '12px 12px 0px 0px rgba(0,0,0,1)',
        '8px 8px 0px 0px rgba(0,0,0,1)'
      ],
      duration: 400,
      easing: 'easeOutElastic(1, .6)'
    });
  },
  
  // Loading animation
  loader: (element: HTMLElement) => {
    return anime({
      targets: `${element} .loader-item`,
      scale: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(200),
      duration: 600,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
  },
  
  // Badge pop-in animation
  badgePopIn: (element: HTMLElement) => {
    return anime({
      targets: element,
      scale: [0, 1],
      rotate: ['-10deg', '0deg'],
      opacity: [0, 1],
      duration: 400,
      easing: 'easeOutBack'
    });
  },

  // Shake animation for errors
  shake: (element: HTMLElement) => {
    return anime({
      targets: element,
      translateX: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
      duration: 600,
      easing: 'easeInOutSine'
    });
  }
};

// Custom hook to animate elements on mount
export const animateOnMount = (selector: string, container: HTMLElement | null) => {
  if (container) {
    const elements = container.querySelectorAll(selector);
    
    anime({
      targets: elements,
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutExpo',
      duration: 800,
      delay: anime.stagger(120)
    });
  }
};

// Component loader animation - fixed by returning a proper React component
export const LoaderAnimation: React.FC = () => {
  return React.createElement('div', {
    className: "flex items-center justify-center space-x-2"
  }, [
    React.createElement('div', {
      key: "dot1",
      className: "w-4 h-4 bg-[#F8C537] border-2 border-black loader-item"
    }),
    React.createElement('div', {
      key: "dot2",
      className: "w-4 h-4 bg-[#C5B4F0] border-2 border-black loader-item"
    }),
    React.createElement('div', {
      key: "dot3",
      className: "w-4 h-4 bg-[#A6C7F7] border-2 border-black loader-item"
    })
  ]);
};

// Create a button click animation directive
export const useButtonAnimation = () => {
  const animateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    animations.buttonPress(button);
  };
  
  return animateClick;
};
