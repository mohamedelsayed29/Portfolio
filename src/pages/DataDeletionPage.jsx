import { Link } from 'react-router-dom'
import { LEGAL } from '@constants/legal'
import {
  LegalList,
  LegalNotice,
  LegalPageLayout,
  LegalSection,
  LegalText,
} from '@features/legal'

const SECTIONS = [
  { id: 'request-deletion', title: 'How to request deletion' },
  { id: 'request-details', title: 'What to include' },
  { id: 'what-may-be-deleted', title: 'What may be deleted' },
  { id: 'limited-retention', title: 'Information we may retain' },
  { id: 'third-party-data', title: 'Third-party data and published content' },
  { id: 'disconnect-accounts', title: 'Disconnecting social accounts' },
  { id: 'what-happens-next', title: 'What happens next' },
  { id: 'contact', title: 'Contact' },
]

const linkClasses =
  'rounded-[4px] font-medium text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:text-accent-hover hover:decoration-accent'

const deletionEmailUrl = `mailto:${LEGAL.contactEmail}?subject=${encodeURIComponent('Data Deletion Request')}`

export default function DataDeletionPage() {
  return (
    <LegalPageLayout
      title="Data Deletion Instructions"
      introduction="You can request deletion of eligible personal, account and integration data held by Hammerload. This page explains what to send, what the request may cover and how third-party content is handled."
      sections={SECTIONS}
    >
      <LegalSection id="request-deletion" number={1} title="How to request deletion">
        <LegalList ordered>
          <li>
            Send an email to{' '}
            <a className={linkClasses} href={deletionEmailUrl}>
              {LEGAL.contactEmail}
            </a>
            .
          </li>
          <li>
            Use the subject: <strong className="font-semibold text-text">Data Deletion Request</strong>.
          </li>
          <li>Include the email address associated with your Hammerload account.</li>
          <li>
            If the request concerns a connected social account, identify the provider and account
            name or identifier where reasonably necessary to locate the relevant connection.
          </li>
          <li>
            Hammerload will verify the request where necessary and process eligible deletion
            requests.
          </li>
        </LegalList>
        <LegalNotice tone="warning">
          Never send your password, OAuth token, access token, API key or any other secret. Hammerload
          does not need those credentials to receive a deletion request.
        </LegalNotice>
      </LegalSection>

      <LegalSection id="request-details" number={2} title="What to include">
        <LegalText>Keep the request limited to the information needed to identify its scope:</LegalText>
        <LegalList>
          <li>The email address associated with your Hammerload account.</li>
          <li>
            The request type, such as Hammerload account data, connected social account data,
            uploaded content or another privacy request.
          </li>
          <li>
            An optional short explanation identifying a workspace, provider or category of content
            if the request is narrower than full account deletion.
          </li>
        </LegalList>
        <LegalText>
          If we cannot reasonably match the request to the relevant information, we may ask for
          limited additional information. We will not ask you to email credentials or tokens.
        </LegalText>
      </LegalSection>

      <LegalSection id="what-may-be-deleted" number={3} title="What may be deleted">
        <LegalText>
          Depending on the features you used, your request, and whether the information must be
          retained, eligible Hammerload-held data may include:
        </LegalText>
        <LegalList>
          <li>Hammerload profile and account data.</li>
          <li>Workspace-associated personal data where applicable.</li>
          <li>Stored social account authorization data and OAuth tokens.</li>
          <li>Drafts, stored media and other uploaded content.</li>
          <li>Publication records where deletion is appropriate.</li>
          <li>Locally stored inbox information where the feature applies.</li>
          <li>Application-level analytics or history linked to the account where appropriate.</li>
        </LegalList>
        <LegalText>
          The exact scope depends on the requested deletion, the structure of a shared workspace and
          the data Hammerload actually holds for the account.
        </LegalText>
      </LegalSection>

      <LegalSection id="limited-retention" number={4} title="Information we may retain">
        <LegalText>
          Deletion is subject to information that Hammerload must retain, or may reasonably retain,
          for legal obligations, security, fraud prevention, dispute resolution, financial record
          keeping, enforcement of agreements or protection of the service. Residual copies may also
          remain temporarily in backups until normal backup cycles replace them.
        </LegalText>
        <LegalText>
          Where appropriate, we may restrict or de-identify retained information instead of keeping
          it available for ordinary use. We do not promise deletion of records that must lawfully or
          operationally be retained.
        </LegalText>
      </LegalSection>

      <LegalSection
        id="third-party-data"
        number={5}
        title="Third-party data and published content"
      >
        <LegalNotice>
          Deleting data held by Hammerload does not automatically delete posts, media, messages or
          other content already published to Facebook, Instagram, LinkedIn, X, TikTok or another
          third-party service.
        </LegalNotice>
        <LegalText>
          External copies are controlled by the respective platform and remain subject to that
          provider's account settings, retention practices and policies. You may need to remove
          published content directly from the provider or submit a separate request to that
          provider.
        </LegalText>
      </LegalSection>

      <LegalSection id="disconnect-accounts" number={6} title="Disconnecting social accounts">
        <LegalText>
          Where available, connected accounts may be disconnected from the Accounts section of the
          Hammerload application. Disconnecting generally stops future authorized access through
          that integration, but it does not by itself submit a deletion request or remove content
          already published to an external platform.
        </LegalText>
        <LegalText>
          You may also be able to revoke Hammerload's authorization from the connected provider's
          own security or application settings. Provider controls and labels differ by platform.
        </LegalText>
      </LegalSection>

      <LegalSection id="what-happens-next" number={7} title="What happens next">
        <LegalText>
          We will review the request, verify that the requester is authorized where necessary, and
          identify the Hammerload-held data within scope. We may contact you from the address above
          if clarification is needed. After an eligible request is processed, we will confirm the
          outcome or explain any information that could not be deleted.
        </LegalText>
        <LegalText>
          For more detail about how information is handled, read the{' '}
          <Link className={linkClasses} to={LEGAL.privacyUrl}>
            Privacy Policy
          </Link>
          .
        </LegalText>
      </LegalSection>

      <LegalSection id="contact" number={8} title="Contact">
        <LegalText>
          {LEGAL.companyName}
          <br />
          Data deletion and privacy requests:{' '}
          <a className={linkClasses} href={deletionEmailUrl}>
            {LEGAL.contactEmail}
          </a>
        </LegalText>
      </LegalSection>
    </LegalPageLayout>
  )
}
