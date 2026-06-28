import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us when you create an account, publish a listing, or contact us. This includes your name, email address, phone number, and profile information. We also collect information automatically when you use the platform, such as your IP address, browser type, pages visited, and actions taken (products viewed, searches performed, items added to cart).`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use your information to provide, maintain, and improve My-Tools services; process transactions; send notifications about orders, answers to your questions, and platform updates; prevent fraud; and personalize your experience. We use anonymized, aggregated data for analytics and platform improvement.`,
  },
  {
    title: "3. Information Sharing",
    content: `We do not sell your personal information to third parties. We share information only with service providers who help us operate the platform (payment processors, cloud storage, email delivery), when required by law, or with your explicit consent. StoreOwner profiles and product listings are public by nature.`,
  },
  {
    title: "4. Authentication & Security",
    content: `My-Tools uses Keycloak SSO (OpenID Connect / OAuth2) for authentication. We never store passwords directly — authentication is handled by the Keycloak identity provider. JWT tokens are managed in-memory and never stored in localStorage. All communication is encrypted via HTTPS.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain your account data for as long as your account is active. If you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it for legal or tax purposes. Cart data is automatically purged after 7 days of inactivity.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to access, correct, or delete your personal data. You may also request a copy of your data, restrict its processing, or withdraw consent at any time. To exercise these rights, contact us at privacy@my-tools.ma. Moroccan users also have rights under Law 09-08 on personal data protection.`,
  },
  {
    title: "7. Cookies",
    content: `We use strictly necessary cookies to maintain session state and security. We do not use tracking cookies or third-party advertising cookies without your explicit consent. See our Cookie Policy for full details.`,
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by a prominent notice on the platform at least 14 days before the changes take effect.`,
  },
  {
    title: "9. Contact",
    content: `For any privacy-related questions or to exercise your rights, contact our Data Protection Officer at: privacy@my-tools.ma`,
  },
];

const Privacy = () => (
  <LegalPage
    icon={Shield}
    title="Privacy Policy"
    updated="June 1, 2026"
    sections={sections}
  />
);
export default Privacy;

/* ─── Shared LegalPage layout ─────────────────────── */
export const LegalPage = ({ icon: Icon, title, updated, sections }) => (
  <div className="min-h-screen bg-[#fafaf9] dark:bg-[#1a1816]">
    <section className="bg-gradient-to-br from-[#6d2842] to-[#a64d6d] py-20 text-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
          <Icon size={26} />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
          {title}
        </h1>
        <p className="text-white/70 text-sm">Last updated: {updated}</p>
      </motion.div>
    </section>

    <div className="container-custom py-16 max-w-3xl">
      <div className="space-y-10">
        {sections.map((s, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}>
            <h2 className="text-lg font-bold text-[#2d2a27] dark:text-[#fafaf9] mb-3 pb-2 border-b border-[#e8e7e5] dark:border-[#4a4642]">
              {s.title}
            </h2>
            {Array.isArray(s.content) ? (
              <ul className="space-y-2">
                {s.content.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-[#5d5955] dark:text-[#c4bfb9] text-sm leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6d2842] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#5d5955] dark:text-[#c4bfb9] text-sm leading-relaxed whitespace-pre-line">
                {s.content}
              </p>
            )}
          </motion.section>
        ))}
      </div>
    </div>
  </div>
);
