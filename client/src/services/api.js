import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://collaborative-email-campaign-engine.vercel.app/api";  // http://localhost:5000/api

// Set auth token in headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

// Auth API
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  return response.data;
};

// Campaign API
export const fetchCampaigns = async () => {
  const response = await axios.get(`${API_URL}/campaigns`);
  return response.data;
};

export const fetchCampaign = async (id) => {
  const response = await axios.get(`${API_URL}/campaigns/${id}`);
  return response.data;
};

export const createCampaign = async (campaignData) => {
  const response = await axios.post(`${API_URL}/campaigns`, campaignData);
  return response.data;
};

export const updateCampaign = async (id, campaignData) => {
  try {
    const response = await axios.put(
      `${API_URL}/campaigns/${id}`,
      campaignData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw error;
  }
};

export const deleteCampaign = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/campaigns/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
};

export default setAuthToken;
