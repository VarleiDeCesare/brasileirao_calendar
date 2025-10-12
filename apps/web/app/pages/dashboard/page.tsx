"use client";

import { useAuth } from "../../../components/auth-provider";
import { useAuthPopup } from "../../../components/auth-popup-provider";
import { authClient } from "../../../lib/auth-client";
import Link from "next/link";

export default function Dashboard() {
  const { session } = useAuth();
  const { showPopup } = useAuthPopup();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {session ? (
            <div className="flex gap-4">
              <Link
                href="/pages/profile"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Profile
              </Link>
              <Link
                href="/pages/example"
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
              >
                Example
              </Link>
              <button
                onClick={() => authClient.signOut()}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => showPopup('/pages/dashboard')}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Sign In
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Welcome to Dashboard</h2>
          <p className="mb-4">
            This is a public dashboard page that everyone can access.
          </p>

          {session ? (
            <div className="bg-green-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">User Information</h3>
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>Name:</strong> {session.user?.name}</p>
              <p><strong>User ID:</strong> {session.user?.id}</p>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p>You are not signed in. Click the &quot;Sign In&quot; button above to access your profile.</p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Public Content</h2>
          <p>
            This dashboard is accessible to everyone. If you want to access your personal profile,
            please sign in and click the &quot;Profile&quot; button.
          </p>
        </div>
      </div>
    </div>
  );
}
