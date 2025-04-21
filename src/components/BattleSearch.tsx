
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface BattleSearchProps {
  onSearch: (results: any[]) => void;
}

const BattleSearch = ({ onSearch }: BattleSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        // If search is empty, fetch all battles
        const { data: allBattles, error: allError } = await supabase
          .from('battles')
          .select(`
            *,
            battle_participants(
              *,
              profiles:user_id(*)
            ),
            battle_spectators(count)
          `)
          .order('created_at', { ascending: false });
          
        if (!allError) {
          // Format data to match the component props
          const formattedBattles = allBattles.map(battle => ({
            ...battle,
            participants: battle.battle_participants.map((p: any) => ({
              id: p.user_id,
              name: p.profiles.username,
              avatar: p.profiles.avatar_url
            })),
            spectatorCount: battle.battle_spectators.length
          }));
          onSearch(formattedBattles);
        }
        return;
      }
      
      // Perform search query
      const { data: searchResults, error } = await supabase
        .from('battles')
        .select(`
          *,
          battle_participants(
            *,
            profiles:user_id(*)
          ),
          battle_spectators(count)
        `)
        .or(`title.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error searching battles:', error);
        return;
      }
      
      // Format data to match the component props
      const formattedResults = searchResults.map(battle => ({
        ...battle,
        participants: battle.battle_participants.map((p: any) => ({
          id: p.user_id,
          name: p.profiles.username,
          avatar: p.profiles.avatar_url
        })),
        spectatorCount: battle.battle_spectators.length
      }));
      
      onSearch(formattedResults);
    };
    
    // Debounce search
    const timer = setTimeout(() => {
      performSearch();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-flame-500" />
      <Input
        placeholder="Search battles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 border-night-700 focus-visible:ring-flame-500"
      />
    </div>
  );
};

export default BattleSearch;
