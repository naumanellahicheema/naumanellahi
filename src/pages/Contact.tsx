import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { useSiteSettings, useProfile, useSubmitContactMessage } from "@/hooks/usePortfolioData";
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowUpRight, Clock, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

function SectionMarker({ n, label }: { n: string; label: string }) {
  return (
    <div className="section-marker mb-6">
      <span>{n} — {label}</span>
    </div>
  );
}

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name too long"),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Message is too short (min 5 chars)").max(4000, "Message too long (max 4000)"),
});

const RATE_LIMIT_KEY = "contact_last_submit";
const RATE_LIMIT_COUNT_KEY = "contact_submit_count";
const RATE_LIMIT_WINDOW_MS = 60_000; // 60s cooldown between sends
const RATE_LIMIT_HOURLY_MAX = 5;
const RATE_LIMIT_HOURLY_KEY = "contact_hourly_window";

export default function Contact() {
  const { data: settings } = useSiteSettings();
  const { data: profile } = useProfile();
  const submitMessage = useSubmitContactMessage();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [honeypot, setHoneypot] = useState(""); // bots fill hidden field
  const [renderedAt] = useState(() => Date.now()); // timing check
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const email = settings?.contact_email || profile?.email;
  const phone = settings?.contact_phone || profile?.phone;
  const location = profile?.location || "Pakistan";

  const checkRateLimit = (): string | null => {
    const now = Date.now();
    // Cooldown
    const last = Number(localStorage.getItem(RATE_LIMIT_KEY) || 0);
    if (last && now - last < RATE_LIMIT_WINDOW_MS) {
      const wait = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - last)) / 1000);
      return `Please wait ${wait}s before sending another message.`;
    }
    // Hourly window
    const winStart = Number(localStorage.getItem(RATE_LIMIT_HOURLY_KEY) || 0);
    let count = Number(localStorage.getItem(RATE_LIMIT_COUNT_KEY) || 0);
    if (!winStart || now - winStart > 3600_000) {
      localStorage.setItem(RATE_LIMIT_HOURLY_KEY, String(now));
      localStorage.setItem(RATE_LIMIT_COUNT_KEY, "0");
      count = 0;
    }
    if (count >= RATE_LIMIT_HOURLY_MAX) {
      return `Hourly limit reached (${RATE_LIMIT_HOURLY_MAX} messages). Try again later or email me directly.`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-spam: honeypot must be empty
    if (honeypot.trim() !== "") {
      toast({ title: "Blocked", description: "Suspicious submission detected.", variant: "destructive" });
      return;
    }
    // Anti-spam: form filled suspiciously fast (< 2s)
    if (Date.now() - renderedAt < 2000) {
      toast({ title: "Slow down", description: "Please take a moment before submitting.", variant: "destructive" });
      return;
    }

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      toast({
        title: "Please check the form",
        description: parsed.error.issues[0]?.message || "Some fields need attention.",
        variant: "destructive",
      });
      return;
    }

    const limitError = checkRateLimit();
    if (limitError) {
      toast({ title: "Rate limit", description: limitError, variant: "destructive" });
      return;
    }

    setErrors({});
    try {
      await submitMessage.mutateAsync(parsed.data as any);
      const now = Date.now();
      localStorage.setItem(RATE_LIMIT_KEY, String(now));
      localStorage.setItem(
        RATE_LIMIT_COUNT_KEY,
        String(Number(localStorage.getItem(RATE_LIMIT_COUNT_KEY) || 0) + 1)
      );
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast({ title: "Message sent", description: "I'll reply within 24 hours." });
    } catch (err: any) {
      toast({
        title: "Couldn't send message",
        description: err?.message || "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────── */}
      <section className="editorial-container pt-28 sm:pt-32 pb-14">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-foreground/60 mb-14">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Inbox open · replies within 24h</span>
          </div>
          <span className="hidden sm:block">— {location}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <span className="pill-status mb-8"><span className="dot" /> Contact · Direct line</span>
            <h1 className="display-hero text-[clamp(2.75rem,8vw,7rem)] text-foreground">
              <span className="block">Tell me the</span>
              <span className="block">
                <span className="accent-underline">brief.</span>{" "}
                <span className="font-serif-italic text-foreground/40">I reply</span>
              </span>
              <span className="block">fast.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base sm:text-lg text-foreground/70 leading-relaxed">
              Every message lands straight in my inbox — no forms into the void. Share the goal, the constraints, the deadline. I'll come back with a concrete next step.
            </p>
          </div>

          <div className="lg:col-span-4">
            <div className="grid grid-cols-3 gap-2 border border-foreground/10 rounded-2xl p-4 bg-background">
              {[
                { v: "24h", l: "Reply" },
                { v: "Free", l: "Consult" },
                { v: "1:1", l: "Direct" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="display-h2 text-xl sm:text-2xl">{s.v}</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Channels + Form ───────────────────────── */}
      <section className="editorial-section editorial-container rule-top">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Channels */}
          <div className="lg:col-span-5">
            <SectionMarker n="01" label="Channels" />
            <h2 className="display-h2 text-3xl sm:text-4xl mb-8">
              Pick the <span className="font-serif-italic text-foreground/60">shortest path.</span>
            </h2>

            <div className="space-y-3">
              {email && (
                <a href={`mailto:${email}`} className="group flex items-center justify-between border border-foreground/10 rounded-2xl p-5 bg-background hover:border-foreground/40 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-foreground/5 flex items-center justify-center"><Mail size={18} /></div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">Email</div>
                      <div className="font-medium text-foreground">{email}</div>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="opacity-40 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`} className="group flex items-center justify-between border border-foreground/10 rounded-2xl p-5 bg-background hover:border-foreground/40 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-foreground/5 flex items-center justify-center"><Phone size={18} /></div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">Phone</div>
                      <div className="font-medium text-foreground">{phone}</div>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="opacity-40 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
                </a>
              )}
              <div className="flex items-center justify-between border border-foreground/10 rounded-2xl p-5 bg-background">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-foreground/5 flex items-center justify-center"><MapPin size={18} /></div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">Based in</div>
                    <div className="font-medium text-foreground">{location}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">Serving US · UK · EU · AU</span>
              </div>
            </div>

            <div className="mt-10 border-t border-foreground/10 pt-8">
              <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-4">What happens next</div>
              <ul className="space-y-4">
                {[
                  { icon: Clock, t: "Reply within 24 hours", d: "Usually the same day." },
                  { icon: Zap, t: "Free 30-min consult", d: "We scope the brief together." },
                  { icon: Shield, t: "Proposal + fixed timeline", d: "Transparent pricing, no surprises." },
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full border border-foreground/15 flex items-center justify-center flex-shrink-0"><s.icon size={14} /></div>
                    <div>
                      <div className="font-medium">{s.t}</div>
                      <div className="text-sm text-foreground/60">{s.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <SectionMarker n="02" label="Send a message" />
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-foreground/15 rounded-3xl p-10 sm:p-14 bg-background text-center"
              >
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-foreground flex items-center justify-center">
                  <CheckCircle size={26} className="text-background" />
                </div>
                <h3 className="display-h2 text-3xl mb-3">
                  Message <span className="font-serif-italic text-foreground/60">received.</span>
                </h3>
                <p className="text-foreground/60 max-w-md mx-auto mb-8">
                  It's already in my inbox. Expect a real, human reply within 24 hours.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button onClick={() => setSubmitted(false)} className="btn-outline-hero">Send another</button>
                  <Link to="/portfolio" className="btn-hero">See work <ArrowUpRight size={16} /></Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-foreground/15 rounded-3xl p-6 sm:p-10 bg-background space-y-6">
                {/* Honeypot — hidden from users, bots will fill it */}
                <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden opacity-0 pointer-events-none">
                  <label>
                    Website (leave blank)
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Name" error={errors.name}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="editorial-input"
                      placeholder="Jane Doe"
                      maxLength={120}
                    />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="editorial-input"
                      placeholder="you@company.com"
                      maxLength={255}
                    />
                  </Field>
                </div>
                <Field label="Subject" error={errors.subject}>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="editorial-input"
                    placeholder="New web app · admin panel · SEO overhaul"
                    maxLength={200}
                  />
                </Field>
                <Field label="Brief" error={errors.message}>
                  <textarea
                    rows={7}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="editorial-input resize-none"
                    placeholder="What are you building, who is it for, and what's the deadline?"
                    maxLength={4000}
                  />
                  <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 mt-1 text-right">
                    {form.message.length} / 4000
                  </div>
                </Field>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-foreground/10">
                  <p className="text-xs text-foreground/50 font-mono uppercase tracking-widest">
                    Encrypted · Never shared
                  </p>
                  <button type="submit" disabled={submitMessage.isPending} className="btn-hero disabled:opacity-60">
                    {submitMessage.isPending ? "Sending…" : <>Send message <Send size={16} /></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ mini ─────────────────────────────── */}
      <section className="editorial-section editorial-container rule-top">
        <SectionMarker n="03" label="Before you write" />
        <h2 className="display-h2 text-3xl sm:text-4xl mb-10">
          A few quick <span className="font-serif-italic text-foreground/60">answers.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { q: "How fast can you start?", a: "Usually within 1–2 weeks. Urgent briefs get triaged the same day." },
            { q: "Do you work with agencies?", a: "Yes — as a white-label senior dev or fractional lead." },
            { q: "Fixed price or hourly?", a: "Fixed scope, fixed price. Hourly retainers for ongoing work." },
            { q: "Do you sign NDAs?", a: "Absolutely. Send yours or use mine — it's a one-page mutual NDA." },
          ].map((f, i) => (
            <div key={i} className="border border-foreground/10 rounded-2xl p-6 bg-background">
              <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-2">Q · {String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-display text-lg mb-2">{f.q}</h3>
              <p className="text-sm text-foreground/65 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/60">{label}</span>
        {error && <span className="text-[10px] font-mono uppercase tracking-widest text-red-600">{error}</span>}
      </div>
      {children}
    </label>
  );
}
