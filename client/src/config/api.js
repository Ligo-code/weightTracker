export const API_BASE_URL = "http://localhost:3001/api";

export const API_ENDPOINTS = {
  USERS: {
    REGISTER: `${API_BASE_URL}/users/register`,
    LOGIN: `${API_BASE_URL}/users/login`,
    PROFILE: `${API_BASE_URL}/users/profile`,
    REFRESH_TOKEN: `${API_BASE_URL}/users/refresh-token`,
  },
  WEIGHT: {
    BASE: `${API_BASE_URL}/weight`,
  },
  HEALTH: `${API_BASE_URL}/health`,
};
