# Internal Data Breach Notification Process

**Scope**: This process applies to any unauthorized access, disclosure, or loss of personal data stored within the BOCRA portal.

## 1. Identification and Containment
- If a breach is suspected, immediately notify the system administrators and the Data Protection Officer (DPO).
- The SOC (Security Operations Center) must isolate the affected systems to prevent further loss.

## 2. Assessment
- The DPO will assess the severity of the breach based on:
  - Type of data accessed (e.g., plaintext passwords, user PII, confidential licensing info).
  - Number of data subjects affected.
  - Likelihood of harm to the individuals.

## 3. Notification to the Authorities
- By law (Data Protection Act / Cybersecurity Act), BOCRA must notify the national cybersecurity incident reporting bodies within **72 hours** of becoming aware of the breach.

## 4. Notification to Data Subjects
- If the breach poses a high risk to the rights and freedoms of the affected users (e.g., identities compromised), they must be notified directly without undue delay via email.
- The notification must include:
  - The nature of the breach.
  - Likely consequences.
  - Measures taken by BOCRA to mitigate harm.
  - Contact details for the DPO.

## 5. Review and Reporting
- Post-incident, a full audit log review MUST be conducted (using `audit.log`).
- Processes and access controls should be revised to prevent reoccurrence.
