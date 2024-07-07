import axiosInstance from "./axiosInstance";

interface ApiConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  params?: any;
  token?: string;
}

export const apiRequest = async <T>(config: ApiConfig): Promise<T> => {
  const { url, method, data, params, token } = config;

  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      data,
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return response.data;
  } catch (error: any) {
    const status = error.response?.data?.status | error.response?.status;
    var errorText = error.response?.data?.title || "API request failed";

    if (!error.response) {
      errorText = "Connection refused. Please try again later.";
    }

    console.error(error.response);

    switch (status) {
      case 401:
        errorText = "Unauthorized";
        localStorage.removeItem("user");
        localStorage.removeItem("currentPage");
        window.location.href =
          window.location.protocol + "//" + window.location.host;
        break;
      case 500:
        errorText = "Internal Server Error";
        break;
      case 400:
        errorText = "Bad Request";
        break;
      case 404:
        errorText = "Not Found";
        break;
      default:
        break;
    }

    throw new Error(errorText);
  }
};
