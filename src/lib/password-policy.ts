export const passwordHint = 'Use pelo menos 15 caracteres, no máximo 72 bytes e evite senhas previsíveis.';
export function passwordError(password: string): string | null {
  if ([...password].length < 15 || new TextEncoder().encode(password).length > 72) return 'Use uma senha de pelo menos 15 caracteres e no máximo 72 bytes.';
  if (/^(.)\1+$/u.test(password) || /^(?:password|senha|123456789|qwerty|abcdefgh|letmein|admin)[\d\W]*$/i.test(password)) return 'Escolha uma senha menos previsível.';
  return null;
}
