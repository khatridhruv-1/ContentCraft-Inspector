import type { Metadata } from 'next';
import WelcomeClient from './WelcomeClient';

export const metadata: Metadata = {
  title: 'Welcome to ContentCraft-Inspector',
  description:
    "Content creation with ContentCraft-Inspector's AI platform. Create, analyze, and optimize content with smart editing tools and deep insights. Try it free today!",
};

export default function WelcomePage() {
  return <WelcomeClient />;
}
