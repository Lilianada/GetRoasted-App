
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from "@/components/ui/sonner";

interface SettingsContextType {
  darkMode: boolean;
  soundEnabled: boolean;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  playSound: (soundName: 'notification' | 'victory' | 'join' | 'error' | 'success') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true; // Default to dark mode
  });
  
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const savedSound = localStorage.getItem('soundEnabled');
    return savedSound ? JSON.parse(savedSound) : true; // Default to sound on
  });
  
  // Apply dark mode class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  
  // Save sound preference
  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);
  
  // Load audio files
  const soundEffects = {
    notification: new Audio('/sounds/notification.mp3'),
    victory: new Audio('/sounds/victory.mp3'),
    join: new Audio('/sounds/join.mp3'),
    error: new Audio('/sounds/error.mp3'),
    success: new Audio('/sounds/success.mp3')
  };
  
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    toast.success(darkMode ? "Light Mode Enabled" : "Dark Mode Enabled");
  };
  
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
    toast.success(soundEnabled ? "Sound Effects Disabled" : "Sound Effects Enabled");
    
    // Play a quick sound effect when enabling
    if (!soundEnabled) {
      setTimeout(() => {
        playSound('success');
      }, 300);
    }
  };
  
  const playSound = (soundName: 'notification' | 'victory' | 'join' | 'error' | 'success') => {
    if (soundEnabled && soundEffects[soundName]) {
      // Stop the sound if it's already playing
      soundEffects[soundName].currentTime = 0;
      // Play the sound
      soundEffects[soundName].play().catch(e => {
        // Don't show error to user, just log it
        console.error(`Error playing sound: ${e}`);
      });
    }
  };
  
  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        soundEnabled,
        toggleDarkMode,
        toggleSound,
        playSound
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
