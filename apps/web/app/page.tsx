"use client";

import { useAuth } from "../components/auth-provider";
import { useAuthPopup } from "../components/auth-popup-provider";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const { session } = useAuth();
  const { showPopup } = useAuthPopup();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {

      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/pages/profile`
      });
      } catch (error: unknown) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="pt-6 h-10 flex justify-between items-center gap-2 w-full mx-auto max-w-7xl">
        <Image src={'/next.svg'} alt={'home_logo'} width={180} height={10}/>

        <Button variant="outline" size={"lg"} onClick={handleGoogleLogin} disabled={isLoading}>
          <Image src={'/google_icon.svg'} alt={'google_logo'} width={27} height={27}/>
          {isLoading ? "Entrando..." : ""}
          Entrar
        </Button>

      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="mt-10max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Bem vindo ao calendário do futebol Brasileiro
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Seu calendário completo de futebol Brasileiro com alertas de partidas e resultados
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Public Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Access the public dashboard to see general information and content.
              </p>
              <Link
                href="/pages/dashboard"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 inline-block"
              >
                Go to Dashboard
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Protected Profile</h3>
              <p className="text-gray-600 mb-4">
                Access your personal profile with authentication required.
              </p>
              {session ? (
                <Link
                  href="/pages/profile"
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 inline-block"
                >
                  Go to Profile
                </Link>
              ) : (
                <button
                  onClick={() => showPopup('/pages/profile')}
                  className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
                >
                  Sign In to Access
                </button>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Example Page</h3>
              <p className="text-gray-600 mb-4">
                Another protected page demonstrating authentication features.
              </p>
              {session ? (
                <Link
                  href="/pages/example"
                  className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 inline-block"
                >
                  Go to Example
                </Link>
              ) : (
                <button
                  onClick={() => showPopup('/pages/example')}
                  className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
                >
                  Sign In to Access
                </button>
              )}
            </div>
          </div>

          {session ? (
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Welcome back, {session.user?.name}!</h2>
              <p className="text-gray-600 mb-4">
                You are signed in and can access all protected content.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/pages/dashboard"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Dashboard
                </Link>
                <Link
                  href="/pages/profile"
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Profile
                </Link>
                <Link
                  href="/pages/example"
                  className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
                >
                  Example
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
              <p className="text-gray-600 mb-4">
                Sign in to access protected content and personalized features.
              </p>
              <button
                onClick={() => showPopup('/pages/dashboard')}
                className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 text-lg"
              >
                Sign In Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}