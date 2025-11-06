import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosClient";
import { useAuth } from "../hooks/useAuth";
import InputMinimal from "../components/InputMinimal";
import ButtonMinimal from "../components/ButtonMinimal";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({ coverLetter: "", portfolioUrl: "", expectedBudget: "" });
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await API.get(`/api/jobs/${id}`);
      setJob(data);
    };
    fetch();
  }, [id]);

  const apply = async () => {
    if (!user) {
      setErr("Please login as a freelancer to apply");
      return;
    }
    try {
      await API.post(`/api/jobs/${id}/apply`, form);
      setSuccess(true);
      setForm({ coverLetter: "", portfolioUrl: "", expectedBudget: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to apply");
    }
  };

  if (!job) return <div className="container mx-auto mt-6 text-neutral-600 dark:text-neutral-400">Loading...</div>;
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">{job.title}</h2>
      <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">{job.description}</p>
      
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {job.skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs font-medium bg-brand-500/10 dark:bg-accent-dark/20 text-brand-600 dark:text-accent-dark rounded-full border border-brand-500/20 dark:border-accent-dark/30"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-6 bg-white dark:bg-background-dark-card rounded-lg shadow-card dark:shadow-dark-card border border-neutral-200/50 dark:border-neutral-700/50">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Apply for this Job</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Cover Letter</label>
            <textarea 
              placeholder="Tell us why you're a great fit..." 
              value={form.coverLetter} 
              onChange={e=>setForm({...form,coverLetter:e.target.value})} 
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-background-dark-card text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-brand-500 dark:focus:border-accent-dark focus:ring-2 focus:ring-brand-500/20 dark:focus:ring-accent-dark/20 transition-all resize-none"
              rows="4"
            />
          </div>
          <InputMinimal
            label="Portfolio URL"
            type="url"
            placeholder="https://yourportfolio.com"
            value={form.portfolioUrl}
            onChange={e=>setForm({...form,portfolioUrl:e.target.value})}
          />
          <InputMinimal
            label="Expected Budget"
            placeholder="e.g., $500-$1000"
            value={form.expectedBudget}
            onChange={e=>setForm({...form,expectedBudget:e.target.value})}
          />
          <ButtonMinimal onClick={apply} className="w-full">Submit Application</ButtonMinimal>
          {success && <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">Application submitted successfully!</p>}
          {err && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">{err}</p>}
        </div>
      </div>
    </div>
  );
}

