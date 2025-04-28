
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from "@/components/ui/sonner";

interface SettingsContextType {
  darkMode: boolean;

  toggleDarkMode: () => void;


}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true; // Default to dark mode
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
  


  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    toast.success(darkMode ? "Light Mode Enabled" : "Dark Mode Enabled");
  };
  



    


  
  





  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
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
