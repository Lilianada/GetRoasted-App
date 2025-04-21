
import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import Loader from "@/components/ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileCardProps {
  loading: boolean;
  avatarUrl?: string;
  username: string;
  bio?: string;
  email?: string;
  stats?: {
    battles: number;
    wins: number;
    winRate?: number;
    longestStreak?: number;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  loading,
  avatarUrl,
  username,
  bio,
  email,
  stats = { battles: 0, wins: 0 }
}) => {
  const { user } = useAuthContext();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }

    try {
      setUploading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        toast.error('Failed to upload avatar');
        console.error('Upload error:', uploadError);
        return;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        toast.error('Failed to get avatar URL');
        return;
      }

      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);

      if (profileUpdateError) {
        toast.error('Failed to update profile');
        console.error('Profile update error:', profileUpdateError);
        return;
      }

      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Unexpected error:', error);
    } finally {
      setUploading(false);
    }
  };

  const initials = username.slice(0, 2).toUpperCase();



  return (
    <div className="bg-secondary border-2 border-black shadow-neo rounded-xl px-8 py-6 flex flex-col items-center relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px]">
      {loading ? (
        <Loader size="large" variant="colorful" className="my-8" />
      ) : (
        <>
        <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarUpload} 
        accept="image/jpeg,image/png,image/gif,image/webp" 
        className="hidden" 
      />
          <Avatar
            className="h-24 w-24 border-2 border-black cursor-pointer rounded-full border-black border-4  object-cover transition-transform duration-300 hover:scale-110"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="h-full w-full flex items-center justify-center bg-night-800">
                <Loader size="small" variant="colorful" />
              </div>
            ) : (
              <>
                <AvatarImage
                  src={avatarPreview || undefined}
                  alt="Profile avatar"
                />
                <AvatarFallback className="bg-primary text-black font-bold">
                  {initials}
                </AvatarFallback>
              </>
            )}
          </Avatar>
          <div className="text-2xl font-black text-black mb-2">{username}</div>
          <div className="text-base text-night-900 font-medium text-center mb-2 max-w-[90%]">{email}</div>
          {bio && (
            <div className="text-base text-night-900 font-medium text-center mb-2 max-w-[90%]">{bio}</div>
          )}
          {!bio && (
            <div className="text-sm text-night-400 italic text-center">No bio provided yet</div>
          )}

          <div className="mt-4 w-full pt-4 border-t border-night-700">
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-black">{stats.battles || 0}</div>
                <div className="text-xs text-night-400">Battles</div>
              </div>

              <div className="h-10 w-px bg-night-700"></div>
              <div className="text-center">
                <div className="text-xl font-bold text-black">{stats.longestStreak || 0}</div>
                <div className="text-xs text-night-400">Streak</div>
              </div>
              <div className="h-10 w-px bg-night-700"></div>

              <div className="text-center">
                <div className="text-xl font-bold text-black">{stats.wins || 0}</div>
                <div className="text-xs text-night-400">Wins</div>
              </div>

              {stats.winRate !== undefined && (
                <>
                  <div className="h-10 w-px bg-night-700"></div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-black">{stats.winRate}%</div>
                    <div className="text-xs text-night-400">Win Rate</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
