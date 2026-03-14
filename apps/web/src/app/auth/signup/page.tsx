import { redirect } from 'next/navigation';

/**
 * Invict Academy is invite-only.
 * Clients receive their login credentials directly from staff.
 * Public registration is not available.
 */
export default function SignupPage() {
    redirect('/auth/login');
}
