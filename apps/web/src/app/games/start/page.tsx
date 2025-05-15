"use client";

import { useSearchParams } from 'next/navigation';
import { GameContainer } from "@web/features/games/ui/GameContainer";
import { useQuery } from "@tanstack/react-query";

export const dynamic = 'force-dynamic';

export default function GamePage() {
  const searchParams = useSearchParams();
  const gameAlias = searchParams?.get('game.alias');
  const currency = searchParams?.get('currency');
  const lang = searchParams?.get('lang');
  const session = searchParams?.get('partner.session');

  const { data: balanceData } = useQuery({
    queryKey: ['balance', session, currency],
    queryFn: async () => {
      if (!session) return { balance: 0 };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_CENTRAL_API}/api/mobule/check.session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session,
          "game.provider": "tonza",
          currency: currency || 'USD'
        }),
      });

      const data = await response.json();
      return data.response.balance;
    },
    enabled: !!session,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  if (gameAlias !== 'mines') {
    return <div>Invalid game</div>;
  }
  
  return (
    <div className="w-full h-screen">
      <GameContainer 
        mode="real"
        session={session}
        currency={currency}
        lang={lang}
        userBalance={balanceData || 0}
      />
    </div>
  );
} 