"use client";

import { useSearchParams } from 'next/navigation';
import { GameContainer } from "@web/features/games/ui/GameContainer";
import { useMobuleWebhook } from "@web/features/games/hooks/useMobuleWebhook";

export const dynamic = 'force-dynamic';

export default function GamePage() {
  const searchParams = useSearchParams();
  const gameAlias = searchParams?.get('game.alias');
  const currency = searchParams?.get('currency');
  const lang = searchParams?.get('lang');
  const session = searchParams?.get('partner.session');

  const { checkBalance } = useMobuleWebhook({
    session,
    currency
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
        userBalance={checkBalance}
      />
    </div>
  );
} 