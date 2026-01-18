import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useSiteSettings, useProfile, useSubmitContactMessage } from "@/hooks/usePortfolioData";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { data: settings } = useSiteSettings();
  const { data: profile } = useProfile();
  const submitMessage = useSubmitContactMessage();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitMessage.mutateAsync(form);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast({ title: "Message sent!", description: "Thank you for reaching out. I'll get back to you soon." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Layout>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="section-title">Get In Touch</h1>
            <p className="section-subtitle mx-auto">Have a project in mind? Let's discuss how I can help bring your vision to life.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="glass-card p-8 mb-8">
                <h2 className="text-2xl font-display font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <a href={`mailto:${settings?.contact_email || profile?.email}`} className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center"><Mail size={20} /></div>
                    <div><div className="text-sm text-muted-foreground">Email</div><div className="font-medium text-foreground">{settings?.contact_email || profile?.email}</div></div>
                  </a>
                  <a href={`tel:${settings?.contact_phone || profile?.phone}`} className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center"><Phone size={20} /></div>
                    <div><div className="text-sm text-muted-foreground">Phone / WhatsApp</div><div className="font-medium text-foreground">{settings?.contact_phone || profile?.phone}</div></div>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center"><MapPin size={20} /></div>
                    <div><div className="text-sm text-muted-foreground">Location</div><div className="font-medium text-foreground">{profile?.location || "Pakistan"}</div></div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-lg font-display font-semibold mb-4">What to expect</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3"><CheckCircle size={18} className="text-foreground mt-0.5 flex-shrink-0" /><span>Quick response within 24 hours</span></li>
                  <li className="flex items-start gap-3"><CheckCircle size={18} className="text-foreground mt-0.5 flex-shrink-0" /><span>Free project consultation</span></li>
                  <li className="flex items-start gap-3"><CheckCircle size={18} className="text-foreground mt-0.5 flex-shrink-0" /><span>Detailed proposal and timeline</span></li>
                  <li className="flex items-start gap-3"><CheckCircle size={18} className="text-foreground mt-0.5 flex-shrink-0" /><span>Transparent pricing</span></li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              {submitted ? (
                <div className="glass-card p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground flex items-center justify-center"><CheckCircle size={32} className="text-background" /></div>
                  <h3 className="text-2xl font-display font-bold mb-4">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline-hero">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground" placeholder="Project Inquiry" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground resize-none" placeholder="Tell me about your project..." />
                  </div>
                  <button type="submit" disabled={submitMessage.isPending} className="btn-hero w-full">
                    {submitMessage.isPending ? "Sending..." : <>Send Message <Send size={18} /></>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}