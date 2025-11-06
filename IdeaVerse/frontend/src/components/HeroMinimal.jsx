import React from "react";
import ButtonMinimal from "./ButtonMinimal";
import { Link } from "react-router-dom";

export default function HeroMinimal({ title = "A universe for your ideas", subtitle = "Pitch, collaborate and get discovered." }) {
  return (
    <section className="bg-white mb-8">
      <div className="container-wide py-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold text-brand-500">{title}</h1>
          <p className="mt-4 text-neutral-600">{subtitle}</p>
          <div className="mt-6 flex gap-3">
            <Link to="/register"><ButtonMinimal>Get Started</ButtonMinimal></Link>
            <Link to="/ideas"><ButtonMinimal variant="ghost">Explore Ideas</ButtonMinimal></Link>
          </div>
        </div>
      </div>
    </section>
  );
}



