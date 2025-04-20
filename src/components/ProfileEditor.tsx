
import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileEditorProps {
  // Add proper props interface
}

const ProfileEditor = () => {
  const { user } = useAuthContext();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }

    try {
      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        toast.error('Failed to upload avatar');
        console.error('Upload error:', uploadError);
        return;
      }

      // Get public URL - fix the type error by checking for errors differently
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        toast.error('Failed to get avatar URL');
        return;
      }

      // Update user's profile with new avatar URL
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
    }
  };

  // Get initials from username if available (adjust this based on actual data structure)
  const username = user?.user_metadata?.username || 'UN';
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center space-y-4">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarUpload} 
        accept="image/jpeg,image/png,image/gif,image/webp" 
        className="hidden" 
      />
      
      <Avatar 
        className="h-24 w-24 border-2 border-black cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => fileInputRef.current?.click()}
      >
        <AvatarImage 
          src={avatarPreview || undefined} 
          alt="Profile avatar" 
        />
        <AvatarFallback className="bg-[#F8C537] text-black font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <Button 
        variant="outline" 
        onClick={() => fileInputRef.current?.click()}
      >
        Change Avatar
      </Button>
    </div>
  );
};

export default ProfileEditor;
