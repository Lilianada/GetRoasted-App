
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Clock, MessageCircle, Users, Award } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface BattleStatisticsProps {
  battleId: string;
  participants: {
    id: string;
    username: string;
    avatar_url?: string;
    score?: number;
  }[];
}

interface RoastData {
  user_id: string;
  content: string;
  round_number: number;
  created_at: string;
}

interface ParticipantStats {
  userId: string;
  username: string;
  totalWords: number;
  avgResponseTime: number;
  roundScores: number[];
  uniqueWords: number;
  wordsByRound: { round: number; wordCount: number }[];
  responseTimeByRound: { round: number; responseTime: number }[];
}

export default function BattleStatistics({ battleId, participants }: BattleStatisticsProps) {
  const [stats, setStats] = useState<ParticipantStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [wordFrequencyData, setWordFrequencyData] = useState<any[]>([]);
  const [compareData, setCompareData] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchBattleStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all roasts for this battle
        const { data: roastsData, error: roastsError } = await supabase
          .from('roasts')
          .select('*')
          .eq('battle_id', battleId)
          .order('created_at', { ascending: true });
          
        if (roastsError) throw roastsError;
        
        // Calculate statistics for each participant
        const participantStats: ParticipantStats[] = [];
        const participantRoasts: Record<string, RoastData[]> = {};
        
        // Group roasts by participant
        for (const roast of (roastsData || [])) {
          if (!participantRoasts[roast.user_id]) {
            participantRoasts[roast.user_id] = [];
          }
          participantRoasts[roast.user_id].push(roast);
        }
        
        // Calculate statistics for each participant
        for (const participant of participants) {
          const userRoasts = participantRoasts[participant.id] || [];
          
          if (userRoasts.length === 0) continue;
          
          // Calculate total words
          const totalWords = userRoasts.reduce((sum, roast) => {
            return sum + (roast.content.match(/\b\w+\b/g) || []).length;
          }, 0);
          
          // Calculate unique words
          const allWords = userRoasts.flatMap(roast => 
            (roast.content.toLowerCase().match(/\b\w+\b/g) || [])
          );
          const uniqueWords = new Set(allWords).size;
          
          // Calculate average response time (simplified - assuming turns alternate perfectly)
          let totalResponseTime = 0;
          let responseTimeCount = 0;
          
          // Words by round
          const wordsByRound = userRoasts.map(roast => ({
            round: roast.round_number,
            wordCount: (roast.content.match(/\b\w+\b/g) || []).length
          }));
          
          // Response time by round (simplified)
          const responseTimeByRound = userRoasts.map((roast, index) => {
            if (index === 0) return { round: roast.round_number, responseTime: 0 };
            
            const prevRoast = userRoasts[index - 1];
            const currentTime = new Date(roast.created_at).getTime();
            const prevTime = new Date(prevRoast.created_at).getTime();
            const responseTime = Math.floor((currentTime - prevTime) / 1000);
            
            totalResponseTime += responseTime;
            responseTimeCount++;
            
            return { round: roast.round_number, responseTime };
          }).filter(item => item.responseTime > 0);
          
          const avgResponseTime = responseTimeCount > 0 
            ? Math.floor(totalResponseTime / responseTimeCount) 
            : 0;
          
          // Mock round scores (in a real app, these would come from the database)
          const roundScores = Array.from({ length: userRoasts.length }, 
            () => Math.floor(Math.random() * 30) + 70);
          
          participantStats.push({
            userId: participant.id,
            username: participant.username,
            totalWords,
            avgResponseTime,
            roundScores,
            uniqueWords,
            wordsByRound,
            responseTimeByRound
          });
        }
        
        // Create word frequency data for chart
        const wordFreq: Record<string, number> = {};
        for (const participant of participantStats) {
          wordFreq[participant.username] = participant.totalWords;
        }
        
        const wordFrequencyChartData = Object.entries(wordFreq).map(([name, value]) => ({
          name,
          words: value
        }));
        
        // Create comparison data for chart
        const compareChartData: any[] = [];
        
        // If we have exactly 2 participants, create round-by-round comparison
        if (participantStats.length === 2) {
          const p1 = participantStats[0];
          const p2 = participantStats[1];
          
          // Find max rounds
          const maxRounds = Math.max(
            p1.wordsByRound.length > 0 ? Math.max(...p1.wordsByRound.map(w => w.round)) : 0,
            p2.wordsByRound.length > 0 ? Math.max(...p2.wordsByRound.map(w => w.round)) : 0
          );
          
          for (let round = 1; round <= maxRounds; round++) {
            const p1WordCount = p1.wordsByRound.find(w => w.round === round)?.wordCount || 0;
            const p2WordCount = p2.wordsByRound.find(w => w.round === round)?.wordCount || 0;
            
            compareChartData.push({
              round: `Round ${round}`,
              [p1.username]: p1WordCount,
              [p2.username]: p2WordCount,
            });
          }
        }
        
        setStats(participantStats);
        setWordFrequencyData(wordFrequencyChartData);
        setCompareData(compareChartData);
      } catch (error) {
        console.error('Error fetching battle statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (battleId && participants.length > 0) {
      fetchBattleStats();
    }
  }, [battleId, participants]);
  
  if (loading) {
    return <div className="p-8 text-center">Loading battle statistics...</div>;
  }

  if (stats.length === 0) {
    return <div className="p-8 text-center">No statistics available for this battle.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-flame-500" />
          Battle Performance Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rounds">Round Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.map((participant) => (
                <Card key={participant.userId} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{participant.username}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Words Used</p>
                        <div className="text-2xl font-bold">{participant.totalWords}</div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Unique Words</p>
                        <div className="text-2xl font-bold">{participant.uniqueWords}</div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Response Time</p>
                        <div className="text-2xl font-bold">{participant.avgResponseTime}s</div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Vocabulary Richness</p>
                        <div className="text-2xl font-bold">
                          {Math.round((participant.uniqueWords / participant.totalWords) * 100)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Word Usage</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wordFrequencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="words" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rounds" className="space-y-4">
            {stats.map((participant) => (
              <Card key={participant.userId}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{participant.username}'s Round Performance</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={participant.wordsByRound.map(item => ({
                        round: `Round ${item.round}`,
                        words: item.wordCount
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="round" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="words" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={participant.responseTimeByRound.map(item => ({
                        round: `Round ${item.round}`,
                        time: item.responseTime
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="round" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="time" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="comparison">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Round-by-Round Comparison</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compareData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="round" />
                      <YAxis />
                      <Tooltip />
                      {stats.map((participant, index) => (
                        <Bar 
                          key={participant.userId}
                          dataKey={participant.username} 
                          fill={index === 0 ? "#8884d8" : "#82ca9d"} 
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
