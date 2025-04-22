
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { toast } from '@/components/ui/sonner';

export function useUserProfile(userId: string | null | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;

        const userProfile: UserProfile = {
          id: data.id,
          username: data.username,
          email: '', // Email is not stored in profiles table
          avatar_url: data.avatar_url || undefined,
          bio: data.bio || undefined,
          subscription_tier: data.subscription_tier as 'free' | 'pro'
        };

        setProfile(userProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId || !profile) {
      toast.error('You need to be logged in to update your profile');
      return null;
    }

    try {
      const validUpdates: any = {};
      if (updates.username) validUpdates.username = updates.username;
      if (updates.bio !== undefined) validUpdates.bio = updates.bio;
      if (updates.avatar_url !== undefined) validUpdates.avatar_url = updates.avatar_url;

      const { data, error } = await supabase
        .from('profiles')
        .update(validUpdates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      const updatedProfile: UserProfile = {
        ...profile,
        ...validUpdates
      };

      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
      return updatedProfile;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        description: error.message
      });
      return null;
    }
  };

  return {
    profile,
    isLoading,
    updateProfile
  };
}
