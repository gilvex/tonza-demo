"use client";

import { useSearchParams } from "next/navigation";
import { Game } from "@web/features/v2/games/game";

export const dynamic = "force-dynamic";

export default function GamePage() {
  const searchParams = useSearchParams();
  const gameAlias = searchParams?.get("game.alias");
  // const currency = searchParams?.get("currency");
  // const lang = searchParams?.get("lang");
  const session = searchParams?.get("partner.session");

  if (gameAlias !== "mines") {
    return <div>Invalid game</div>;
  }

  return (
    <div className="w-full h-screen">
      <Game session={session} mode={"real"} />
    </div>
  );
}
