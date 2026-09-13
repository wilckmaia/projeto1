import { PasswordRecoveryForm } from '@/components/PasswordRecoveryForm';
export const metadata = { title: 'Redefinir senha - Politika', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default function ResetPage() { return <PasswordRecoveryForm reset />; }
