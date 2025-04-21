
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";

interface SettingsToggleProps {
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

const SettingsToggle = ({ variant = 'horizontal', className = '' }: SettingsToggleProps) => {
  const { darkMode, soundEnabled, toggleDarkMode, toggleSound } = useSettings();
  
  return (
    <div className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} gap-2 ${className}`}>
      <Button 
        variant={darkMode ? "default" : "outline"} 
        size="icon" 
        onClick={toggleDarkMode}
        className={`border-2 border-black transition-all ${darkMode ? 'bg-primary text-black' : 'bg-background text-white'}`}
      >
        {darkMode ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
      </Button>
      
      <Button
        variant={soundEnabled ? "default" : "outline"}
        size="icon"
        onClick={toggleSound}
        className={`border-2 border-black transition-all ${soundEnabled ? 'bg-[#F8C537] text-black' : 'bg-night-800 text-white'}`}
      >
        {soundEnabled ? <Volume2 className="h-[1.2rem] w-[1.2rem]" /> : <VolumeX className="h-[1.2rem] w-[1.2rem]" />}
      </Button>
    </div>
  );
};

export default SettingsToggle;
