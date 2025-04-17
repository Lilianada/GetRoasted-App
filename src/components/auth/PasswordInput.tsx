
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const PasswordInput = ({ id, value, onChange, placeholder = "6+ characters", className = "", required = false }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        className={`pr-9 border-night-700 focus-visible:ring-flame-500 ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button 
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-2.5 text-muted-foreground hover:text-white"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
