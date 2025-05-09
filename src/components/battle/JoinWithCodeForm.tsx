
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

// Form schema validation
const formSchema = z.object({
  code: z
    .string()
    .min(6, "Code must be 6 characters")
    .max(6, "Code must be 6 characters")
    .toUpperCase(),
});

interface JoinWithCodeFormProps {
  onSuccess?: () => void;
}

const JoinWithCodeForm = ({ onSuccess }: JoinWithCodeFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Find battle with matching invite code
      const { data: battle, error: battleError } = await supabase
        .from("battles")
        .select("id, status")
        .eq("invite_code", values.code)
        .single();
      
      if (battleError || !battle) {
        toast.error("Invalid battle code. Please check and try again.");
        return;
      }
      
      // Success! Navigate based on battle status
      if (battle.status === "waiting") {
        navigate(`/battles/waiting/${battle.id}`);
      } else if (battle.status === "active" || battle.status === "ready") {
        navigate(`/battles/live/${battle.id}`);
      } else {
        navigate(`/battles/${battle.id}`);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error joining battle:", error);
      toast.error("Failed to join battle. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter 6-digit battle code</FormLabel>
              <FormControl>
                <Input 
                  placeholder="BATTLE" 
                  {...field} 
                  value={field.value.toUpperCase()}
                  maxLength={6}
                  className="uppercase text-center tracking-wider"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-purple hover:bg-purple/90 text-white"
        >
          {isSubmitting ? "Joining..." : "Join Battle"}
        </Button>
      </form>
    </Form>
  );
};

export default JoinWithCodeForm;
