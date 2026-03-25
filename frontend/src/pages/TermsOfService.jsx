import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <p className="text-gray-500 mb-8">Effective Date: March 2026</p>

      <div className="prose prose-teal max-w-none text-gray-700 space-y-6">
        <p>
          Welcome to the Botswana Communications Regulatory Authority (BOCRA) online portal. By accessing and using this service, you agree to comply with the following plain-language Terms of Service. Please read them carefully.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By creating an account, accessing information, or submitting an application through this portal, you confirm that you accept these terms. If you do not agree, please do not use this portal.</p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. User Accounts & Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You must provide accurate and up-to-date information when creating an account or submitting an application.</li>
          <li>Fraudulent activity or providing false regulatory information may result in legal action or account suspension.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Prohibited Conduct</h2>
        <p>While using this portal, you must not:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Attempt to gain unauthorized access to other user accounts or internal system infrastructure.</li>
          <li>Upload viruses, malicious code, or submit excessive irrelevant complaints intended to disrupt service (denial of service).</li>
          <li>Use the portal for any illegal activities.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Complaint & Dispute Resolution</h2>
        <p>
          In accordance with the Digital Services Act, BOCRA provides a transparent mechanism for dispute resolution. If you have an issue with a telecommunications provider, you can use our <a href="/complaints" className="text-teal-600 underline">My Complaints module</a> to file a formal report. BOCRA will independently review the complaint and mediate a resolution transparently.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Modifications to Service</h2>
        <p>
          We reserve the right to modify, restrict access, or temporarily suspend the portal for maintenance. Where possible, we will notify users in advance.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
