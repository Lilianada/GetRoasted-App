
import { Link } from "react-router-dom";


import { Button } from "@/components/ui/button";
import { Flame, ShieldCheck, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

import ReactMarkdown from 'react-markdown';
import privacyContent from '@/content/privacy.md';

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

      <div className="prose dark:prose-invert">
        <ReactMarkdown>{privacyContent}</ReactMarkdown>
      </div>

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
