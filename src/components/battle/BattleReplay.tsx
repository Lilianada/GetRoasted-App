
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, Pause, SkipBack, SkipForward, RotateCcw, 
  Clock, Share2, MessageCircle, Award 
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";

interface RoastData {
  id: string;
  content: string;
  user_id: string;
  round_number: number;
  created_at: string;
  profile?: {
    username: string;
    avatar_url: string | null;
  };
}

interface BattleReplayProps {
  battleId: string;
  participants: {
    id: string;
    username: string;
    avatar_url?: string;
    score?: number;
  }[];
}

export default function BattleReplay({ battleId, participants }: BattleReplayProps) {
  const [roasts, setRoasts] = useState<RoastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const fetchRoasts = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('roasts')
          .select('*, profile:profiles!user_id(username, avatar_url)')
          .eq('battle_id', battleId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        setRoasts(data || []);
      } catch (error) {
        console.error('Error fetching roasts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoasts();
  }, [battleId]);
  
  useEffect(() => {
    // Calculate progress percentage
    if (roasts.length > 0) {
      setProgress((currentIndex / (roasts.length - 1)) * 100);
    }
  }, [currentIndex, roasts.length]);
  
  useEffect(() => {
    // Auto-play functionality
    let playInterval: NodeJS.Timeout;
    
    if (isPlaying && currentIndex < roasts.length - 1) {
      playInterval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex < roasts.length - 1) {
            return prevIndex + 1;
          } else {
            setIsPlaying(false);
            return prevIndex;
          }
        });
      }, 3000 / playbackSpeed); // Adjust speed based on playbackSpeed
    }
    
    return () => {
      if (playInterval) clearInterval(playInterval);
    };
  }, [isPlaying, currentIndex, roasts.length, playbackSpeed]);
  
  const handlePlay = () => {
    if (currentIndex === roasts.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };
  
  const handleNext = () => {
    if (currentIndex < roasts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(false);
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(false);
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    const targetIndex = Math.floor((value[0] / 100) * (roasts.length - 1));
    setCurrentIndex(targetIndex);
    setIsPlaying(false);
  };
  
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`Check out this battle: ${window.location.origin}/battles/${battleId}`);
      toast.success("Battle link copied to clipboard!");
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("Failed to copy link");
    }
  };
  
  if (loading) {
    return <div className="p-8 text-center">Loading battle replay...</div>;
  }
  
  if (roasts.length === 0) {
    return <div className="p-8 text-center">No roasts found for this battle.</div>;
  }
  
  const currentRoast = roasts[currentIndex];
  const currentUser = participants.find(p => p.id === currentRoast.user_id);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-flame-500" />
            Battle Replay
          </div>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Playback controls */}
        <div className="bg-night-800 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              Round {currentRoast.round_number}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(currentRoast.created_at).toLocaleString()}
            </Badge>
          </div>
          
          {/* Current roast display */}
          <div className="bg-night-700 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarImage src={currentUser?.avatar_url} />
                <AvatarFallback>
                  {currentUser?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{currentUser?.username}</h3>
                <p className="text-xs text-gray-400">Roast #{currentIndex + 1}</p>
              </div>
            </div>
            <div className="p-3 bg-night-600 rounded-lg text-white">
              {currentRoast.content}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="pt-2">
            <Progress value={progress} className="h-1 mb-1" />
            <div className="text-xs flex justify-between text-gray-400">
              <span>Start</span>
              <span>{currentIndex + 1} / {roasts.length}</span>
              <span>End</span>
            </div>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="icon" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentIndex === 0}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button 
              variant={isPlaying ? "default" : "outline"} 
              size="icon" 
              onClick={handlePlay}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext} 
              disabled={currentIndex === roasts.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <div className="ml-2">
              <select 
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-transparent text-sm border border-gray-600 rounded p-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>
          
          {/* Timeline scrubber */}
          <div className="pt-2">
            <Slider
              defaultValue={[0]}
              value={[progress]}
              max={100}
              step={1}
              onValueChange={handleSliderChange}
            />
          </div>
        </div>
        
        {/* Highlights or key moments could go here */}
        <Card className="bg-yellow/10">
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4" />
              Battle Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <div className="space-y-2">
              {[...roasts]
                .sort((a, b) => b.content.length - a.content.length)
                .slice(0, 2)
                .map(roast => {
                  const player = participants.find(p => p.id === roast.user_id);
                  return (
                    <Button 
                      key={roast.id} 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => {
                        const index = roasts.findIndex(r => r.id === roast.id);
                        if (index !== -1) setCurrentIndex(index);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {player?.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="truncate flex-1">
                          <p className="truncate text-xs">
                            {roast.content.length > 30 
                              ? roast.content.substring(0, 30) + '...' 
                              : roast.content}
                          </p>
                        </div>
                      </div>
                    </Button>
                  );
                })
              }
            </div>
          </CardContent>
        </Card>
      </CardContent>
      
      <CardFooter className="bg-night-800 p-4">
        <div className="flex justify-between items-center w-full">
          <Button variant="outline" size="sm" onClick={handleRestart}>
            Restart
          </Button>
          <div className="text-sm">
            {Math.round((currentIndex / (roasts.length - 1)) * 100)}% Complete
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
