import axios from "axios";

const AxiosInstance = (contentType = "application/json") => {
  const axiosInstance = axios.create({
    baseURL: "http://172.16.123.185:8686/",
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      config.headers = {
        Authorization: `Bearer ${""}`,
        Accept: "application/json",
        "Content-Type": contentType,
      };
      return config;
    },
    (err) => Promise.reject(err)
  );

  axiosInstance.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(err)
  );
  return axiosInstance;
};

export default AxiosInstance;
