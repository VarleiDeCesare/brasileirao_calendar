"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { PopupLoginForm } from "./auth-forms";

interface AuthPopupContextType {
  showPopup: (redirectUrl?: string) => void;
  hidePopup: () => void;
  isPopupOpen: boolean;
  redirectUrl: string | null;
}

const AuthPopupContext = createContext<AuthPopupContextType | undefined>(undefined);

export function AuthPopupProvider({ children }: { children: ReactNode }) {
  const [ isPopupOpen, setIsPopupOpen] = useState(false);
  const [ redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const showPopup = (url?: string) => {
    setRedirectUrl(url || null);
    setIsPopupOpen(true);
  };

  const hidePopup = () => {
    // setTimeout(() => {
      setIsPopupOpen(false);
    // }, 200);
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPopupOpen]);

  return (
    <AuthPopupContext.Provider value={{ showPopup, hidePopup, isPopupOpen, redirectUrl }}>
      {children}
      <PopupLoginForm isOpen={isPopupOpen} onClose={hidePopup} redirectUrl={redirectUrl} />
    </AuthPopupContext.Provider>
  );
}

export function useAuthPopup() {
  const context = useContext(AuthPopupContext);
  if (context === undefined) {
    throw new Error("useAuthPopup must be used within an AuthPopupProvider");
  }
  return context;
}
