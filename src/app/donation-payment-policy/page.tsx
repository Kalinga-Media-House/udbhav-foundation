import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Donation & Payment Policy | UDBHAV Foundation",
  description: "UDBHAV Foundation donation and payment policy.",
};

export default function DonationPaymentPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8 sm:py-32 lg:px-12">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Donation & Payment Policy
          </h1>
          <p className="mt-4 text-sm font-medium text-gray-500">
            Last updated: 25 August 2026
          </p>
        </header>

        <div className="prose prose-lg prose-gray max-w-none text-gray-700 space-y-12">
          <section>
            <p className="text-lg leading-relaxed mb-8">
              UDBHAV Foundation appreciates your support. This policy explains how donations made through our website are processed, confirmed, and handled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              1. Donations
            </h2>
            <p className="mb-4">
              Donations made through the UDBHAV Foundation website are intended to support our programmes, community initiatives, charitable activities, and organisational work.
            </p>
            <p>
              By making a donation, you confirm that the information provided during the donation process is accurate and that you are authorized to use the selected payment method.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              2. Payment Processing
            </h2>
            <p className="mb-4">
              Online payments may be processed through a third-party payment gateway or payment service provider.
            </p>
            <p className="mb-4">
              Payment details such as card, banking, or other sensitive payment credentials are handled by the applicable payment service provider according to its security and privacy practices.
            </p>
            <p>
              UDBHAV Foundation does not intentionally store complete card numbers, CVV numbers, PINs, passwords, or banking credentials on its own website servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              3. Donation Confirmation
            </h2>
            <p className="mb-4">
              After a successful payment, you may receive a confirmation or acknowledgement through the contact information provided during the donation process.
            </p>
            <p>
              A payment confirmation from the payment gateway indicates that the transaction has been successfully processed. If the amount has been debited from your account but you do not receive a confirmation, please contact us with the relevant transaction details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              4. Failed or Pending Transactions
            </h2>
            <p className="mb-4">
              A transaction may occasionally remain pending or fail because of banking issues, payment gateway problems, network interruptions, incorrect payment information, or other technical reasons.
            </p>
            <p className="mb-4">
              If your account has been debited but the donation is not reflected as successful, please contact us before making another payment.
            </p>
            <p>
              We will review the transaction with the relevant payment service provider or financial institution.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              5. Refunds and Cancellations
            </h2>
            <p className="mb-4">
              Donation transactions are generally treated as voluntary contributions.
            </p>
            <p className="mb-4">
              If you believe that a donation was made incorrectly, duplicated, charged incorrectly, or resulted from an unauthorized transaction, please contact UDBHAV Foundation as soon as possible with the transaction details.
            </p>
            <p>
              Any refund or cancellation request will be reviewed on a case-by-case basis and processed where applicable, subject to the payment provider's procedures and applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              6. Unauthorized Transactions
            </h2>
            <p className="mb-4">
              If you believe that a payment was made without your authorization, please contact your bank or payment provider immediately and inform UDBHAV Foundation.
            </p>
            <p>
              We may request transaction information necessary to investigate the matter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              7. Payment Information Security
            </h2>
            <p className="mb-4">
              UDBHAV Foundation takes reasonable measures to protect information associated with donations and payments.
            </p>
            <p className="mb-4">
              However, no online payment or electronic transmission system can be guaranteed to be completely secure.
            </p>
            <p className="mb-4">
              Users should also take reasonable precautions, including keeping passwords, OTPs, PINs, and other authentication information confidential.
            </p>
            <p>
              UDBHAV Foundation will never ask you to share your OTP, PIN, password, CVV, or other confidential payment authentication information through email, phone, or social media.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              8. Third-Party Payment Services
            </h2>
            <p className="mb-4">
              Payments may be subject to the terms, conditions, privacy policies, and security practices of the third-party payment provider used for the transaction.
            </p>
            <p>
              UDBHAV Foundation is not responsible for service interruptions or technical issues originating from external payment providers, banks, card networks, or other financial institutions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              9. Donation Records
            </h2>
            <p className="mb-4">
              UDBHAV Foundation may maintain appropriate records of donations and related transactions for administrative, accounting, reporting, compliance, and legal purposes.
            </p>
            <p>
              Information will be handled in accordance with our Privacy Policy and applicable requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              10. Changes to This Policy
            </h2>
            <p className="mb-4">
              UDBHAV Foundation may update this Donation & Payment Policy from time to time.
            </p>
            <p>
              Any updated version will be published on this page with a revised "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              11. Contact Us
            </h2>
            <p className="mb-4">
              For questions regarding a donation or payment, please contact:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-100 mt-6 mb-6">
              <p className="font-semibold text-gray-900 mb-2">UDBHAV Foundation</p>
              <p className="mb-2">
                Email: <a href="mailto:admin@udbhavfoundation.in" className="text-[#4FAF32] hover:underline transition-colors">admin@udbhavfoundation.in</a>
              </p>
              <p>
                Phone: <a href="tel:+916370508606" className="text-[#4FAF32] hover:underline transition-colors">+91 63705 08606</a>
              </p>
            </div>
            <p>
              When contacting us about a transaction, please provide the transaction reference or other relevant payment details. Do not send passwords, OTPs, PINs, CVVs, or complete card or banking credentials.
            </p>
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
