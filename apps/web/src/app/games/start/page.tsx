"use client";

import { useSearchParams } from "next/navigation";
import { GameContainer } from "@web/features/games/ui/GameContainer";
import { useMobuleWebhook } from "@web/features/games/hooks/useMobuleWebhook";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@web/shared/trpc/client";

export const dynamic = "force-dynamic";

export default function GamePage() {
  const searchParams = useSearchParams();
  const gameAlias = searchParams?.get("game.alias");
  const currency = searchParams?.get("currency");
  // const lang = searchParams?.get("lang");
  const session = searchParams?.get("partner.session");

  const api = useTRPC();
  const { checkSession } = useMobuleWebhook({
    session,
    currency,
  });

  const lastUnfinishedGame = useQuery(
    api.game.getLastUnfinishedGame.queryOptions(
      {
        userId: checkSession.data?.id_player || "",
      },
      {
        enabled: !!checkSession.data?.id_player,
      }
    )
  );

  // console.log(lastUnfinishedGame.data);
  // const userId = checkSession.data?.id_player;
  // const userBalance: number | undefined = checkBalance.data?.balance;

  // const lastGame = useQuery(
  //   api.game..queryOptions({
  //     userId,
  //   })
  // );

  if (gameAlias !== "mines") {
    return <div>Invalid game</div>;
  }

  return (
    <div className="w-full h-screen">
      <GameContainer
        mode="real"
        session={session}
        lastUnfinishedGame={lastUnfinishedGame}
      />
    </div>
  );
}
