
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserBattlesList from "@/components/battle/UserBattlesList";
import BattleLobbyOptions from "@/components/battle/BattleLobbyOptions";
import { useAuthContext } from "@/context/AuthContext";

const BattleLobby = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<string>(user ? "myBattles" : "joinBattle");
  
  return (
    <div className="min-h-screen bg-night flex flex-col">
      <main className="container flex-1 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Battle Lobby</h1>
          <p className="text-muted-foreground">Create, join or manage your roast battles</p>
        </div>
        
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="myBattles">My Battles</TabsTrigger>
            <TabsTrigger value="joinBattle">Join Battle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="myBattles" className="mt-0">
            <UserBattlesList />
          </TabsContent>
          
          <TabsContent value="joinBattle" className="mt-0">
            <BattleLobbyOptions />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BattleLobby;
