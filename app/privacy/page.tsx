import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Resume Builder',
  description: 'Privacy Policy for Resume Builder application',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
      
      <div className="space-y-8 text-gray-700">
        <section>
          <p className="text-sm text-gray-500 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <p className="mb-4">
            This Privacy Policy describes how Resume Builder (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects, uses, and protects your information when you use our resume building service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Personal Information</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Name, email address, and contact details</li>
            <li>Professional information (work experience, education, skills)</li>
            <li>Resume content and uploaded documents</li>
            <li>LinkedIn profile data (when you choose to connect)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-gray-800">Technical Information</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Usage data and analytics</li>
            <li>Cookies and similar technologies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>To create and format your resume</li>
            <li>To provide AI-powered resume enhancement suggestions</li>
            <li>To save your resume data for future editing</li>
            <li>To improve our service and user experience</li>
            <li>To communicate with you about our service</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Data Storage and Security</h2>
          <p className="mb-4">
            We use Supabase as our database provider, which provides enterprise-grade security and data protection. Your data is encrypted in transit and at rest.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Security Measures</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>SSL/TLS encryption for all data transmission</li>
            <li>Secure authentication and authorization</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and monitoring</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Third-Party Services</h2>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-800">LinkedIn Integration</h3>
          <p className="mb-4">
            When you connect your LinkedIn account, we access your profile information to help populate your resume. We only request the minimum necessary permissions and do not store your LinkedIn credentials.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-gray-800">AI Services</h3>
          <p className="mb-4">
            We use OpenAI and DeepSeek APIs to provide AI-powered resume enhancement features. Your resume content may be processed by these services to provide suggestions and improvements.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-gray-800">Analytics</h3>
          <p className="mb-4">
            We may use analytics services to understand how our application is used and to improve the user experience. This data is aggregated and anonymized.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and data</li>
            <li>Export your data</li>
            <li>Opt out of certain data processing</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Data Retention</h2>
          <p className="mb-4">
            We retain your personal information only for as long as necessary to provide our services and comply with legal obligations. You can delete your account and data at any time through your account settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Cookies</h2>
          <p className="mb-4">
            We use cookies and similar technologies to enhance your experience, authenticate users, and analyze usage patterns. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Children&apos;s Privacy</h2>
          <p className="mb-4">
            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">International Users</h2>
          <p className="mb-4">
            Our service may be accessed from around the world. By using our service, you consent to the transfer of your information to countries that may have different data protection laws than your country of residence.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2">Email: ryan@ryankatayi.com</p>
          </div>
        </section>

        <section className="border-t pt-8">
          <p className="text-sm text-gray-500">
            This privacy policy is designed to be comprehensive and transparent. If you have any concerns about your privacy or data protection, please don&apos;t hesitate to contact us.
          </p>
        </section>
      </div>
    </div>
  )
}