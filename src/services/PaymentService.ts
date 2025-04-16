
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaymentInitParams {
  email: string;
  amount: number; // in kobo (multiply by 100 for Naira)
  plan: string;
  userId: string;
  callback_url?: string;
}

class PaymentService {
  private static instance: PaymentService;
  private paystackPublicKey = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Replace with your actual public key

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async initializePayment(params: PaymentInitParams): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          email: params.email,
          amount: params.amount,
          plan: params.plan,
          userId: params.userId,
          callback_url: params.callback_url || window.location.origin + '/billing/success',
        }
      });

      if (error) throw new Error(error.message);
      
      return data.authorization_url;
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('Payment initialization failed', {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      return null;
    }
  }

  async verifyTransaction(reference: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { reference }
      });

      if (error) throw new Error(error.message);
      
      return data.success;
    } catch (error) {
      console.error('Transaction verification failed:', error);
      toast.error('Transaction verification failed', {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      return false;
    }
  }
}

export default PaymentService.getInstance();
