import React from 'react';

export default function Offer({ navigate }) {
  return (
    <section className="offer-section">
      <div className="offer-main-box">
        <div className="offer-container">
          {/* Left Column: Heading and copy */}
          <div className="offer-left">
            <div className="offer-header">
              <h2 className="offer-title">
                We help you become an <span className="offer-highlight-box blue-highlight">entrepreneur</span>
                <br />
                By making you
                <br />
                <span className="offer-highlight-box green-highlight">build</span>, not study
              </h2>
              <div className="offer-subheading-box">
                What you actually get inside the cohort.
              </div>
            </div>
            <p className="offer-text">
              Dhandha School is a 4-week cohort. You pick a track, you get live sessions with real Indian case studies, and every week you clear an entrepreneurial checkpoint with a real business. By Day 30, top performers will be flown to Bangalore to meet founders and leading VCs.
            </p>
          </div>

          {/* Right Column: Grid of metric highlights */}
          <div className="offer-right">
            <div className="offer-metrics-grid">
              <div className="offer-metric-card">
                <span className="offer-metric-num">4</span>
                <span className="offer-metric-label">Weeks</span>
              </div>
              
              <div className="offer-metric-card">
                <span className="offer-metric-num">2</span>
                <span className="offer-metric-label">Tracks</span>
              </div>
              
              <div className="offer-metric-card">
                <span className="offer-metric-num">10</span>
                <span className="offer-metric-label">Live Sessions</span>
              </div>
              
              <div className="offer-metric-card">
                <span className="offer-metric-num">4</span>
                <span className="offer-metric-label">Checkpoints</span>
              </div>
              
              <div className="offer-metric-card highlight">
                <div className="offer-metric-card-content">
                  <span className="offer-metric-num">1</span>
                  <span className="offer-metric-label">Free Flight to Bangalore</span>
                </div>
                <div 
                  id="plane-start-marker" 
                  className="offer-metric-card-icon" 
                  style={{ position: 'relative', width: '4.5rem', height: '7.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <img 
                    id="plane-start-img"
                    className="airplane-img" 
                    src="/real_airplane.png" 
                    alt="Real commercial airplane" 
                    style={{ transition: 'opacity 0.15s ease' }}
                  />
                </div>
              </div>
            </div>
            
            <button className="offer-cta-button" onClick={(e) => { e.preventDefault(); navigate('/apply'); }}>
              APPLY NOW →
            </button>
            {/* Mobile-only body text: appears below CTA per screenshot */}
            <p className="offer-mobile-text">
              Dhandha School is a 4-week cohort. You pick a track, you get live sessions with real Indian case studies, and every week you clear an entrepreneurial checkpoint with a real business. By Day 30, top performers will be flown to Bangalore to meet founders and leading VCs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
