
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for managing battle codes
 */
export function useBattleCode() {
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Generate a random 6-digit code for a battle
   */
  const generateBattleCode = () => {
    // Generate a random 6-digit number
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  };

  /**
   * Validate if a battle code exists and is joinable
   */
  const validateBattleCode = async (code: string) => {
    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      toast.error("Invalid battle code. Please enter a 6-digit code.");
      return null;
    }

    setIsValidating(true);
    
    try {
      // Check if battle with this code exists
      const { data: battleData, error } = await supabase
        .from('battles')
        .select('*')
        .eq('invite_code', code)
        .maybeSingle();

      if (error || !battleData) {
        toast.error("Battle not found with this code.");
        return null;
      }

      if (battleData.status !== 'waiting') {
        toast.error("This battle has already started or has ended.");
        return null;
      }

      // Get current participants count
      const { data: participants } = await supabase
        .from('battle_participants')
        .select('id')
        .eq('battle_id', battleData.id);

      if (participants && participants.length >= 2) {
        toast.error("This battle already has the maximum number of participants.");
        return null;
      }

      return battleData;
    } catch (error) {
      console.error("Error validating battle code:", error);
      toast.error("Failed to validate battle code.");
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    generateBattleCode,
    validateBattleCode,
    isValidating
  };
}
