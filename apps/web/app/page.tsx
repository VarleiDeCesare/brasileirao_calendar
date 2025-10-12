"use client";

import { useAuth } from "../components/auth-provider";
import { useAuthPopup } from "../components/auth-popup-provider";
import Link from "next/link";

export default function Home() {
  const { session } = useAuth();
  const { showPopup } = useAuthPopup();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Brasileirão Calendar
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Your complete football calendar application with authentication and protected content.
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