import { supabase } from '@/integrations/supabase/client';

/**
 * Deletes battles older than 24 hours with no participants.
 * Returns the IDs of deleted battles.
 */
export async function cleanupOldBattles(): Promise<string[]> {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  // 1. Find battles older than 24 hours
  const { data: oldBattles, error: battlesError } = await supabase
    .from('battles')
    .select('id, created_at')
    .lt('created_at', twentyFourHoursAgo);

  if (battlesError) throw new Error(`Failed to fetch old battles: ${battlesError.message}`);
  if (!oldBattles || oldBattles.length === 0) return [];

  // 2. For each battle, check if it has participants
  const battlesToDelete: string[] = [];
  for (const battle of oldBattles) {
    const { data: participants, error: participantsError } = await supabase
      .from('battle_participants')
      .select('id')
      .eq('battle_id', battle.id);
    if (participantsError) throw new Error(`Failed to fetch participants: ${participantsError.message}`);
    if (!participants || participants.length === 0) {
      battlesToDelete.push(battle.id);
    }
  }

  // 3. Delete battles with no participants
  if (battlesToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('battles')
      .delete()
      .in('id', battlesToDelete);
    if (deleteError) throw new Error(`Failed to delete battles: ${deleteError.message}`);
  }

  return battlesToDelete;
}
