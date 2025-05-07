
import React from 'react';
import BattleLobbyOptions from "@/components/battle/BattleLobbyOptions";

const BattleLobby = () => {
  return (
    <div className="min-h-screen bg-night flex flex-col">
      <main className="container flex-1 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Battle Lobby</h1>
          <p className="text-muted-foreground">Create or join a roast battle</p>
        </div>
        
        <BattleLobbyOptions />
      </main>
    </div>
  );
};

export default BattleLobby;
