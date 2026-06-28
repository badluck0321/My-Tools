import { RefreshCw } from "lucide-react";
import { LegalPage } from "./Privacy";

const sections = [
  {
    title: "1. Overview",
    content: `My-Tools is a marketplace connecting buyers with professional sellers. Refund eligibility depends on the type of transaction (purchase or rental) and the circumstances of the claim. We aim to resolve all disputes fairly and quickly.`,
  },
  {
    title: "2. Eligible Refund Scenarios",
    content: [
      "Item not received: Full refund if a purchased item is not delivered within the agreed timeframe.",
      "Item significantly not as described: Full or partial refund if the item materially differs from its listing.",
      "Cancelled rental before start date: Full refund if cancelled more than 48 hours before the rental start date.",
      "Late cancellation (< 48 h): 50% refund of rental fee.",
      "Service not rendered: Full refund if a Mastery service was booked and the craftsman did not show up.",
    ],
  },
  {
    title: "3. Non-Refundable Situations",
    content: [
      "Change of mind after a completed transaction.",
      "Items damaged by the buyer during a rental period.",
      "Digital services or consultations already delivered.",
      "Disputes raised more than 14 days after delivery or rental end date.",
      "Transactions conducted outside the My-Tools platform.",
    ],
  },
  {
    title: "4. How to Request a Refund",
    content: `To request a refund, contact our support team at support@my-tools.ma within 14 days of the transaction. Include your order ID, a description of the issue, and any supporting photos. We will review your request within 3 business days.`,
  },
  {
    title: "5. Refund Processing",
    content: `Approved refunds are processed within 5–10 business days to the original payment method. Processing times may vary depending on your bank or payment provider. My-Tools platform fees are non-refundable.`,
  },
  {
    title: "6. Disputes Between Buyers and Sellers",
    content: `If a buyer and seller cannot reach an agreement, My-Tools support will mediate. Our decision is final. We reserve the right to issue refunds and adjust seller ratings in cases of confirmed misrepresentation or fraud.`,
  },
  {
    title: "7. Contact",
    content: `For refund requests or questions: support@my-tools.ma\nFor escalated disputes: legal@my-tools.ma`,
  },
];

const RefundPolicy = () => (
  <LegalPage
    icon={RefreshCw}
    title="Refund Policy"
    updated="June 1, 2026"
    sections={sections}
  />
);
export default RefundPolicy;
