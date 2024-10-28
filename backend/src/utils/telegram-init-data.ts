import * as crypto from 'crypto';

export function validateTelegramInitDataHash(
  initData: string,
  botToken: string,
): boolean {
  const params = new URLSearchParams(initData);

  const receivedHash = params.get('hash');
  params.delete('hash');

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return hmac === receivedHash;
}

export function parseTelegramInitData(initData: string): Record<string, any> {
  const params = new URLSearchParams(initData);
  const obj: Record<string, any> = {};
  for (const [key, value] of params.entries()) {
    if (key === 'user') {
      try {
        obj[key] = JSON.parse(value);
      } catch (error) {
        console.error(`Error parsing user field: ${error}`);
      }
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
