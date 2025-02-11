"use client";

import { GameContainer } from "@web/features/games/ui/GameContainer";
import { NavigationBar } from "@web/features/navigation/ui/NavigationBar";

export default function GamePage() {
  return (
    <div className="px-4 flex flex-col gap-4 items-center h-screen">
      <NavigationBar balance={100} onAddFunds={() => {}} onBack={() => {}} />
      <GameContainer />
    </div>
  );
}
