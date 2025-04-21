import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Loader } from '@/components/ui/loader';
import { CardContent, CardFooter } from './ui/card';
import { Label } from './ui/label';
import { Input } from "@/components/ui/input";
import { User, AtSign, PenIcon } from "lucide-react";
import { Textarea } from './ui/textarea';


interface ProfileProps {
  loading: boolean;
  username: string;
  bio?: string;
  email?: string;
  avatarUrl?: string;
  isSaving?: boolean;
  error?: string | null;
  onProfileUpdated?: (profile: any) => void;
  onCancel?: () => void;
}


const ProfileEditor = ({ loading, username, bio, email, avatarUrl, isSaving = false, error, onProfileUpdated, onCancel }: ProfileProps) => {
  const { user } = useAuthContext();
  const [profileFields, setProfileFields] = useState({
    username: username || '',
    bio: bio || '',
    email: email || ''
  });
  const [editMode, setEditMode] = useState(false);
  const [originalFields, setOriginalFields] = useState({ username: username || '', bio: bio || '', email: email || '' });



  // DRY: Sync all fields with props in a single useEffect
  useEffect(() => {
    setProfileFields({
      username: username || '',
      bio: bio || '',
      email: email || ''
    });
    setOriginalFields({
      username: username || '',
      bio: bio || '',
      email: email || ''
    });
    setEditMode(false);
  }, [username, bio, email]);

  // Save handler updates username, bio, and email in both profiles and auth
  const handleSave = async (e?: React.FormEvent) => {
    if (!editMode) return;

    if (e) e.preventDefault();
    if (!user) return;

    const { username, bio, email } = profileFields;
    try {
      // 1. Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ username, bio, email })
        .eq("id", user.id);
      if (profileError) throw profileError;

      // 2. Update auth email if changed
      if (email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({ email });
        if (authError) throw authError;
      }

      // 3. Notify parent of updated profile
      const updatedProfile = {
        ...user,
        username,
        bio,
        email,
        avatar_url: avatarUrl
      };
      if (onProfileUpdated) onProfileUpdated(updatedProfile);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile: " + (error?.message || "Unknown error"));
    }

  };

  // Accessibility: focus first input when editor opens
  const usernameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editMode && !loading && !isSaving && usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, [editMode, loading, isSaving]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setProfileFields(originalFields);
    setEditMode(false);
    if (onCancel) onCancel();
  };

  return (
    <div className="bg-secondary border-2 border-black shadow-neo rounded-xl py-6 flex flex-col items-center relative overflow-hidden">

      <form onSubmit={handleSave} className='w-full' aria-label="Edit profile form">
        <CardContent className="w-full space-y-4">
          <div className="space-y-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-flame-500" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="FlameThrow3r"
                    className="pl-9 border-night-700 focus-visible:ring-flame-500"
                    value={profileFields.username}
                    onChange={(e) => setProfileFields(f => ({ ...f, username: e.target.value }))}
                    ref={usernameInputRef}
                    aria-label="Username"
                    disabled={!editMode || isSaving || loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-flame-500" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9 border-night-700 focus-visible:ring-flame-500"
                    value={profileFields.email}
                    onChange={(e) => setProfileFields(f => ({ ...f, email: e.target.value }))}
                    required
                    aria-label="Email"
                    disabled={!editMode || isSaving || loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <div className="relative">
                  <PenIcon className="absolute left-3 top-2.5 h-4 w-4 text-flame-500" />
                  <Textarea
                    value={profileFields.bio}
                    onChange={(e) => setProfileFields(f => ({ ...f, bio: e.target.value }))}
                    className="w-full pl-9 border-2 border-black rounded-md focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                    placeholder="Tell us about yourself..."
                    rows={4}
                    aria-label="Bio"
                    disabled={!editMode || isSaving || loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center pb-0">
          {editMode && (
            <div className="flex w-full gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isSaving || loading}
                aria-label="Save profile"
              >
                {isSaving ? <Loader size="small" /> : "Save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-black"
                onClick={handleCancel}
                disabled={isSaving || loading}
                aria-label="Cancel editing"
              >
                Cancel
              </Button>
            </div>
          )}
          {!editMode && (
            <div className="text-center w-full text-night-500 text-xs mt-2">
              Profile fields are locked. Click Edit to make changes.
            </div>
          )}
          {!editMode && (
            <Button
              type="button"
              onClick={handleEditClick}
              className="mt-2 bg-primary text-black border-2 border-black hover:bg-primary/90"
              aria-label="Edit profile"
            >
              Edit
            </Button>
          )}
          {error && (
            <div className="mt-2 text-red-600 text-sm text-center" role="alert">
              {error}
            </div>
          )}
        </CardFooter>
      </form>
    </div>
  );
};

export default ProfileEditor;
