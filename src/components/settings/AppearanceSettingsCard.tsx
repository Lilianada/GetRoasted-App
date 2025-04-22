
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppearanceSettings } from "@/components/SettingsSections";

interface AppearanceSettingsCardProps {
  onSave: () => void;
}

const AppearanceSettingsCard: React.FC<AppearanceSettingsCardProps> = ({ onSave }) => {
  return (
    <Card className="border-night-700">
      <CardHeader>
        <CardTitle className="text-xl">
          Display Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AppearanceSettings />
      </CardContent>
      <CardFooter className="border-t border-night-700 pt-6">
        <Button 
          className="bg-yellow hover:opacity-90"
          onClick={onSave}
        >
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppearanceSettingsCard;
