
import React, { useState } from 'react';
import BattleLobbyOptions from "@/components/battle/BattleLobbyOptions";
import UserBattlesList from "@/components/battle/UserBattlesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BattleLobby = () => {
  const [activeTab, setActiveTab] = useState<"join" | "my-battles">("join");
  
  return (
    <div className="min-h-screen bg-night flex flex-col">
      <main className="container flex-1 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Battle Lobby</h1>
          <p className="text-muted-foreground">Create, join or manage your roast battles</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "join" | "my-battles")}>
          <TabsList className="mb-6">
            <TabsTrigger value="join">Join Battle</TabsTrigger>
            <TabsTrigger value="my-battles">My Battles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="join">
            <BattleLobbyOptions />
          </TabsContent>
          
          <TabsContent value="my-battles">
            <UserBattlesList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BattleLobby;
