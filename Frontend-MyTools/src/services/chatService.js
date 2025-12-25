import interceptor from "../interceptors/auth.interceptor";

export const chatService = {
    async sendMessage(message) {
        const response = await interceptor.post("/chat", { message });
        return response.data;
    }
};
