"use client";

import { useSearchParams } from 'next/navigation';
import { GameContainer } from "@web/features/games/ui/GameContainer";

export const dynamic = 'force-dynamic';

export default function GamePage() {
  const searchParams = useSearchParams();
  const gameAlias = searchParams?.get('game.alias');
  const currency = searchParams?.get('currency');
  const lang = searchParams?.get('lang');

  // Validate required parameters
  if (!gameAlias || gameAlias !== 'mines') {
    return <div>Invalid game</div>;
  }

  return (
    <div className="w-full h-screen">
      <GameContainer 
        mode="demo"
        currency={currency}
        lang={lang}
      />
    </div>
  );
} 