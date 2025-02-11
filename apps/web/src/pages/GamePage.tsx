"use client";

import { GameContainer } from "@web/features/games/ui/GameContainer";
import { NavigationBar } from "@web/features/navigation/ui/NavigationBar";

export default function GamePage() {
  return (
    <div className="p-4 flex flex-col gap-4 items-center *:max-w-[90vw]">
      <NavigationBar balance={100} onAddFunds={() => {}} onBack={() => {}} />
      <GameContainer />
    </div>
  );
}
