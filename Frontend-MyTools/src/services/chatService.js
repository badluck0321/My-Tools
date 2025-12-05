import interceptor from "../interceptors/auth.interceptor";

export const chatService = {
    async sendMessage(message) {
        const response = await interceptor.post("/chat", { message });
        return response.data;
    }
};
// export const chatService = {
//     async sendMessage(message) {  // ← `message` is a STRING ("hi")
//         const response = await fetch('http://localhost:8888/api/chat', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },

//             body: JSON.stringify({ message }),  // → { "message": "hi" } ✅
//         });
//         return response.json();
//     }
// };
