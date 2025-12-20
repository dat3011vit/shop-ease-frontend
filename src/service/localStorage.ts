const tokenKey = "persist:auth";

export const LocalStorageService = {
  getToken: () => {
    const token =
        localStorage.getItem('persist:auth')  &&
        JSON.parse(localStorage.getItem('persist:auth') as string)?.token?.slice(1, -1);
    console.log({token})
    return token;
  },
  setToken: (token: string | null) => {
    if (token) {
      return localStorage.setItem(tokenKey, token);
    }
    if (token === null) {
      return localStorage.removeItem(tokenKey);
    }
  },
  getLocalStorage: (key: string) => {
    return localStorage.getItem(key);
  },
  setLocalStorage: (key: string, value: any) => {
    return localStorage.setItem(key, value);
  },
  removeLocalStorage: (key: string) => {
    return localStorage.removeItem(key);
  },
};
