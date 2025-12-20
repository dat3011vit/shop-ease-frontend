import axios from "axios";
import { IApiResponse } from "../common/models/ApiResponse";
import { LocalStorageService } from "./localStorage";

// Cấu hình headers với tham số useToken
const headers = (useToken = true) => {
  const baseHeaders = {
    Accept: "*/*",
  };

  if (useToken) {
    // Chỉ thêm Authorization nếu useToken là true
    return {
      ...baseHeaders,
      Authorization: `Bearer ${LocalStorageService.getToken()}`,
    };
  }

  return baseHeaders;
};

export const API = {
  get: async <T>(
    serverUrl: string,
    path: string,
    params?: { [key: string]: any },
    useToken: boolean = false // Thêm tham số để điều chỉnh việc dùng token
  ) => {
    const _path = path[0] === "/" ? path.substring(1) : path;
    return await axios.get<IApiResponse<T>>(
      serverUrl + "/" + _path + (params ? "?" + _paramSerializer(params) : ""),
      {
        headers: headers(useToken), // Truyền useToken vào đây
      }
    );
  },

  post: async <T>(
    serverUrl: string,
    path: string,
    body?: { [key: string]: any },
    useToken: boolean = false // Thêm tham số để điều chỉnh việc dùng token
  ) => {
    const _path = path[0] === "/" ? path.substring(1) : path;
    return await axios.post<IApiResponse<T>>(serverUrl + "/" + _path, body, {
      headers: headers(useToken), // Truyền useToken vào đây
      timeout: 10000,
    });
  },

  delete: async <T>(
    serverUrl: string,
    path: string,
    params?: { [key: string]: any },
    useToken: boolean = true // Thêm tham số để điều chỉnh việc dùng token
  ) => {
    const _path = path[0] === "/" ? path.substring(1) : path;
    return await axios.delete<IApiResponse<T>>(
      serverUrl + "/" + _path + (params ? "?" + _paramSerializer(params) : ""),
      {
        headers: headers(useToken), // Truyền useToken vào đây
      }
    );
  },

  update: async <T>(
    serverUrl: string,
    path: string,
    data?: { [key: string]: any },
    useToken: boolean = true // Thêm tham số để điều chỉnh việc dùng token
  ) => {
    const _path = path[0] === "/" ? path.substring(1) : path;
    return await axios.patch<IApiResponse<T>>(serverUrl + "/" + _path, data, {
      headers: headers(useToken), // Truyền useToken vào đây
    });
  },
};

// Hàm serialize params để thêm vào URL
function _paramSerializer(paramObject?: { [key: string]: any }) {
  if (!paramObject) {
    return "";
  }
  const keys = Object.keys(paramObject);
  if (keys.length === 0) {
    return "";
  }
  return keys
    .map((key) => {
      return `${key}=${paramObject[key]}`;
    })
    .join("&");
}
