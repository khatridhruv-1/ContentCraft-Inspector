'use client';

import LegalPageShell, { LegalSection } from '@/components/legal/LegalPageShell';
import { marketingAccentSpan, marketingLink } from '@/lib/marketing/marketingTheme';

const LAST_UPDATED = 'May 28, 2026';

export default function TermsPage() {
  return (
    <LegalPageShell
      badge="Terms of Service"
      heading={
        <>
          Terms of <span className={marketingAccentSpan}>Service</span>
        </>
      }
      description="The rules and guidelines for using ContentCraft Inspector."
    >
      <p className="text-sm text-white/55">Last updated: {LAST_UPDATED}</p>

      <LegalSection id="agreement" title="1. Agreement to terms">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of ContentCraft
          Inspector (the &quot;Service&quot;) operated by ContentCraft Inspector (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;). By creating an account or using the Service, you agree
          to these Terms and our{' '}
          <a href="/privacy" className={marketingLink}>
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="2. Eligibility">
        <p>
          You must be at least 16 years old and able to form a binding contract to use the Service.
          If you use the Service on behalf of an organization, you represent that you have authority
          to bind that organization to these Terms.
        </p>
      </LegalSection>

      <LegalSection id="accounts" title="3. Accounts">
        <p>
          You are responsible for maintaining the confidentiality of your login credentials and for
          all activity under your account. Notify us promptly at{' '}
          <a href="mailto:support@contentcraftinspector.com" className={marketingLink}>
            support@contentcraftinspector.com
          </a>{' '}
          if you suspect unauthorized access.
        </p>
        <p>
          We may suspend or terminate accounts that violate these Terms or pose security or legal
          risk.
        </p>
      </LegalSection>

      <LegalSection id="service" title="4. The Service">
        <p>
          ContentCraft Inspector provides tools for AI-assisted content generation, editing, SEO and
          readability analysis, and AI-detection scoring. Features may vary by plan. We may modify,
          suspend, or discontinue features with reasonable notice where practicable.
        </p>
        <p>
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. AI
          outputs are generated automatically and may contain errors, bias, or inaccuracies. You are
          solely responsible for reviewing and using outputs appropriately.
        </p>
      </LegalSection>

      <LegalSection id="plans" title="5. Plans and billing">
        <p>
          We offer free and paid subscription plans. Free plans may include usage limits (such as
          monthly generation caps). Paid plans are billed according to the pricing shown at signup or
          in your account settings.
        </p>
        <p>
          Subscriptions renew automatically unless cancelled before the renewal date. Refunds are
          handled according to our refund policy stated at purchase or required by applicable law.
        </p>
      </LegalSection>

      <LegalSection id="ownership" title="6. Your content and ownership">
        <p>
          You retain all rights to content you create, upload, or generate using the Service. We do
          not claim ownership of your content. You grant us a limited license to host, process, and
          display your content solely to operate and improve the Service for you.
        </p>
        <p>
          You represent that you have the necessary rights to submit content and that your use does
          not infringe third-party rights or violate applicable law.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="7. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the Service for unlawful, harmful, or deceptive purposes</li>
          <li>Generate content that violates intellectual property, privacy, or publicity rights</li>
          <li>Attempt to reverse engineer, scrape, or disrupt the Service or its infrastructure</li>
          <li>Share account credentials or resell access without authorization</li>
          <li>Circumvent usage limits, security measures, or plan restrictions</li>
          <li>Use the Service to produce spam, malware, or content that promotes violence or illegal activity</li>
        </ul>
        <p>We may remove content or restrict access that violates these rules.</p>
      </LegalSection>

      <LegalSection id="ip" title="8. Our intellectual property">
        <p>
          The Service, including software, design, branding, and documentation, is owned by us or our
          licensors and protected by intellectual property laws. These Terms do not grant you any
          rights to our trademarks or brand assets except as needed to use the Service.
        </p>
      </LegalSection>

      <LegalSection id="disclaimers" title="9. Disclaimers">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED,
          INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO
          NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT AI OUTPUTS WILL MEET
          YOUR REQUIREMENTS OR COMPLY WITH SEARCH ENGINE OR PLATFORM POLICIES.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="10. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE AND OUR SUPPLIERS WILL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS,
          DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
        </p>
        <p>
          OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS OR THE SERVICE WILL NOT EXCEED
          THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE MONTHS BEFORE THE CLAIM OR (B) ONE
          HUNDRED U.S. DOLLARS ($100).
        </p>
      </LegalSection>

      <LegalSection id="indemnity" title="11. Indemnification">
        <p>
          You will defend and indemnify us against claims arising from your content, your use of the
          Service, or your violation of these Terms or applicable law, except to the extent caused by
          our gross negligence or willful misconduct.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="12. Termination">
        <p>
          You may stop using the Service and delete your account at any time. We may suspend or
          terminate your access for breach of these Terms or for operational reasons with notice where
          required. Sections that by nature should survive termination (including ownership,
          disclaimers, limitation of liability, and indemnity) will survive.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="13. Governing law">
        <p>
          These Terms are governed by the laws of the jurisdiction in which ContentCraft Inspector is
          established, without regard to conflict-of-law principles. Disputes will be resolved in the
          courts of that jurisdiction, unless mandatory consumer protection laws in your country
          require otherwise.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="14. Changes to terms">
        <p>
          We may update these Terms from time to time. Continued use after the effective date of
          updated Terms constitutes acceptance. If you do not agree, you must stop using the Service.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="15. Contact">
        <p>
          Questions about these Terms? Email{' '}
          <a href="mailto:legal@contentcraftinspector.com" className={marketingLink}>
            legal@contentcraftinspector.com
          </a>{' '}
          or use our{' '}
          <a href="/contact" className={marketingLink}>
            Contact page
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
