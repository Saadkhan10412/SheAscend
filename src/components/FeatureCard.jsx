import React from "react";
export  function FeatureCard({ title, desc, emoji }) {
  return (
    <div className="feature-card">
      <h3>{emoji} {title}</h3>
      <p>{desc}</p>
    </div>
  );
}