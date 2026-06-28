import { useEffect, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { messageService } from '../../services/messageService';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState('');

  useEffect(() => {
    messageService.conversations().then((res) => setConversations(Array.isArray(res.data) ? res.data : [])).catch(() => {});
  }, []);

  const openConversation = async (conversation) => {
    setActive(conversation);
    const res = await messageService.messages(conversation.id);
    setMessages(Array.isArray(res.data) ? res.data : []);
  };

  const send = async () => {
    if (!body.trim() || !active) return;
    await messageService.send({ conversationId: active.id, body });
    setBody('');
    await openConversation(active);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#508978] to-[#70a596] rounded-2xl text-white"><MessageCircle /></div>
        <div>
          <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">Messages</h2>
          <p className="text-sm text-[#8a8580]">Buyer/seller conversations</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          {conversations.map((c) => (
            <button key={c.id} onClick={() => openConversation(c)} className="w-full text-left p-3 rounded-xl bg-[#f5f5f3] dark:bg-[#2d2a27]">
              <p className="font-semibold">Conversation</p>
              <p className="text-xs text-[#8a8580] truncate">{c.lastMessage || 'No messages yet'}</p>
            </button>
          ))}
          {conversations.length === 0 && <p className="text-sm text-[#8a8580]">No conversations yet.</p>}
        </div>
        <div className="md:col-span-2 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] p-4 min-h-[360px] flex flex-col">
          <div className="flex-1 space-y-2 overflow-y-auto">
            {messages.map((m) => <div key={m.id} className="p-3 rounded-xl bg-white dark:bg-[#1a1816] text-sm">{m.body}</div>)}
            {!active && <p className="text-sm text-[#8a8580] text-center mt-20">Select a conversation.</p>}
          </div>
          {active && <div className="flex gap-2 mt-3">
            <input value={body} onChange={(e) => setBody(e.target.value)} className="flex-1 rounded-xl border p-3 bg-transparent" placeholder="Write a message..." />
            <button onClick={send} className="px-4 rounded-xl bg-[#6d2842] text-white"><Send size={18} /></button>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Messages;
