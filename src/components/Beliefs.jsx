import React, { useState, useRef, useEffect } from 'react';

export default function Beliefs({ navigate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);

  const data = [
    {
      num: '01',
      title: 'Wealth comes from ownership',
      text: "Nobody gets truly rich on a salary. Look at any rich list: it's people who built and owned businesses. A job pays your bills. Ownership buys your freedom."
    },
    {
      num: '02',
      title: 'There is no right age',
      text: "16 or 45, the market doesn't check your birth certificate. It checks whether someone will pay for what you made. You can start today."
    },
    {
      num: '03',
      title: "You don't need a degree. You need the basics",
      text: "Marketing, strategy, finance, relevant tech tools: enough to get moving. That takes weeks, not years. The rest you learn on the business, while running it."
    },
    {
      num: '04',
      title: 'Your network is the moat',
      text: "Dhandhas are built on meaningful relationships: customers who trust you, founders who've seen your problem, one senior who picks up your call. AI can write your ads. It cannot build your relationships."
    }
  ];

  const cardColors = ['#FFD166', '#B4D5FF', '#FFB3D9', '#C2F5E9']; // Yellow, Blue, Pink, Mint

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const marquee = section.querySelector('.beliefs-marquee-inner');
    if (!marquee) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        marquee.classList.toggle('marquee-paused', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="beliefs-section" id="beliefs" ref={sectionRef}>
      <div className="beliefs-main-box">
        {/* Marquee at the top of the box */}
        <div className="beliefs-marquee">
          <div className="beliefs-marquee-inner">
            {[...Array(4)].map((_, i) => (
              <div className="beliefs-marquee-content" key={i} aria-hidden={i > 0 ? "true" : undefined}>
                <span className="marquee-item">BUILD YOUR BUSINESS</span>
                <span className="marquee-item">✦</span>
                <span className="marquee-item">NO RIGHT AGE</span>
                <span className="marquee-item">✦</span>
                <span className="marquee-item">OWNERSHIP IS FREEDOM</span>
                <span className="marquee-item">✦</span>
                <span className="marquee-item">YOUR NETWORK IS THE MOAT</span>
                <span className="marquee-item">✦</span>
              </div>
            ))}
          </div>
        </div>

        <div className="beliefs-header">
          <h2 className="beliefs-title">
            <span className="beliefs-highlight-box">FOUR THINGS</span> WE HOLD TO BE TRUE
          </h2>
          <div className="beliefs-subheading-box">
            The principles that drive Dhandha School.
          </div>
        </div>
        
        <div className="beliefs-split">
          {/* Left Column: Interactive Title Buttons */}
          <div className="beliefs-left">
            <div className="beliefs-options-box">
              {data.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`beliefs-btn ${activeIndex === idx ? 'is-active' : ''}`}
                  aria-label={`Show belief: ${item.title}`}
                >
                  <span className="beliefs-btn-num">{item.num}</span>
                  <span className="beliefs-btn-text">{item.title}</span>
                  <span className="beliefs-plus-icon">+</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Right Column: Revealed Text Card */}
          <div className="beliefs-right">
            <div 
              className="beliefs-content-card" 
              style={{ backgroundColor: cardColors[activeIndex] }}
            >
              <span className="beliefs-content-num">{data[activeIndex].num}</span>
              <p key={activeIndex} className="beliefs-content-text anim-fade-in">
                {data[activeIndex].text}
              </p>
            </div>
          </div>
        </div>

        {/* Inline Segue Link Block */}
        <div className="beliefs-segue">
          <span className="beliefs-segue-label">Here are some interesting facts</span>
          <a
            className="beliefs-segue-link"
            href="/read-this"
            onClick={(e) => {
              e.preventDefault();
              navigate('/read-this');
            }}
          >
            Read this →
          </a>
        </div>
      </div>
    </section>
  );
}
