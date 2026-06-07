/** Shared color palette used for roulette option segments. */
export const OPTION_COLORS = [
  "#E07B54", // primary orange
  "#84A98C", // sage green
  "#9B59B6", // purple
  "#F4C430", // golden yellow
  "#6BA8C4", // sky blue
  "#E8866E", // coral
  "#5BAD8A", // teal
  "#C0776A", // dusty rose
];

export function getOptionColor(index: number): string {
  return OPTION_COLORS[index % OPTION_COLORS.length];
}
