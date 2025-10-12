"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { GoogleIcon } from "./google-login-button";

export function PopupLoginForm({ isOpen, onClose, redirectUrl }: { isOpen: boolean; onClose: () => void; redirectUrl?: string | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginFailedMessage, setLoginFailedMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Submitting login form");
    try {
      const response = await authClient.signIn.email({
        email,
        password,
      });

      if (response?.error) {
        if (response?.error?.code === "INVALID_EMAIL_OR_PASSWORD") {
          setLoginFailedMessage("Email ou senha incorretos. Tente novamente.");
        } else {
          setLoginFailedMessage(response?.error?.message || "Email ou senha incorretos. Tente novamente.");
        }
      } else {
        onClose();
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Email ou senha incorretos. Tente novamente.";
      console.error("Login failed:", errorMessage);
      setLoginFailedMessage(errorMessage);
      } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
      });
      onClose();
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (error: unknown) {
      console.error("Google login failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Falha no login com Google. Tente novamente.";
      setLoginFailedMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm popup-enter"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto popup-enter">
        <div className="p-8 popup-form">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Calendário Brasileirão</h2>
              <p className="text-gray-600 text-sm mt-1">Faça login para acessar este conteúdo</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">or</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="popup-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="popup-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite seu email"
                />
              </div>
              <div>
                <label htmlFor="popup-password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="popup-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite sua senha"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Entrando
                  </div>
                ) : (
                  "Continuar"
                )}
              </button>
            </form>
            {loginFailedMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 error-enter">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-800 font-medium">{loginFailedMessage}</p>
                  </div>
                  <button
                    className="text-red-400 hover:text-red-600 transition-colors duration-200 p-1 hover:bg-red-100 rounded-full"
                    onClick={() => setLoginFailedMessage("")}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <GoogleIcon />
              {isLoading ? "Entrando..." : "Entrar com Google"}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => {/* FIXME: Add signup functionality */}}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                >
                  Criar conta
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
