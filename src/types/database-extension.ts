
import { Database } from "@/integrations/supabase/types";

// Extend the Database interface to include our new tables
export interface ExtendedDatabase extends Database {
  public: Database["public"] & {
    Tables: Database["public"]["Tables"] & {
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
