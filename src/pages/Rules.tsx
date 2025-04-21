
import { Flame } from "lucide-react";


import { Card } from "@/components/ui/card";

const Rules = () => {
  return (
    <div className="min-h-screen bg-night flex flex-col">
      
      
      
      <main className="container flex-1 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Flame className="h-8 w-8 text-flame-600 animate-flame-pulse" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Battle Rules</h1>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-yellow border-2 border-black">
              <h2 className="text-xl font-bold mb-3">1. The Basics</h2>
              <p className="text-muted-foreground">
                GetRoasted is a platform for witty, creative verbal duels. Our battles are meant to be entertaining and 
                challenging, not harmful or degrading. Remember: roast the performance, not the person.
              </p>
            </Card>
            
            <Card className="bg-yellow border-2 border-black">
              <h2 className="text-xl font-bold mb-3">2. Battle Structure</h2>
              <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                <li>Each battle consists of 3 rounds maximum</li>
                <li>3-minute timer per participant per round</li>
                <li>Text-only roasts (voice/video coming soon)</li>
                <li>30-second grace period between rounds</li>
                <li>20-second inactivity warning triggers auto-forfeit</li>
              </ul>
            </Card>
            
            <Card className="bg-yellow border-2 border-black">
              <h2 className="text-xl font-bold mb-3">3. Judging System</h2>
              <p className="text-muted-foreground mb-3">
                Battles are scored across three dimensions:
              </p>
              <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                <li><span className="text-flame-500">Creativity</span> (0-5 stars) - Originality and cleverness</li>
                <li><span className="text-flame-500">Humor</span> (0-5 stars) - How funny the roast is</li>
                <li><span className="text-flame-500">Savagery</span> (0-5 stars) - Impact and boldness</li>
              </ul>
              <div className="mt-4 p-3 border border-night-700 rounded-md bg-night/50">
                <p className="text-sm">
                  <span className="text-flame-500 font-medium">Scoring Formula:</span>{" "}
                  Total Score = (Avg Creativity × 2) + (Avg Humor × 3) + (Avg Savagery × 1)
                </p>
              </div>
            </Card>
            
            <Card className="bg-yellow border-2 border-black">
              <h2 className="text-xl font-bold mb-3">4. Community Guidelines</h2>
              <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                <li><span className="font-medium">No hate speech</span> - No racism, sexism, homophobia, or other forms of discrimination</li>
                <li><span className="font-medium">No harassment</span> - Do not target or humiliate specific individuals</li>
                <li><span className="font-medium">No doxxing</span> - Never share personal information</li>
                <li><span className="font-medium">Keep it creative</span> - Focus on wit, not cruelty</li>
                <li><span className="font-medium">Three-strike system</span> - Violations may result in temporary or permanent bans</li>
              </ul>
            </Card>
            
            <Card className="bg-yellow border-2 border-black">
              <h2 className="text-xl font-bold mb-3">5. Rewards & Recognition</h2>
              <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                <li>"Top Roaster" badges for exceptional performances</li>
                <li>Win/loss records tracked on your profile</li>
                <li>Hall of Fame features for highest-rated roasts</li>
                <li>Special events and tournaments with unique rewards</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-night-800 py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 GetRoasted. All rights reserved. Keep it fiery, keep it fair.</p>
        </div>
      </footer>
    </div>
  );
};

export default Rules;
