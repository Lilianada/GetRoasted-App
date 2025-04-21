
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-night p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="relative h-20 w-20">
            <Flame className="h-20 w-20 text-flame-600 animate-flame-pulse" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4 gradient-text">This Roast Got Burned</h2>
        
        <p className="text-muted-foreground mb-8">
          Looks like the page you're looking for went up in flames. 
          Maybe it couldn't handle the heat of our savage roasts.
        </p>
        
        <Button asChild className="gap-2 bg-yellow hover:opacity-90">
          <Link to="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
