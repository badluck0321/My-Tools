import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // replace with real API call
    setSent(true);
    setLoading(false);
  };

  const info = [
    {
      icon: Mail,
      label: "Email",
      value: "support@my-tools.ma",
      sub: "We reply within 24 h",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+212 5XX-XXX-XXX",
      sub: "Mon – Fri, 9 am – 6 pm",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "Casablanca, Morocco",
      sub: "Headquarters",
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Mon – Fri 9:00 – 18:00",
      sub: "GMT+1",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#1a1816]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#6d2842] to-[#a64d6d] py-20 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
            <MessageSquare size={26} />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            Contact Us
          </h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Have a question, a suggestion, or need support? We're here to help.
          </p>
        </motion.div>
      </section>

      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-2xl font-bold text-[#2d2a27] dark:text-[#fafaf9] mb-6">
              Get in touch
            </h2>
            {info.map(({ icon: Icon, label, value, sub }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-4 bg-white dark:bg-[#2d2a27] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642]">
                <div className="w-10 h-10 bg-[#6d2842]/10 dark:bg-[#6d2842]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon
                    size={18}
                    className="text-[#6d2842] dark:text-[#e8a0b4]"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#8a8580] uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="font-semibold text-[#1a1816] dark:text-[#f0ece8]">
                    {value}
                  </p>
                  <p className="text-xs text-[#8a8580]">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-[#2d2a27] rounded-3xl border border-[#e8e7e5] dark:border-[#4a4642] p-8 shadow-sm">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <Send size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1816] dark:text-[#f0ece8]">
                    Message sent!
                  </h3>
                  <p className="text-[#5d5955] dark:text-[#c4bfb9]">
                    We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="mt-4 text-sm text-[#6d2842] dark:text-[#e8a0b4] underline underline-offset-4">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <h2 className="text-xl font-bold text-[#2d2a27] dark:text-[#fafaf9] mb-6">
                    Send a message
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field
                      label="Full Name"
                      name="name"
                      value={form.name}
                      onChange={handle}
                      placeholder="Ahmed Benali"
                      required
                    />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handle}
                      placeholder="ahmed@example.com"
                      required
                    />
                  </div>
                  <Field
                    label="Subject"
                    name="subject"
                    value={form.subject}
                    onChange={handle}
                    placeholder="How can we help?"
                    required
                  />
                  <div>
                    <label className="block text-sm font-semibold text-[#2d2a27] dark:text-[#c4bfb9] mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handle}
                      required
                      rows={5}
                      placeholder="Describe your question or issue..."
                      className="w-full px-4 py-3 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-[#fafaf9] dark:bg-[#1a1816] text-[#1a1816] dark:text-[#f0ece8] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60">
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={16} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div>
    <label className="block text-sm font-semibold text-[#2d2a27] dark:text-[#c4bfb9] mb-1.5">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-[#fafaf9] dark:bg-[#1a1816] text-[#1a1816] dark:text-[#f0ece8] text-sm focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
    />
  </div>
);

export default Contact;
