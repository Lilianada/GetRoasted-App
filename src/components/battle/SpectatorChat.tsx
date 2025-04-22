
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Send, MessageSquare, X } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  username: string;
  avatar_url: string | null;
}

interface SpectatorChatProps {
  battleId: string;
  onToggleChat: () => void;
}

export default function SpectatorChat({ battleId, onToggleChat }: SpectatorChatProps) {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Load existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('battle_messages')
        .select('*')
        .eq('battle_id', battleId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`battle-chat-${battleId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'battle_messages', filter: `battle_id=eq.${battleId}` },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(current => [...current, newMessage]);
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [battleId]);

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    try {
      setIsSubmitting(true);

      // Get user profile for display info
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (!profile) {
        throw new Error('User profile not found');
      }

      // Send message
      const { error } = await supabase
        .from('battle_messages')
        .insert({
          battle_id: battleId,
          user_id: user.id,
          message: newMessage.trim(),
          username: profile.username,
          avatar_url: profile.avatar_url
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full border-2 border-black bg-white rounded-lg">
      <div className="p-3 border-b-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-flame-500" />
          <h3 className="font-bold text-sm">Spectator Chat</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggleChat} className="h-7 w-7 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[300px]"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-2 ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              {msg.user_id !== user?.id && (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={msg.avatar_url || undefined} />
                  <AvatarFallback>
                    {msg.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`max-w-[75%] rounded-lg p-2 text-sm ${
                  msg.user_id === user?.id 
                    ? 'bg-flame-500 text-white' 
                    : 'bg-gray-100 text-black'
                }`}
              >
                {msg.user_id !== user?.id && (
                  <p className="text-xs font-medium mb-1">{msg.username}</p>
                )}
                <p>{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t-2 border-black">
        <div className="relative">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting || !user}
            className="pr-10 text-sm min-h-[60px] resize-none"
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-flame-500 hover:bg-flame-600"
            onClick={sendMessage}
            disabled={isSubmitting || !newMessage.trim() || !user}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
        {!user && (
          <p className="text-xs text-center mt-2 text-gray-500">
            Please log in to join the conversation
          </p>
        )}
      </div>
    </div>
  );
}
