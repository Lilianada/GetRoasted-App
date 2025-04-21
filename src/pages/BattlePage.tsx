
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { BattleChat } from "@/components/BattleChat";
import { BattleVotePanel } from "@/components/BattleVotePanel";
import BattleTimer from "@/components/BattleTimer";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useBattle, useBattleParticipants, useSpectatorCount, useBattleVotes, useVoteMutation } from '@/hooks/useBattleData';
import type { Participant } from '@/types/battle';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';


const BattlePage = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [battleEnded, setBattleEnded] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);

  // --- React Query hooks ---
  const {
    data: battle,
    isLoading: battleLoading,
    isError: battleError,
    error: battleErrObj,
  } = useBattle(battleId);
  const {
    data: participants,
    isLoading: participantsLoading,
    isError: participantsError,
    error: participantsErrObj,
  } = useBattleParticipants(battleId);
  const {
    data: spectatorCount = 0,
    isLoading: spectatorLoading,
    isError: spectatorError,
    error: spectatorErrObj,
  } = useSpectatorCount(battleId);
  const {
    data: votes,
    isLoading: votesLoading,
    isError: votesError,
    error: votesErrObj,
  } = useBattleVotes(battleId);

  // --- Participation logic ---
  const isParticipant = !!participants?.find(p => p.id === user?.id);

  // --- Centralized error handling ---
  if (!battleId) {
    return <div>Invalid battle ID</div>;
  }
  if (battleError || participantsError || spectatorError || votesError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night text-red-600">
        <h2 className="text-2xl font-bold mb-2">Failed to load battle data</h2>
        <div className="mb-4">
          {battleErrObj?.message || participantsErrObj?.message || spectatorErrObj?.message || votesErrObj?.message}
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // --- Loading state ---
  if (battleLoading || participantsLoading || spectatorLoading) {
    return (
      <div className="min-h-screen bg-night flex flex-col">
        <div className="container py-6">
          <Skeleton className="h-8 mb-6" />
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Skeleton className="h-16 mb-3" />
              <Skeleton className="h-8 mb-3" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Voting logic ---
  // --- Voting logic ---
  // Move vote upsert logic to a custom hook
  // Use mutation from React Query for voting
  import { useVoteMutation } from '@/hooks/useBattleData'; // (move to top of file)
  const voteMutation = useVoteMutation();

  const handleVote = async (userId: string) => {
    if (!user || !battleId) return;
    voteMutation.mutate(
      { battleId, voterId: user.id, votedForId: userId, score: 1 },
      {
        onSuccess: () => {
          setVotedFor(userId);
          setVoteSubmitted(true);
          toast.success('Thank you for voting!');
        },
        onError: (err: any) => {
          toast.error('Failed to submit vote: ' + err.message);
        },
      }
    );
  };


  // --- Battle duration ---
  const battleDuration = battle?.roundCount ? battle.roundCount * 60 : 120;

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate('/battles')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Battles
          </Button>
          {isParticipant ? (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-700 text-white rounded-full">You are battling!</span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900 text-white rounded-full">You are watching as a spectator</span>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <BattleTimer
              initialSeconds={battleDuration}
              isActive={!battleEnded}
              onTimeout={() => setBattleEnded(true)}
              showWarningAt={30}
            />
            <div className="my-3 text-right text-night-400">Spectators: {spectatorCount}</div>
            <BattleChat
              battleId={battleId}
              user={{ id: user?.id, username: user?.user_metadata?.username || user?.email || 'User', avatar_url: user?.user_metadata?.avatar_url }}
              canSend={isParticipant && !battleEnded}
            />
            {battleEnded && !isParticipant && !voteSubmitted && (
              <BattleVotePanel
                participants={participants as Participant[]}
                onVote={handleVote}
                votedFor={votedFor}
                disabled={voteSubmitted}
              />
            )}
            {battleEnded && !isParticipant && voteSubmitted && (
              <div className="text-green-600 text-center mt-4">Thank you for voting!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
