"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api-client";

//FIXME: Move this for a specific place for matches
type Match = {
  id: number;
  utcDate: Date;
  status: string;
  matchday: number;
  stage: string;
  group: string;
  lastUpdated: Date;
  areaId: number;
  areaName: string;
  areaCode: string;
  areaFlag: string;
  competitionId: number;
  competitionName: string;
  competitionCode: string;
  competitionType: string;
  competitionEmblem: string;
  seasonId: number;
  seasonStartDate: Date;
  seasonEndDate: Date;
  seasonCurrentMatchday: number;
  seasonWinner: number;
  homeTeamId: number;
  homeTeamName: string;
  homeTeamShortName: string;
  homeTeamTla: string;
  homeTeamCrest: string;
  awayTeamId: number;
  awayTeamName: string;
  awayTeamShortName: string;
  awayTeamTla: string;
  awayTeamCrest: string;
  scoreWinner: string;
  scoreDuration: string;
  scoreFullTimeHome: number;
  scoreFullTimeAway: number;
  scoreHalfTimeHome: number;
  scoreHalfTimeAway: number;
  oddsMsg: string;
};

type MatchesResponse = {
  data: Match[];
  total: number;
  page: number;
  limit: number;
};

export default function Home() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {

      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/pages/profile`
      });
      } catch (error: unknown) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
    } catch (error: unknown) {
      console.error("Sign out failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    const fetchMatches: () => Promise<void> = async () => {
      setMatchesLoading(true);
      try {
        const { data } = await api.get<MatchesResponse>("/matches");
        setMatches(data?.data ?? []);
        setMatchesLoading(false);
      } catch (error: unknown) {
        console.error("Failed to fetch matches:", error);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="pt-6 h-10 flex justify-between items-center gap-2 w-full mx-auto max-w-7xl">
        <Image src={'/next.svg'} alt={'home_logo'} width={180} height={10}/>

        {!session ? (
          <Button variant="outline" size={"lg"} onClick={handleGoogleLogin} disabled={isLoading}>
          <Image src={'/google_icon.svg'} alt={'google_logo'} width={27} height={27}/>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        ) : (
          <Button variant="outline" size={"lg"} onClick={handleSignOut} disabled={isLoading}>
            {isLoading ? "Saindo..." : "Sair"}
          </Button>
      )}
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="mt-10max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Bem vindo ao calendário do futebol Brasileiro
          </h2>
          <p className="text-base text-gray-600 mb-12">
            Seu calendário completo de futebol Brasileiro com alertas de partidas e resultados
          </p>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Partidas</h3>
            {matchesLoading && (
              // FIXME: Put a skeleton loader here from shadcn/ui
              <p className="text-gray-600">Carregando partidas...</p>
            )}
            {matches.length > 0 ? (
              <div className="text-gray-600">
                <p>Encontradas {matches.length} partidas</p>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {matches.map((match) => (
                    <div key={match.id}>
                      <p>{match.homeTeamName} {match.homeTeamShortName} {match.awayTeamName} {match.awayTeamShortName}</p>
                    </div>
                  ))}
                </pre>
              </div>
            ) : (
              <p className="text-gray-600">Nenhuma partida encontrada</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}