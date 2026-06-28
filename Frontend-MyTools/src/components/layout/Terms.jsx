import { FileText } from "lucide-react";
import { LegalPage } from "./Privacy";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using My-Tools, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform. These terms apply to all users — visitors, registered users, and StoreOwners.`,
  },
  {
    title: "2. Account Registration",
    content: `You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. You must be at least 18 years old to use My-Tools.`,
  },
  {
    title: "3. StoreOwner Responsibilities",
    content: `StoreOwners must ensure that listings are accurate, legal, and comply with applicable laws. Photos must represent the actual product or service. Pricing must be clear and inclusive of applicable taxes. A StoreOwner may only operate one store on the platform. Misrepresentation or fraud will result in immediate account termination.`,
  },
  {
    title: "4. Buyer Responsibilities",
    content: `Buyers agree to pay for items or services they commit to purchasing or renting. Rental agreements must include accurate dates. Cart items expire after 7 days of inactivity. My-Tools is not responsible for disputes arising from transactions conducted outside the platform.`,
  },
  {
    title: "5. Prohibited Conduct",
    content: [
      "Listing counterfeit, stolen, or illegal goods",
      "Harassing, threatening, or abusing other users in the Community Q&A",
      "Creating multiple accounts to circumvent bans or restrictions",
      "Scraping or automated data collection without written permission",
      "Impersonating another user, craftsman, or My-Tools staff",
      "Publishing false reviews or manipulating the upvote system",
    ],
  },
  {
    title: "6. Community Q&A",
    content: `The Community Q&A forum is intended for good-faith questions and answers related to tools, repairs, and craftsmanship. Off-topic content, spam, or harmful advice may be removed without notice. Votes and accepted answers are meant to surface the most helpful responses, not to promote commercial interests.`,
  },
  {
    title: "7. Intellectual Property",
    content: `All content you publish on My-Tools (photos, descriptions, answers) remains yours. By publishing, you grant My-Tools a non-exclusive, royalty-free license to display and distribute that content as part of the platform. You may not reproduce or distribute platform content without permission.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `My-Tools is a marketplace connecting buyers and sellers. We are not a party to transactions between users and are not liable for the quality, safety, or legality of listed items or services. Our liability is limited to the amount of fees paid to us in the 12 months preceding the claim.`,
  },
  {
    title: "9. Termination",
    content: `We reserve the right to suspend or terminate accounts that violate these Terms at our discretion. You may close your account at any time via account settings. Termination does not affect obligations arising from completed transactions.`,
  },
  {
    title: "10. Governing Law",
    content: `These Terms are governed by the laws of the Kingdom of Morocco. Any disputes shall be subject to the exclusive jurisdiction of the courts of Casablanca.`,
  },
];

const Terms = () => (
  <LegalPage
    icon={FileText}
    title="Terms of Service"
    updated="June 1, 2026"
    sections={sections}
  />
);
export default Terms;
