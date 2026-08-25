import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | UDBHAV Foundation",
  description: "Official UDBHAV Foundation website privacy policy and personal information stewardship guidelines.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8 sm:py-32 lg:px-12">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm font-medium text-gray-500">
            Last updated: 25 August 2026
          </p>
        </header>

        <div className="prose prose-lg prose-gray max-w-none text-gray-700 space-y-12">
          <section>
            <p className="text-lg leading-relaxed mb-8">
              UDBHAV Foundation respects your privacy. This Privacy Policy explains what information we collect, how we use it, and how we protect it when you use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We may collect information that you provide directly to us, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Information submitted through contact, volunteer, donation, or other forms</li>
              <li>Any message or information you choose to provide</li>
            </ul>
            <p>
              We may also collect basic technical information when you visit our website, such as your browser type, device information, IP address, and general usage information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">
              We use information collected through our website to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Respond to your enquiries</li>
              <li>Process and manage volunteer or participation requests</li>
              <li>Process donations and related communications</li>
              <li>Communicate with you about our programmes, activities, and initiatives</li>
              <li>Improve our website and services</li>
              <li>Maintain website security and prevent misuse</li>
            </ul>
            <p>
              We do not use your personal information for purposes unrelated to the activities of UDBHAV Foundation without an appropriate basis or your consent where required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              3. Donations and Payments
            </h2>
            <p className="mb-4">
              When you make a donation through our website, payment information may be processed by a third-party payment service provider.
            </p>
            <p className="mb-4">
              UDBHAV Foundation does not intend to store complete payment card details such as your full card number, CVV, or banking credentials on its own servers.
            </p>
            <p>
              Payment information is handled according to the privacy and security practices of the relevant payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              4. Cookies and Similar Technologies
            </h2>
            <p className="mb-4">
              Our website may use cookies or similar technologies to keep the website functioning properly, understand basic website usage, and improve your experience.
            </p>
            <p>
              You can control or disable cookies through your browser settings. Some website features may not function properly if certain cookies are disabled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              5. Sharing of Information
            </h2>
            <p className="mb-4">
              We do not sell or rent your personal information.
            </p>
            <p className="mb-4">
              We may share information with trusted service providers when necessary to operate our website and provide our services. These providers may include hosting, storage, payment processing, communication, analytics, and security providers.
            </p>
            <p>
              We may also disclose information when required by applicable law, regulation, legal process, or to protect the rights, safety, and security of UDBHAV Foundation, our users, or others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              6. Data Security
            </h2>
            <p className="mb-4">
              We take reasonable technical and organizational measures to protect personal information against unauthorized access, misuse, alteration, disclosure, or loss.
            </p>
            <p>
              However, no method of transmitting or storing information online can be guaranteed to be completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              7. Data Retention
            </h2>
            <p>
              We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, to provide our services, maintain appropriate records, resolve disputes, or comply with applicable legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              8. Third-Party Websites
            </h2>
            <p className="mb-4">
              Our website may contain links to websites or services operated by third parties.
            </p>
            <p>
              UDBHAV Foundation is not responsible for the privacy practices or content of those third-party websites. We recommend reviewing their privacy policies before providing them with personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              9. Children's Privacy
            </h2>
            <p className="mb-4">
              Our website is not intended to knowingly collect personal information from children without appropriate consent or involvement of a parent or guardian where required.
            </p>
            <p>
              If you believe that a child has provided personal information to us improperly, please contact us so that we can take appropriate action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              10. Your Privacy Choices
            </h2>
            <p className="mb-4">
              You may contact us to ask about the personal information we hold about you, request correction of inaccurate information, or request deletion where applicable.
            </p>
            <p>
              Some information may need to be retained where required by law or for legitimate operational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              11. Changes to This Policy
            </h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time.
            </p>
            <p>
              When changes are made, the updated version will be published on this page with a revised "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              12. Contact Us
            </h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or how we handle personal information, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-100 mt-6">
              <p className="font-semibold text-gray-900 mb-2">UDBHAV Foundation</p>
              <p className="mb-2">
                Email: <a href="mailto:admin@udbhavfoundation.in" className="text-[#4FAF32] hover:underline transition-colors">admin@udbhavfoundation.in</a>
              </p>
              <p>
                Phone: <a href="tel:+916370508606" className="text-[#4FAF32] hover:underline transition-colors">+91 63705 08606</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
