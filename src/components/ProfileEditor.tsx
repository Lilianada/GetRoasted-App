
import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Loader } from '@/components/ui/loader';
import { CardContent, CardFooter } from './ui/card';
import { Label } from './ui/label';

import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { User, AtSign, Lock, PenIcon } from "lucide-react";
import PasswordInput from './auth/PasswordInput';


const ProfileEditor = () => {
  const { user } = useAuthContext();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState("");

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ bio })
        .eq("id", user.id);

      if (error) throw error;

      setProfile({ ...profile, bio });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <form onSubmit={handleSave}>
        <CardContent className="space-y-4">
          <div className="space-y-2">

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="FlameThrow3r"
                    className="pl-9 border-night-700 focus-visible:ring-flame-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9 border-night-700 focus-visible:ring-flame-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <div className="relative">
                  <PenIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 bg-night-700 border border-night-600 rounded-md focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </div>


            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <Button
            type="submit"
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader size="small" className="mr-2" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};

export default ProfileEditor;
