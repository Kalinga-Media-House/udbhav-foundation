import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | UDBHAV Foundation",
  description: "Terms of use and guidelines for accessing and utilizing UDBHAV Foundation's digital platform.",
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8 sm:py-32 lg:px-12">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Terms of Use
          </h1>
          <p className="mt-4 text-sm font-medium text-gray-500">
            Last updated: 25 August 2026
          </p>
        </header>

        <div className="prose prose-lg prose-gray max-w-none text-gray-700 space-y-12">
          <section>
            <p className="text-lg leading-relaxed mb-8">
              Welcome to the UDBHAV Foundation website. By accessing or using this website, you agree to these Terms of Use. If you do not agree with these terms, please do not use the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              1. About This Website
            </h2>
            <p className="mb-4">
              This website is operated by UDBHAV Foundation to provide information about our organisation, programmes, activities, initiatives, events, volunteer opportunities, and other community-related work.
            </p>
            <p>
              The information provided on this website is intended for general informational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              2. Use of the Website
            </h2>
            <p className="mb-4">
              You agree to use this website responsibly and only for lawful purposes.
            </p>
            <p className="mb-4">
              You must not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Use the website for any unlawful or fraudulent purpose</li>
              <li>Attempt to gain unauthorized access to the website or its systems</li>
              <li>Interfere with the security or normal operation of the website</li>
              <li>Upload malicious software, harmful code, or other damaging material</li>
              <li>Misuse forms, donation services, volunteer services, or other features</li>
              <li>Copy or reproduce website content for misleading or unlawful purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              3. Website Content
            </h2>
            <p className="mb-4">
              We make reasonable efforts to keep the information on this website accurate and current. However, information may change from time to time.
            </p>
            <p className="mb-4">
              UDBHAV Foundation does not guarantee that every piece of information on the website will always be complete, accurate, current, or available.
            </p>
            <p>
              Programme details, activities, events, schedules, opportunities, and other information may be changed, suspended, or discontinued without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              4. Programmes and Activities
            </h2>
            <p className="mb-4">
              Information about programmes and initiatives published on this website is provided to help visitors understand the work of UDBHAV Foundation.
            </p>
            <p className="mb-4">
              Participation in any programme, event, volunteer activity, or community initiative may be subject to additional requirements or conditions communicated separately.
            </p>
            <p>
              Submitting an enquiry, registration, volunteer request, or other form does not automatically guarantee participation or acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              5. Donations
            </h2>
            <p className="mb-4">
              Donations made through the website are subject to the applicable payment provider's terms and conditions.
            </p>
            <p className="mb-4">
              You are responsible for providing accurate information when making a donation.
            </p>
            <p>
              Once a donation has been successfully processed, any refund or cancellation will be handled according to the applicable donation and payment policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              6. Intellectual Property
            </h2>
            <p className="mb-4">
              Unless otherwise stated, the content of this website, including text, photographs, graphics, logos, designs, videos, and other materials, belongs to or is used by UDBHAV Foundation with appropriate rights.
            </p>
            <p className="mb-4">
              You may view and use the website for personal and non-commercial purposes.
            </p>
            <p>
              You must not reproduce, modify, distribute, publish, sell, or commercially exploit website content without prior written permission, except where permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              7. Photos and Community Content
            </h2>
            <p className="mb-4">
              The website may display photographs, videos, stories, and other content from UDBHAV Foundation programmes, events, and community activities.
            </p>
            <p>
              If you believe that any content published on the website raises a legitimate privacy, copyright, or other concern, please contact us so that we can review the matter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              8. Third-Party Links
            </h2>
            <p className="mb-4">
              The website may contain links to websites or services operated by third parties.
            </p>
            <p className="mb-4">
              These links are provided for convenience. UDBHAV Foundation does not control or guarantee the availability, accuracy, security, or privacy practices of third-party websites.
            </p>
            <p>
              Your use of third-party websites is subject to their respective terms and policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              9. Website Availability
            </h2>
            <p className="mb-4">
              We aim to keep the website available and functioning properly. However, access may occasionally be interrupted because of maintenance, technical problems, security issues, network failures, or circumstances beyond our reasonable control.
            </p>
            <p>
              We do not guarantee uninterrupted or error-free access to the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              10. Limitation of Liability
            </h2>
            <p className="mb-4">
              To the extent permitted by applicable law, UDBHAV Foundation will not be responsible for losses or damages arising from your use of, or inability to use, the website or from reliance on information provided through the website.
            </p>
            <p>
              Nothing in these Terms of Use is intended to exclude any liability that cannot legally be excluded.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              11. Changes to These Terms
            </h2>
            <p className="mb-4">
              We may update these Terms of Use from time to time.
            </p>
            <p className="mb-4">
              When changes are made, the updated version will be published on this page with a revised "Last updated" date.
            </p>
            <p>
              Your continued use of the website after changes are published means that you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              12. Governing Law
            </h2>
            <p className="mb-4">
              These Terms of Use are governed by the applicable laws of India.
            </p>
            <p>
              Any disputes relating to the use of this website will be subject to the jurisdiction of the appropriate courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              13. Contact Us
            </h2>
            <p className="mb-4">
              If you have questions about these Terms of Use, please contact us:
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

          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-[#20256F] text-white text-sm font-semibold hover:bg-[#181C5A] transition-colors shadow-sm"
            >
              Return to UDBHAV Foundation Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
