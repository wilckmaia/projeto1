import 'server-only';
import bcrypt from 'bcryptjs';
import { HttpError } from './errors';
import { passwordError } from './password-policy';
// Valid fixed bcrypt hash at cost 12: nonexistent accounts still pay comparison cost.
const DUMMY = '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW';
export function validatePassword(password: string) {
  const error = passwordError(password);
  if (error) throw new HttpError(400, error);
}
export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export async function checkPassword(password: string, hash?: string) {
  const result = await bcrypt.compare(password, hash ?? DUMMY);
  return Boolean(hash && result);
}
