import { Link } from 'react-router-dom'
import { LEGAL } from '@constants/legal'
import {
  LegalList,
  LegalPageLayout,
  LegalSection,
  LegalText,
} from '@features/legal'

const SECTIONS = [
  { id: 'acceptance', title: 'Acceptance of terms' },
  { id: 'services', title: 'Services' },
  { id: 'accounts', title: 'Accounts' },
  { id: 'connected-accounts', title: 'Connected third-party accounts' },
  { id: 'acceptable-use', title: 'Acceptable use' },
  { id: 'platform-rules', title: 'Social platform rules' },
  { id: 'user-content', title: 'User content' },
  { id: 'intellectual-property', title: 'Hammerload intellectual property' },
  { id: 'availability', title: 'Service availability' },
  { id: 'disclaimers', title: 'Disclaimers' },
  { id: 'limitation-of-liability', title: 'Limitation of liability' },
  { id: 'termination', title: 'Suspension and termination' },
  { id: 'changes', title: 'Changes to these terms' },
  { id: 'contact', title: 'Contact' },
]

const linkClasses =
  'rounded-[4px] font-medium text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:text-accent-hover hover:decoration-accent'

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      introduction="These Terms of Service govern your access to and use of Hammerload's website, software and digital services. Please read them before using the service."
      sections={SECTIONS}
    >
      <LegalSection id="acceptance" number={1} title="Acceptance of terms">
        <LegalText>
          By accessing or using a Hammerload service, you agree to these Terms. If you use the
          service for a company, team or other organization, you represent that you have authority
          to accept these Terms on its behalf. If you do not agree, do not use the service.
        </LegalText>
      </LegalSection>

      <LegalSection id="services" number={2} title="Services">
        <LegalText>
          Hammerload provides software and digital services. Depending on the engagement or product,
          these services may include software development, technical services and social media
          management functionality such as content preparation, scheduling, publishing, publication
          history, supported analytics or inbox features.
        </LegalText>
        <LegalText>
          Available features may differ by account, plan, project, platform, region or development
          stage. A reference to a possible feature does not promise that the feature is currently
          available or will remain available.
        </LegalText>
      </LegalSection>

      <LegalSection id="accounts" number={3} title="Accounts">
        <LegalText>Where an account is required, you are responsible for:</LegalText>
        <LegalList>
          <li>Providing information that is accurate and reasonably current.</li>
          <li>Maintaining the confidentiality and security of your credentials.</li>
          <li>Using appropriate safeguards for every person who can access your workspace.</li>
          <li>Activity occurring through your account to the extent within your control.</li>
          <li>Promptly notifying Hammerload if you suspect unauthorized access.</li>
        </LegalList>
        <LegalText>
          You may not share access in a way that defeats account limits or gives an unauthorized
          person control of the service or a connected account.
        </LegalText>
      </LegalSection>

      <LegalSection
        id="connected-accounts"
        number={4}
        title="Connected third-party accounts"
      >
        <LegalText>
          The service may allow you to authorize a social platform or other third-party account. You
          must have the right and permission to connect, access and manage each account you
          authorize. You may not connect an account by using another person's credentials or by
          bypassing the provider's authorization process.
        </LegalText>
        <LegalText>
          You remain responsible for the people you authorize to manage a connected account and for
          instructions submitted through your Hammerload workspace.
        </LegalText>
      </LegalSection>

      <LegalSection id="acceptable-use" number={5} title="Acceptable use">
        <LegalText>You may not use the service to:</LegalText>
        <LegalList>
          <li>Engage in unlawful activity, abuse, fraud, harassment or impersonation.</li>
          <li>Access an account, system or data without authorization.</li>
          <li>Distribute malicious code or interfere with the security or operation of a service.</li>
          <li>Send spam or other communications prohibited by applicable rules.</li>
          <li>Bypass provider restrictions, permissions, rate limits or technical controls.</li>
          <li>Abuse an API, scrape the service in a disruptive manner or overload infrastructure.</li>
          <li>Infringe privacy, intellectual property or other rights belonging to another person.</li>
        </LegalList>
        <LegalText>
          Reasonable security testing requires Hammerload's prior written authorization. We may take
          proportionate steps to protect users, providers and the service from suspected abuse.
        </LegalText>
      </LegalSection>

      <LegalSection id="platform-rules" number={6} title="Social platform rules">
        <LegalText>
          A connected integration remains subject to the provider's terms, developer policies, API
          rules, permissions, review requirements and usage limits. You must comply with the rules
          that apply to your connected accounts and content.
        </LegalText>
        <LegalText>
          An integration or feature may be delayed, limited or stop working if a provider changes
          its API, modifies service availability, restricts Hammerload's access, changes applicable
          policies, expires a permission, or if the connected account is restricted or disconnected.
          Hammerload does not control those provider decisions.
        </LegalText>
      </LegalSection>

      <LegalSection id="user-content" number={7} title="User content">
        <LegalText>
          You retain ownership of content that you submit, upload or publish through the service.
          You grant Hammerload a limited, non-exclusive right to host, process, reproduce, transmit
          and publish that content only as needed to provide, secure and support the functionality
          you request.
        </LegalText>
        <LegalText>
          You are responsible for your content, its accuracy, and whether you have the rights and
          permissions necessary to use and publish it. Hammerload does not claim ownership of your
          customer content or social posts.
        </LegalText>
      </LegalSection>

      <LegalSection
        id="intellectual-property"
        number={8}
        title="Hammerload intellectual property"
      >
        <LegalText>
          Hammerload's website, branding, software, interface, design, trademarks, documentation and
          proprietary content are protected by applicable intellectual property laws. Except for
          rights expressly granted to use the service, these Terms do not transfer Hammerload's
          intellectual property to you.
        </LegalText>
        <LegalText>
          This section does not apply to user content, customer social posts or other material that
          you or a third party owns.
        </LegalText>
      </LegalSection>

      <LegalSection id="availability" number={9} title="Service availability">
        <LegalText>
          We work to keep Hammerload reliable, but we do not guarantee uninterrupted, error-free or
          permanently available service. Maintenance, security work, outages, third-party APIs,
          external infrastructure and events outside our reasonable control may affect availability.
        </LegalText>
        <LegalText>
          We may modify, add, limit or discontinue features when reasonably necessary, including in
          response to technical, security, legal or provider requirements.
        </LegalText>
      </LegalSection>

      <LegalSection id="disclaimers" number={10} title="Disclaimers">
        <LegalText>
          To the extent permitted by applicable law, the service is provided “as is” and “as
          available.” Hammerload disclaims implied warranties that may lawfully be disclaimed,
          including warranties of merchantability, fitness for a particular purpose and
          non-infringement. We do not warrant a specific business, audience or engagement outcome.
        </LegalText>
        <LegalText>
          Nothing in these Terms excludes a warranty or right that cannot legally be excluded.
        </LegalText>
      </LegalSection>

      <LegalSection id="limitation-of-liability" number={11} title="Limitation of liability">
        <LegalText>
          To the fullest extent permitted by applicable law, Hammerload and its personnel will not
          be liable for indirect, incidental, special, consequential or punitive damages, or for lost
          profits, revenue, data, goodwill or business opportunities arising from the service.
        </LegalText>
        <LegalText>
          To the fullest extent permitted by applicable law, Hammerload's aggregate liability for a
          claim relating to paid services will not exceed the fees paid for the affected service
          during the twelve months before the event giving rise to the claim. These limitations do
          not apply where liability cannot lawfully be limited or excluded.
        </LegalText>
      </LegalSection>

      <LegalSection id="termination" number={12} title="Suspension and termination">
        <LegalText>
          We may suspend or terminate access when reasonably necessary to address a material breach
          of these Terms, unlawful or abusive activity, a security risk, non-payment for a paid
          service, or a requirement imposed by law or a third-party provider. Where practical, we
          will provide notice and an opportunity to resolve the issue.
        </LegalText>
        <LegalText>
          You may stop using the service at any time. Where applicable, you may also request account
          deletion by following the{' '}
          <Link to={LEGAL.dataDeletionUrl} className={linkClasses}>
            Data Deletion Instructions
          </Link>
          . Provisions that by their nature should survive termination, including intellectual
          property, disclaimers and limitations of liability, will continue to apply.
        </LegalText>
      </LegalSection>

      <LegalSection id="changes" number={13} title="Changes to these terms">
        <LegalText>
          We may update these Terms to reflect changes to the service, provider requirements or
          applicable law. We will post the revised Terms on this page and update the “Last updated”
          date. If a change materially affects users, we may provide additional notice when
          appropriate. Continued use after revised Terms take effect constitutes acceptance of the
          revised Terms.
        </LegalText>
      </LegalSection>

      <LegalSection id="contact" number={14} title="Contact">
        <LegalText>
          {LEGAL.companyName}
          <br />
          <a className={linkClasses} href={`mailto:${LEGAL.contactEmail}`}>
            {LEGAL.contactEmail}
          </a>
        </LegalText>
      </LegalSection>
    </LegalPageLayout>
  )
}
