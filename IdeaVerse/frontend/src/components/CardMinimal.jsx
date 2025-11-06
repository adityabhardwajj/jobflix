import React from "react";
import { Link } from "react-router-dom";

export default function CardMinimal({ title, subtitle, excerpt, to, meta, children }) {
  return (
    <article className="bg-white rounded-md shadow-subtle p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-brand-500">
            {to ? <Link to={to}>{title}</Link> : title}
          </h3>
          {subtitle && <div className="text-sm text-neutral-500 mt-1">{subtitle}</div>}
        </div>
      </div>
      {excerpt && <p className="text-sm text-neutral-600 mt-3">{excerpt}</p>}
      {children}
      {meta && <div className="mt-4 text-xs text-neutral-400">{meta}</div>}
    </article>
  );
}

