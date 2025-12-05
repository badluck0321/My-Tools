import axios from "axios";
import getKeycloakInstance from "../keycloak";
// import { getKeycloakInstance } from "../keycloak/keycloak"; // <— IMPORTANT

const interceptor = axios.create({
    baseURL: "http://localhost:8888/api",
    withCredentials: true,
});

interceptor.interceptors.request.use(async (config) => {

    const keycloak = getKeycloakInstance();

    // Refresh token if needed
    if (keycloak && keycloak.token) {
        // Refresh before expiration
        await keycloak.updateToken(30).catch(() => keycloak.login());

        // Attach the token
        config.headers["Authorization"] = "Bearer " + keycloak.token;
        console.log("Attached Token: " + keycloak.token);

    }

    return config;
});

export default interceptor;


// import axios from "axios";

// // Create axios instance
// const interceptor = axios.create({
//     baseURL: "http://localhost:8888/api",
//     withCredentials: true,
// });


// export default interceptor;
