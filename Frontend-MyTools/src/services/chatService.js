const API_BASE_URL = 'http://localhost:8888';

export const chatService = {
    async sendMessage(message) {  // ← `message` is a STRING ("hi")
        const response = await fetch('http://localhost:8888/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ message }),  // → { "message": "hi" } ✅
        });
        return response.json();
    }
};
// import keycloak from '../keycloak';

// interface ChatMessageRequest {
//   message: string;
// }

// interface ChatMessageResponse {
//   text: string;
// }

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8888';

// export const chatService = {
//   async sendMessage(message: string): Promise<ChatMessageResponse> {
//     const token = keycloak.token;
//     if (!token) {
//       throw new Error('No authentication token');
//     }

//     const response = await fetch(`${API_BASE_URL}/api/chat`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify({ message } as ChatMessageRequest),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`HTTP ${response.status}: ${errorText}`);
//     }

//     return response.json() as Promise<ChatMessageResponse>;
//   }
// };