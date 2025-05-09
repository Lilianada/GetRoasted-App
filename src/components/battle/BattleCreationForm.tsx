
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import BattleRoundsSelection from "./BattleRoundsSelection";
import BattleTimeSelection from "./BattleTimeSelection";

// Schema definition for form validation
const battleFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(50, "Title cannot exceed 50 characters"),
  type: z.enum(["public", "private"]),
  roundCount: z.number().int().min(1).max(5),
  timePerTurn: z.number().int().min(30).max(300),
  allowSpectators: z.boolean().default(true),
});

type BattleFormValues = z.infer<typeof battleFormSchema>;

interface BattleCreationFormProps {
  setBattleId?: (id: string) => void;
  setInviteCode?: (code: string) => void;
  onSuccess?: () => void;
}

export function BattleCreationForm({ setBattleId, setInviteCode, onSuccess }: BattleCreationFormProps) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default form values
  const defaultValues: BattleFormValues = {
    title: "",
    type: "public",
    roundCount: 3,
    timePerTurn: 180, // 3 minutes in seconds
    allowSpectators: true,
  };
  
  const form = useForm<BattleFormValues>({
    resolver: zodResolver(battleFormSchema),
    defaultValues,
  });
  
  const onSubmit = async (values: BattleFormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a battle");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create invite code for the battle
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Save battle to database
      const { data, error } = await supabase
        .from("battles")
        .insert({
          title: values.title,
          type: values.type,
          round_count: values.roundCount,
          time_per_turn: values.timePerTurn,
          allow_spectators: values.allowSpectators,
          status: "waiting",
          created_by: user.id,
          invite_code: inviteCode,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Save user as first participant
      await supabase
        .from("battle_participants")
        .insert({
          battle_id: data.id,
          user_id: user.id,
        });
        
      toast.success("Battle created successfully!");
      
      if (setBattleId) setBattleId(data.id);
      if (setInviteCode) setInviteCode(inviteCode);
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate to the battle waiting room
        navigate(`/battles/waiting/${data.id}`);
      }
    } catch (error) {
      console.error("Error creating battle:", error);
      toast.error("Failed to create battle. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Battle Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Battle Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a title for your battle"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Choose a catchy title for your roast battle
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Battle Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Battle Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="public" id="public" />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="public">
                      Public - Anyone can join or spectate
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="private" id="private" />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="private">
                      Private - Invite-only (requires code)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Round Count Selection */}
        <FormField
          control={form.control}
          name="roundCount"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Number of Rounds</FormLabel>
              <FormControl>
                <BattleRoundsSelection
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Select how many rounds the battle should have
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Time Per Turn Selection */}
        <FormField
          control={form.control}
          name="timePerTurn"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Time Per Turn</FormLabel>
              <FormControl>
                <BattleTimeSelection
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Set the time limit for each turn
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Allow Spectators */}
        <FormField
          control={form.control}
          name="allowSpectators"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Allow Spectators</FormLabel>
                <FormDescription>
                  Let others watch your battle and vote on rounds
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-flame-500 hover:bg-flame-600 text-white"
        >
          {isSubmitting ? "Creating..." : "Create Battle"}
        </Button>
      </form>
    </Form>
  );
}
