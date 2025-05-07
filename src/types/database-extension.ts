import { Database } from "@/integrations/supabase/types";

// Extend the Database interface to include our new tables
export interface ExtendedDatabase {
  public: {
    Tables: {
      battles: {
        Row: {
          id: string;
          title: string;
          round_count: number;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          allow_spectators: boolean;
          time_per_turn: number;
          status: string;
          type: string;
          invite_code: string | null;
          player_ready_status: string | null; // JSON string with user IDs and ready status
        };
        Insert: {
          id?: string;
          title: string;
          round_count?: number;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          allow_spectators?: boolean;
          time_per_turn?: number;
          status?: string;
          type?: string;
          invite_code?: string | null;
          player_ready_status?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          round_count?: number;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          allow_spectators?: boolean;
          time_per_turn?: number;
          status?: string;
          type?: string;
          invite_code?: string | null;
          player_ready_status?: string | null;
        };
      };
      battle_reactions: {
        Row: {
          id: string;
          battle_id: string;
          roast_id: string | null;
          user_id: string;
          reaction: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          battle_id: string;
          roast_id?: string | null;
          user_id: string;
          reaction: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          battle_id?: string;
          roast_id?: string | null;
          user_id?: string;
          reaction?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "battle_reactions_battle_id_fkey";
            columns: ["battle_id"];
            isOneToOne: false;
            referencedRelation: "battles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "battle_reactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "battle_reactions_roast_id_fkey";
            columns: ["roast_id"];
            isOneToOne: false;
            referencedRelation: "roasts";
            referencedColumns: ["id"];
          }
        ];
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
          battle_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          earned_at?: string;
          battle_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          earned_at?: string;
          battle_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_achievements_battle_id_fkey";
            columns: ["battle_id"];
            isOneToOne: false;
            referencedRelation: "battles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
  };
}
