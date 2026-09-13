import 'server-only';
import bcrypt from 'bcryptjs';
import { HttpError } from './errors';
// Valid fixed bcrypt hash at cost 12: nonexistent accounts still pay comparison cost.
const DUMMY = '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW';
export function validatePassword(password: string) {
  if ([...password].length < 15 || Buffer.byteLength(password, 'utf8') > 72) throw new HttpError(400, 'Use uma senha de pelo menos 15 caracteres e no máximo 72 bytes.');
  if (/^(.)\1+$/u.test(password) || /^(?:password|senha|123456789|qwerty|abcdefgh|letmein|admin)[\d\W]*$/i.test(password)) throw new HttpError(400, 'Escolha uma senha menos previsível.');
}
export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export async function checkPassword(password: string, hash?: string) {
  const result = await bcrypt.compare(password, hash ?? DUMMY);
  return Boolean(hash && result);
}
