export function getToday(): string {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function getYesterday(): string {
  const yesterdayTimestamp = Date.now() - 24 * 60 * 60 * 1000;
  return new Date(yesterdayTimestamp).toISOString().split('T')[0];
}

export function getTomorrow(): string {
  const tomorrowTimestamp = Date.now() + 24 * 60 * 60 * 1000;
  return new Date(tomorrowTimestamp).toISOString().split('T')[0];
}

export function updateDatesOfVisits(dates: string[]): string[] {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  if (dates.includes(today)) {
    return dates;
  } else if (
    !dates.includes(today) &&
    dates[dates.length - 1] == getYesterday()
  ) {
    dates.push(today);
    return dates;
  } else {
    return [today];
  }
}

export function scheduleLiquidityPoolsUpdate(): string {
  const tomorrowTimestamp = Date.now() + 24 * 60 * 60 * 1000;
  const tomorrow = new Date(tomorrowTimestamp).toISOString().split('T')[0]; // YYYY-MM-DD format
  return tomorrow;
}
