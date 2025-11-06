import React, { useState } from "react";
import API from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import InputMinimal from "../components/InputMinimal";
import ButtonMinimal from "../components/ButtonMinimal";

export default function CreateIdea() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", tags: "" });
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title: form.title, description: form.description, tags: form.tags.split(",").map(t=>t.trim()).filter(t=>t) };
      await API.post("/api/ideas", payload);
      navigate("/ideas");
    } catch (error) {
      setErr(error.response?.data?.message || "Create idea failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">Create Idea</h2>
      <form onSubmit={submit} className="space-y-5">
        <InputMinimal
          label="Title"
          required
          placeholder="Enter a compelling title for your idea"
          value={form.title}
          onChange={e=>setForm({...form,title:e.target.value})}
        />
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Description</label>
          <textarea 
            required 
            placeholder="Describe your idea in detail..."
            value={form.description} 
            onChange={e=>setForm({...form,description:e.target.value})} 
            className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-background-dark-card text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-brand-500 dark:focus:border-accent-dark focus:ring-2 focus:ring-brand-500/20 dark:focus:ring-accent-dark/20 transition-all resize-none h-32"
          />
        </div>
        <InputMinimal
          label="Tags (comma separated)"
          placeholder="e.g., AI, Tech, Innovation"
          value={form.tags}
          onChange={e=>setForm({...form,tags:e.target.value})}
        />
        <ButtonMinimal type="submit" className="w-full">Publish Idea</ButtonMinimal>
        {err && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">{err}</p>}
      </form>
    </div>
  );
}

