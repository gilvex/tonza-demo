"use client";

import { useSearchParams } from 'next/navigation';
import { GameContainer } from "@web/features/games/ui/GameContainer";

export const dynamic = 'force-dynamic';

export default function GamePage() {
  const searchParams = useSearchParams();
  const gameAlias = searchParams?.get('game.alias');
  const currency = searchParams?.get('currency');
  const lang = searchParams?.get('lang');
  const session = searchParams?.get('partner.session');
  
  // Validate required parameters
  if (!gameAlias || gameAlias !== 'mines') {
    return <div>Invalid game</div>;
  }
  
  return (
    <div className="w-full h-screen">
      {Array.from(searchParams?.entries() ?? []).map(([key, value]) => (
        <div key={key}>{key}: {value}</div>
      ))}
      <GameContainer 
        mode="real"
        session={session}
        currency={currency}
        lang={lang}
      />
    </div>
  );
} 