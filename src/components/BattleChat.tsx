import React, { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

function getSafeUser(user: any) {
  return {
    id: user?.id || '',
    username: user?.username || user?.user_metadata?.username || user?.email || 'User',
    avatar_url: user?.avatar_url || user?.user_metadata?.avatar_url || undefined,
  };
}

/**
 * Real-time chat for a battle. Only participants can send messages.
 */
export function BattleChat({ battleId, user, canSend }: {
  battleId: string;
  user: { id?: string, username?: string, avatar_url?: string, user_metadata?: any, email?: string };
  canSend: boolean;
}) {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [input, setInput] = React.useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // Fetch and subscribe to messages
  useEffect(() => {
    if (!battleId) return;
    let isMounted = true;
    supabase
      .from('messages') // Use correct table name as per schema (change to 'messages' if that's the correct one)
      .select('*')
      .eq('battle_id', battleId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }
        if (isMounted) setMessages(data || []);
      });
    // Real-time subscription (supabase.channel)
    const channel = supabase.channel(`battle_messages_${battleId}`);
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'battle_messages', filter: `battle_id=eq.${battleId}` },
      payload => setMessages(msgs => [...msgs, payload.new])
    );
    channel.subscribe();
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [battleId]);

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const safeUser = getSafeUser(user);
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !safeUser.id) return;
    const { error } = await supabase.from('messages') // Use correct table name as per schema
      .insert({
        battle_id: battleId,
        user_id: safeUser.id,
        username: safeUser.username,
        avatar_url: safeUser.avatar_url,
        content: input.trim(),
      });
    if (error) {
      console.error('Error sending message:', error);
      return;
    }
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={chatRef} className="flex-1 overflow-y-auto bg-night-800 rounded p-2 mb-2" style={{ minHeight: 180, maxHeight: 320 }}>
        {messages.map((msg, i) => (
          <div key={i} className="flex items-start gap-2 mb-1">
            <img src={msg.avatar_url || "/placeholder.svg"} alt={msg.username} className="w-7 h-7 rounded-full border" />
            <div>
              <span className="font-bold text-xs text-night-100">{msg.username}</span>
              <div className="text-night-100 text-sm bg-night-700 rounded px-2 py-1 inline-block">{msg.content}</div>
            </div>
          </div>
        ))}
        {messages.length === 0 && <div className="text-night-400 text-center">No messages yet.</div>}
      </div>
      {canSend && (
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            className="flex-1 rounded border px-2 py-1 text-night-900"
            value={input}
            onChange={e => setInput(e.target.value)}
            maxLength={300}
            placeholder="Type your roast..."
            autoFocus
          />
          <Button type="submit" disabled={!input.trim()}>Send</Button>
        </form>
      )}
    </div>
  );
}
