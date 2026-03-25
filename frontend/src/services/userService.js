/**
 * User Service
 * Handles all API calls related to user management
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Get authorization header with JWT token
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('bocra_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Handle API errors consistently
 */
const handleError = async (response) => {
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'API request failed');
  }
  return response;
};

/**
 * Fetch all users
 * @param {number} limit - Results per page (default: 50)
 * @param {number} offset - Pagination offset (default: 0)
 * @returns {Promise} User list with pagination info
 */
export const fetchAllUsers = async (limit = 50, offset = 0) => {
  try {
    const response = await fetch(
      `${API_URL}/users?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: getAuthHeader(),
      }
    );

    await handleError(response);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

/**
 * Fetch single user by ID
 * @param {string} userId - User ID
 * @returns {Promise} User object
 */
export const fetchUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    await handleError(response);
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    throw error;
  }
};

/**
 * Create new user
 * @param {Object} userData - User data object
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password (min 8 chars)
 * @param {string} userData.name - User full name
 * @param {string} userData.userType - User type: 'client' or 'admin'
 * @param {string} userData.adminLevel - Admin level (required if userType='admin'): 'superadmin' or 'admin'
 * @param {string} userData.department - Department (required if adminLevel='admin'): 'licensing'|'complaints'|'qos'|'tenders'
 * @param {string} userData.phone - User phone number
 * @param {string} userData.address - User address
 * @returns {Promise} Created user object
 */
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(userData),
    });

    await handleError(response);
    return await response.json();
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

/**
 * Update user
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @param {string} updates.email - New email
 * @param {string} updates.password - New password
 * @param {string} updates.name - New name
 * @param {string} updates.adminLevel - Admin level
 * @param {string} updates.department - Department
 * @param {string} updates.phone - Phone number
 * @param {string} updates.address - Address
 * @returns {Promise} Updated user object
 */
export const updateUser = async (userId, updates) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    });

    await handleError(response);
    return await response.json();
  } catch (error) {
    console.error(`Failed to update user ${userId}:`, error);
    throw error;
  }
};

/**
 * Delete user
 * @param {string} userId - User ID to delete
 * @returns {Promise} Success response
 */
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    await handleError(response);
    return await response.json();
  } catch (error) {
    console.error(`Failed to delete user ${userId}:`, error);
    throw error;
  }
};

export default {
  fetchAllUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
};
