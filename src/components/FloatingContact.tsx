import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X, Mail } from "lucide-react";
import { useSiteSettings, useProfile } from "@/hooks/usePortfolioData";

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const { data: profile } = useProfile();

  const phone = settings?.contact_phone || profile?.phone || "+923331401384";
  const email = settings?.contact_email || profile?.email || "naumancheema643@gmail.com";
  
  // Clean phone number for links
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  const whatsappLink = `https://wa.me/${cleanPhone.replace("+", "")}`;
  const callLink = `tel:${cleanPhone}`;
  const emailLink = `mailto:${email}`;

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={20} />
                <span className="font-medium">WhatsApp</span>
              </motion.a>
              
              <motion.a
                href={callLink}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-3 px-4 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              >
                <Phone size={20} />
                <span className="font-medium">Call Now</span>
              </motion.a>

              <motion.a
                href={emailLink}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="flex items-center gap-3 px-4 py-3 bg-foreground text-background rounded-full shadow-lg hover:opacity-90 transition-opacity"
              >
                <Mail size={20} />
                <span className="font-medium">Email</span>
              </motion.a>
            </>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          animate={{ rotate: isOpen ? 45 : 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </motion.button>
      </div>
    </>
  );
}
