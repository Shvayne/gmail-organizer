/**
 * This code provides the service functions used to interact
 * with the backend for managing the allowed emails feature
 * in the app. It uses axios to send HTTP requests 
 * to a server running on localhost:5001.
 */
import axios from "axios";

const SERVER = "http://localhost:5001";

/**
 * This function fetches the list of allowed email 
 * addresses for a particular user.
 */
export const getAllowedEmails = async (userId) => {
  const response = await axios.get(`${SERVER}/user/${userId}/allowed-emails`);
  return response.data;
};

/**
 * This function fetches the list of allowed email 
 * addresses for a particular user.
 */

export const addAllowedEmail = async (userId, email) => {
  const response = await axios.post(`${SERVER}/user/${userId}/allowed-emails`, {
    email,
  });
  return response.data;
};

export const removeAllowedEmail = async (userId, email) => {
  const response = await axios.delete(`${SERVER}/user/${userId}/allowed-emails`, {
    data: { email },
  });
  return response.data;
};

