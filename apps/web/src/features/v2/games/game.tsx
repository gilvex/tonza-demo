import { GameProvider } from "@web/features/games/context/GameContext";
import { DynamicGameContainer } from "./container";

export function Game({ session, mode }: { session?: string | null, mode?: "demo" | "real" }) {
    return (
        <GameProvider session={session} mode={mode}>
            <DynamicGameContainer />
        </GameProvider>
    )
}

