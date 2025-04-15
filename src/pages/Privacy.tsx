
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Flame, ShieldCheck, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const Privacy = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <div className="min-h-screen bg-night flex flex-col">
      <NavBar />
      
      <main className="container flex-1 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-flame-500" />
            <h1 className="text-3xl font-bold gradient-text">Privacy Policy</h1>
          </div>
          
          <div className="text-sm text-muted-foreground mb-8">
            Last updated: April 15, 2025
          </div>
          
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-flame-500">1. Introduction</h2>
              <p className="text-muted-foreground">
                GetRoasted ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and related services (collectively, the "Services").
              </p>
              <p className="text-muted-foreground">
                By accessing or using our Services, you consent to the collection, use, and storage of your information as described in this Privacy Policy. Please read this Privacy Policy carefully. If you disagree with our practices, please do not use our Services.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-flame-500">2. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information that you provide directly to us, information we collect automatically, and information from third parties.
              </p>
              
              <h3 className="text-lg font-semibold">Information You Provide</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li><span className="font-medium">Account Information:</span> When you register for an account, we collect your name, email address, username, and password.</li>
                <li><span className="font-medium">Profile Information:</span> You may choose to provide additional information in your profile, such as a profile picture, bio, or social media handles.</li>
                <li><span className="font-medium">User Content:</span> We collect the content you create, share, or upload, including text, images, or audio for roast battles.</li>
                <li><span className="font-medium">Communications:</span> If you contact us directly, we may collect information you provide in your communications.</li>
              </ul>
              
              <h3 className="text-lg font-semibold">Information We Collect Automatically</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li><span className="font-medium">Device Information:</span> We collect device information, including IP address, device type, operating system, and browser type.</li>
                <li><span className="font-medium">Usage Information:</span> We collect information about your use of our Services, including the pages you visit, the time and duration of your visits, and the content you interact with.</li>
                <li><span className="font-medium">Location Information:</span> With your consent, we may collect precise location information from your device.</li>
                <li><span className="font-medium">Cookies and Similar Technologies:</span> We use cookies and similar tracking technologies to collect information about your browsing activities.</li>
              </ul>
              
              <h3 className="text-lg font-semibold">Information from Third Parties</h3>
              <p className="text-muted-foreground">
                We may receive information about you from third parties, such as:
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li><span className="font-medium">Authentication Providers:</span> If you sign up or log in using a third-party service (like Google), we may receive information from that service, such as your name and email address.</li>
                <li><span className="font-medium">Analytics Providers:</span> We work with analytics providers who help us understand how users interact with our Services.</li>
              </ul>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-flame-500">3. How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li><span className="font-medium">Provide and Improve the Services:</span> We use your information to operate and improve our Services, develop new features, and ensure the technical functionality of our Services.</li>
                <li><span className="font-medium">Personalize Your Experience:</span> We use your information to personalize your experience, including showing you content and features that may be of interest to you.</li>
                <li><span className="font-medium">Communication:</span> We use your email address to communicate with you about your account, updates to our Services, and marketing messages (which you can opt out of).</li>
                <li><span className="font-medium">Safety and Security:</span> We use your information to protect the safety and security of our Services and our users, including monitoring for and preventing fraudulent activity and violations of our Terms of Service.</li>
                <li><span className="font-medium">Legal Compliance:</span> We use your information to comply with applicable legal obligations, such as responding to legal process or government requests.</li>
              </ul>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-flame-500">4. How We Share Your Information</h2>
              <p className="text-muted-foreground">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li><span className="font-medium">With Other Users:</span> Your profile information and any content you post on the Services will be visible to other users according to your privacy settings.</li>
                <li><span className="font-medium">Service Providers:</span> We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf.</li>
                <li><span className="font-medium">Business Transfers:</span> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
                <li><span className="font-medium">Legal Requirements:</span> We may disclose your information if required to do so by law or in response to valid requests from public authorities.</li>
                <li><span className="font-medium">With Your Consent:</span> We may share your information with third parties when we have your consent to do so.</li>
              </ul>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-flame-500">5. Your Rights and Choices</h2>
              <p className="text-muted-foreground">
                You have certain rights and choices regarding your information:
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li><span className="font-medium">Account Information:</span> You can update your account information through the Settings section of our Services.</li>
                <li><span className="font-medium">Email Communications:</span> You can opt out of receiving promotional emails from us by following the unsubscribe instructions in the emails.</li>
                <li><span className="font-medium">Cookies:</span> Most web browsers are set to accept cookies by default. You can usually set your browser to remove or reject cookies.</li>
                <li><span className="font-medium">Do Not Track:</span> We do not currently respond to Do Not Track signals.</li>
              </ul>
              <p className="text-muted-foreground">
                Depending on your location, you may have additional rights under applicable data protection laws, such as the right to access, correct, delete, or restrict processing of your personal information.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-flame-500">6. Data Security</h2>
              <p className="text-muted-foreground">
                We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-flame-500">7. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we learn we have collected personal information from a child under 18, we will delete that information as quickly as possible. If you believe a child under 18 has provided us with personal information, please contact us.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-flame-500">8. International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to, and processed in, countries other than the country in which you are resident. These countries may have data protection laws that are different from the laws of your country. By using our Services, you consent to the transfer of your information to these countries.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-flame-500">9. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. If we make material changes to this Privacy Policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-flame-500">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-muted-foreground">
                GetRoasted, Inc.<br />
                123 Flame Street<br />
                Suite 400<br />
                San Francisco, CA 94107<br />
                privacy@getroasted.com
              </p>
            </section>
          </div>
          
          <div className="mt-12 flex items-center justify-center">
            <Button 
              variant="outline" 
              className="gap-2 border-night-700"
              asChild
            >
              <Link to="/">
                <Flame className="h-4 w-4" />
                <span>Return to Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      {showScrollButton && (
        <Button
          size="icon"
          variant="outline"
          className="fixed bottom-4 right-4 h-10 w-10 rounded-full bg-night-800/80 backdrop-blur-sm border-night-700 shadow-lg z-50"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
      
      <footer className="border-t border-night-800 py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 GetRoasted. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link to="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-flame-500 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
