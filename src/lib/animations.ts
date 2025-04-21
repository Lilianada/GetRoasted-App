import React from 'react';

// Utility functions for animations using vanilla JS
export const animations = {
  // Button press animation
  buttonPress: (element: HTMLElement) => {
    if (!element) return;
    element.style.transition = 'transform 0.1s cubic-bezier(0.45,0,0.55,1)';
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
      element.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.2)';
      element.style.transform = 'scale(1)';
    }, 100);
  },
  
  // Page transition in
  pageEnter: (container: HTMLElement) => {
    const elements = container.querySelectorAll('.animate-item');
    elements.forEach((el, i) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(20px)';
      setTimeout(() => {
        (el as HTMLElement).style.transition = 'opacity 0.6s cubic-bezier(0.19,1,0.22,1), transform 0.6s cubic-bezier(0.19,1,0.22,1)';
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      }, 300 + i * 100);
    });
  },
  
  // Card hover effect
  cardHover: (element: HTMLElement, enter: boolean) => {
    if (!element) return;
    element.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1.2)';
    element.style.transform = enter ? 'translateY(-8px)' : 'translateY(0)';
    // For boxShadow, toggle a class in React/CSS instead for best performance
  },
  
  // Loading animation
  loader: (element: HTMLElement) => {
    if (!element) return;
    const items = element.querySelectorAll('.loader-item');
    items.forEach((item, i) => {
      (item as HTMLElement).style.opacity = '0';
      (item as HTMLElement).style.transform = 'scale(0)';
      setTimeout(() => {
        (item as HTMLElement).style.transition = 'transform 0.6s cubic-bezier(0.45,0,0.55,1), opacity 0.6s cubic-bezier(0.45,0,0.55,1)';
        (item as HTMLElement).style.opacity = '1';
        (item as HTMLElement).style.transform = 'scale(1)';
      }, i * 200);
    });
    // For looping, you can reset after a timeout or use CSS animation
  },
  
  // Badge pop-in animation
  badgePopIn: (element: HTMLElement) => {
    if (!element) return;
    element.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    element.style.opacity = '0';
    element.style.transform = 'scale(0) rotate(-10deg)';
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1) rotate(0deg)';
    }, 10);
  },

  // Shake animation for errors
  shake: (element: HTMLElement) => {
    if (!element) return;
    const keyframes = [0, -10, 10, -10, 10, -5, 5, -2, 2, 0];
    let i = 0;
    function animateShake() {
      if (i < keyframes.length) {
        element.style.transform = `translateX(${keyframes[i]}px)`;
        i++;
        setTimeout(animateShake, 50);
      } else {
        element.style.transform = '';
      }
    }
    animateShake();
  }
};

// Custom function to animate elements on mount (vanilla)
export const animateOnMount = (selector: string, container: HTMLElement | null) => {
  if (container) {
    const elements = container.querySelectorAll(selector);
    elements.forEach((el, i) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(20px)';
      setTimeout(() => {
        (el as HTMLElement).style.transition = 'opacity 0.8s cubic-bezier(0.19,1,0.22,1), transform 0.8s cubic-bezier(0.19,1,0.22,1)';
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      }, i * 120);
    });
  }
};

// Component loader animation (vanilla, just static dots, animate with CSS or JS if needed)
export const LoaderAnimation: React.FC = () => {
  return React.createElement('div', {
    className: "flex items-center justify-center space-x-2"
  }, [
    React.createElement('div', {
      key: "dot1",
      className: "w-4 h-4 bg-primary border-2 border-black loader-item"
    }),
    React.createElement('div', {
      key: "dot2", 
      className: "w-4 h-4 bg-secondary border-2 border-black loader-item"
    }),
    React.createElement('div', {
      key: "dot3",
      className: "w-4 h-4 bg-blue border-2 border-black loader-item"
    })
  ]);
};

// Create a button click animation directive (vanilla)
export const useButtonAnimation = () => {
  return (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    animations.buttonPress(button);
  };
};
