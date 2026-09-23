import React, { useRef, useEffect } from 'react';

export default function InvestorDay() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const marquees = section.querySelectorAll('.investor-marquee-inner');
    const observer = new IntersectionObserver(
      ([entry]) => {
        const action = entry.isIntersecting ? 'remove' : 'add';
        marquees.forEach(el => el.classList[action]('marquee-paused'));
      },
      { threshold: 0 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="investor-section" id="investor" ref={sectionRef}>
      {/* Top Marquee */}
      <div className="investor-marquee top-marquee">
        <div className="investor-marquee-inner">
          {[...Array(4)].map((_, i) => (
            <div className="investor-marquee-content" key={i} aria-hidden={i > 0 ? "true" : undefined}>
              <span className="marquee-item">THE FINALE</span>
              <span className="marquee-item">✦</span>
              <span className="marquee-item">MEET FOUNDERS</span>
              <span className="marquee-item">✦</span>
              <span className="marquee-item">PITCH VCs</span>
              <span className="marquee-item">✦</span>
              <span className="marquee-item">BANGALORE TRIP</span>
              <span className="marquee-item">✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="investor-inner" style={{ position: 'relative', zIndex: 5 }}>
        <div className="investor-grid">
          {/* Left Column: Copy */}
          <div className="investor-left">
            <div className="investor-subheading-box">THE FINALE</div>
            <h2 className="investor-title">
              <span className="investor-highlight-box yellow-highlight">One team</span> flies to <span className="investor-highlight-box pink-highlight">Bangalore</span>
            </h2>
            <p className="investor-desc">
              After the Week 4 demos, we pick one team. Flights, stay, everything paid. You spend a day inside the startup ecosystem: sit with 4 to 5 founders, pitch your business to real VCs, and see the rooms most people only read about.
            </p>
            <p className="investor-punch">
              We don't hand out certificates. We hand out a seat at the table.
            </p>
          </div>

          {/* Right Column: Landing Card */}
          <div className="investor-right">
            <div className="investor-landing-card" style={{ position: 'relative', zIndex: 1 }}>
              <div className="landing-card-content">
                <span className="landing-card-tag mono">Ecosystem Trip</span>
                <h3>Dhandha Pass</h3>
                <p>Flights, stay &amp; meetings paid.</p>
              </div>
              <div 
                id="plane-end-marker" 
                className="landing-card-icon"
                style={{ position: 'relative', width: '7.5rem', height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img 
                  id="plane-end-img"
                  className="airplane-img" 
                  src="/real_airplane.png" 
                  alt="Landed airplane" 
                  style={{ opacity: 0, transition: 'opacity 0.15s ease', transform: 'rotate(270deg)', width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Marquee */}
      <div className="investor-marquee bottom-marquee">
        <div className="investor-marquee-inner">
          {[...Array(4)].map((_, i) => (
            <div className="investor-marquee-content" key={i} aria-hidden={i > 0 ? "true" : undefined}>
              <span className="marquee-item">THE FINALE</span>
              <span className="marquee-item">✦</span>
              <span className="marquee-item">MEET FOUNDERS</span>
              <span className="marquee-item">✦</span>
              <span className="marquee-item">PITCH VCs</span>
              <span className="marquee-item">✦</span>
              <span className="marquee-item">BANGALORE TRIP</span>
              <span className="marquee-item">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
