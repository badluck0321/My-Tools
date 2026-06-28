import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useKeycloak } from "../../providers/KeycloakProvider";
import { messageService } from "../../services/messageService";

const Messages = () => {
  const { user } = useKeycloak();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const data = await messageService.conversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load conversations", error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = async (conversation) => {
    setActiveConversation(conversation);
    setIsLoadingMessages(true);
    try {
      const data = await messageService.messages(conversation.id);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load conversation messages", error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const refreshConversations = async () => {
    const data = await messageService.conversations();
    setConversations(Array.isArray(data) ? data : []);
  };

  const formatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const getConversationTitle = (conversation) => {
    const participantIds = Array.isArray(conversation?.participantIds)
      ? conversation.participantIds
      : [];
    const otherParticipants = participantIds.filter(
      (id) => id && id !== user?.id
    );

    if (otherParticipants.length > 0) {
      return otherParticipants[0];
    }

    return conversation?.productId
      ? `Product ${conversation.productId}`
      : "Conversation";
  };

  const getReceiverId = (conversation) => {
    const participantIds = Array.isArray(conversation?.participantIds)
      ? conversation.participantIds
      : [];
    return participantIds.find((id) => id && id !== user?.id) || null;
  };

  const send = async () => {
    if (!body.trim() || !activeConversation || isSending) return;

    const payload = {
      conversationId: activeConversation.id,
      receiverId: getReceiverId(activeConversation),
      productId: activeConversation.productId,
      body: body.trim(),
    };

    setIsSending(true);
    try {
      await messageService.send(payload);
      setBody("");
      await openConversation(activeConversation);
      await refreshConversations();
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  const activeConversationLabel = useMemo(() => {
    if (!activeConversation) return "Select a conversation";
    return getConversationTitle(activeConversation);
  }, [activeConversation, user?.id]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#508978] to-[#70a596] rounded-2xl text-white">
          <MessageCircle />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">
            Messages
          </h2>
          <p className="text-sm text-[#8a8580]">
            Buyer and seller conversations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2">
          {isLoadingConversations ? (
            <div className="rounded-2xl border border-[#e8e7e5] bg-[#f5f5f3] p-4 text-sm text-[#8a8580] dark:border-[#4a4642] dark:bg-[#2d2a27]">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading conversations...
              </div>
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((conversation) => {
              const isActive = activeConversation?.id === conversation.id;
              return (
                <button
                  key={conversation.id}
                  onClick={() => openConversation(conversation)}
                  className={`w-full rounded-2xl border p-3 text-left transition-all ${
                    isActive
                      ? "border-[#6d2842] bg-[#6d2842] text-white shadow-lg"
                      : "border-[#e8e7e5] bg-[#f5f5f3] text-[#2d2a27] hover:bg-[#efece9] dark:border-[#4a4642] dark:bg-[#2d2a27] dark:text-[#fafaf9] dark:hover:bg-[#3a3633]"
                  }`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">
                      {getConversationTitle(conversation)}
                    </p>
                    {conversation.updatedAt && (
                      <span
                        className={`text-[11px] ${
                          isActive ? "text-white/80" : "text-[#8a8580]"
                        }`}>
                        {formatTime(conversation.updatedAt)}
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-1 text-sm truncate ${
                      isActive ? "text-white/80" : "text-[#8a8580]"
                    }`}>
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-[#e8e7e5] bg-[#f5f5f3] p-4 text-sm text-[#8a8580] dark:border-[#4a4642] dark:bg-[#2d2a27]">
              No conversations yet.
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-[#e8e7e5] bg-[#f5f5f3] p-4 min-h-[420px] flex flex-col dark:border-[#4a4642] dark:bg-[#2d2a27]">
          {activeConversation ? (
            <>
              <div className="mb-4 border-b border-[#e8e7e5] pb-3 dark:border-[#4a4642]">
                <p className="text-lg font-semibold text-[#2d2a27] dark:text-white">
                  {activeConversationLabel}
                </p>
                <p className="text-sm text-[#8a8580]">
                  {activeConversation.productId
                    ? `Related product: ${activeConversation.productId}`
                    : "Private conversation"}
                </p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {isLoadingMessages ? (
                  <div className="flex h-full items-center justify-center text-sm text-[#8a8580]">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading messages...
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((message) => {
                    const isMine = message.senderId === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isMine ? "justify-end" : "justify-start"
                        }`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                            isMine
                              ? "bg-[#6d2842] text-white"
                              : "bg-white text-[#2d2a27] dark:bg-[#1a1816] dark:text-[#fafaf9]"
                          }`}>
                          <p className="text-sm whitespace-pre-wrap">
                            {message.body}
                          </p>
                          <p
                            className={`mt-1 text-[11px] ${
                              isMine ? "text-white/70" : "text-[#8a8580]"
                            }`}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-[#8a8580]">
                    Start the conversation by sending the first message.
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="mt-3 flex gap-2 border-t border-[#e8e7e5] pt-3 dark:border-[#4a4642]">
                <input
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      send();
                    }
                  }}
                  className="flex-1 rounded-xl border border-[#e8e7e5] bg-transparent px-3 py-3 text-sm outline-none focus:border-[#6d2842] dark:border-[#4a4642]"
                  placeholder="Write a message..."
                />
                <button
                  onClick={send}
                  disabled={isSending || !body.trim()}
                  className="rounded-xl bg-[#6d2842] px-4 py-3 text-white transition hover:bg-[#552033] disabled:cursor-not-allowed disabled:opacity-70">
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-[#8a8580]">
              <MessageCircle className="mb-3 h-8 w-8" />
              Select a conversation to view its messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
