'use client';

import LegalPageShell, { LegalSection } from '@/components/legal/LegalPageShell';
import { marketingAccentSpan, marketingLink } from '@/lib/marketing/marketingTheme';

const LAST_UPDATED = 'May 28, 2026';

export default function PrivacyPage() {
  return (
    <LegalPageShell
      heading={
        <>
          Privacy <span className={marketingAccentSpan}>Policy</span>
        </>
      }
      description="How we collect, use, and protect your information when you use ContentCraft Inspector."
    >
      <p className="text-sm text-white/55">Last updated: {LAST_UPDATED}</p>

      <LegalSection id="introduction" title="1. Introduction">
        <p>
          ContentCraft Inspector (&quot;ContentCraft,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
          provides an AI-powered content workspace for generating, editing, and analyzing written
          content. This Privacy Policy explains how we collect, use, disclose, and safeguard
          information when you use our website, applications, and related services (collectively, the
          &quot;Service&quot;).
        </p>
        <p>
          By using the Service, you agree to the collection and use of information in accordance with
          this policy. If you do not agree, please do not use the Service.
        </p>
      </LegalSection>

      <LegalSection id="information-we-collect" title="2. Information we collect">
        <p>
          <strong className="text-white/90">Account information.</strong> When you register, we
          collect information such as your name, email address, and authentication credentials managed
          through our identity provider.
        </p>
        <p>
          <strong className="text-white/90">Content you provide.</strong> We process text and prompts
          you submit for AI generation, editing, SEO analysis, readability scoring, and AI-detection
          (&quot;Realness Score&quot;) features. This includes drafts, projects, and exported content
          stored in your workspace.
        </p>
        <p>
          <strong className="text-white/90">Usage data.</strong> We collect technical information
          such as IP address, browser type, device identifiers, pages visited, feature usage, and
          error logs to operate and improve the Service.
        </p>
        <p>
          <strong className="text-white/90">Communications.</strong> If you contact us, we retain the
          content of your message and related contact details.
        </p>
      </LegalSection>

      <LegalSection id="how-we-use" title="3. How we use your information">
        <p>We use collected information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide, maintain, and improve the Service</li>
          <li>Authenticate users and manage accounts</li>
          <li>Process AI generation and analysis requests you initiate</li>
          <li>Respond to support inquiries and send service-related notices</li>
          <li>Monitor security, prevent fraud, and enforce our Terms of Service</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          We do <strong className="text-white/90">not</strong> use your content to train our own or
          third-party AI models unless you explicitly opt in to a separate program, if offered.
        </p>
      </LegalSection>

      <LegalSection id="ai-processing" title="4. AI and third-party processing">
        <p>
          To deliver AI features, your prompts and content may be transmitted to third-party AI
          infrastructure providers for processing. These providers process data according to their
          policies and our agreements with them. We select providers that support appropriate
          security and data-handling standards.
        </p>
        <p>
          AI outputs may be inaccurate or incomplete. You are responsible for reviewing content before
          publication or reliance.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="5. How we share information">
        <p>We may share information with:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white/90">Service providers</strong> who assist with hosting,
            authentication, analytics, email, and AI processing
          </li>
          <li>
            <strong className="text-white/90">Team members</strong> you explicitly invite to
            collaborate on shared workspaces
          </li>
          <li>
            <strong className="text-white/90">Legal authorities</strong> when required by law or to
            protect rights, safety, and security
          </li>
          <li>
            <strong className="text-white/90">Business transfers</strong> in connection with a merger,
            acquisition, or asset sale, with notice where required
          </li>
        </ul>
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection id="retention" title="6. Data retention">
        <p>
          We retain account and content data for as long as your account is active or as needed to
          provide the Service. You may delete content within the product where supported. Upon account
          deletion, we delete or anonymize personal data within a reasonable period, except where
          retention is required for legal, security, or backup purposes.
        </p>
      </LegalSection>

      <LegalSection id="security" title="7. Security">
        <p>
          We implement administrative, technical, and organizational measures designed to protect
          your information, including encryption in transit and at rest where applicable. No method of
          transmission or storage is completely secure; we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="8. Your rights and choices">
        <p>
          Depending on your location, you may have rights to access, correct, delete, or port your
          personal data, and to object to or restrict certain processing. To exercise these rights,
          contact us at{' '}
          <a href="mailto:privacy@contentcraftinspector.com" className={marketingLink}>
            privacy@contentcraftinspector.com
          </a>
          .
        </p>
        <p>
          You may update account details in your profile settings. You can opt out of non-essential
          marketing emails using the unsubscribe link in those messages.
        </p>
      </LegalSection>

      <LegalSection id="international" title="9. International users">
        <p>
          If you access the Service from outside the country where our servers are located, your
          information may be transferred to and processed in other jurisdictions that may have
          different data protection laws.
        </p>
      </LegalSection>

      <LegalSection id="children" title="10. Children">
        <p>
          The Service is not directed to individuals under 16. We do not knowingly collect personal
          information from children. If you believe we have collected such information, please contact
          us so we can delete it.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="11. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. We will post the revised version on
          this page and update the &quot;Last updated&quot; date. Material changes may be communicated
          by email or in-product notice.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="12. Contact us">
        <p>
          Questions about this Privacy Policy? Email{' '}
          <a href="mailto:privacy@contentcraftinspector.com" className={marketingLink}>
            privacy@contentcraftinspector.com
          </a>{' '}
          or visit our{' '}
          <a href="/contact" className={marketingLink}>
            Contact page
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
