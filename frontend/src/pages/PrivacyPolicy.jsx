import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Effective Date: March 2026</p>

      <div className="prose prose-teal max-w-none text-gray-700 space-y-6">
        <p>
          The Botswana Communications Regulatory Authority (BOCRA) respects your right to privacy and is committed to protecting your personal data in compliance with the Data Protection Act exactly. 
          This notice explains what personal information we collect, why we collect it, how it is used, how long it is kept, and with whom it may be shared.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. What Data We Collect</h2>
        <p>When you register on our portal, submit a complaint, or apply for a license, we collect:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Identity Data:</strong> Name, National ID/Omang, or Passport Number.</li>
          <li><strong>Contact Data:</strong> Email address, physical address, phone numbers.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, time zone setting, and operating system.</li>
          <li><strong>Service Data:</strong> Details about the services, complaints, or licenses you apply for.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Why We Collect It</h2>
        <p>We process your personal data for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide and manage your account and access to the portal.</li>
          <li>To process applications such as type approvals, licenses, and tenders.</li>
          <li>To investigate and resolve complaints reported through the portal.</li>
          <li>To comply with legal and regulatory obligations as defined by the Communications Regulatory Authority Act.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How Long We Keep It</h2>
        <p>
          We only keep your personal data for as long as necessary to fulfill the purposes for which it was collected. 
          Specifically:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Account Information:</strong> Retained for the lifetime of your active account and up to 5 years after closure.</li>
          <li><strong>Complaints Data:</strong> Retained for 7 years for auditing and legal purposes.</li>
          <li><strong>License/Tender Info:</strong> Retained indefinitely as part of the permanent regulatory record.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Who We Share It With</h2>
        <p>We do not sell your personal data. We may share it strictly for regulatory purposes with:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Law Enforcement:</strong> If required by a court order or legal mandate.</li>
          <li><strong>Service Providers:</strong> IT and system administration providers acting directly as data processors for BOCRA.</li>
          <li><strong>Telecommunications Operators:</strong> Only when absolutely necessary to resolve a complaint you have specifically logged against them.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Subject Rights</h2>
        <p>Under the Data Protection Act, you have the following clear rights regarding your data:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Right of Access:</strong> You can request a copy of the personal data we hold about you.</li>
          <li><strong>Right to Rectification:</strong> You can request that we correct any inaccurate or incomplete data.</li>
          <li><strong>Right to Erasure:</strong> You can ask us to delete or remove personal data where there is no good reason for us continuing to process it.</li>
          <li><strong>Right to Object:</strong> You can object to the processing of your data in certain circumstances.</li>
        </ul>
        <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mt-4">
          <p className="font-semibold text-teal-800 m-0">How to exercise your rights:</p>
          <p className="text-sm mt-2 text-teal-700">
            To make a data access request, correct your data, or request deletion, please contact our Data Protection Officer at: <br/>
            <strong>Email:</strong> dpo@bocra.org.bw <br/>
            <strong>Phone:</strong> +267 395 7755 <br/>
            We will respond to all legitimate requests within 30 days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
