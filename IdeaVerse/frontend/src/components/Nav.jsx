import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">IdeaVerse</Link>
        <div className="space-x-4">
          <Link to="/ideas" className="hover:underline">Ideas</Link>
          <Link to="/jobs" className="hover:underline">Jobs</Link>
          <Link to="/news" className="hover:underline">Tech News</Link>
          {user ? (
            <>
              <Link to="/create" className="ml-2 btn">Create Idea</Link>
              {user.role === "recruiter" && <Link to="/recruiter" className="ml-2 btn">Recruiter</Link>}
              <button onClick={handleLogout} className="ml-2 text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="ml-2">Login</Link>
              <Link to="/register" className="ml-2">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

