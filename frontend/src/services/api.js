const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const getAuthToken = () => localStorage.getItem('bocra_token');

const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// =====================
// APPLICATIONS API
// =====================

export const getApplications = ({ page = 1, limit = 10 } = {}) =>
  apiCall(`/applications?page=${page}&limit=${limit}`);

export const getApplication = (id) => apiCall(`/applications/${id}`);

export const submitApplication = (data) =>
  apiCall('/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateApplication = (id, data) =>
  apiCall(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteApplication = (id) =>
  apiCall(`/applications/${id}`, {
    method: 'DELETE',
  });

export const uploadApplicationDocument = (applicationId, documentData) =>
  apiCall(`/applications/${applicationId}/documents`, {
    method: 'POST',
    body: JSON.stringify(documentData),
  });

// =====================
// COMPLAINTS API
// =====================

export const getComplaints = ({ page = 1, limit = 10 } = {}) =>
  apiCall(`/complaints?page=${page}&limit=${limit}`);

export const getComplaint = (id) => apiCall(`/complaints/${id}`);

export const submitComplaint = (data) =>
  apiCall('/complaints', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateComplaint = (id, data) =>
  apiCall(`/complaints/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteComplaint = (id) =>
  apiCall(`/complaints/${id}`, {
    method: 'DELETE',
  });

// =====================
// TENDERS API
// =====================

export const getTenders = ({ page = 1, limit = 10 } = {}) =>
  apiCall(`/tenders?page=${page}&limit=${limit}`);

export const getTender = (id) => apiCall(`/tenders/${id}`);

export const submitTender = (data) =>
  apiCall('/tenders', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateTender = (id, data) =>
  apiCall(`/tenders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteTender = (id) =>
  apiCall(`/tenders/${id}`, {
    method: 'DELETE',
  });

export const uploadTenderDocument = (tenderId, documentData) =>
  apiCall(`/tenders/${tenderId}/documents`, {
    method: 'POST',
    body: JSON.stringify(documentData),
  });

// =====================
// DOCUMENTS API
// =====================

export const getDocuments = ({ page = 1, limit = 10 } = {}) =>
  apiCall(`/documents?page=${page}&limit=${limit}`);

export const downloadDocument = (id) =>
  apiCall(`/documents/${id}/download`);

export const deleteDocument = (id) =>
  apiCall(`/documents/${id}`, {
    method: 'DELETE',
  });

// =====================
// PROFILE API
// =====================

export const getUserProfile = () => apiCall('/user/profile');

export const updateUserProfile = (data) =>
  apiCall('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// =====================
// DASHBOARD API
// =====================

export const getDashboardStats = () => apiCall('/user/dashboard-stats');

// =====================
// ACTIVITY LOG API
// =====================

export const getActivityLog = ({ page = 1, limit = 20 } = {}) =>
  apiCall(`/user/activity?page=${page}&limit=${limit}`);

// =====================
// SEARCH API
// =====================

export const searchGlobal = ({ query = '', page = 1, limit = 10 } = {}) =>
  apiCall(`/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);

// =====================
// ADMIN API
// =====================

export const getSubmissions = ({ department = '', page = 1, limit = 10 } = {}) => {
  const query = new URLSearchParams();
  if (department) query.append('department', department);
  query.append('page', page);
  query.append('limit', limit);
  return apiCall(`/admin/submissions?${query.toString()}`);
};

export const getAdminStats = (department = '') => {
  const query = new URLSearchParams();
  if (department) query.append('department', department);
  return apiCall(`/admin/stats?${query.toString()}`);
};

export const updateSubmissionStatus = (referenceNumber, status) =>
  apiCall(`/admin/submissions/${referenceNumber}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });

export const addSubmissionNotes = (referenceNumber, notes) =>
  apiCall(`/admin/submissions/${referenceNumber}/notes`, {
    method: 'PUT',
    body: JSON.stringify({ notes }),
  });

// =====================
// ADMIN COMPLAINTS API
// =====================

export const getAdminComplaints = ({ page = 1, limit = 10 } = {}) => {
  const query = new URLSearchParams();
  query.append('page', page);
  query.append('limit', limit);
  return apiCall(`/admin/complaints?${query.toString()}`);
};

export const updateComplaintStatus = (ticketNumber, status) =>
  apiCall(`/admin/complaints/${ticketNumber}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });

export const addComplaintNotes = (ticketNumber, notes) =>
  apiCall(`/admin/complaints/${ticketNumber}/notes`, {
    method: 'PUT',
    body: JSON.stringify({ notes }),
  });

// =====================
// ADMIN TENDERS API
// =====================

export const getAdminTenders = ({ page = 1, limit = 10 } = {}) => {
  const query = new URLSearchParams();
  query.append('page', page);
  query.append('limit', limit);
  return apiCall(`/admin/tenders?${query.toString()}`);
};

export const updateTenderStatus = (tenderNumber, status) =>
  apiCall(`/admin/tenders/${tenderNumber}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });

export const addTenderNotes = (tenderNumber, notes) =>
  apiCall(`/admin/tenders/${tenderNumber}/notes`, {
    method: 'PUT',
    body: JSON.stringify({ notes }),
  });
