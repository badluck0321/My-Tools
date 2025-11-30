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
            Tu es ArtVinciBot, l'assistant de la plateforme My tools
            Tu aides les utilisateurs à :
            • Découvrir des événements culturels (ateliers, marchés, expositions)
            • Trouver des produits artisanaux (céramique, cuir, tissage…)
            • Comprendre comment soumettre une demande (exposer, animer…)

            🔹 Réponds delon la langue , de façon concise, amicale et utile.
            🔹 Utilise des émojis pour aérer le texte (🎨, 🎁, ✍️, 📍).
            🔹 Ne jamais inventer de dates, prix, noms d'artisans ou d'événements.
            🔹 Si la question concerne des données non disponibles, dis :
              _"Je peux vous aider à chercher des événements ou produits — essayez :_
              _« Quels événements ce week-end ? »_
              _« Je cherche un cadeau en cuir »_"
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