import { useState } from "react";
import NavBar from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, File, AlertCircle, PlusCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import PricingCard from "@/components/PricingCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PricingCardWrapper } from "@/components/PricingCard";

// Mock data - would come from Supabase in a real implementation
const mockSubscription = {
  plan: "free", // "free" or "pro"
  status: "active",
  currentPeriodEnd: "2025-05-15",
  cancelAtPeriodEnd: false
};

const mockInvoices = [
  { id: "inv_123", date: "2025-04-01", amount: "$0.00", status: "paid", downloadUrl: "#" },
  { id: "inv_122", date: "2025-03-01", amount: "$0.00", status: "paid", downloadUrl: "#" }
];

const Billing = () => {
  const [activeTab, setActiveTab] = useState("plan");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(mockSubscription.plan);
  
  const handleUpgrade = () => {
    toast.success("Subscription upgraded successfully!", {
      description: "Welcome to GetRoasted Pro!"
    });
    setShowUpgradeModal(false);
  };
  
  const handleCancel = () => {
    toast.success("Subscription will be canceled at the end of the billing cycle", {
      description: "You can reactivate anytime before then."
    });
  };

  // Plan features
  const freeFeatures = [
    { name: "Join unlimited roast battles", included: true },
    { name: "Up to 280 characters per roast", included: true },
    { name: "Basic badges and achievements", included: true },
    { name: "Public battles only", included: true },
    { name: "Standard matchmaking", included: true },
    { name: "Voice recording", included: false },
    { name: "Private battle rooms", included: false },
    { name: "Extended character limit (700)", included: false }
  ];
  
  const proFeatures = [
    { name: "Join unlimited roast battles", included: true },
    { name: "Extended characters (700) per roast", included: true },
    { name: "Premium badges and achievements", included: true },
    { name: "Private battle rooms", included: true },
    { name: "Priority matchmaking", included: true },
    { name: "Voice recording", included: true },
    { name: "Ad-free experience", included: true },
    { name: "Early access to new features", included: true }
  ];

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <NavBar />
      
      <main className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and payment details</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6 bg-night-800 border border-night-700">
                <TabsTrigger value="plan" className="data-[state=active]:bg-flame-600">
                  Plan
                </TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-flame-600">
                  Payment
                </TabsTrigger>
                <TabsTrigger value="invoices" className="data-[state=active]:bg-flame-600">
                  Invoices
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="plan">
                <Card className="flame-card">
                  <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>
                      You are currently on the {mockSubscription.plan === "pro" ? "Pro" : "Free"} plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md bg-night-800 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{mockSubscription.plan === "pro" ? "GetRoasted Pro" : "GetRoasted Free"}</p>
                          <p className="text-sm text-muted-foreground">
                            {mockSubscription.plan === "pro" ? "$5.00/month" : "Free forever"}
                          </p>
                        </div>
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                          Active
                        </span>
                      </div>
                      
                      {mockSubscription.plan === "pro" && (
                        <div className="mt-4 text-sm">
                          <p className="text-muted-foreground">
                            Your subscription will {mockSubscription.cancelAtPeriodEnd ? "end" : "renew"} on {mockSubscription.currentPeriodEnd}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      {mockSubscription.plan === "free" ? (
                        <Button 
                          className="bg-gradient-flame hover:opacity-90"
                          onClick={() => setShowUpgradeModal(true)}
                        >
                          Upgrade to Pro
                        </Button>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            className="border-destructive text-destructive hover:bg-destructive/10"
                            onClick={handleCancel}
                          >
                            Cancel Subscription
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setShowUpgradeModal(true)}
                          >
                            Change Plan
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment">
                <Card className="flame-card">
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md border border-night-700 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-flame-500" />
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-xs text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                        <div>
                          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full border-dashed flex items-center justify-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Add Payment Method</span>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="invoices">
                <Card className="flame-card">
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>
                      View and download your past invoices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mockInvoices.length > 0 ? (
                      <div className="divide-y divide-night-700">
                        {mockInvoices.map((invoice) => (
                          <div key={invoice.id} className="py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <File className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Invoice {invoice.id}</p>
                                <p className="text-xs text-muted-foreground">{invoice.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm">{invoice.amount}</span>
                              <Button variant="ghost" size="sm" asChild>
                                <a href={invoice.downloadUrl} download>
                                  Download
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="flex justify-center mb-4">
                          <File className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium mb-1">No invoices yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Your billing history will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card className="flame-card">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-flame-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Billing Questions</h4>
                    <p className="text-sm text-muted-foreground">
                      Have questions about your billing or subscription? Contact our support team.
                    </p>
                    <Button variant="link" className="px-0 h-auto text-flame-500">
                      Contact Support
                    </Button>
                  </div>
                </div>
                
                <Separator className="bg-night-700" />
                
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-flame-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Cancellation Policy</h4>
                    <p className="text-sm text-muted-foreground">
                      You can cancel your subscription at any time. Your subscription will remain active until the end of your billing period.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-[600px] bg-night-800 border-night-700">
          <DialogHeader>
            <DialogTitle>Choose Your Plan</DialogTitle>
            <DialogDescription>
              Select the plan that works best for you
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <PricingCardWrapper
              title="Free"
              price="Free"
              description="Basic roasting capabilities"
              features={freeFeatures}
              buttonText="Current Plan"
              onButtonClick={() => setSelectedPlan("free")}
              currentPlan={mockSubscription.plan === "free"}
            />
            
            <PricingCardWrapper
              title="Pro"
              price="$5"
              description="Premium roasting experience"
              features={proFeatures}
              buttonText="Upgrade to Pro"
              popular={true}
              onButtonClick={() => setSelectedPlan("pro")}
              currentPlan={mockSubscription.plan === "pro"}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
              Cancel
            </Button>
            {selectedPlan === "pro" && mockSubscription.plan !== "pro" && (
              <Button className="bg-gradient-flame hover:opacity-90" onClick={handleUpgrade}>
                Confirm Upgrade
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
