
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Flame, ArrowRight } from "lucide-react";
import JoinWithCodeForm from "./JoinWithCodeForm";

const BattleLobbyOptions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-secondary border-2 border-black p-6">
        <CardContent className="flex flex-col items-center justify-center gap-6 h-full p-0">
          <div className="bg-flame-500 rounded-full p-4">
            <Flame className="h-10 w-10 text-white" />
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Create a Battle</h3>
            <p className="text-muted-foreground mb-6">
              Start a new battle and get a 6-digit code to share with your opponent
            </p>
            
            <Link to="/battles/new">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all relative border-2 border-black shadow-neo font-geist rounded-none bg-flame-500 hover:bg-flame-600 text-white h-10 px-4 py-2 hover:shadow-neo-hover hover:-translate-y-1 hover:translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-neo">
                <Flame className="h-4 w-4" />
                Create New Battle
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-secondary border-2 border-black p-6">
        <CardContent className="flex flex-col items-center justify-center gap-6 h-full p-0">
          <div className="bg-purple rounded-full p-4">
            <ArrowRight className="h-10 w-10 text-white" />
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Join a Battle</h3>
            <p className="text-muted-foreground mb-6">
              Enter a 6-digit code to join an existing battle
            </p>
            
            <JoinWithCodeForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BattleLobbyOptions;
