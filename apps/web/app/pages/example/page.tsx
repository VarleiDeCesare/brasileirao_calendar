"use client";

import { useAuth } from "../../../components/auth-provider";
import { useAuthPopup } from "../../../components/auth-popup-provider";
import { authClient } from "../../../lib/auth-client";
import Link from "next/link";
import { useEffect } from "react";

export default function ExamplePage() {
  const { session, isLoading } = useAuth();
  const { showPopup } = useAuthPopup();

  useEffect(() => {
    if (!isLoading && !session) {
      showPopup('/pages/example');
    }
  }, [isLoading, session, showPopup]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">You need to be signed in to access this example page.</p>
          <div className="space-y-4">
            <button
              onClick={() => showPopup('/pages/example')}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mr-4"
            >
              Sign In
            </button>
            <Link
              href="/pages/dashboard"
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Example Protected Page</h1>
          <div className="flex gap-4">
            <Link
              href="/pages/dashboard"
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Dashboard
            </Link>
            <Link
              href="/pages/profile"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Profile
            </Link>
            <button
              onClick={() => authClient.signOut()}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Example Protected Content</h2>
          <p className="mb-4">
            This is an example of another protected page that requires authentication.
            Only signed-in users can access this content.
          </p>

          <div className="bg-green-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold mb-2">Welcome, {session.user?.name}!</h3>
            <p>You have successfully accessed the example protected page.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Feature 1</h3>
              <p>This is an example of protected content that only authenticated users can see.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Feature 2</h3>
              <p>Another example of exclusive content for signed-in users.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/pages/dashboard"
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              ← Dashboard
            </Link>
            <Link
              href="/pages/profile"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Profile →
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <p className="text-lg">{session.user?.name || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <p className="text-lg">{session.user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Authenticated
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
