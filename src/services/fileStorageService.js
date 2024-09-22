import axios from "axios";

const SERVER = "http://localhost:5001";

export const getAllowedEmails = async (userId) => {
  const response = await axios.get(`${SERVER}/user/${userId}/allowed-emails`);
  return response.data;
};

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

