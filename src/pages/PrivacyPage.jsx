import { Link } from 'react-router-dom'
import { LEGAL } from '@constants/legal'
import {
  LegalList,
  LegalNotice,
  LegalPageLayout,
  LegalSection,
  LegalSubheading,
  LegalText,
} from '@features/legal'

const SECTIONS = [
  { id: 'information-we-collect', title: 'Information we collect' },
  { id: 'how-we-use-information', title: 'How we use information' },
  { id: 'connected-social-accounts', title: 'Connected social accounts' },
  { id: 'credentials-and-tokens', title: 'Credentials and tokens' },
  { id: 'user-content', title: 'User content' },
  { id: 'third-party-services', title: 'Third-party services' },
  { id: 'data-retention', title: 'Data retention' },
  { id: 'security', title: 'Security' },
  { id: 'your-choices', title: 'Your choices and data deletion' },
  { id: 'children', title: "Children's privacy" },
  { id: 'policy-changes', title: 'Changes to this policy' },
  { id: 'contact', title: 'Contact' },
]

const linkClasses =
  'rounded-[4px] font-medium text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:text-accent-hover hover:decoration-accent'

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      introduction="This policy explains how Hammerload handles personal information when you visit our website or use our software and digital services, including social media management features made available through the service."
      sections={SECTIONS}
    >
      <LegalSection id="information-we-collect" number={1} title="Information we collect">
        <LegalText>
          The information we collect depends on the Hammerload services and features you use. We
          limit collection to information reasonably needed to provide, secure and support those
          services.
        </LegalText>

        <LegalSubheading>Information you provide</LegalSubheading>
        <LegalList>
          <li>Name, email address, account information and authentication-related information.</li>
          <li>Workspace or team information that you choose to create or provide.</li>
          <li>
            Uploaded media, drafts, content created in the platform, scheduled posts and related
            publishing instructions.
          </li>
          <li>Information included in support, privacy or other requests you send to us.</li>
        </LegalList>

        <LegalSubheading>Information generated through use of the service</LegalSubheading>
        <LegalList>
          <li>
            Publication history, delivery status and other records needed to show or troubleshoot
            actions requested through Hammerload.
          </li>
          <li>
            Social account connection information and supported analytics or engagement data when
            you authorize a compatible integration.
          </li>
          <li>
            Technical logs, security events, IP address, and device or browser information used to
            operate, protect and diagnose the service.
          </li>
        </LegalList>
        <LegalText>
          We do not claim to collect every category listed above from every user. A category applies
          only when the relevant feature is available and you use it.
        </LegalText>
      </LegalSection>

      <LegalSection id="how-we-use-information" number={2} title="How we use information">
        <LegalText>We may use information to:</LegalText>
        <LegalList>
          <li>Operate the service and authenticate users.</li>
          <li>Connect social accounts that a user has authorized.</li>
          <li>Process, schedule and publish content at the user's request.</li>
          <li>Display publication history and retrieve supported analytics.</li>
          <li>Provide supported inbox, comment or message functionality where available.</li>
          <li>Maintain security, prevent abuse and diagnose technical failures.</li>
          <li>Improve the reliability and performance of the service.</li>
          <li>Respond to support, privacy and account requests.</li>
          <li>Meet legal obligations and enforce applicable agreements.</li>
        </LegalList>
        <LegalText>
          We do not use connected-account permissions for purposes unrelated to providing or
          protecting the features you request.
        </LegalText>
      </LegalSection>

      <LegalSection
        id="connected-social-accounts"
        number={3}
        title="Connected social accounts"
      >
        <LegalText>
          Hammerload may allow you to connect accounts from independent services such as Facebook,
          Instagram, LinkedIn, X and TikTok. When you choose to connect an account, Hammerload may
          receive information allowed by your authorization and the provider's approved scopes.
        </LegalText>
        <LegalText>Depending on the provider, permissions and available feature, this may include:</LegalText>
        <LegalList>
          <li>Account identifiers, page or account names, and permitted profile information.</li>
          <li>Permissions needed to publish content you request.</li>
          <li>Posts created through the service and their publication status.</li>
          <li>Comments or messages where the provider supports them and you authorize access.</li>
          <li>Supported analytics and engagement information.</li>
        </LegalList>
        <LegalNotice>
          Hammerload's access is limited by your authorization, the provider permissions granted to
          Hammerload, and the provider's API capabilities. Connecting an account does not give
          Hammerload unrestricted access to that account.
        </LegalNotice>
      </LegalSection>

      <LegalSection id="credentials-and-tokens" number={4} title="Credentials and tokens">
        <LegalText>
          OAuth access tokens or equivalent authentication credentials may be stored securely when
          needed to maintain an integration you authorize. These credentials are treated as
          sensitive service data.
        </LegalText>
        <LegalList>
          <li>They are not publicly exposed.</li>
          <li>They are not rendered in the frontend.</li>
          <li>They are not included in analytics.</li>
          <li>They are not intentionally written to normal application logs.</li>
        </LegalList>
        <LegalText>
          A provider may expire or revoke a token, and you may need to reconnect the relevant
          account before an integration can continue working.
        </LegalText>
      </LegalSection>

      <LegalSection id="user-content" number={5} title="User content">
        <LegalText>
          You retain ownership of and responsibility for the content you submit, upload, schedule or
          publish through Hammerload. Hammerload does not obtain ownership merely because content
          passes through the service.
        </LegalText>
        <LegalText>
          You grant Hammerload only the limited rights necessary to process, store, transmit and
          publish your content according to your instructions, and to maintain and protect the
          service. You are responsible for ensuring that your content and publishing activity comply
          with applicable law and third-party rights.
        </LegalText>
      </LegalSection>

      <LegalSection id="third-party-services" number={6} title="Third-party services">
        <LegalText>
          Hammerload may interact with independent providers, including social platforms,
          infrastructure providers and other services needed to deliver requested functionality.
          Those providers operate under their own terms and privacy policies.
        </LegalText>
        <LegalText>
          Hammerload does not control how an independent provider operates its service. You should
          review the terms, privacy practices and account settings of each external service you use.
        </LegalText>
      </LegalSection>

      <LegalSection id="data-retention" number={7} title="Data retention">
        <LegalText>
          We may retain information while your account is active, while it is needed to provide a
          requested feature, for legitimate operational or security purposes, or where retention is
          legally required. Retention depends on the type of information, the feature involved and
          the reason it is held.
        </LegalText>
        <LegalText>
          When information is no longer reasonably needed, we may delete or de-identify it, subject
          to lawful retention needs, backup cycles and technical constraints. We do not state a
          universal retention period because different records serve different purposes.
        </LegalText>
      </LegalSection>

      <LegalSection id="security" number={8} title="Security">
        <LegalText>
          Hammerload uses reasonable technical and organizational safeguards designed to protect
          information against unauthorized access, loss, misuse or alteration. Safeguards may
          include access controls, secure transport, credential handling practices and operational
          monitoring appropriate to the service.
        </LegalText>
        <LegalText>
          No online service or storage system can guarantee absolute security. You are responsible
          for protecting your account credentials and for notifying us if you suspect unauthorized
          activity.
        </LegalText>
      </LegalSection>

      <LegalSection id="your-choices" number={9} title="Your choices and data deletion">
        <LegalText>
          You may choose not to connect a social account, disconnect an integration where that
          option is available, or stop using a feature. Some choices may prevent the associated
          functionality from working.
        </LegalText>
        <LegalText>
          To request deletion of Hammerload-held account or integration data, follow our{' '}
          <Link to={LEGAL.dataDeletionUrl} className={linkClasses}>
            Data Deletion Instructions
          </Link>
          . We may verify a request before acting on it and may retain limited information where
          required or reasonably necessary for legal, security or operational purposes.
        </LegalText>
      </LegalSection>

      <LegalSection id="children" number={10} title="Children's privacy">
        <LegalText>
          Hammerload's services are intended for business and professional users and are not
          directed to children under 13. Users must also meet any higher minimum age that applies in
          their location. We do not knowingly seek personal information from children. If you believe
          a child has provided personal information to Hammerload, contact us so we can review the
          situation and take appropriate action.
        </LegalText>
      </LegalSection>

      <LegalSection id="policy-changes" number={11} title="Changes to this policy">
        <LegalText>
          We may update this Privacy Policy as the service, our practices or applicable requirements
          change. We will post the revised policy on this page and update the “Last updated” date.
          Where an update materially affects users, we may provide an additional notice when
          appropriate.
        </LegalText>
      </LegalSection>

      <LegalSection id="contact" number={12} title="Contact">
        <LegalText>
          {LEGAL.companyName}
          <br />
          Privacy questions:{' '}
          <a className={linkClasses} href={`mailto:${LEGAL.contactEmail}`}>
            {LEGAL.contactEmail}
          </a>
        </LegalText>
      </LegalSection>
    </LegalPageLayout>
  )
}
