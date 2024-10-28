export function calculateLiquidity(
  liquidity: number,
  lastRequestAt: number,
): number {
  return Math.round(
    liquidity < 100
      ? (liquidity +=
          (Math.round(Date.now() / 1000) - lastRequestAt) / (30 * 1000) > 100
            ? 100
            : (liquidity += (Date.now() / 1000 - lastRequestAt) / (30 * 1000)))
      : 100,
  );
}
