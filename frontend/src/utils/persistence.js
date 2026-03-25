/**
 * BOCRA Citizen Portal - Persistence & Token Layer
 * Simulates a database using localStorage for citizen submissions,
 * admin reviews, and unique regulatory tracking tokens.
 */

const STORAGE_KEYS = {
  SUBMISSIONS: 'bocra_submissions',
  TOKENS: 'bocra_tokens',
};

// Department categories
export const DEPARTMENTS = {
  LICENSING: 'licensing',
  COMPLAINTS: 'complaints',
  QOS: 'qos',
  TENDERS: 'tenders',
};

export const DEPARTMENT_LABELS = {
  [DEPARTMENTS.LICENSING]: 'Licensing & Type Approval',
  [DEPARTMENTS.COMPLAINTS]: 'Complaints & Consumer Protection',
  [DEPARTMENTS.QOS]: 'QoS Monitoring',
  [DEPARTMENTS.TENDERS]: 'Tender Management',
};

export const DEPARTMENT_COLORS = {
  [DEPARTMENTS.LICENSING]: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
  [DEPARTMENTS.COMPLAINTS]: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50' },
  [DEPARTMENTS.QOS]: { bg: 'bg-teal-500', text: 'text-teal-600', light: 'bg-teal-50' },
  [DEPARTMENTS.TENDERS]: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50' },
};

// ── Token Generation ────────────────────────────────────────────────
let tokenCounter = parseInt(localStorage.getItem('bocra_token_counter') || '0', 10);

function generateToken(department) {
  tokenCounter += 1;
  localStorage.setItem('bocra_token_counter', tokenCounter.toString());
  
  const year = new Date().getFullYear();
  const deptCode = {
    [DEPARTMENTS.LICENSING]: 'LIC',
    [DEPARTMENTS.COMPLAINTS]: 'CMP',
    [DEPARTMENTS.QOS]: 'QOS',
    [DEPARTMENTS.TENDERS]: 'TND',
  }[department] || 'GEN';
  
  const id = String(tokenCounter).padStart(4, '0');
  return `BOCRA-${year}-${deptCode}-${id}`;
}

// ── CRUD Operations ─────────────────────────────────────────────────

export function getSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSubmissions(submissions) {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
}

/**
 * Add a new citizen submission.
 * @param {Object} data - The submission data
 * @param {string} data.type - 'license' | 'complaint' | 'type-approval' | 'tender-bid'
 * @param {string} data.department - One of DEPARTMENTS values
 * @param {string} data.citizenName - Submitter's name
 * @param {string} data.citizenEmail - Submitter's email
 * @param {string} data.subject - Brief title/subject
 * @param {string} data.description - Full description
 * @param {string} [data.priority] - 'High' | 'Medium' | 'Low'
 * @returns {Object} The saved submission with token
 */
export function addSubmission(data) {
  const submissions = getSubmissions();
  const token = generateToken(data.department);
  
  const submission = {
    id: token,
    ...data,
    status: 'Pending Review',
    priority: data.priority || 'Medium',
    submittedDate: new Date().toISOString().split('T')[0],
    submittedAt: new Date().toISOString(),
    adminNotes: '',
    reviewedBy: null,
    reviewedAt: null,
  };
  
  submissions.unshift(submission);
  saveSubmissions(submissions);
  
  return submission;
}

/**
 * Get submissions filtered by department.
 */
export function getSubmissionsByDepartment(department) {
  const all = getSubmissions();
  if (!department || department === 'all') return all;
  return all.filter((s) => s.department === department);
}

/**
 * Get a single submission by its token ID.
 */
export function getSubmissionByToken(token) {
  const all = getSubmissions();
  return all.find((s) => s.id === token) || null;
}

/**
 * Update a submission's status (admin action).
 */
export function updateSubmissionStatus(token, status, adminName) {
  const submissions = getSubmissions();
  const index = submissions.findIndex((s) => s.id === token);
  if (index === -1) return null;
  
  submissions[index] = {
    ...submissions[index],
    status,
    reviewedBy: adminName,
    reviewedAt: new Date().toISOString(),
  };
  
  saveSubmissions(submissions);
  return submissions[index];
}

/**
 * Add admin notes to a submission.
 */
export function addAdminNote(token, note) {
  const submissions = getSubmissions();
  const index = submissions.findIndex((s) => s.id === token);
  if (index === -1) return null;
  
  submissions[index].adminNotes = note;
  saveSubmissions(submissions);
  return submissions[index];
}

/**
 * Get dashboard statistics for a department.
 */
export function getDepartmentStats(department) {
  const submissions = getSubmissionsByDepartment(department);
  
  return {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === 'Pending Review').length,
    underReview: submissions.filter((s) => s.status === 'Under Review').length,
    approved: submissions.filter((s) => s.status === 'Approved').length,
    rejected: submissions.filter((s) => s.status === 'Rejected').length,
    highPriority: submissions.filter((s) => s.priority === 'High').length,
  };
}

// ── Seed Data ───────────────────────────────────────────────────────
// Seeds demo data if the store is empty (first load)
export function seedDemoData() {
  const existing = getSubmissions();
  if (existing.length > 0) return;

  const demoSubmissions = [
    {
      type: 'license',
      department: DEPARTMENTS.LICENSING,
      citizenName: 'Kgosi Modise',
      citizenEmail: 'kgosi@btcl.co.bw',
      subject: 'MVNO License Application',
      description: 'Application for a Mobile Virtual Network Operator license to provide affordable connectivity in rural areas of the North-West District.',
      priority: 'High',
    },
    {
      type: 'type-approval',
      department: DEPARTMENTS.LICENSING,
      citizenName: 'Tshepiso Mothibi',
      citizenEmail: 'tshepiso@orange.co.bw',
      subject: 'Huawei 5G Base Station - Type Approval',
      description: 'Request for type approval certification for the Huawei AAU5613 base station equipment for 5G deployment in Gaborone CBD.',
      priority: 'Medium',
    },
    {
      type: 'complaint',
      department: DEPARTMENTS.COMPLAINTS,
      citizenName: 'Naledi Tau',
      citizenEmail: 'naledi.tau@gmail.com',
      subject: 'Persistent Network Outages - Mascom',
      description: 'Reporting recurring network outages in Francistown area lasting 3+ hours daily for the past two weeks. Service quality is severely impacted.',
      priority: 'High',
    },
    {
      type: 'complaint',
      department: DEPARTMENTS.COMPLAINTS,
      citizenName: 'Thato Kgatlhane',
      citizenEmail: 'thato.k@yahoo.com',
      subject: 'Billing Dispute - BTC Broadband',
      description: 'I have been overcharged P450 for two consecutive months on my BTC Broadband subscription despite having a fixed-rate plan.',
      priority: 'Medium',
    },
    {
      type: 'qos-report',
      department: DEPARTMENTS.QOS,
      citizenName: 'BTC Compliance Officer',
      citizenEmail: 'compliance@btc.bw',
      subject: 'Q1 2026 QoS Report - Botswana Telecom',
      description: 'Quarterly Quality of Service report submission for Botswana Telecommunications Corporation covering January-March 2026.',
      priority: 'Low',
    },
    {
      type: 'tender-bid',
      department: DEPARTMENTS.TENDERS,
      citizenName: 'Mmasetshwane Dikabo',
      citizenEmail: 'mma@procure.co.bw',
      subject: 'Spectrum Monitoring Equipment Bid',
      description: 'Submission for BOCRA/PROC/2026-005: Provision of RF spectrum monitoring equipment for the national spectrum management system upgrade.',
      priority: 'Medium',
    },
  ];

  demoSubmissions.forEach((data) => addSubmission(data));
}
