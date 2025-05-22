export const convertServerGrid = (serverGrid: string[][]) => {
  return (serverGrid as ("bomb" | "gem" | "hidden")[][])
    .flat()
    .map((cell) => {
      // console.log("cell", cell);
      return {
        isBomb: cell === "bomb",
        isRevealed: cell !== "hidden",
        isGem: cell === "gem",
      }
    });
};
