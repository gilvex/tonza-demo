export type GamePhase = "initial" | "running" | "cashOut" | "bombed" | "result:lose" | "result:win";

export interface Multiplier {
  value: string;
  factor: number;
  borderColor: string;
  backgroundColor?: string;
  growColor: string;
}
