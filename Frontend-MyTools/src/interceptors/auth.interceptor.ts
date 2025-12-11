import axios from "axios";
import getKeycloakInstance from "../keycloak";
const interceptor = axios.create({
    baseURL: "http://localhost:8888",
    withCredentials: true,
});

interceptor.interceptors.request.use(async (config) => {

    const keycloak = getKeycloakInstance();
    console.log("INTERCEPTOR RAN");
    console.log("KEYCLOAK TOKEN:", keycloak?.token);
    console.log("FINAL REQUEST HEADERS BEFORE SEND:", config.headers);
    // Refresh token if needed
    if (keycloak && keycloak.token) {
        // Refresh before expiration
        await keycloak.updateToken(30).catch(() => keycloak.login());
        // Attach the token
        config.headers["Authorization"] = "Bearer " + keycloak.token;
    }

    return config;
});

export default interceptor;


