import axios from "axios";
import getKeycloakInstance from "../keycloak";
import { env } from "../config/env";

const interceptor = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
});

interceptor.interceptors.request.use(async (config) => {
  let keycloak = null;
  try {
    keycloak = getKeycloakInstance();
  } catch {
    keycloak = null;
  }

  if (keycloak?.token) {
    await keycloak.updateToken(30).catch(() => keycloak.login());
    config.headers["Authorization"] = "Bearer " + keycloak.token;
  }

  return config;
});

export default interceptor;
