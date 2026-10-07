import React from 'react';

export default function Segue({ navigate }) {
  return (
    <div className="frame">
      <span className="tag">Home · 04 · Segue</span>
      <div className="segue">
        <span>Here are some interesting facts</span>
        <a 
          className="link" 
          href="/read-this"
          onClick={(e) => {
            e.preventDefault();
            navigate('/read-this');
          }}
        >
          Read this →
        </a>
        <span className="mono" style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>
          4 facts · all sourced · 2 min
        </span>
      </div>
      <span className="note">
        <b>NOTE</b> A thin banner, not a section. Links to the /read-this page (wireframed below). Skippable by design.
      </span>
    </div>
  );
}
