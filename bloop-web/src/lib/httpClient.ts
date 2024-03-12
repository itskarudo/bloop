import axios from "axios";

export const refreshAccessToken = async () => {
  const { data } = await axios.get("http://localhost:5000/auth/refresh", {
    withCredentials: true,
  });
  localStorage.setItem("access_token", data.data.accessToken);
};

const httpClient = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

httpClient.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessToken();
      return await httpClient(originalRequest);
    }
    return Promise.reject(err);
  }
);

export default httpClient;
