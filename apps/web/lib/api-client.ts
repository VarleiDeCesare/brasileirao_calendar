import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const createApiClient = (): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:3000',
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.warn('Unauthorized request - session may have expired');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }

      if (error.response?.status === 403) {
        console.warn('Forbidden request - insufficient permissions');
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

export const apiClient = createApiClient();

export type ApiResponse<T = any> = AxiosResponse<T>;
export type ApiError = {
  message: string;
  status?: number;
  data?: any;
};

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    return {
      message: 'Network error - please check your connection',
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }
};

export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.get(url, config);
  },

  post: <T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.post(url, data, config);
  },

  put: <T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.put(url, data, config);
  },

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.delete(url, config);
  },
};

export default apiClient;
