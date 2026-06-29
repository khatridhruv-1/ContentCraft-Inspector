import { redirect } from 'next/navigation';

/** Permanent alias — canonical homepage is `/`. */
export default function WelcomeRedirectPage() {
  redirect('/');
}
