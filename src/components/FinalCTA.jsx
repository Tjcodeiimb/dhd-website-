import React, { useState } from 'react';

export default function FinalCTA({ navigate }) {
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  return (
    <div className="frame">
      <span className="tag">Home · 11 · Final CTA</span>
      <div className="cta-center">
        <h2>Stop preparing. Start building.</h2>
        <p className="sub" style={{ margin: '0 auto 16px', maxWidth: '48ch' }}>
          Applications for Cohort 2 will close soon. Seats are capped and we read every application personally.
        </p>
        <a
          className="btn"
          href="/apply"
          onClick={(e) => {
            e.preventDefault();
            navigate('/apply');
          }}
        >
          Apply for Cohort 2
        </a>
        &nbsp;&nbsp;
        {waitlistJoined ? (
          <span className="btn ghost" style={{ cursor: 'default', opacity: 0.7 }}>
            You're on the list ✓
          </span>
        ) : (
          <a
            className="btn ghost"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setWaitlistJoined(true);
            }}
          >
            Join the waitlist
          </a>
        )}
      </div>
    </div>
  );
}
