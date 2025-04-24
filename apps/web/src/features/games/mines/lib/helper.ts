export const convertServerGrid = (serverGrid: string[][]) => {
  return (serverGrid as ("bomb" | "success" | "hidden")[][])
    .flat()
    .map((cell) => ({
      isBomb: cell === "bomb",
      isRevealed: cell !== "hidden",
      isGem: cell === "success",
    }));
};
