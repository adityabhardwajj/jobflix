import React from "react";

interface LoginOptionsProps {
  onSelect: (method: 'phone' | 'google' | 'linkedin') => void;
}

export default function LoginOptions({ onSelect }: LoginOptionsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <button
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={() => onSelect('phone')}
      >
        Login with Contact Number
      </button>
      <button
        className="w-full py-3 bg-white text-gray-900 rounded-lg border hover:bg-gray-100 transition flex items-center justify-center gap-2"
        onClick={() => window.location.href = "/api/auth/google"}
      >
        <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/></g></svg>
        Continue with Google
      </button>
      <button
        className="w-full py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition flex items-center justify-center gap-2"
        onClick={() => window.location.href = "/api/auth/linkedin"}
      >
        <svg className="w-5 h-5" viewBox="0 0 32 32"><path fill="#fff" d="M29 0H3C1.3 0 0 1.3 0 3v26c0 1.7 1.3 3 3 3h26c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3zM9.3 27H5.3V12h4v15zm-2-17.1c-1.3 0-2.3-1-2.3-2.3S6 5.3 7.3 5.3s2.3 1 2.3 2.3-1 2.3-2.3 2.3zm19.7 17.1h-4v-7.2c0-1.7-.6-2.8-2.1-2.8-1.1 0-1.7.7-2 1.4-.1.3-.1.7-.1 1.1V27h-4s.1-13 0-15h4v2.1c.5-.8 1.4-2 3.5-2 2.6 0 4.5 1.7 4.5 5.3V27z"/></svg>
        Sign in with LinkedIn
      </button>
    </div>
  );
}
