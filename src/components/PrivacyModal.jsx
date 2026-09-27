import { useNavigate } from 'react-router-dom';
import SupportModal from './SupportModal.jsx';

/* FreshFind Privacy Policy. The wording below is the approved policy text and
   is rendered inside the existing support-modal shell (scrollable body, close
   button, focus trap) so the policy keeps the site's design system. */

export default function PrivacyModal({ open, onClose }) {
  const navigate = useNavigate();

  // internal navigation closes the modal first, then scrolls to the section
  const goContact = () => {
    onClose();
    navigate('/#contact');
  };

  return (
    <SupportModal
      open={open}
      onClose={onClose}
      icon="checkc"
      title="FreshFind Privacy Policy"
      intro="Last updated: September 2026"
    >
      <div className="ff-card p-3 mb-3">
        <p className="small text-muted mb-0">
          FreshFind respects your privacy and is committed to protecting the information you share
          with us. This Privacy Policy explains what information we collect, how we use it, and the
          choices available to you when using FreshFind.
        </p>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">Information We Collect</h3>
        <p className="small text-muted">Depending on how you use FreshFind, we may collect:</p>
        <ul className="small text-muted mb-0">
          <li><strong>Account information</strong> — such as your name, email address, and password when you create an account.</li>
          <li><strong>Profile information</strong> — information you choose to add to your FreshFind profile.</li>
          <li><strong>Saved items</strong> — markets, farmers, products, and notes that you save to your account.</li>
          <li><strong>Shopping information</strong> — products added to your cart and information required to process an order.</li>
          <li><strong>Messages</strong> — information you provide when contacting farmers, sellers, or FreshFind support.</li>
          <li><strong>Location information</strong> — your location when you choose to use location-based features.</li>
          <li><strong>Usage information</strong> — information about how you interact with FreshFind, such as pages and features you use.</li>
        </ul>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">How We Use Your Information</h3>
        <p className="small text-muted">We use collected information to:</p>
        <ul className="small text-muted mb-0">
          <li>Provide and improve FreshFind services.</li>
          <li>Help you discover local farmers, markets, and products.</li>
          <li>Show relevant locations and nearby services.</li>
          <li>Process and manage orders.</li>
          <li>Save your preferences and account information.</li>
          <li>Respond to questions and support requests.</li>
          <li>Maintain the security and reliability of the platform.</li>
          <li>Improve the overall FreshFind experience.</li>
        </ul>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">Location Information</h3>
        <p className="small text-muted">
          FreshFind may request access to your location when you use features such as <em>Near Me</em>,
          nearby markets, or map-based services.
        </p>
        <p className="small text-muted">
          Location access is optional. You can disable location permissions through your device or
          browser settings.
        </p>
        <p className="small text-muted mb-0">
          We use location information to provide location-based features and improve the relevance
          of nearby results.
        </p>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">Maps and Directions</h3>
        <p className="small text-muted">
          FreshFind uses mapping services to display locations and provide directions.
        </p>
        <p className="small text-muted">
          When you interact with third-party mapping services, those services may collect information
          such as your IP address, device information, or location according to their own privacy
          policies.
        </p>
        <p className="small text-muted mb-0">
          For more information, please review the privacy policies of the relevant mapping providers.
        </p>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">Information Sharing</h3>
        <p className="small text-muted">FreshFind does not sell your personal information.</p>
        <p className="small text-muted">We may share information when necessary to:</p>
        <ul className="small text-muted mb-0">
          <li>Provide services you request.</li>
          <li>Process orders and payments.</li>
          <li>Connect you with relevant farmers or sellers.</li>
          <li>Operate and maintain FreshFind.</li>
          <li>Comply with legal obligations.</li>
          <li>Protect FreshFind, its users, and the public from fraud or security threats.</li>
        </ul>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">Data Security</h3>
        <p className="small text-muted">
          We take reasonable technical and organizational measures to protect your information
          against unauthorized access, alteration, disclosure, or destruction.
        </p>
        <p className="small text-muted mb-0">
          However, no online service can guarantee complete security of information.
        </p>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">Your Choices</h3>
        <p className="small text-muted">You may be able to:</p>
        <ul className="small text-muted mb-0">
          <li>Update your account information.</li>
          <li>Change your privacy and location permissions.</li>
          <li>Delete saved information.</li>
          <li>Request deletion of your account and associated personal information.</li>
          <li>Contact us with questions about your personal data.</li>
        </ul>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">Cookies and Similar Technologies</h3>
        <p className="small text-muted">
          FreshFind may use cookies or similar technologies where necessary to keep you signed in,
          remember preferences, maintain security, and provide essential functionality.
        </p>
        <p className="small text-muted mb-0">
          Any optional analytics or advertising technologies will be disclosed where applicable.
        </p>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">Children&apos;s Privacy</h3>
        <p className="small text-muted">
          FreshFind is not intended to knowingly collect personal information from children without
          appropriate consent.
        </p>
        <p className="small text-muted mb-0">
          If you believe that a child has provided personal information to FreshFind, please contact
          us so that we can take appropriate action.
        </p>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">Changes to This Privacy Policy</h3>
        <p className="small text-muted">
          We may update this Privacy Policy from time to time to reflect changes to FreshFind, our
          services, or applicable requirements.
        </p>
        <p className="small text-muted mb-0">
          Any updated version will be posted on this page with the revised date.
        </p>
      </div>

      <div className="ff-card p-3">
        <h3 className="h6">Contact Us</h3>
        <p className="small text-muted mb-0">
          If you have questions, concerns, or requests regarding this Privacy Policy or your personal
          information, please contact us through the{' '}
          <button className="support-text-link" onClick={goContact}>
            Contact section on the FreshFind website
          </button>.
        </p>
      </div>
    </SupportModal>
  );
}
