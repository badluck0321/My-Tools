// service/AIChatbotService.java
package com.example.BackEnd_MyTools.Services;

import java.util.List;

import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import org.springframework.ai.chat.messages.Message;

@Service
public class AIChatbotService {

    private final ChatClient chatClient;

    public AIChatbotService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    private static final String SYSTEM_PROMPT = """
            Tu es MyToolsBot, l'assistant de la plateforme My-Tools.
            Tu aides les utilisateurs à :
            • Trouver des outils et équipements disponibles à la vente ou à la location
            • Comprendre les services de maîtrise proposés par les vendeurs
            • Créer une demande, une réservation, une commande ou contacter un vendeur

            🔹 Réponds delon la langue , de façon concise, amicale et utile.
            🔹 Utilise des émojis pour aérer le texte (🛠️, 📦, ✍️, 📍).
            🔹 Ne jamais inventer de dates, prix, vendeurs, disponibilités ou services.
            🔹 Si la question concerne des données non disponibles, dis :
              _"Je peux vous aider à chercher des outils, services ou demandes — essayez :_
              _« Quels outils sont disponibles à Rabat ? »_
              _« Je veux louer une perceuse »_"
            """;

    public String chat(String userMessage) {
        var prompt = new Prompt(
                List.<Message>of(
                        new SystemMessage(SYSTEM_PROMPT),
                        new UserMessage(userMessage)));
        // var prompt = new Prompt(
        // new SystemMessage(SYSTEM_PROMPT),
        // new UserMessage(userMessage));

        return chatClient.call(prompt).getResult().getOutput().getContent();
    }
}