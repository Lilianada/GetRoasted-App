
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronUp, FileText, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";

const Terms = () => {
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
      <div className="prose dark:prose-invert flex-1 container py-12 mx-auto">

        <main className="container flex-1 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
              <FileText className="h-8 w-8 text-flame-500" />
              <h1 className="text-3xl font-bold gradient-text">Terms of Service</h1>
            </div>

            <div className="text-sm text-muted-foreground mb-8">
              Last updated: April 15, 2025
            </div>

            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-flame-500">1. Introduction</h2>
                <p className="text-muted-foreground">
                  Welcome to GetRoasted, the premier platform for real-time, gamified roast battles. These Terms of Service ("Terms") govern your access to and use of the GetRoasted website, mobile application, and related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy.
                </p>
                <p className="text-muted-foreground">
                  GetRoasted is owned and operated by GetRoasted, Inc. ("we," "us," or "our"). We reserve the right to modify these Terms at any time. If we make changes, we will provide notice of such changes, such as by sending an email notification, providing notice through the Services, or updating the "Last Updated" date at the top of these Terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-bold text-flame-500">2. Eligibility</h2>
                <p className="text-muted-foreground">
                  You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you meet this eligibility requirement. If you are accessing and using the Services on behalf of a company or other legal entity, you represent and warrant that you have the authority to bind that entity to these Terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-bold text-flame-500">3. Account Registration</h2>
                <p className="text-muted-foreground">
                  To access certain features of the Services, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself. You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
                <p className="text-muted-foreground">
                  We reserve the right to disable your account if we determine, in our sole discretion, that you have violated these Terms or have used the Services in a manner that could harm GetRoasted or other users.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-bold text-flame-500">4. Community Guidelines</h2>
                <p className="text-muted-foreground">
                  GetRoasted is designed to be a platform for creative, witty, and entertaining verbal duels. To maintain a positive environment, we have established the following community guidelines:
                </p>
                <Card className="p-4 border-night-700 bg-secondary/70">
                  <ul className="space-y-2 list-disc pl-5">
                    <li><span className="font-medium">No hate speech</span> - No racism, sexism, homophobia, or other forms of discrimination</li>
                    <li><span className="font-medium">No harassment</span> - Do not target or humiliate specific individuals</li>
                    <li><span className="font-medium">No doxxing</span> - Never share personal information</li>
                    <li><span className="font-medium">Keep it creative</span> - Focus on wit, not cruelty</li>
                    <li><span className="font-medium">Respect the format</span> - Adhere to the battle structure and time limits</li>
                    <li><span className="font-medium">No illegal content</span> - No promotion of illegal activities or substances</li>
                  </ul>
                </Card>
                <p className="text-muted-foreground">
                  Violations of these guidelines may result in content removal, account suspension, or permanent banning from the Services, at our sole discretion.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-bold text-flame-500">5. User Content</h2>
                <p className="text-muted-foreground">
                  The Services allow you to create, post, and share content ("User Content"). You retain ownership of your User Content, but by posting it on GetRoasted, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, modify, create derivative works from, distribute, publicly display, and publicly perform your User Content in connection with operating and providing the Services.
                </p>
                <p className="text-muted-foreground">
                  You are solely responsible for your User Content and the consequences of posting it. By posting User Content, you represent and warrant that:
                </p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                  <li>You own or have obtained all necessary rights and permissions to post the User Content.</li>
                  <li>Your User Content does not infringe upon the intellectual property rights of any third party.</li>
                  <li>Your User Content complies with these Terms and our Community Guidelines.</li>
                </ul>
                <p className="text-muted-foreground">
                  We reserve the right to remove any User Content that violates these Terms or that we determine, in our sole discretion, is harmful, offensive, or otherwise inappropriate.
                </p>
              </section>
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-flame-500">6. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  GetRoasted and its associated logos, designs, text, graphics, and other materials are protected by copyright, trademark, and other intellectual property laws. You may not use, copy, reproduce, modify, create derivative works from, distribute, or publicly display any content from our Services without our prior written permission, except as expressly permitted by these Terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-bold text-flame-500">7. Privacy</h2>
                <p className="text-muted-foreground">
                  Our Privacy Policy describes how we collect, use, and share information about you when you use our Services. By using our Services, you consent to our collection and use of your information as described in our Privacy Policy.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-bold text-flame-500">8. Termination</h2>
                <p className="text-muted-foreground">
                  You may terminate your account at any time by following the instructions in the Settings section of the Services. We reserve the right to suspend or terminate your access to the Services at any time, for any reason, without notice.
                </p>
                <p className="text-muted-foreground">
                  Upon termination, your right to use the Services will immediately cease, but the following provisions of these Terms will survive: Intellectual Property, Disclaimer of Warranties, Limitation of Liability, Indemnification, and General Terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-bold text-flame-500">9. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground">
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR THE SERVERS THAT MAKE THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-bold text-flame-500">10. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL GETROASTED, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES ARISING FROM OR RELATED TO YOUR USE OF THE SERVICES OR THESE TERMS, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL THEORY, WHETHER OR NOT GETROASTED HAS BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-bold text-flame-500">11. Contact Information</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us at legal@getroastedonline.com.
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
      </div>

      {showScrollButton && (
        <Button
          size="icon"
          variant="outline"
          className="fixed bottom-4 right-4 h-10 w-10 rounded-full bg-primary/80 backdrop-blur-sm border-night-700 shadow-lg z-50"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}

      <Footer />
    </div>
  );
};

export default Terms;
