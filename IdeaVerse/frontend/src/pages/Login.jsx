import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axiosClient";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import InputMinimal from "../components/InputMinimal";
import ButtonMinimal from "../components/ButtonMinimal";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const { data } = await API.post("/api/users/login", form);
      if (data.success) {
        login(
          {
            name: data.data.name,
            email: data.data.email,
            role: data.data.role,
            _id: data.data._id,
            isEmailVerified: data.data.isEmailVerified,
          },
          data.data.token
        );
        toast.success("Login successful!");
        navigate("/ideas");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Login failed";
      setErr(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">Sign in</h2>
      <form onSubmit={submit} className="space-y-5">
        <InputMinimal
          label="Email"
          type="email"
          required
          placeholder="your@email.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <InputMinimal
          label="Password"
          type="password"
          required
          placeholder="••••••••"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <ButtonMinimal type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </ButtonMinimal>
        {err && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
            {err}
          </p>
        )}
        <div className="text-center mt-4">
          <Link
            to="/forgot-password"
            className="text-sm text-brand-500 dark:text-neon-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
}

