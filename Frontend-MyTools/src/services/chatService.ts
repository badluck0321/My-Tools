import interceptor from "../interceptors/auth.interceptor";

export const chatService = {
    async sendMessage(message: any) {
        const responsed = await interceptor.get("/products");
        console.log("RESPONSED:", responsed);
        const response = await interceptor.post("/chat", { message });
        console.log("CHAT RESPONSE:", response);
        return response.data;
    }
};
