import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

// Props for profile settings
interface ProfileSettingsProps {
  displayName: string;
  email: string;
  bio: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  displayName,
  email,
  bio,
  isLoading,
  onInputChange,
  onSave,
}) => {
  return (
    <Card className="border-night-700">
      <CardHeader>
        <CardTitle className="text-xl">Profile Information</CardTitle>
        <CardDescription>
          Update your account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input 
            id="displayName" 
            value={displayName}
            onChange={onInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            value={email}
            disabled
          />
          <p className="text-xs text-muted-foreground">
            To change your email, please contact support
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio" 
            value={bio} 
            onChange={onInputChange}
            placeholder="Tell us a bit about yourself"
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
      <CardFooter className="border-t border-night-700 pt-6">
        <Button 
          className="bg-yellow hover:opacity-90"
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSettings;
