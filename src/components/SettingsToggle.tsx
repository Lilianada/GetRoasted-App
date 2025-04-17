
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SettingsToggleProps {
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

const SettingsToggle = ({ variant = 'horizontal', className = '' }: SettingsToggleProps) => {
  const { darkMode, soundEnabled, toggleDarkMode, toggleSound } = useSettings();
  
  return (
    <div className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} gap-2 ${className}`}>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleDarkMode}
        className={darkMode ? 'bg-night-700 text-flame-500' : 'bg-transparent text-gray-500'}
      >
        {darkMode ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSound}
        className={soundEnabled ? 'bg-night-700 text-flame-500' : 'bg-transparent text-gray-500'}
      >
        {soundEnabled ? <Volume2 className="h-[1.2rem] w-[1.2rem]" /> : <VolumeX className="h-[1.2rem] w-[1.2rem]" />}
      </Button>
    </div>
  );
};

export default SettingsToggle;
