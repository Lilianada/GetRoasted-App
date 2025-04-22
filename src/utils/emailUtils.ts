
import { supabase } from "@/integrations/supabase/client";

/**
 * Send an email notification to a user
 * @param options Email options
 * @returns Promise resolving to success status and message
 */
export async function sendEmailNotification({
  email,
  name,
  subject,
  message,
  actionUrl
}: {
  email: string;
  name: string;
  subject: string;
  message: string;
  actionUrl?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { email, name, subject, message, actionUrl },
    });

    if (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: `Failed to send email: ${error.message}`
      };
    }

    return {
      success: true,
      message: 'Email sent successfully'
    };
  } catch (error: any) {
    console.error('Exception sending email:', error);
    return {
      success: false,
      message: `Unexpected error: ${error.message}`
    };
  }
}
