import axios, {
    AxiosInstance,
    AxiosResponse,
  } from "axios";
  
  const httpService: AxiosInstance = axios.create();
  
  httpService.interceptors.request.use(
    (config) => {
      let accessToken: string = "";
  
      if (
        (config.url?.includes("/AdSale/Get/Likes") ||
          config.url?.includes("/Auth/Anonymous") ||
          config.url?.includes("/Search/Get") ||
          config.url?.includes("/Search/Save") ||
          (config.url?.includes("/AdSale/Id/") && config.url.endsWith("/View")) ||
          config.url?.includes("/AdSale/Get/User/View") ||
          config.url?.match(/\/AdSale\/Id\/[a-zA-Z0-9-]+\/Like/) ||
          config.url?.match(/\/AdSale\/Id\/[a-zA-Z0-9-]+\/UnLike/)) &&
        (!accessToken || accessToken === "")
      ) {
      } else if (accessToken) {
        // config.headers["Authorization"] = JSON.parse(atob(accessToken));
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  httpService.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      if (error?.response?.status === 498) {
        if (typeof window !== "undefined") {
          localStorage.clear();
          location.pathname = "/auth/check";
        }
      }
      return Promise.reject(error);
    }
  );
  
  export { httpService };