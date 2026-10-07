import React, { useEffect, useRef, useState } from 'react';

function ScrollDashedPath({ d, width, height, className }) {
  const pathRef = useRef(null);
  const [dashOffset, setDashOffset] = useState(0);
  const [dashLength, setDashLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setDashLength(length);
      setDashOffset(length);
    }

    const handleScroll = () => {
      if (!pathRef.current || !dashLength) return;
      const rect = pathRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      const start = viewHeight;
      const end = viewHeight / 2;
      
      if (rect.top > start) {
        setDashOffset(dashLength);
      } else if (rect.top < end) {
        setDashOffset(0);
      } else {
        const pct = (rect.top - end) / (start - end);
        setDashOffset(dashLength * pct);
      }
    };

    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [dashLength]);

  return (
    <svg className={className} width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path 
        ref={pathRef}
        d={d}
        style={{
          strokeDasharray: dashLength,
          strokeDashoffset: dashOffset,
          transition: 'stroke-dashoffset 0.1s ease-out'
        }}
      />
    </svg>
  );
}

export default function Hero({ navigate }) {
  return (
    <div className="frame hero-frame">
      <span className="tag">Home · 01 · Hero</span>
      <div className="hero">
        <div style={{ marginLeft: '-16px' }}>
          <div className="eyebrow">Dhandha School · Cohort 2</div>
          <h2>India doesn't have an education system. It has an exam system.</h2>
          <p className="sub">You've been its customer since you were 16.</p>
          <a 
            className="btn btn-primary" 
            href="/apply"
            onClick={(e) => {
              e.preventDefault();
              navigate('/apply');
            }}
          >
            Apply for Cohort 2
          </a>
        </div>
        <div className="receipt">
          <div className="stop">
            <span className="dot">16</span>
            <span className="body"><b>At 16.</b> Lakhs to a coaching institute, to crack JEE/NEET.</span>
          </div>
          <ScrollDashedPath 
            className="curve" 
            width={120} 
            height={46} 
            d="M20 2 C 20 26, 76 16, 76 44" 
          />
          <div className="stop shift">
            <span className="dot">18</span>
            <span className="body"><b>At 18.</b> 9 out of 10 don't crack it. So: lakhs more, to a college you never wanted.</span>
          </div>
          <ScrollDashedPath 
            className="curve" 
            width={120} 
            height={46} 
            d="M76 2 C 76 26, 20 16, 20 44" 
          />
          <div className="stop">
            <span className="dot">22</span>
            <span className="body"><b>At 22.</b> A job that barely covers rent. So you buy the next exam. CAT. Or UPSC.</span>
          </div>
          <p className="kicker">The system never runs out of exams to sell you.</p>
        </div>
      </div>
      <span className="note">
        <b>NOTE</b> Desktop: headline left, Receipt right. Mobile: headline first, Receipt on scroll. The dashed path draws itself on scroll; this is one of only two animated things on the site.
      </span>
    </div>
  );
}
