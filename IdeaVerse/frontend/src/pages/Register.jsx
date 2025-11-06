import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axiosClient";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import InputMinimal from "../components/InputMinimal";
import ButtonMinimal from "../components/ButtonMinimal";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "creator" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[@$!%*?&]/.test(password);
    const hasLength = password.length >= 8;

    if (hasUpper && hasLower && hasDigit && hasSymbol && hasLength) {
      setPasswordStrength("strong");
    } else if ((hasUpper || hasLower) && hasDigit && hasLength) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("weak");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const { data } = await API.post("/api/users/register", form);
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
        toast.success(data.message || "Registration successful! Please check your email to verify your account.");
        navigate("/ideas");
      }
    } catch (error) {
      const errorDetails = error.response?.data?.error?.details || [];
      const errorMsg =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Registration failed";
      setErr(errorDetails.length > 0 ? errorDetails.map((d) => d.msg).join(", ") : errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">Sign up</h2>
      <form onSubmit={submit} className="space-y-5">
        <InputMinimal
          label="Name"
          required
          placeholder="Your name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <InputMinimal
          label="Email"
          type="email"
          required
          placeholder="your@email.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <div>
          <InputMinimal
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              checkPasswordStrength(e.target.value);
            }}
          />
          {passwordStrength && (
            <div className="mt-1 text-xs">
              <span className={`${
                passwordStrength === "strong"
                  ? "text-green-500"
                  : passwordStrength === "medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}>
                Password strength: {passwordStrength}
              </span>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                Must contain: uppercase, lowercase, digit, symbol, min 8 chars
              </p>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Role</label>
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-background-dark-card text-neutral-900 dark:text-neutral-100 focus:border-brand-500 dark:focus:border-accent-dark focus:ring-2 focus:ring-brand-500/20 dark:focus:ring-accent-dark/20 transition-all"
          >
            <option value="creator">Creator</option>
            <option value="freelancer">Freelancer</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>
        <ButtonMinimal type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </ButtonMinimal>
        {err && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
            {err}
          </p>
        )}
      </form>
    </div>
  );
}

