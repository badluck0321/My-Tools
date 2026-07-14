// ContactButton.jsx — reusable component
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { messageService } from "../../services/messageService";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "../../providers/KeycloakProvider";

const ContactButton = ({ resourceType, resourceId, ownerName }) => {
  const { authenticated, login } = useKeycloak();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleContact = async () => {
    if (!authenticated) {
      login();
      return;
    }
    setLoading(true);
    try {
      const msg = await messageService.startConversation({
        resourceType,
        resourceId,
        initialMessage: `Bonjour, je suis intéressé(e) par votre ${
          resourceType === "PRODUCT"
            ? "produit"
            : resourceType === "MASTERY"
            ? "service"
            : "demande"
        }.`,
      });
      // Navigate to the conversation
      navigate(`/dashboard/messages?conversation=${msg.conversationId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleContact}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl 
                 bg-[#6d2842] text-white text-sm font-semibold 
                 hover:bg-[#5a1f35] transition-colors disabled:opacity-60">
      <MessageCircle size={16} />
      {loading ? "Chargement..." : `Contacter ${ownerName || "le vendeur"}`}
    </button>
  );
};

export default ContactButton;
