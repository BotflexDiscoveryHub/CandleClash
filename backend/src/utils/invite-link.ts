export function getInviteLink(botUsername: string, telegramId: string): string {
  return `https://t.me/${botUsername}?start=ref_${telegramId}`;
}
